import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Users, 
  Wallet, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Edit2, 
  Trash2, 
  Plus, 
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Profile } from '../types';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { profiles, deposits, transactions, approveDeposit, rejectDeposit, updateProfile, deleteProfile, addProfile } = useProfiles();
  const { format } = useCurrency();
  const [editingProfile, setEditingProfile] = React.useState<Profile | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <ShieldAlert className="w-20 h-20 text-destructive mb-6" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You do not have administrative privileges to view this page.</p>
        <Button className="mt-8" asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: JSON.parse(localStorage.getItem('black_sense_users') || '[]').length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Profiles', value: profiles.length, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Pending Deposits', value: deposits.filter(d => d.status === 'pending').length, icon: Wallet, color: 'bg-amber-500' },
    { label: 'Total Volume', value: transactions.filter(t => t.type === 'deposit').reduce((acc, t) => acc + t.amount, 0), icon: TrendingUp, color: 'bg-purple-500', isCurrency: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform management and financial oversight.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Add New Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stat.isCurrency ? format(stat.value) : stat.value}
                  </h3>
                </div>
                <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Deposit Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-500" />
              Pending Deposits
            </CardTitle>
            <CardDescription>Approve or reject manual payment transfers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deposits.filter(d => d.status === 'pending').length === 0 ? (
                <div className="text-center py-10 text-muted-foreground italic">No pending deposits.</div>
              ) : (
                deposits.filter(d => d.status === 'pending').map((dep) => (
                  <div key={dep.id} className="p-4 border rounded-xl bg-card space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{dep.userEmail}</p>
                        <p className="text-sm text-muted-foreground">Ref: {dep.transactionRef}</p>
                        <p className="text-xl font-black text-primary mt-1">
                          {dep.localCurrency} {dep.localAmount.toLocaleString()} 
                          <span className="text-sm font-normal text-muted-foreground ml-2">(${dep.amount.toFixed(2)} USD)</span>
                        </p>
                      </div>
                      <Badge variant="secondary">{new Date(dep.createdAt).toLocaleDateString()}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => {
                        approveDeposit(dep.id);
                        toast.success('Deposit approved!');
                      }}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => {
                        rejectDeposit(dep.id);
                        toast.error('Deposit rejected.');
                      }}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profiles Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Profile Management
            </CardTitle>
            <CardDescription>Manage the exactly 20 profiles on the marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {profiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-sm leading-none">{p.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.city}, {p.state} • ${p.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingProfile(p)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      if(confirm('Are you sure?')) deleteProfile(p.id);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      {editingProfile && (
        <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile: {editingProfile.fullName}</DialogTitle>
            </DialogHeader>
            <ProfileForm 
              initialData={editingProfile} 
              onSubmit={(data) => {
                updateProfile({ ...editingProfile, ...data } as Profile);
                setEditingProfile(null);
                toast.success('Profile updated!');
              }} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Profile Dialog */}
      {isAdding && (
        <Dialog open={isAdding} onOpenChange={() => setIsAdding(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Profile</DialogTitle>
            </DialogHeader>
            <ProfileForm 
              onSubmit={(data) => {
                addProfile(data as Omit<Profile, 'id'>);
                setIsAdding(false);
                toast.success('Profile added!');
              }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface ProfileFormData {
  fullName: string;
  city: string;
  state: string;
  phoneNumber: string;
  occupation: string;
  dob: string;
  bio: string;
  notes: string;
  imageUrl: string;
  status: 'Active' | 'Premium' | 'Verified';
  price: number;
}

const ProfileForm = ({ initialData, onSubmit }: { initialData?: Partial<Profile>, onSubmit: (data: ProfileFormData) => void }) => {
  const [formData, setFormData] = React.useState<ProfileFormData>({
    fullName: initialData?.fullName || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    phoneNumber: initialData?.phoneNumber || '',
    occupation: initialData?.occupation || '',
    dob: initialData?.dob || '',
    bio: initialData?.bio || '',
    notes: initialData?.notes || '',
    imageUrl: initialData?.imageUrl || '',
    status: (initialData?.status as any) || 'Active',
    price: initialData?.price || 10
  });

  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2 col-span-2 sm:col-span-1">
        <Label>Full Name</Label>
        <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
      </div>
      <div className="space-y-2 col-span-2 sm:col-span-1">
        <Label>Occupation</Label>
        <Input value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>City</Label>
        <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>State</Label>
        <Input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Phone Number</Label>
        <Input value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Date of Birth</Label>
        <Input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Price ($ USD)</Label>
        <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as any})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Image URL</Label>
        <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Short Bio</Label>
        <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Notes</Label>
        <Textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
      </div>
      <DialogFooter className="col-span-2 pt-4">
        <Button onClick={() => onSubmit(formData)} className="w-full sm:w-auto">Save Changes</Button>
      </DialogFooter>
    </div>
  );
};

export default AdminPage;