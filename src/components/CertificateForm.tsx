import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, FileText, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { verifyWithExternalSources, validateCertificateData } from "../services/certificateVerification";

interface CertificateFormProps {
  onCertificateCreated: (certificate: any) => void;
}

export function CertificateForm({ onCertificateCreated }: CertificateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    institutionName: '',
    certificateType: '',
    degreeProgram: '',
    graduationDate: '',
    gpa: '',
    certificateNumber: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear previous validation when form changes
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const generateCertificateHash = (data: any) => {
    // Mock hash generation - in real implementation, this would be a proper hash
    const dataString = JSON.stringify(data) + Date.now();
    return 'cert_' + btoa(dataString).slice(0, 16).toLowerCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationResult(null);
    setVerificationResult(null);

    try {
      // Step 1: Validate certificate data
      toast.info("Validating certificate data...");
      const validation = await validateCertificateData(formData);
      setValidationResult(validation);

      if (!validation.isValid) {
        toast.error("Certificate validation failed. Please fix the errors and try again.");
        setIsLoading(false);
        return;
      }

      // Step 2: Verify with external sources
      toast.info("Verifying with external databases...");
      const verification = await verifyWithExternalSources(formData);
      setVerificationResult(verification);

      if (!verification.isValid) {
        toast.warning("External verification returned warnings. Certificate will still be created but may need manual review.");
      }

      // Step 3: Generate certificate and register
      toast.info("Registering certificate...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      const certificateId = generateCertificateHash(formData);
      const securityHash = currentHash || 'sec_' + Math.random().toString(36).substr(2, 12);
      
      const certificate = {
        id: certificateId,
        ...formData,
        securityHash,
        issuedAt: new Date().toISOString(),
        status: verification.isValid ? 'verified' : 'pending_review',
        issuer: formData.institutionName,
        verification: verification,
        validation: validation
      };

      // Store in localStorage for demo purposes
      const existingCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      existingCertificates.push(certificate);
      localStorage.setItem('certificates', JSON.stringify(existingCertificates));

      onCertificateCreated(certificate);
      
      if (verification.isValid) {
        toast.success("Certificate successfully verified and registered!");
      } else {
        toast.warning("Certificate registered but requires manual verification due to external validation issues.");
      }
      
      // Reset form
      setFormData({
        studentName: '',
        institutionName: '',
        certificateType: '',
        degreeProgram: '',
        graduationDate: '',
        gpa: '',
        certificateNumber: '',
        description: ''
      });
      setValidationResult(null);
      setVerificationResult(null);
    } catch (error) {
      toast.error("Failed to register certificate. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Register New Certificate
          </CardTitle>
          <CardDescription>
            Create a secure certificate record with external verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Validation Results */}
          {validationResult && (
            <div className="mb-6 space-y-2">
              {validationResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {validationResult.errors.map((error: string, index: number) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              {validationResult.warnings.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {validationResult.warnings.map((warning: string, index: number) => (
                        <div key={index}>• {warning}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Verification Results */}
          {verificationResult && (
            <div className="mb-6">
              <Alert variant={verificationResult.isValid ? "default" : "destructive"}>
                {verificationResult.isValid ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">
                      External Verification {verificationResult.isValid ? 'Successful' : 'Issues Found'}
                    </div>
                    <div className="text-sm space-y-1">
                      <div>Institution: {verificationResult.institution.isAccredited ? '✅ Accredited' : '❌ Not found in accreditation database'}</div>
                      <div>Student Enrollment: {verificationResult.student.isEnrolled ? '✅ Verified' : '❌ Cannot verify'}</div>
                      <div>Certificate Authenticity: {verificationResult.certificate.isAuthentic ? '✅ Authentic' : '❌ Cannot verify'}</div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Verified against: {verificationResult.sources.join(', ')}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name *</Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) => handleInputChange('institutionName', e.target.value)}
                  placeholder="Enter institution name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type *</Label>
                <Select 
                  value={formData.certificateType} 
                  onValueChange={(value) => handleInputChange('certificateType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="degreeProgram">Degree Program *</Label>
                <Input
                  id="degreeProgram"
                  value={formData.degreeProgram}
                  onChange={(e) => handleInputChange('degreeProgram', e.target.value)}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduationDate">Graduation Date *</Label>
                <Input
                  id="graduationDate"
                  type="date"
                  value={formData.graduationDate}
                  onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                  placeholder="e.g., 3.8"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input
                  id="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
                  placeholder="Institution cert #"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Any additional information about the certificate..."
                rows={3}
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Upload certificate document (optional)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, JPG, or PNG up to 10MB
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying and Registering...
                </>
              ) : (
                'Verify & Register Certificate'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}