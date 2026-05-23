import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShieldCheck, Mail, Lock, User, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { SUPPORTED_CURRENCIES } from '../lib/constants';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    fullName: '',
    country: 'Ghana',
    currency: 'GHS'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back to Black Sense!');
      } else {
        await register({
          email: formData.email,
          fullName: formData.fullName,
          country: formData.country,
          currency: formData.currency
        });
        toast.success('Account created successfully!');
      }
      navigate('/marketplace');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-black tracking-tighter">BLACK SENSE</h1>
          <p className="text-muted-foreground">Secure Premium Contact Access</p>
        </div>

        <Card className="border-2 shadow-2xl">
          <CardHeader>
            <CardTitle>{isLogin ? 'Login' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Enter your credentials to access the platform.' : 'Join our elite network of professionals.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="fullName" 
                      className="pl-10" 
                      placeholder="John Doe" 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    className="pl-10" 
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="currency">Local Currency (African Regions)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select 
                      value={formData.currency} 
                      onValueChange={v => {
                        const curr = SUPPORTED_CURRENCIES.find(c => c.code === v);
                        setFormData({...formData, currency: v, country: curr?.name || 'Ghana'});
                      }}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_CURRENCIES.filter(c => c.code !== 'USD').map(c => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name} ({c.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <Button className="w-full font-bold h-12" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Elite Account'}
              </Button>

              <div className="text-center pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLogin && (
          <div className="mt-8 p-4 bg-muted rounded-xl border text-center">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-bold">Admin Demo Credentials</p>
            <p className="text-sm font-medium">Email: <code className="bg-background px-1 rounded">admin@blacksense.com</code></p>
            <p className="text-sm font-medium">Pass: <code className="bg-background px-1 rounded">admin123</code></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;