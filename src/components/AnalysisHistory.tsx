
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisRecord {
  id: string;
  image_name: string;
  image_url: string;
  verdict: 'authentic' | 'fake' | 'uncertain';
  confidence_score: number;
  analysis_details: string;
  created_at: string;
}

const AnalysisHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('medicine_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medicine_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      toast({
        title: "Analysis deleted",
        description: "The analysis record has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting analysis",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fake': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return 'bg-green-100 text-green-800';
      case 'fake': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analysis History</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Analysis History</h3>
      
      {analyses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No analyses yet. Upload your first medicine image to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={analysis.image_url}
                    alt={analysis.image_name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{analysis.image_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => deleteAnalysis(analysis.id)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getVerdictIcon(analysis.verdict)}
                  <Badge className={getVerdictColor(analysis.verdict)}>
                    {analysis.verdict.charAt(0).toUpperCase() + analysis.verdict.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {analysis.confidence_score}% confidence
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                {analysis.analysis_details}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AnalysisHistory;
