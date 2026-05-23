import React from 'react';
import { Profile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useProfiles } from '../../contexts/ProfileContext';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Lock, Unlock, MapPin, Briefcase, Calendar, Info, Phone, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { user } = useAuth();
  const { format } = useCurrency();
  const { unlockProfile } = useProfiles();
  const [loading, setLoading] = React.useState(false);

  const isUnlocked = user?.role === 'admin' || user?.unlockedProfiles.includes(profile.id);

  const handleUnlock = async () => {
    if (!user) {
      toast.error('Please login to unlock profiles');
      return;
    }

    if (user.balance < profile.price) {
      toast.error('Insufficient balance. Please deposit funds.');
      return;
    }

    setLoading(true);
    try {
      await unlockProfile(profile.id);
      toast.success('Profile unlocked successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-primary/10 hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={profile.imageUrl}
            alt={profile.fullName}
            className={`w-full h-full object-cover transition-all duration-700 ${!isUnlocked ? 'blur-xl scale-110 grayscale' : 'blur-0 scale-100'}`}
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge variant={profile.status === 'Premium' ? 'destructive' : profile.status === 'Verified' ? 'default' : 'secondary'} className="shadow-md">
              {profile.status}
            </Badge>
            {!isUnlocked && (
              <div className="bg-black/60 backdrop-blur-md rounded-full p-2 border border-white/20">
                <Lock className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="text-center p-4">
                <p className="text-white font-bold text-sm mb-2 drop-shadow-md">CONTACT LOCKED</p>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2">
                  <p className="text-white/90 text-xs font-medium">Unlock Price</p>
                  <p className="text-white text-xl font-bold">{format(profile.price)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-bold text-lg leading-tight ${!isUnlocked ? 'select-none filter blur-[2px]' : ''}`}>
                {isUnlocked ? profile.fullName : '•••••••• ••••••••'}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="w-3 h-3" />
                <span>{profile.city}, {profile.state}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="font-medium">{profile.occupation}</span>
            </div>
            
            {isUnlocked ? (
              <>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold animate-in fade-in zoom-in">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>DOB: {new Date(profile.dob).toLocaleDateString()}</span>
                </div>
                <div className="pt-2 border-t mt-2">
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    <Info className="w-3 h-3 inline mr-1" />
                    {profile.bio}
                  </p>
                </div>
                {profile.notes && (
                  <div className="bg-primary/5 p-2 rounded text-xs border border-primary/10 italic">
                    "{profile.notes}"
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2 opacity-60">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-12 w-full bg-muted/50 rounded mt-2 border border-dashed border-muted flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Information Locked</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {!isUnlocked ? (
            <Button 
              className="w-full font-bold group" 
              onClick={handleUnlock}
              disabled={loading}
            >
              <Unlock className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Unlock Profile ({format(profile.price)})
            </Button>
          ) : (
            <Button variant="outline" className="w-full font-bold border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20" disabled>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Profile Unlocked
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};