import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  GraduationCap, 
  Search, 
  Download, 
  Share2, 
  CheckCircle, 
  Calendar,
  Building,
  Award,
  QrCode
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeModal } from "./QRCodeModal";
import { ShareModal } from "./ShareModal";
import { generateCertificatePDF } from "../services/pdfGenerator";

interface Certificate {
  id: string;
  studentName: string;
  institutionName: string;
  certificateType: string;
  degreeProgram: string;
  graduationDate: string;
  gpa?: string;
  certificateNumber?: string;
  securityHash: string;
  issuedAt: string;
  status: string;
  issuer: string;
}

export function Dashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Load certificates from localStorage
    const loadCertificates = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('certificates') || '[]');
        // Add demo certificate if no certificates exist
        if (stored.length === 0) {
          const demoCert = {
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
          };
          stored.push(demoCert);
          localStorage.setItem('certificates', JSON.stringify(stored));
        }
        setCertificates(stored);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const filteredCertificates = certificates.filter(cert =>
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.degreeProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleShare = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowShareModal(true);
  };

  const handleDownload = (certificate: Certificate) => {
    try {
      // Generate and download PDF
      generateCertificatePDF(certificate);
      toast.success("Certificate PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
      console.error('PDF generation error:', error);
    }
  };

  const handleQRCode = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowQRModal(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Certificate Dashboard</h1>
        <p className="text-gray-600">Manage and view your verified certificates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{certificates.length}</p>
                <p className="text-sm text-gray-500">Total Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl">{certificates.filter(c => c.status === 'verified').length}</p>
                <p className="text-sm text-gray-500">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl">{new Set(certificates.map(c => c.institutionName)).size}</p>
                <p className="text-sm text-gray-500">Institutions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search certificates by name, institution, program, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <div className="space-y-4">
        {filteredCertificates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="mb-2">No certificates found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No certificates match your search criteria.' : 'You haven\'t registered any certificates yet.'}
              </p>
              {!searchTerm && (
                <Button variant="outline">
                  Register Your First Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="mb-1">{certificate.studentName}</h3>
                          <p className="text-sm text-gray-500">{formatCertificateType(certificate.certificateType)}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{certificate.institutionName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        <span>{certificate.degreeProgram}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(certificate.graduationDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Certificate ID</div>
                      <code className="text-sm break-all">{certificate.id}</code>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                    <Button variant="outline" size="sm" onClick={() => handleShare(certificate)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(certificate)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQRCode(certificate)}>
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      {selectedCertificate && (
        <>
          <QRCodeModal
            isOpen={showQRModal}
            onClose={() => {
              setShowQRModal(false);
              setSelectedCertificate(null);
            }}
            certificate={selectedCertificate}
          />
          <ShareModal
            isOpen={showShareModal}
            onClose={() => {
              setShowShareModal(false);
              setSelectedCertificate(null);
            }}
            certificate={selectedCertificate}
            onShowQRCode={() => {
              setShowShareModal(false);
              setShowQRModal(true);
            }}
          />
        </>
      )}
    </div>
  );
}