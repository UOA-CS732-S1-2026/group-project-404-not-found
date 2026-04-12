import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function UploadMaterialPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Upload Material</h1>
        <p className="text-gray-500">Share your course materials with the community and earn points. Ensure your uploads comply with university policies.</p>
      </div>

      <div className="space-y-8">
        {/* File Upload Area */}
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden">
          <CardContent className="p-12 text-center">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
            {!file ? (
              <div className="space-y-4">
                <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-gray-400">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-lg font-bold">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">PDF, DOCX, PPTX or ZIP (max 50MB)</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <div className="h-16 w-16 bg-black text-white rounded-xl flex items-center justify-center">
                  <FileText size={32} />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold truncate max-w-[300px]">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Material Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., COMPSCI 101 Exam Prep Notes" className="h-11 border-gray-200" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course Code</Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs101">COMPSCI 101</SelectItem>
                    <SelectItem value="math108">MATHS 108</SelectItem>
                    <SelectItem value="eng121">ENGGEN 121</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points Cost</Label>
                <div className="relative">
                  <Input id="points" type="number" placeholder="500" className="h-11 border-gray-200 pr-12" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">pts</span>
                </div>
                <p className="text-[10px] text-gray-400">Recommended: 200 - 800 pts</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly describe what's included in this material..." 
                className="min-h-[100px] border-gray-200 resize-none"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-blue-700 text-xs leading-relaxed">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <p>
                By uploading, you confirm that you have the right to share this material and it does not violate the University of Auckland's Academic Integrity Policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading || uploadSuccess}
            className="flex-grow h-12 bg-black text-white hover:bg-gray-800 font-bold text-base relative overflow-hidden"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : uploadSuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                Success!
              </div>
            ) : (
              'Upload Material'
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="h-12 px-8 font-bold text-base">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
