
import React, { useState, useCallback } from 'react';
import { Upload, FileImage, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface AnalysisResult {
  id: string;
  verdict: 'authentic' | 'fake' | 'uncertain';
  confidence_score: number;
  analysis_details: string;
  created_at: string;
}

const ImageUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to analyze medicine images.",
        variant: "destructive",
      });
      return;
    }

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      const id = Math.random().toString(36).substr(2, 9);
      
      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${id}.${fileExt}`;
        
        setUploadProgress(0);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medicine-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('medicine-images')
          .getPublicUrl(fileName);

        const newImage: UploadedImage = {
          id,
          name: file.name,
          url: publicUrl,
          file
        };
        
        setUploadedImages(prev => [...prev, newImage]);
        setUploadProgress(100);
        
        // Analyze with AI
        await analyzeImage(newImage);
        
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const analyzeImage = async (image: UploadedImage) => {
    setAnalyzing(image.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medicine', {
        body: {
          imageUrl: image.url,
          imageName: image.name,
          userId: user?.id
        }
      });

      if (error) throw error;

      setAnalysisResults(prev => [...prev, data]);
      
      toast({
        title: "Analysis complete",
        description: `Medicine ${data.verdict} detected with ${data.confidence_score}% confidence`,
        variant: data.verdict === 'fake' ? 'destructive' : 'default',
      });
      
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(null);
      setUploadProgress(0);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    setAnalysisResults(prev => prev.filter(result => result.id !== id));
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return 'text-green-600';
      case 'fake': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fake': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  if (!user) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in to analyze medicines
            </h3>
            <p className="text-gray-600">
              Create an account or sign in to start using our AI-powered medicine authentication system.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Area */}
      <Card className="relative overflow-hidden">
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-medical-blue bg-medical-blue/5 scale-105' 
              : 'border-gray-300 hover:border-medical-blue hover:bg-medical-blue/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInput}
            multiple
            accept="image/*"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 medical-gradient rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Medicine Images
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, WebP up to 10MB each
              </p>
            </div>
            
            <Button className="medical-gradient text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Choose Files
            </Button>
          </div>
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-4 w-4 animate-spin text-medical-blue" />
              <div className="flex-1">
                <Progress value={uploadProgress} className="h-2" />
              </div>
              <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
            </div>
          </div>
        )}
      </Card>

      {/* Uploaded Images and Results */}
      {uploadedImages.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          
          <div className="grid gap-6">
            {uploadedImages.map((image) => {
              const result = analysisResults.find(r => r.id === image.id);
              const isAnalyzing = analyzing === image.id;
              
              return (
                <Card key={image.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-6">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Analysis Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileImage className="h-4 w-4" />
                            {image.name}
                          </h3>
                        </div>
                      </div>
                      
                      {isAnalyzing ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-medical-blue" />
                            <span className="text-medical-blue font-medium">Analyzing with AI...</span>
                          </div>
                          <div className="bg-gradient-to-r from-medical-blue/20 to-transparent h-2 rounded-full animate-pulse" />
                        </div>
                      ) : result ? (
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex items-center gap-3">
                            {getVerdictIcon(result.verdict)}
                            <span className={`font-semibold text-lg capitalize ${getVerdictColor(result.verdict)}`}>
                              {result.verdict === 'authentic' ? 'Authentic Medicine' : 
                               result.verdict === 'fake' ? 'Potential Counterfeit' : 'Uncertain Result'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {result.confidence_score}% confidence
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">
                              {result.analysis_details}
                            </p>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Analyzed on {new Date(result.created_at).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">Preparing for analysis...</div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
