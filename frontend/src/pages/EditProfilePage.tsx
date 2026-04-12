import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  
  const avatars = [
    'https://picsum.photos/seed/user/200',
    'https://picsum.photos/seed/avatar2/200',
    'https://picsum.photos/seed/avatar3/200',
    'https://picsum.photos/seed/avatar4/200',
    'https://picsum.photos/seed/avatar5/200',
  ];

  const handleSave = () => {
    // Logic to save profile
    navigate('/profile');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
          <ArrowLeft size={16} />
          Back to profile
        </Link>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="space-y-8">
        {/* Avatar Section */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={avatars[selectedAvatar]} />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center border-4 border-white hover:bg-gray-800 transition-colors">
                  <Camera size={18} />
                </button>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold mb-3">Choose from library</p>
                <div className="flex flex-wrap gap-3">
                  {avatars.map((avatar, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedAvatar(i)}
                      className={`h-14 w-14 rounded-full overflow-hidden border-2 transition-all relative ${selectedAvatar === i ? 'border-black scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {selectedAvatar === i && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">Or upload your own image (max 2MB)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info Section */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Alex Marshall" className="h-11 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upi">UPI ID</Label>
                <Input id="upi" defaultValue="amar123" disabled className="h-11 bg-gray-50 border-gray-200 text-gray-400" />
                <p className="text-[10px] text-gray-400">UPI ID cannot be changed</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Tell us a bit about yourself, your major, or what you're looking for..." 
                className="min-h-[120px] border-gray-200 resize-none"
                defaultValue="Third-year Software Engineering student at UoA. Passionate about algorithms and open-source materials."
              />
              <p className="text-xs text-gray-400 text-right">0 / 200 characters</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info Section */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Contact Details (for Marketplace)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input id="whatsapp" placeholder="+64 21 000 0000" className="h-11 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wechat">WeChat ID</Label>
                <Input id="wechat" placeholder="Your WeChat ID" className="h-11 border-gray-200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Public Email (Optional)</Label>
              <Input id="email" placeholder="alex.m@example.com" className="h-11 border-gray-200" />
              <p className="text-[10px] text-gray-400">This email will be visible to potential buyers on your listings</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="flex-grow h-12 bg-black text-white hover:bg-gray-800 font-bold text-base">
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile')} className="h-12 px-8 font-bold text-base">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
