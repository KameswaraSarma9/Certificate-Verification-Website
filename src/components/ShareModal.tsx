import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Share2, Copy, Mail, MessageCircle, Globe, Linkedin, Twitter, Facebook, QrCode } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: any;
  onShowQRCode?: () => void;
}

export function ShareModal({ isOpen, onClose, certificate, onShowQRCode }: ShareModalProps) {
  const verificationUrl = `${window.location.origin}?verify=${certificate.id}`;
  
  const shareText = `🎓 Check out my verified ${certificate.degreeProgram} certificate from ${certificate.institutionName}! 
  
Verified with CertVerify - the secure certificate verification platform.

Verify instantly: ${verificationUrl}

#Education #DigitalCertificate #CertVerify`;

  const shareOptions = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}&summary=${encodeURIComponent(shareText)}`;
        window.open(linkedInUrl, '_blank');
        toast.success("Shared on LinkedIn!");
      }
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank');
        toast.success("Shared on Twitter!");
      }
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-700 hover:bg-blue-800",
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verificationUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(facebookUrl, '_blank');
        toast.success("Shared on Facebook!");
      }
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
        toast.success("Shared on WhatsApp!");
      }
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => {
        const subject = `Verified Certificate - ${certificate.studentName}`;
        const body = `Dear Colleague,

I'm excited to share my verified academic certificate with you:

Student: ${certificate.studentName}
Degree: ${certificate.degreeProgram}
Institution: ${certificate.institutionName}
Graduation Date: ${new Date(certificate.graduationDate).toLocaleDateString()}

This certificate is digitally verified and cannot be forged or tampered with.

You can verify its authenticity instantly at: ${verificationUrl}

Certificate ID: ${certificate.id}
Security Hash: ${certificate.securityHash}

Best regards,
${certificate.studentName}

---
Powered by CertVerify - Digital Certificate Verification
`;
        
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        toast.success("Email client opened!");
      }
    },
    {
      name: "QR Code",
      icon: QrCode,
      color: "bg-indigo-600 hover:bg-indigo-700",
      action: () => {
        onClose();
        onShowQRCode?.();
      }
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const copyShareText = () => {
    copyToClipboard(shareText, "Share message");
  };

  const copyVerificationUrl = () => {
    copyToClipboard(verificationUrl, "Verification URL");
  };

  // Native Web Share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate Verification - ${certificate.studentName}`,
          text: shareText,
          url: verificationUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      toast.error("Native sharing not supported on this device");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Certificate
          </DialogTitle>
          <DialogDescription>
            Share your verified certificate with employers, colleagues, or on social media
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
            <div className="text-center">
              <h3 className="font-semibold">{certificate.studentName}</h3>
              <p className="text-sm text-gray-600">
                {certificate.degreeProgram} • {certificate.institutionName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Digitally Verified • {new Date(certificate.graduationDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Share Options</Label>
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className={`${option.color} text-white border-none flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform`}
                  onClick={option.action}
                >
                  <option.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Native Share (if supported) */}
          {navigator.share && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleNativeShare}
            >
              <Globe className="h-4 w-4 mr-2" />
              Share via Device
            </Button>
          )}

          {/* Copy Options */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="verification-url" className="text-sm font-medium">
                Verification URL
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="verification-url"
                  value={verificationUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyVerificationUrl}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="share-message" className="text-sm font-medium">
                Share Message
              </Label>
              <div className="flex gap-2 mt-1">
                <textarea
                  id="share-message"
                  value={shareText}
                  readOnly
                  className="flex-1 min-h-[100px] p-2 border rounded-md text-sm resize-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyShareText}
                  className="self-start"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              💡 <strong>Tip:</strong> Recipients can scan the QR code or visit the verification URL to instantly confirm your certificate's authenticity.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}