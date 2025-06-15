import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import StatsSection from '@/components/StatsSection';
import FeaturesSection from '@/components/FeaturesSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, LogIn } from 'lucide-react';

const Index = () => {
  // Don't use useAuth, pretend user is always present
  const navigate = useNavigate();

  // Remove loading check

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-medical-blue/10 rounded-full text-medical-blue text-sm font-medium mb-6">
            <Info className="h-4 w-4 mr-2" />
            Trusted by 50,000+ Healthcare Professionals Worldwide
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Medicine
            <span className="block medical-gradient bg-clip-text text-transparent">
              Authentication
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Upload images of pharmaceutical products to instantly detect counterfeits using 
            our advanced deep learning models. Protect patients from dangerous fake medicines 
            with 99.2% accuracy.
          </p>
          
          {/* Remove conditional Get Started button; show nothing or leave for marketing link */}
          
          <Alert className="max-w-2xl mx-auto mb-12 border-sky-200 bg-sky-50">
            <AlertTriangle className="h-4 w-4 text-sky-600" />
            <AlertDescription className="text-sky-800">
              <strong>Important:</strong> This tool is for preliminary screening only. 
              Always consult healthcare professionals for final verification and medical advice.
            </AlertDescription>
          </Alert>
        </div>

        {/* Remove User Profile, always hidden */}

        {/* Stats Section */}
        <StatsSection />

        {/* Main Upload Component */}
        <div className="mb-16">
          <ImageUpload />
        </div>

        {/* Remove Analysis History (history table is per-user) */}
        
        {/* Features Section */}
        <FeaturesSection />

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-12 mt-16">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              MediGuard AI is committed to global health security through advanced technology.
            </p>
            <p className="text-sm">
              For enterprise solutions and API access, contact our healthcare partnerships team.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
