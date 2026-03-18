import { useState } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'seller':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'customer_service':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gold/20 text-gold border-gold/30';
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl text-white mb-2">My Profile</h1>
            <p className="text-white/60">Manage your account information</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Avatar Card */}
            <div className="md:col-span-1">
              <div className="p-6 bg-white/5 rounded-lg border border-white/5 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-full h-full object-cover rounded-full border-2 border-gold/30"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold/30">
                      <User className="w-12 h-12 text-gold" />
                    </div>
                  )}
                  <button
                    onClick={() => toast.info('Avatar upload coming soon')}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-colors"
                  >
                    <Camera className="w-5 h-5 text-black" />
                  </button>
                </div>
                <h2 className="font-display text-xl text-white mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <span
                  className={`inline-block px-3 py-1 text-xs uppercase tracking-wider rounded-full border ${getRoleBadgeColor(
                    user?.role || ''
                  )}`}
                >
                  {user?.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2">
              <div className="p-6 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl text-white">Personal Information</h3>
                  <Button
                    variant="outline"
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white/60">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10 bg-white/5 border-white/10 text-white disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/60">Last Name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/60">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        value={formData.email}
                        disabled
                        className="pl-10 bg-white/5 border-white/10 text-white/50"
                      />
                    </div>
                    <p className="text-white/40 text-xs">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/60">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="+1 (555) 000-0000"
                        className="pl-10 bg-white/5 border-white/10 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="mt-6 p-6 bg-white/5 rounded-lg border border-white/5">
                <h3 className="font-display text-xl text-white mb-6">Account Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white/60">Member Since</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        value={
                          user?.createdAt
                            ? (typeof user.createdAt === 'object' && 'toDate' in user.createdAt 
                                ? user.createdAt.toDate().toLocaleDateString() 
                                : new Date(user.createdAt).toLocaleDateString())
                            : '-'
                        }
                        disabled
                        className="pl-10 bg-white/5 border-white/10 text-white/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60">Last Login</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        value={
                          user?.lastLogin
                            ? (typeof user.lastLogin === 'object' && 'toDate' in user.lastLogin 
                                ? user.lastLogin.toDate().toLocaleDateString() 
                                : new Date(user.lastLogin).toLocaleDateString())
                            : '-'
                        }
                        disabled
                        className="pl-10 bg-white/5 border-white/10 text-white/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
