
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain, Zap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 medical-gradient rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MediGuard AI</h1>
              <p className="text-xs text-gray-600">Pharmaceutical Authentication</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Brain className="h-4 w-4 text-medical-blue" />
                <span>AI-Powered Detection</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-4 w-4 text-medical-blue" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-medical-blue" />
                <span>99.2% Accuracy</span>
              </div>
            </div>
            
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="medical-gradient text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
