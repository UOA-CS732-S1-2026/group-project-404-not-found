import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2, XCircle, Trash2, Plus, FileText, Users, ShoppingBag, BookOpen,
  AlertCircle, RefreshCw, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// ── Types ────────────────────────────────────────────────────────────────────
type PendingMaterial = {
  id: number;
  title: string;
  courseCode: string;
  description?: string;
  fileType?: string;
  fileSize?: string;
  uploaderId: number;
  createdAt: string;
  status: string;
};

type AdminUser = {
  id: number;
  username: string;
  email: string;
  is_admin: number;
  creditBalance: number;
  createdAt: string;
};

type AdminCourse = {
  id: number;
  courseCode: string;
  courseName: string;
  department?: string;
  level?: number;
  status?: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-NZ', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ── Material Review ──
  const [materials, setMaterials] = useState<PendingMaterial[]>([]);
  const [matStatus, setMatStatus] = useState<'pending' | 'live' | 'rejected'>('pending');
  const [matLoading, setMatLoading] = useState(false);
  const [matMsg, setMatMsg] = useState('');

  // ── Users ──
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ── Courses ──
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDept, setNewCourseDept] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState('');
  const [courseMsg, setCourseMsg] = useState('');
  const [courseCreating, setCourseCreating] = useState(false);

  // ── Stats ──
  const [stats, setStats] = useState({ pendingMaterials: 0, totalUsers: 0, totalCourses: 0 });

  // ── Auth check (must be admin) ────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || !data.is_admin) {
          navigate('/');
          return;
        }
        setIsAdmin(true);
      })
      .catch(() => navigate('/'))
      .finally(() => setCheckingAuth(false));
  }, [navigate]);

  // ── Load materials by status ──────────────────────────────────────────────
  const loadMaterials = async (status: string) => {
    setMatLoading(true);
    setMatMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/materials?status=${status}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMaterials(Array.isArray(data) ? data : (data.items ?? []));
    } catch {
      setMatMsg('Failed to load materials.');
    } finally {
      setMatLoading(false);
    }
  };

  // ── Load users ────────────────────────────────────────────────────────────
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data);
    } catch {
      /* silent */
    } finally {
      setUsersLoading(false);
    }
  };

  // ── Load courses ──────────────────────────────────────────────────────────
  const loadCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/course`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCourses(data);
    } catch { /* silent */ }
  };

  // ── Initial data load ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return;
    void loadMaterials('pending');
    void loadUsers();
    void loadCourses();
  }, [isAdmin]);

  useEffect(() => {
    setStats({
      pendingMaterials: materials.filter(m => m.status === 'pending').length,
      totalUsers: users.length,
      totalCourses: courses.length,
    });
  }, [materials, users, courses]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const approveMaterial = async (id: number) => {
    setMatMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/materials/${id}/approve`, { method: 'PATCH', credentials: 'include' });
      if (!res.ok) throw new Error();
      setMaterials(prev => prev.filter(m => m.id !== id));
      setMatMsg('✅ Material approved! Uploader has been awarded 200 pts.');
    } catch {
      setMatMsg('Failed to approve material.');
    }
  };

  const rejectMaterial = async (id: number) => {
    setMatMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/materials/${id}/reject`, { method: 'PATCH', credentials: 'include' });
      if (!res.ok) throw new Error();
      setMaterials(prev => prev.filter(m => m.id !== id));
      setMatMsg('Material rejected.');
    } catch {
      setMatMsg('Failed to reject material.');
    }
  };

  const deleteMaterial = async (id: number) => {
    if (!confirm('Permanently delete this material?')) return;
    try {
      await fetch(`${API_BASE_URL}/admin/materials/${id}`, { method: 'DELETE', credentials: 'include' });
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch { /* silent */ }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Permanently delete this user and all their data?')) return;
    try {
      await fetch(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { /* silent */ }
  };

  const createCourse = async () => {
    if (!newCourseCode.trim() || !newCourseName.trim()) {
      setCourseMsg('Course code and name are required.');
      return;
    }
    setCourseCreating(true);
    setCourseMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/course`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: newCourseCode.trim().toUpperCase(),
          courseName: newCourseName.trim(),
          department: newCourseDept.trim() || undefined,
          level: newCourseLevel ? parseInt(newCourseLevel) : undefined,
          status: 'Available',
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setCourseMsg(d.error ?? 'Failed to create course.');
        return;
      }
      const newCourse = await res.json();
      setCourses(prev => [...prev, newCourse]);
      setNewCourseCode('');
      setNewCourseName('');
      setNewCourseDept('');
      setNewCourseLevel('');
      setCourseMsg(`✅ Course "${newCourse.courseCode}" created successfully!`);
    } catch {
      setCourseMsg('Failed to create course.');
    } finally {
      setCourseCreating(false);
    }
  };

  const deleteCourse = async (id: number, code: string) => {
    if (!confirm(`Delete course ${code}? This cannot be undone.`)) return;
    try {
      await fetch(`${API_BASE_URL}/admin/course/${id}`, { method: 'DELETE', credentials: 'include' });
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch { /* silent */ }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage materials, users and courses</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <Card className="border-gray-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Pending Review</p>
              <p className="text-3xl font-bold">{stats.pendingMaterials}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Courses</p>
              <p className="text-3xl font-bold">{stats.totalCourses}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="materials">
        <TabsList className="mb-8 bg-gray-100 rounded-xl p-1 h-auto gap-1">
          <TabsTrigger value="materials" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText size={16} className="mr-2" />
            Material Review
            {stats.pendingMaterials > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {stats.pendingMaterials}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users size={16} className="mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="courses" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BookOpen size={16} className="mr-2" />
            Courses
          </TabsTrigger>
        </TabsList>

        {/* ── Material Review Tab ── */}
        <TabsContent value="materials">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {(['pending', 'live', 'rejected'] as const).map(s => (
                <Button
                  key={s}
                  variant={matStatus === s ? 'default' : 'outline'}
                  size="sm"
                  className={`capitalize h-9 ${matStatus === s ? 'bg-black text-white' : ''}`}
                  onClick={() => {
                    setMatStatus(s);
                    void loadMaterials(s);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => void loadMaterials(matStatus)}>
              <RefreshCw size={16} className="mr-2" /> Refresh
            </Button>
          </div>

          {matMsg && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm border ${matMsg.startsWith('✅') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {matMsg}
            </div>
          )}

          {matLoading ? (
            <div className="py-20 text-center">
              <div className="h-8 w-8 mx-auto border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : materials.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed">
              <CheckCircle2 size={40} className="mx-auto text-green-400 mb-3" />
              <p className="text-gray-500 font-medium">No materials with status "{matStatus}"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {materials.map(m => (
                <Card key={m.id} className="border-gray-100">
                  <CardContent className="p-6 flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center flex-shrink-0">
                        <FileText size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base">{m.title}</h3>
                          <Badge variant="outline" className="rounded-md h-5 px-2 text-[10px] font-bold">{m.courseCode}</Badge>
                          {m.status === 'pending' && <Badge className="rounded-md h-5 px-2 text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-200">Pending</Badge>}
                          {m.status === 'live' && <Badge className="rounded-md h-5 px-2 text-[10px] bg-green-50 text-green-700 border border-green-200">Live</Badge>}
                          {m.status === 'rejected' && <Badge className="rounded-md h-5 px-2 text-[10px] bg-red-50 text-red-600 border border-red-200">Rejected</Badge>}
                        </div>
                        <p className="text-xs text-gray-400">
                          Uploader ID: {m.uploaderId} • {m.fileType?.toUpperCase() ?? 'FILE'}{m.fileSize ? ` • ${m.fileSize}` : ''} • Submitted {formatDate(m.createdAt)}
                        </p>
                        {m.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{m.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {m.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="h-9 bg-green-600 hover:bg-green-700 text-white font-bold"
                            onClick={() => void approveMaterial(m.id)}
                          >
                            <CheckCircle2 size={16} className="mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 text-orange-600 border-orange-200 hover:bg-orange-50 font-bold"
                            onClick={() => void rejectMaterial(m.id)}
                          >
                            <XCircle size={16} className="mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-gray-400 hover:text-red-500"
                        onClick={() => void deleteMaterial(m.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Users Tab ── */}
        <TabsContent value="users">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{users.length} registered users</p>
            <Button variant="ghost" size="sm" onClick={() => void loadUsers()}>
              <RefreshCw size={16} className="mr-2" /> Refresh
            </Button>
          </div>
          {usersLoading ? (
            <div className="py-20 text-center">
              <div className="h-8 w-8 mx-auto border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(u => (
                <Card key={u.id} className="border-gray-100">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                        {u.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{u.username || u.email}</p>
                          {u.is_admin === 1 && (
                            <Badge className="h-4 px-1.5 text-[9px] bg-purple-100 text-purple-700 border border-purple-200 rounded-sm">ADMIN</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{u.email} • {u.creditBalance ?? 0} pts • Joined {formatDate(u.createdAt)}</p>
                      </div>
                    </div>
                    {u.is_admin !== 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-red-500"
                        onClick={() => void deleteUser(u.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Courses Tab ── */}
        <TabsContent value="courses">
          {/* Create new course */}
          <Card className="border-gray-100 mb-8">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Plus size={18} /> Add New Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseMsg && (
                <div className={`px-4 py-3 rounded-xl text-sm border ${courseMsg.startsWith('✅') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {courseMsg}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="course-code">Course Code <span className="text-red-500">*</span></Label>
                  <Input id="course-code" placeholder="e.g. COMPSCI101" className="h-10 border-gray-200" value={newCourseCode} onChange={e => setNewCourseCode(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="course-name">Course Name <span className="text-red-500">*</span></Label>
                  <Input id="course-name" placeholder="e.g. Introduction to Computer Science" className="h-10 border-gray-200" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="course-dept">Department</Label>
                  <Input id="course-dept" placeholder="e.g. Computer Science" className="h-10 border-gray-200" value={newCourseDept} onChange={e => setNewCourseDept(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="course-level">Level</Label>
                  <Input id="course-level" type="number" placeholder="e.g. 100, 200, 700" className="h-10 border-gray-200" value={newCourseLevel} onChange={e => setNewCourseLevel(e.target.value)} />
                </div>
              </div>
              <Button
                className="bg-black text-white hover:bg-gray-800 font-bold"
                onClick={() => void createCourse()}
                disabled={courseCreating || !newCourseCode.trim() || !newCourseName.trim()}
              >
                {courseCreating ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Plus size={16} className="mr-2" />
                )}
                Create Course
              </Button>
            </CardContent>
          </Card>

          {/* Course list */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{courses.length} courses in system</p>
            <Button variant="ghost" size="sm" onClick={() => void loadCourses()}>
              <RefreshCw size={16} className="mr-2" /> Refresh
            </Button>
          </div>
          <div className="space-y-3">
            {courses.map(c => (
              <Card key={c.id} className="border-gray-100">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {c.level ?? '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{c.courseCode}</p>
                        <span className="text-gray-400 text-sm">—</span>
                        <p className="text-sm text-gray-600">{c.courseName}</p>
                      </div>
                      {c.department && <p className="text-xs text-gray-400">{c.department}</p>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-400 hover:text-red-500"
                    onClick={() => void deleteCourse(c.id, c.courseCode)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


