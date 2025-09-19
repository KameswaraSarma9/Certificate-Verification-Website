import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { QrCode, Download, Copy, Share2, X } from "lucide-react";
import { toast } from "sonner";

// Declare QRCode library as any to avoid import issues
declare const QRCode: any;

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: any;
}

export function QRCodeModal({ isOpen, onClose, certificate }: QRCodeModalProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const verificationUrl = `${window.location.origin}?verify=${certificate.id}`;

  useEffect(() => {
    if (isOpen && certificate) {
      generateQRCode();
    }
  }, [isOpen, certificate]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrData = JSON.stringify({
        id: certificate.id,
        studentName: certificate.studentName,
        institution: certificate.institutionName,
        degree: certificate.degreeProgram,
        verifyUrl: verificationUrl,
        securityHash: certificate.securityHash
      });

      // Fallback if QRCode library is not available
      if (typeof QRCode === 'undefined') {
        // Create a simple data URL representing a QR code placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Draw a simple placeholder QR code pattern
          ctx.fillStyle = '#030213';
          ctx.fillRect(0, 0, 300, 300);
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('QR CODE', 150, 140);
          ctx.fillText('PLACEHOLDER', 150, 160);
          
          // Create a grid pattern to simulate QR code
          ctx.fillStyle = '#030213';
          for (let i = 0; i < 300; i += 15) {
            for (let j = 0; j < 300; j += 15) {
              if ((i + j) % 30 === 0) {
                ctx.fillRect(i, j, 10, 10);
              }
            }
          }
        }
        
        setQrCodeDataURL(canvas.toDataURL());
      } else {
        const qrCodeUrl = await QRCode.toDataURL(qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#030213',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        setQrCodeDataURL(qrCodeUrl);
      }
    } catch (error) {
      toast.error("Failed to generate QR code");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.download = `${certificate.studentName.replace(/\s+/g, '_')}_Certificate_QR.png`;
    link.href = qrCodeDataURL;
    link.click();
    toast.success("QR code downloaded successfully!");
  };

  const copyVerificationUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    toast.success("Verification URL copied to clipboard!");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Certificate QR Code
          </DialogTitle>
          <DialogDescription>
            Share this QR code to allow others to verify the certificate instantly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{certificate.studentName}</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Verified
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {formatCertificateType(certificate.certificateType)} in {certificate.degreeProgram}
              </div>
              <div className="text-sm text-gray-600">
                {certificate.institutionName}
              </div>
              <div className="text-xs text-gray-500">
                ID: {certificate.id}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            {isGenerating ? (
              <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Generating QR Code...</p>
                </div>
              </div>
            ) : qrCodeDataURL ? (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img
                  src={qrCodeDataURL}
                  alt="Certificate QR Code"
                  className="w-64 h-64"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">Failed to generate QR code</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Scan this QR code to instantly verify the certificate</p>
            <p className="text-xs">The QR code contains secure verification data</p>
          </div>

          {/* Verification URL */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">Verification URL:</div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-white px-2 py-1 rounded flex-1 truncate border">
                {verificationUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyVerificationUrl}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={downloadQRCode}
              disabled={!qrCodeDataURL}
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                toast.success("Share options coming up!");
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}