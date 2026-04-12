import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, Plus, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleAddImage = () => {
    if (images.length < 5) {
      const newImage = `https://picsum.photos/seed/${Date.now()}/800/600`;
      setImages([...images, newImage]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => navigate('/marketplace'), 2000);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Create Listing</h1>
        <p className="text-gray-500">List your second-hand items for other students to discover. Textbooks, electronics, and stationery are most popular.</p>
      </div>

      <div className="space-y-8">
        {/* Image Upload Area */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button 
                  onClick={handleAddImage}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all bg-gray-50/50"
                >
                  <Camera size={24} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase">Add Photo</span>
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-4">Add up to 5 photos. High-quality images help items sell faster.</p>
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Listing Title</Label>
              <Input id="title" placeholder="e.g., Calculus: Early Transcendentals - 3rd Edition" className="h-11 border-gray-200" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="textbooks">Textbooks</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="stationery">Stationery</SelectItem>
                    <SelectItem value="notes">Physical Notes</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                  <Input id="price" type="number" placeholder="0.00" className="h-11 border-gray-200 pl-8" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New / Like New</SelectItem>
                    <SelectItem value="good">Good - used</SelectItem>
                    <SelectItem value="fair">Fair - heavily used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Related Course (Optional)</Label>
                <Input id="course" placeholder="e.g., MATHS 108" className="h-11 border-gray-200" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the item's condition, any highlighting, or specific pickup details..." 
                className="min-h-[150px] border-gray-200 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={images.length === 0 || isSubmitting || submitSuccess}
            className="flex-grow h-12 bg-black text-white hover:bg-gray-800 font-bold text-base relative overflow-hidden"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Publishing...
              </div>
            ) : submitSuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                Published!
              </div>
            ) : (
              'Publish Listing'
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
