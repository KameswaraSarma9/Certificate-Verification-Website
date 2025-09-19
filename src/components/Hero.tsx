import { Button } from "./ui/button";
import { Shield, CheckCircle, Lock, Search } from "lucide-react";

interface HeroProps {
  onNavigate: (view: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="bg-primary/10 p-4 rounded-full">
                <Shield className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl mb-6 text-gray-900">
              Secure Digital{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Certificate Verification
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              CertVerify makes academic certificates easily verifiable and secure. 
              Issue, verify, and manage certificates with complete transparency and trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => onNavigate('register')}
                className="px-8 py-3"
              >
                Register Certificate
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => onNavigate('verify')}
                className="px-8 py-3"
              >
                Verify Certificate
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2">Instantly Verifiable</h3>
              <p className="text-gray-600">
                Quickly verify the authenticity of any certificate with our advanced verification system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">
                Certificates are protected with cryptographic security, ensuring permanent integrity and authenticity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2">Easy Access</h3>
              <p className="text-gray-600">
                Access and share your certificates anywhere, anytime with a simple link or QR code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}