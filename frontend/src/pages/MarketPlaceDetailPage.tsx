import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Mail, Phone, Copy, Share2, Bookmark } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function MarketPlaceDetailPage() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  const listing = {
    title: 'Calculus: Early Transcendentals - 3rd',
    price: '$10.99',
    category: 'Textbook',
    condition: 'Good - used',
    location: 'University of Auckland',
    description: 'A well-used third edition calculus textbook. Pages are intact with light highlighting on select chapters (limits and integrals). Spine is slightly creased but binding remains solid. Ideal for first-year engineering students. Includes personal notes on chapter 2 and 4.\n\nPickup preferred. Open to swapping for a physics textbook or selling together with solution manual for an extra $5.',
    images: [
      'https://picsum.photos/seed/book-detail-1/800/600',
      'https://picsum.photos/seed/book-detail-2/800/600',
      'https://picsum.photos/seed/book-detail-3/800/600',
    ],
    seller: {
      name: 'Alex Chen',
      email: 'alex.chen@aucklanduni.ac.nz',
      whatsapp: '+64 21 555 0123',
      wechat: 'uoa_student_88',
      phone: '+64 9 373 7519'
    }
  };

  const similarListings = [
    { id: 's1', title: 'Linear Algebra - 2nd Ed', price: '$8.00', condition: 'Good', image: 'https://picsum.photos/seed/sim1/300/300' },
    { id: 's2', title: 'Introductory Physics', price: '$12.00', condition: 'Like new', image: 'https://picsum.photos/seed/sim2/300/300' },
    { id: 's3', title: 'Discrete Mathematics', price: '$9.50', condition: 'Used', image: 'https://picsum.photos/seed/sim3/300/300' },
    { id: 's4', title: 'Organic Chemistry', price: '$11.00', condition: 'Accept swap', image: 'https://picsum.photos/seed/sim4/300/300' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/marketplace" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
        <ArrowLeft size={16} />
        Back to marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
            <img 
              src={listing.images[currentImage]} 
              alt={listing.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="flex gap-4">
            {listing.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImage(i)}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${currentImage === i ? 'border-black' : 'border-transparent opacity-60'}`}
              >
                <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Listing Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex flex-wrap gap-3 items-center text-sm text-gray-500">
              <span>Category: {listing.category}</span>
              <span>•</span>
              <span>Condition: {listing.condition}</span>
              <span>•</span>
              <span>Location: {listing.location}</span>
            </div>
          </div>

          <div>
            <p className="text-3xl font-bold mb-1">{listing.price}</p>
            <p className="text-xs text-gray-400">Free pickup on campus • Prefer collection near School of</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Contact Seller</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="text-green-500"><MessageCircle size={20} /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">WhatsApp</p>
                    <p className="text-sm font-medium">{listing.seller.whatsapp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold">Copy</Button>
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500"><MessageCircle size={20} /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">WeChat</p>
                    <p className="text-sm font-medium">{listing.seller.wechat}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold">Copy</Button>
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400"><Mail size={20} /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Email</p>
                    <p className="text-sm font-medium truncate max-w-[150px]">{listing.seller.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold">Copy</Button>
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400"><Phone size={20} /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Phone</p>
                    <p className="text-sm font-medium">{listing.seller.phone}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold">Copy</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Similar Listings</h2>
          <span className="text-sm text-gray-400">Showing 4 items</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {similarListings.map((item) => (
            <Link key={item.id} to={`/marketplace/${item.id}`} className="group">
              <Card className="border-gray-100 hover:border-gray-300 transition-all">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:underline">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{item.price}</span>
                    <span className="text-[10px] text-gray-400">• {item.condition}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
