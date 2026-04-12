import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ShoppingBag, ArrowLeft, Share2, Bookmark, ExternalLink, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function CourseDetailPage() {
  const { id } = useParams();

  // Mock data for a specific course
  const course = {
    code: 'MATHS 108',
    title: 'Mathematics for Business',
    level: 'Undergraduate',
    semester: 'Trimester 1 • 2026',
    instructor: 'Dr. Ayesha Patel',
    description: 'An introduction to applied mathematics for business students covering calculus fundamentals, optimisation, time value of money and statistical methods with practical examples and problem sets used in commerce and finance contexts.',
    updatedAt: '12 Mar'
  };

  const materials = [
    { id: 'm1', name: 'Maths 108 Notes.PDF', date: '02 Mar 2026', size: '1.8 MB', uploader: 'Emily' },
    { id: 'm2', name: 'Assignment 1 Solutions.DOCX', date: '10 Mar 2026', size: '240 KB', uploader: 'Liam' },
    { id: 'm3', name: 'Practice Exam.pdf', date: '18 Feb 2026', size: '3.2 MB', uploader: 'Course' },
  ];

  const listings = [
    { id: 'l1', title: 'Mathematics for Business - 2nd ed', price: '$10.99', seller: 'Oliver Nguyen', image: 'https://picsum.photos/seed/book1/400/300', description: 'A well-kept textbook with margin notes from previous students — essential for MATHS 108.' },
    { id: 'l2', title: 'Lecture Notes Bundle', price: '$6.00', seller: 'Priya Sharma', image: 'https://picsum.photos/seed/notes1/400/300', description: 'Photocopies of full trimester lecture notes, clear handwriting and organized by...' },
    { id: 'l3', title: 'Scientific Calculator (Casio)', price: '$18.00', seller: 'Hannah Lee', image: 'https://picsum.photos/seed/calc1/400/300', description: 'Reliable calculator for course exercises. Barely used and kept in original...' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/courses" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
          <ArrowLeft size={16} />
          Back to courses
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{course.code} – {course.title}</h1>
            </div>
            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500">
              <Badge variant="secondary" className="rounded-md bg-gray-100 text-gray-600 border-none">{course.level}</Badge>
              <span>{course.semester}</span>
              <span className="hidden md:inline">•</span>
              <span className="font-medium text-gray-900">Course code: {course.code}</span>
              <span className="hidden md:inline">•</span>
              <span>Instructor: {course.instructor}</span>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-400 mb-1">Course code: {course.code}</p>
            <p className="text-xs text-gray-400">Instructor: {course.instructor}</p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed max-w-4xl mb-8">
          {course.description}
        </p>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-md h-10 px-6 font-medium">Continue Browsing</Button>
          <Button variant="outline" size="icon" className="rounded-md h-10 w-10"><Share2 size={18} /></Button>
          <Button variant="outline" size="icon" className="rounded-md h-10 w-10"><Bookmark size={18} /></Button>
          <div className="flex-grow"></div>
          <span className="text-xs text-gray-400 self-center">Updated: {course.updatedAt}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Materials Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Materials</h2>
            <span className="text-xs text-gray-400">{materials.length} items</span>
          </div>
          <div className="space-y-4">
            {materials.map((item) => (
              <Card key={item.id} className="border-gray-100 hover:border-gray-300 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-400">
                        Uploaded {item.date} • {item.size} • Uploaded by {item.uploader}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black">
                    <Download size={20} />
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full h-12 rounded-md font-bold text-gray-500 hover:text-black">
              Load more materials
            </Button>
          </div>
        </div>

        {/* Marketplace Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Marketplace</h2>
            <span className="text-xs text-gray-400">{listings.length} listings</span>
          </div>
          <div className="space-y-4">
            {listings.map((item) => (
              <Card key={item.id} className="border-gray-100 hover:border-gray-300 transition-colors">
                <CardContent className="p-4 flex gap-4">
                  <div className="h-24 w-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                        <span className="font-bold text-sm">{item.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-gray-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${item.seller}/50/50`} alt={item.seller} referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] text-gray-500">Seller: {item.seller}</span>
                      </div>
                      <Link to={`/marketplace/${item.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold px-3">
                          View details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full h-12 rounded-md font-bold text-gray-500 hover:text-black">
              Load more listings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
