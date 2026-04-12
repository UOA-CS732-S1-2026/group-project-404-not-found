import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronLeft, ChevronRight, Users, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: '1',
    code: 'COMPSCI 101',
    title: 'Introduction to Computer Science',
    instructor: 'Dr. Amelia Rangi',
    schedule: 'Mon, Wed • 10:00 – 11:30 • Grafton Lecture',
    prerequisites: 'None',
    status: 'Available',
    seats: 8,
    image: 'https://picsum.photos/seed/cs101/400/400'
  },
  {
    id: '2',
    code: 'ENGL 210',
    title: 'Modernist Literature and Culture',
    instructor: 'Prof. Hemi Tui',
    schedule: 'Tue, Thu • 14:00 – 15:30 • City Campus Room',
    prerequisites: 'ENGL 101 or',
    status: 'Limited',
    waitlist: true,
    image: 'https://picsum.photos/seed/engl210/400/400'
  },
  {
    id: '3',
    code: 'ARTS 150',
    title: 'Foundations of Visual Practice',
    instructor: 'Maia Chen',
    schedule: 'Fri • 09:00 – 12:00 • Elam',
    prerequisites: 'None',
    status: 'Available',
    seats: 12,
    image: 'https://picsum.photos/seed/arts150/400/400'
  },
  {
    id: '4',
    code: 'BUSMGT 301',
    title: 'Organisational Behaviour',
    instructor: 'Dr. Naveen Patel',
    schedule: 'Mon • 18:00 – 20:00 • Business School',
    prerequisites: 'BUSMGT 101',
    status: 'Limited',
    seats: 3,
    image: 'https://picsum.photos/seed/bus301/400/400'
  },
  {
    id: '5',
    code: 'ENGG 220',
    title: 'Statics and Dynamics',
    instructor: 'Prof. Leo Marshall',
    schedule: 'Tue, Thu • 08:30 – 10:00 • Engineering Lab',
    prerequisites: 'ENGG 110',
    status: 'Available',
    seats: 5,
    image: 'https://picsum.photos/seed/engg220/400/400'
  },
  {
    id: '6',
    code: 'MATHS 205',
    title: 'Linear Algebra II',
    instructor: 'Dr. Sione Leota',
    schedule: 'Wed • 13:00 – 15:00 • Mathematics Building',
    prerequisites: 'MATHS 101',
    status: 'Closed',
    waitlist: 10,
    image: 'https://picsum.photos/seed/maths205/400/400'
  }
];

export default function CourseListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Find your course</h1>
        <p className="text-gray-500 mb-8">Search courses by code, title, instructor or department to discover linked materials and marketplace listings.</p>
        
        <div className="flex gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              placeholder="Search by course code, title, or instructor..." 
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
            <input type="checkbox" id="available" className="rounded border-gray-300" />
            <label htmlFor="available" className="text-gray-600">Show only available courses</label>
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

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">24 courses found</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Sort by</span>
          <select className="border-none bg-transparent font-medium outline-none cursor-pointer">
            <option>Newest first</option>
            <option>Code A-Z</option>
            <option>Popularity</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{course.code}</h3>
                  <h4 className="text-lg font-bold leading-tight line-clamp-2 h-14">{course.title}</h4>
                </div>
                <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                  <img src={course.image} alt={course.instructor} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Instructor:</span> {course.instructor}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Schedule:</span> {course.schedule}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Prerequisites:</span> {course.prerequisites}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Badge variant={course.status === 'Available' ? 'secondary' : 'outline'} className={`rounded-md ${course.status === 'Available' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                  {course.status}
                </Badge>
                <span className="text-xs text-gray-400">
                  {course.waitlist ? `Waitlist available` : `Seats left: ${course.seats}`}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Link to={`/course/${course.id}`} className="w-full">
                <Button variant="ghost" className="w-full h-12 rounded-none border-t font-bold hover:bg-gray-50">
                  View details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" size="icon" className="h-10 w-10"><ChevronLeft size={20} /></Button>
        <Button variant="outline" className="h-10 w-10 p-0">1</Button>
        <Button className="h-10 w-10 p-0 bg-black text-white">2</Button>
        <Button variant="outline" className="h-10 w-10 p-0">3</Button>
        <Button variant="outline" size="icon" className="h-10 w-10"><ChevronRight size={20} /></Button>
      </div>
    </div>
  );
}
