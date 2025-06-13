
import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap, Shield, Brain, Globe, Clock, Award } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-medical-blue" />,
      title: "Advanced AI Detection",
      description: "Deep learning models trained on millions of pharmaceutical images for precise counterfeit detection."
    },
    {
      icon: <Zap className="h-6 w-6 text-medical-blue" />,
      title: "Instant Analysis",
      description: "Get results in seconds with our optimized neural networks and cloud infrastructure."
    },
    {
      icon: <Shield className="h-6 w-6 text-medical-blue" />,
      title: "99.2% Accuracy",
      description: "Industry-leading precision validated by pharmaceutical experts and regulatory bodies."
    },
    {
      icon: <Globe className="h-6 w-6 text-medical-blue" />,
      title: "Global Database",
      description: "Comprehensive database covering medicines from 150+ countries and 5000+ manufacturers."
    },
    {
      icon: <Clock className="h-6 w-6 text-medical-blue" />,
      title: "24/7 Availability",
      description: "Round-the-clock service ensuring patient safety never sleeps, anywhere in the world."
    },
    {
      icon: <Award className="h-6 w-6 text-medical-blue" />,
      title: "FDA Recognized",
      description: "Approved methodology recognized by major health authorities and pharmaceutical companies."
    }
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Protecting Global Health with AI
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our cutting-edge technology empowers healthcare professionals, pharmacists, and patients 
          to verify medicine authenticity and combat the growing threat of counterfeit drugs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-medical-blue/10 rounded-lg group-hover:bg-medical-blue/20 transition-colors">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
