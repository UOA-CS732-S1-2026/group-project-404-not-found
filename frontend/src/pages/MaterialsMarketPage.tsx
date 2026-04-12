import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Wallet } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

type Material = {
  id: number;
  title: string;
  courseCode: string;
  description?: string;
  fileType?: string;
  createdAt?: string;
  year?: number;
};

function formatDate(value?: string) {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function MaterialsMarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(`${API_BASE_URL}/material`);
        if (!response.ok) {
          throw new Error('Failed to load materials.');
        }

        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load materials.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadMaterials();
  }, []);

  const filteredMaterials = materials.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      item.title.toLowerCase().includes(query) ||
      item.courseCode.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  const pointsEstimate = filteredMaterials.length * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="flex gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search by course code or material title..."
              className="pl-12 h-14 border-gray-200 shadow-sm text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-14 px-10 bg-black text-white hover:bg-gray-800 text-lg font-medium" disabled>
            Search
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Materials</h2>
            <span className="text-sm text-gray-400">
              {isLoading ? 'Loading...' : `Showing ${filteredMaterials.length} result${filteredMaterials.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500">
              Loading materials...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMaterials.map((item) => (
                <Card key={item.id} className="border-gray-100 hover:border-gray-300 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg overflow-hidden border flex-shrink-0 bg-gray-50 flex items-center justify-center text-gray-400 font-bold">
                        {(item.fileType ?? 'FILE').slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1">{item.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                          <Badge variant="outline" className="rounded-md h-6 px-2 font-bold">{item.courseCode}</Badge>
                          {item.year ? <span>{item.year}</span> : null}
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                        {item.description ? (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-sm whitespace-nowrap">{100} pts</span>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black" disabled>
                        <Download size={24} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredMaterials.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                  <p className="text-gray-400">No materials match your current search.</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="border-gray-100 shadow-sm sticky top-24">
            <CardContent className="p-8">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Points Balance</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold">{pointsEstimate} pts</span>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Wallet size={24} className="text-gray-600" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-8">Estimated from currently loaded materials</p>

              <div className="space-y-6">
                <h4 className="text-sm font-bold">How it works</h4>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>Upload new study resources to make them available in the materials market.</p>
                  <p>Your recent uploads will also appear in your profile for quick management.</p>
                  <p>Points are still using a placeholder economy until the backend points model is added.</p>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-md font-bold text-gray-500 hover:text-black" disabled>
                  View full history
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
