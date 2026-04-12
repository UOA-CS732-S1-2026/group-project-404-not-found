import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, FileText, Filter, Wallet, History, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const materials = [
  {
    id: '1',
    name: 'CS701 Exam Prep Notes',
    course: 'MATHS 108',
    uploader: 'jdoe123',
    date: 'Apr 1, 2026',
    points: 500,
    type: 'PDF',
    icon: 'https://picsum.photos/seed/pdf/100/100'
  },
  {
    id: '2',
    name: 'Intro to Algorithms Lecture Slides',
    course: 'COMP 202',
    uploader: 'alice.w',
    date: 'Mar 29, 2026',
    points: 500,
    type: 'PPT',
    icon: 'https://picsum.photos/seed/ppt/100/100'
  },
  {
    id: '3',
    name: 'Linear Algebra Solutions Set',
    course: 'MATHS 301',
    uploader: 'r.thompson',
    date: 'Feb 10, 2026',
    points: 500,
    type: 'DOCX',
    icon: 'https://picsum.photos/seed/doc/100/100'
  },
  {
    id: '4',
    name: 'Signals & Systems Recorded Tutorial',
    course: 'ENGR 210',
    uploader: 'm_chen',
    date: 'Jan 18, 2026',
    points: 500,
    type: 'Video',
    icon: 'https://picsum.photos/seed/video/100/100'
  },
  {
    id: '5',
    name: 'Annotated Exam Solutions (Figures)',
    course: 'COMP 350',
    uploader: 'sara.k',
    date: 'Dec 5, 2025',
    points: 500,
    type: 'Image',
    icon: 'https://picsum.photos/seed/image/100/100'
  }
];

export default function MaterialsMarketPage() {
  const [searchQuery, setSearchQuery] = useState('');

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
          <Button className="h-14 px-10 bg-black text-white hover:bg-gray-800 text-lg font-medium">Search</Button>
        </div>

        <div className="flex flex-wrap gap-8 items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Level:</span>
            <div className="flex gap-2">
              {['All levels', '100', '200', '300', '400'].map((level) => (
                <Button key={level} variant={level === 'All levels' ? 'default' : 'outline'} size="sm" className="rounded-md h-8 px-3">
                  {level}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Semester:</span>
            <select className="border rounded-md h-8 px-2 bg-white outline-none">
              <option>Semester 1</option>
              <option>Semester 2</option>
              <option>Summer School</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Type:</span>
            <div className="flex gap-2">
              {['PDF', 'DOCX', 'PPT', 'Video', 'Image'].map((type) => (
                <Button key={type} variant="outline" size="sm" className="rounded-md h-8 px-3">
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="text-sm font-medium mr-2 self-center">Departments:</span>
          {['Art', 'English', 'Computer Science', 'Business', 'Engineering', 'More'].map((dept) => (
            <Button key={dept} variant="outline" size="sm" className="rounded-md h-8 px-4">
              {dept}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Materials List */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Materials</h2>
            <span className="text-sm text-gray-400">Showing 5 results</span>
          </div>
          <div className="space-y-4">
            {materials.map((item) => (
              <Card key={item.id} className="border-gray-100 hover:border-gray-300 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg overflow-hidden border flex-shrink-0">
                      <img src={item.icon} alt={item.type} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">{item.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <Badge variant="outline" className="rounded-md h-6 px-2 font-bold">{item.course}</Badge>
                        <span>Uploaded by {item.uploader}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-sm whitespace-nowrap">{item.points} pts</span>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black">
                      <Download size={24} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Points Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-gray-100 shadow-sm sticky top-24">
            <CardContent className="p-8">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Points Balance</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold">1,250 pts</span>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Wallet size={24} className="text-gray-600" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-8">Available balance</p>

              <div className="space-y-6">
                <h4 className="text-sm font-bold">Recent transactions</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Downloaded CS701 Notes</span>
                    <span className="font-medium text-red-500">-500 pts</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Uploaded ML Slides</span>
                    <span className="font-medium text-green-500">+800 pts</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Downloaded COMP202 Slides</span>
                    <span className="font-medium text-red-500">-700 pts</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-md font-bold text-gray-500 hover:text-black">
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
