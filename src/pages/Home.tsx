import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Globe, Lock, Wallet, ArrowRight, Zap, Star, Shield } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                Premium Contact Platform
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
                Connect with the <span className="text-primary italic">Elite</span> in the United States
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Black Sense is the world's most secure premium contact marketplace. 
                Access verified, high-profile United States contacts from anywhere in Africa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/marketplace" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:px-8 h-14 text-lg font-bold rounded-full group">
                  Explore Marketplace
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:px-8 h-14 text-lg font-bold rounded-full border-2">
                  Join Black Sense
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              <div>
                <p className="text-3xl font-bold text-primary">20+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Verified Profiles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Secure System</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">05+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">African Regions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">Instant</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Unlocking</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Black Sense?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our platform is designed for security, transparency, and elite networking.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Lock className="w-10 h-10 text-primary" />}
              title="Locked System"
              description="Full profile details remain hidden and secure until you decide to unlock them via our premium wallet system."
            />
            <FeatureCard 
              icon={<Globe className="w-10 h-10 text-primary" />}
              title="US Data Only"
              description="Every profile on the platform contains authentic United States based information, verified by our team."
            />
            <FeatureCard 
              icon={<Wallet className="w-10 h-10 text-primary" />}
              title="Local Currency"
              description="Pay and manage your balance in your own African currency. We handle the real-time conversion for you."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to start your premium journey?</h2>
          <Link to="/auth">
            <Button size="lg" className="px-12 h-16 text-xl font-bold rounded-full">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold">BLACK SENSE</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Black Sense Premium Platform. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-2xl bg-background border border-primary/10 hover:border-primary/30 transition-all shadow-sm group">
    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

import { Badge } from '../components/ui/badge';

export default Home;