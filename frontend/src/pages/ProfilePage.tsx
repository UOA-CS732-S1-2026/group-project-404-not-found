import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, ShoppingBag, FileText, Download, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001';

type UserProfile = {
  id: number;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  description?: string;
  avatar_id?: number;
};

type UserMaterial = {
  id: number;
  title: string;
  courseCode: string;
  year: number;
  description?: string;
  fileType?: string;
  createdAt?: string;
};

type UserListing = {
  id: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  createdAt?: string;
  createAt?: string;
};

function formatDisplayDate(value?: string) {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  }).format(value);
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [uploads, setUploads] = useState<UserMaterial[]>([]);
  const [listings, setListings] = useState<UserListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingMaterialId, setDeletingMaterialId] = useState<number | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<number | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [profileResponse, materialsResponse, listingsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/me`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/me/material`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/me/marketplace`, { credentials: 'include' }),
        ]);

        if (profileResponse.status === 401) {
          setUser(null);
          setUploads([]);
          setListings([]);
          return;
        }

        if (!profileResponse.ok || !materialsResponse.ok || !listingsResponse.ok) {
          throw new Error('Failed to load your profile data.');
        }

        const [profileData, materialsData, listingsData] = await Promise.all([
          profileResponse.json(),
          materialsResponse.json(),
          listingsResponse.json(),
        ]);

        setUser(profileData);
        setUploads(materialsData);
        setListings(listingsData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load your profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfileData();
  }, []);

  const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm('Delete this material from your profile?')) return;

    setDeletingMaterialId(materialId);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/me/material/${materialId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        setUser(null);
        setUploads([]);
        setListings([]);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete the material.');
      }

      setUploads((currentUploads) => currentUploads.filter((item) => item.id !== materialId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete the material.');
    } finally {
      setDeletingMaterialId(null);
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    if (!window.confirm('Delete this listing from your profile?')) return;

    setDeletingListingId(listingId);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/me/marketplace/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        setUser(null);
        setUploads([]);
        setListings([]);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete the listing.');
      }

      setListings((currentListings) => currentListings.filter((item) => item.id !== listingId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete the listing.');
    } finally {
      setDeletingListingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-gray-100">
          <CardContent className="p-10 text-center space-y-4">
            <h1 className="text-2xl font-bold">Please log in to view your profile</h1>
            <p className="text-sm text-gray-500">
              Your uploads, listings, and account settings will appear here after you sign in.
            </p>
            <Link to="/auth" className="inline-block">
              <Button className="bg-black text-white hover:bg-gray-800">Go to login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() || user.username || user.email;
  const initials = `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.trim() || user.email[0]?.toUpperCase() || 'U';
  const pointsEstimate = uploads.length * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {errorMessage ? (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <Card className="border-gray-100 shadow-sm sticky top-24">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md mb-4">
                  <AvatarImage src={`https://picsum.photos/seed/avatar-${user.avatar_id ?? 1}/200`} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
                <p className="text-sm text-gray-400 mb-2">{user.email}</p>
                <p className="text-sm text-gray-400 mb-4">Username: {user.username}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {user.description?.trim() || 'Add a bio to introduce yourself to other students.'}
                </p>
                <Link to="/profile/edit" className="w-full">
                  <Button variant="outline" className="w-full h-10 rounded-md font-bold text-sm">
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              <div className="space-y-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Points Balance</p>
                      <p className="text-lg font-bold">{pointsEstimate} pts</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs font-bold" disabled>
                    History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="uploads" className="w-full">
            <div className="flex justify-between items-center mb-8">
              <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-8">
                <TabsTrigger value="uploads" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-4 font-bold text-base">My Uploads</TabsTrigger>
                <TabsTrigger value="listings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-4 font-bold text-base">My Listings</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-4 font-bold text-base">Settings</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Link to="/upload">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800 h-9 px-4 font-bold">
                    <Plus size={16} className="mr-2" />
                    Upload
                  </Button>
                </Link>
                <Link to="/create-listing">
                  <Button variant="outline" size="sm" className="h-9 px-4 font-bold">
                    <Plus size={16} className="mr-2" />
                    List Item
                  </Button>
                </Link>
              </div>
            </div>

            <TabsContent value="uploads" className="mt-0 space-y-4">
              {uploads.map((item) => (
                <Card key={item.id} className="border-gray-100 hover:border-gray-300 transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-400">
                          {item.courseCode} • {item.fileType?.toUpperCase() ?? 'FILE'} • Uploaded {formatDisplayDate(item.createdAt)}
                        </p>
                        {item.description ? (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black" disabled>
                        <Download size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => void handleDeleteMaterial(item.id)}
                        disabled={deletingMaterialId === item.id}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {uploads.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                  <p className="text-gray-400">You haven't uploaded any materials yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="listings" className="mt-0 space-y-4">
              {listings.map((item) => (
                <Card key={item.id} className="border-gray-100 hover:border-gray-300 transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-20 rounded-lg bg-gray-100 overflow-hidden">
                        <img src={`https://picsum.photos/seed/listing-${item.id}/100/100`} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1">{item.title}</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-sm">{formatCurrency(item.price)}</span>
                          <Badge variant="secondary" className="rounded-md bg-green-50 text-green-700 border-green-100">
                            Active
                          </Badge>
                          {item.category ? <span className="text-xs text-gray-400">{item.category}</span> : null}
                          <span className="text-xs text-gray-400">
                            Listed {formatDisplayDate(item.createdAt || item.createAt)}
                          </span>
                        </div>
                        {item.description ? (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/marketplace/${item.id}`}>
                        <Button variant="ghost" size="sm" className="text-sm font-medium">
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black" disabled>
                        <Edit2 size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => void handleDeleteListing(item.id)}
                        disabled={deletingListingId === item.id}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {listings.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                  <p className="text-gray-400">You haven't created any listings yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <Card className="border-gray-100">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-bold">Account Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email when material is downloaded</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email when someone messages about a listing</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Monthly points summary</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t space-y-4">
                    <h3 className="font-bold text-red-500">Danger Zone</h3>
                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 font-bold" disabled>
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
