import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, User, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

type Listing = {
  id: number;
  sellerId?: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition?: string;
  courseCode?: string;
  images?: string[];
  createdAt?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MarketPlacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(`${API_BASE_URL}/marketplace`);
        if (!response.ok) {
          throw new Error('Failed to load marketplace listings.');
        }

        const data = await response.json();
        // Backend returns { items, total, page, limit } — extract the array safely
        setListings(Array.isArray(data) ? data : (data.items ?? []));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load marketplace listings.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      item.title.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.courseCode?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col">
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://picsum.photos/seed/marketplace-hero/1920/1080?blur=2"
          alt="Marketplace Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4">Market Place</h1>
          <p className="text-xl opacity-90">Browse real listings created by students in the app</p>
          <Link to="/create-listing">
            <Button className="mt-8 h-12 px-10 bg-black text-white hover:bg-gray-800 rounded-md font-bold">Create a listing</Button>
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {errorMessage ? (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Filters</h3>
                <button className="text-xs text-gray-400 hover:text-black" onClick={() => setSearchQuery('')}>
                  Clear Search
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold">Current Categories</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {[...new Set(listings.map((item) => item.category).filter(Boolean))].slice(0, 6).map((category) => (
                    <p key={category}>{category}</p>
                  ))}
                  {listings.length === 0 ? <p>No categories yet.</p> : null}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold">Related Courses</h4>
                <div className="space-y-2">
                  {[...new Set(listings.map((item) => item.courseCode).filter(Boolean))].slice(0, 4).map((course) => (
                    <Button key={course} variant="outline" className="w-full justify-start h-auto py-2 px-3 text-[10px] text-left">
                      {course}
                    </Button>
                  ))}
                  {!listings.some((item) => item.courseCode) ? (
                    <p className="text-sm text-gray-500">Listings will show course links here once sellers add them.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-grow">
            <div className="mb-8">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search for textbooks, electronics, stationery..."
                  className="pl-12 h-12 border-gray-200 shadow-sm rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-500">
                  {isLoading ? 'Loading listings...' : `${filteredListings.length} item${filteredListings.length === 1 ? '' : 's'} found`}
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Newest First</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500">
                Loading marketplace listings...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredListings.map((item, index) => (
                  <Link key={item.id} to={`/marketplace/${item.id}`} className="group">
                    <Card className="border-none shadow-none bg-transparent">
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                          <img
                            src={item.images?.[0] || `https://picsum.photos/seed/marketplace-${item.id}/400/300`}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          {index === 0 && (
                            <Badge className="absolute top-3 left-3 bg-black text-white border-none rounded-sm text-[10px] uppercase font-bold px-2 py-0.5">Latest</Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:underline">{item.title}</h3>
                        <p className="font-bold text-lg mb-2">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-500">
                          <span>Seller #{item.sellerId ?? 'N/A'}</span>
                          {item.category ? <span>• {item.category}</span> : null}
                          {item.condition ? <span>• {item.condition}</span> : null}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && filteredListings.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed mt-8">
                <p className="text-gray-400">No marketplace listings match your current search.</p>
              </div>
            ) : null}
          </main>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 py-24 border-t mt-24">
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold">Real-Time Listings</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              New items published through the create listing form now appear here automatically.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold">Seller Profiles</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Listings are tied back to authenticated users, so profile management and marketplace management stay in sync.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-bold">Student Goods</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Textbooks, stationery, electronics, and notes can all be published through the shared backend.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-bold">Next Step</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Detail pages can be connected next so these cards open into real item records instead of placeholders.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
