
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <CheckCircle className="h-8 w-8 text-medical-green" />,
      value: "2.4M+",
      label: "Images Analyzed",
      change: "+12% this month"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-medical-red" />,
      value: "847K",
      label: "Counterfeits Detected",
      change: "Prevented harm"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-medical-blue" />,
      value: "99.2%",
      label: "Accuracy Rate",
      change: "Verified by experts"
    },
    {
      icon: <Users className="h-8 w-8 text-medical-blue" />,
      value: "50K+",
      label: "Healthcare Partners",
      change: "Worldwide trust"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-center mb-4">
            {stat.icon}
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            <div className="text-xs text-gray-500">{stat.change}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsSection;
