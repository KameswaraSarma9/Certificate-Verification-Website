import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Search, Shield, CheckCircle, XCircle, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

export function CertificateVerification() {
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error("Please enter a certificate ID");
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      // Simulate database lookup
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check localStorage for demo certificates
      const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      const found = certificates.find((cert: any) => 
        cert.id === searchId || cert.securityHash === searchId
      );

      if (found) {
        setSearchResult(found);
        toast.success("Certificate found and verified!");
      } else {
        // Demo certificate for testing
        if (searchId === 'cert_demo123' || searchId === 'sec_demo456') {
          setSearchResult({
            id: 'cert_demo123',
            studentName: 'John Smith',
            institutionName: 'MIT',
            certificateType: 'master',
            degreeProgram: 'Computer Science',
            graduationDate: '2023-05-15',
            gpa: '3.9',
            certificateNumber: 'MIT-CS-2023-001',
            securityHash: 'sec_demo456',
            issuedAt: '2023-05-20T10:30:00Z',
            status: 'verified',
            issuer: 'MIT'
          });
          toast.success("Certificate found and verified!");
        } else {
          setSearchResult({ notFound: true });
          toast.error("Certificate not found in database");
        }
      }
    } catch (error) {
      toast.error("Error searching database");
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatCertificateType = (type: string) => {
    const types: { [key: string]: string } = {
      bachelor: "Bachelor's Degree",
      master: "Master's Degree",
      phd: "PhD",
      diploma: "Diploma",
      certificate: "Certificate"
    };
    return types[type] || type;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Verify Certificate
            </CardTitle>
            <CardDescription>
              Enter a certificate ID or security hash to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="searchId" className="sr-only">Certificate ID</Label>
                <Input
                  id="searchId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter certificate ID or security hash..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="px-6"
              >
                {isSearching ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p className="mb-1">Try these demo IDs:</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSearchId('cert_demo123')}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  cert_demo123
                </button>
                <button 
                  onClick={() => setSearchId('sec_demo456')}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  sec_demo456
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchResult && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Result
                </CardTitle>
                {searchResult.notFound ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Not Found
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {searchResult.notFound ? (
                <div className="text-center py-8">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="mb-2">Certificate Not Found</h3>
                  <p className="text-gray-600">
                    The certificate ID or hash you entered was not found in our database.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">Certificate Verified</span>
                    </div>
                    <p className="text-sm text-green-700">
                      This certificate is authentic and has been verified against our secure database.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4>Certificate Details</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-500">Student Name</Label>
                          <p>{searchResult.studentName}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">Institution</Label>
                          <p>{searchResult.institutionName}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">Certificate Type</Label>
                          <p>{formatCertificateType(searchResult.certificateType)}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">Program</Label>
                          <p>{searchResult.degreeProgram}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">Graduation Date</Label>
                          <p>{new Date(searchResult.graduationDate).toLocaleDateString()}</p>
                        </div>

                        {searchResult.gpa && (
                          <div>
                            <Label className="text-sm text-gray-500">GPA</Label>
                            <p>{searchResult.gpa}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4>Security Information</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-500">Certificate ID</Label>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 min-w-0 truncate">
                              {searchResult.id}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(searchResult.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">Security Hash</Label>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 min-w-0 truncate">
                              {searchResult.securityHash}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(searchResult.securityHash)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">Issued Date</Label>
                          <p>{new Date(searchResult.issuedAt).toLocaleString()}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">Issuing Authority</Label>
                          <p>{searchResult.issuer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}