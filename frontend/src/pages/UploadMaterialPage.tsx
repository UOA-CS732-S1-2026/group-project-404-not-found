import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function UploadMaterialPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim() || !courseCode) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/material`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          courseCode,
          year: Number(year),
          description: description.trim(),
          fileType: file.name.split('.').pop()?.toLowerCase() || 'file',
          originalFileName: file.name,
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.status === 401) {
        navigate('/auth');
        return;
      }

      if (!response.ok) {
        setErrorMessage(data?.error ?? 'Unable to upload your material.');
        return;
      }

      setUploadSuccess(true);
      setTimeout(() => navigate('/profile'), 1200);
    } catch {
      setErrorMessage('Unable to connect to the server.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Upload Material</h1>
        <p className="text-gray-500">Share your course materials with the community and earn points. Ensure your uploads comply with university policies.</p>
      </div>

      <div className="space-y-8">
        {errorMessage ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

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
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Material Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., COMPSCI 101 Exam Prep Notes" className="h-11 border-gray-200" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course Code</Label>
                <Select value={courseCode} onValueChange={setCourseCode}>
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPSCI101">COMPSCI 101</SelectItem>
                    <SelectItem value="MATHS108">MATHS 108</SelectItem>
                    <SelectItem value="ENGGEN121">ENGGEN 121</SelectItem>
                    <SelectItem value="COMPSCI732">COMPSCI 732</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <div className="relative">
                  <Input id="year" type="number" placeholder="2026" className="h-11 border-gray-200" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <p className="text-[10px] text-gray-400">Used for sorting and filtering materials</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what's included in this material..."
                className="min-h-[100px] border-gray-200 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-blue-700 text-xs leading-relaxed">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <p>
                By uploading, you confirm that you have the right to share this material and it does not violate the University of Auckland&apos;s Academic Integrity Policy.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => void handleUpload()}
            disabled={!file || !title.trim() || !courseCode || !year || isUploading || uploadSuccess}
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
