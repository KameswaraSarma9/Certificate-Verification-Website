import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CertificateForm } from "./components/CertificateForm";
import { CertificateVerification } from "./components/CertificateVerification";
import { Dashboard } from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleCertificateCreated = (certificate: any) => {
    // Switch to dashboard to show the new certificate
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Hero onNavigate={handleNavigate} />;
      case 'register':
        return <CertificateForm onCertificateCreated={handleCertificateCreated} />;
      case 'verify':
        return <CertificateVerification />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onNavigate={handleNavigate} />
      <main>
        {renderCurrentView()}
      </main>
      <Toaster />
    </div>
  );
}