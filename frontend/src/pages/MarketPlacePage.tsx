import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown, User, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const listings = [
  {
    id: '1',
    title: 'TI-84 Graphing Calculator — Good Condition',
    price: '$75',
    seller: 'Maya Thompson',
    category: 'Maths',
    image: 'https://picsum.photos/seed/calc/400/300'
  },
  {
    id: '2',
    title: 'Fundamentals of Physics — 10th Edition',
    price: '$30',
    seller: 'Noah Green',
    category: 'Physics',
    image: 'https://picsum.photos/seed/physics/400/300',
    bestSeller: true
  },
  {
    id: '3',
    title: 'Stationery Bundle — Highlighters & Sticky Notes',
    price: '$12',
    seller: 'Priya Singh',
    category: 'General',
    image: 'https://picsum.photos/seed/stationery/400/300'
  },
  {
    id: '4',
    title: 'Discrete Math Notes — Comprehensive Bundle',
    price: '$20',
    seller: 'Sofia Martinez',
    category: 'CS',
    image: 'https://picsum.photos/seed/notes-cs/400/300'
  },
  {
    id: '5',
    title: 'Introduction to Algorithms — 3rd Edition',
    price: '$45',
    seller: 'Liam Patel',
    category: 'Computer Science',
    image: 'https://picsum.photos/seed/algo/400/300',
    isNew: true
  },
  {
    id: '6',
    title: 'Wireless Over-Ear Headphones — Like New',
    price: '$85',
    seller: 'Ethan Walker',
    category: 'Electronics',
    image: 'https://picsum.photos/seed/headphones/400/300'
  }
];

export default function MarketPlacePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
          <p className="text-xl opacity-90">Subheading with description of your shopping site</p>
          <Button className="mt-8 h-12 px-10 bg-black text-white hover:bg-gray-800 rounded-md font-bold">Button</Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Filters</h3>
                <button className="text-xs text-gray-400 hover:text-black">Clear All</button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold">Year</h4>
                <div className="space-y-2">
                  {['2026', '2025', 'All'].map((year) => (
                    <label key={year} className="flex items-center gap-3 cursor-pointer group">
                      <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-black">
                        <div className="h-2 w-2 rounded-full bg-black scale-0 transition-transform group-has-[:checked]:scale-100"></div>
                      </div>
                      <input type="radio" name="year" className="hidden" />
                      <span className="text-sm text-gray-600">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold">Item Type</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Books', count: 1234 },
                    { label: 'Stationery', count: 542 },
                    { label: 'Electronics', count: 328 }
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                      <div className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-black">
                        <div className="h-2 w-2 bg-black scale-0 transition-transform group-has-[:checked]:scale-100"></div>
                      </div>
                      <input type="checkbox" className="hidden" />
                      <span className="text-sm text-gray-600">{item.label} ({item.count.toLocaleString()})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold">Related Courses</h4>
                <div className="space-y-2">
                  {[
                    { code: 'CS732', name: 'Advanced Algorithms', matched: 24 },
                    { code: 'MA201', name: 'Linear Algebra', matched: 12 },
                    { code: 'PH310', name: 'Computational Physics', matched: 8 }
                  ].map((course) => (
                    <Button key={course.code} variant="outline" className="w-full justify-start h-auto py-2 px-3 text-[10px] text-left">
                      {course.code} - {course.name} Matched: {course.matched}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-grow bg-black text-white hover:bg-gray-800 h-10 text-xs font-bold">Apply Filters</Button>
                <Button variant="ghost" className="h-10 text-xs font-bold">Cancel</Button>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
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
                <h2 className="text-sm font-medium text-gray-500">24 items found</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Newest First</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((item) => (
                <Link key={item.id} to={`/marketplace/${item.id}`} className="group">
                  <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                        {item.bestSeller && (
                          <Badge className="absolute top-3 left-3 bg-black text-white border-none rounded-sm text-[10px] uppercase font-bold px-2 py-0.5">Best Seller</Badge>
                        )}
                        {item.isNew && (
                          <Badge className="absolute top-3 left-3 bg-white text-black border-none rounded-sm text-[10px] uppercase font-bold px-2 py-0.5">New</Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:underline">{item.title}</h3>
                      <p className="font-bold text-lg mb-2">{item.price}</p>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-gray-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${item.seller}/50/50`} alt={item.seller} referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] text-gray-500">{item.seller} • {item.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </main>
        </div>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 py-24 border-t mt-24">
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold">Subheading</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold">Subheading</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Body text for whatever you'd like to suggest. Add main takeaway points, quotes, anecdotes, or even a very very short story.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-bold">Subheading</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Body text for whatever you'd like to claim. Add main takeaway points, quotes, anecdotes, or even a very very short story.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-10 flex items-center justify-center">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-bold">Subheading</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Body text for whatever you'd like to type. Add main takeaway points, quotes, anecdotes, or even a very very short story.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
