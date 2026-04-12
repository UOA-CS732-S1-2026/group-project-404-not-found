import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddImage = () => {
    if (images.length < 5) {
      const newImage = `https://picsum.photos/seed/${Date.now()}/800/600`;
      setImages([...images, newImage]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !category || !price || !condition) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/marketplace`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
          category,
          condition,
          courseCode: courseCode.trim(),
          images,
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.status === 401) {
        navigate('/auth');
        return;
      }

      if (!response.ok) {
        setErrorMessage(data?.error ?? 'Unable to publish your listing.');
        return;
      }

      setSubmitSuccess(true);
      setTimeout(() => navigate('/profile'), 1200);
    } catch {
      setErrorMessage('Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Create Listing</h1>
        <p className="text-gray-500">List your second-hand items for other students to discover. Textbooks, electronics, and stationery are most popular.</p>
      </div>

      <div className="space-y-8">
        {errorMessage ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

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
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
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

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Listing Title</Label>
              <Input id="title" placeholder="e.g., Calculus: Early Transcendentals - 3rd Edition" className="h-11 border-gray-200" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Textbooks">Textbooks</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Stationery">Stationery</SelectItem>
                    <SelectItem value="Physical Notes">Physical Notes</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                  <Input id="price" type="number" placeholder="0.00" className="h-11 border-gray-200 pl-8" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New / Like New">New / Like New</SelectItem>
                    <SelectItem value="Good - used">Good - used</SelectItem>
                    <SelectItem value="Fair - heavily used">Fair - heavily used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Related Course (Optional)</Label>
                <Input id="course" placeholder="e.g., MATHS 108" className="h-11 border-gray-200" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item's condition, any highlighting, or specific pickup details..."
                className="min-h-[150px] border-gray-200 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => void handleSubmit()}
            disabled={!title.trim() || !category || !price || !condition || isSubmitting || submitSuccess}
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
