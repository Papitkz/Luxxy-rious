import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message || 'Login failed');
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = (role: string) => {
    switch (role) {
      case 'admin':
        setFormData({ email: 'admin@luxxyrious.com', password: 'admin123' });
        break;
      case 'seller':
        setFormData({ email: 'seller@luxxyrious.com', password: 'seller123' });
        break;
      case 'buyer':
        setFormData({ email: 'buyer@luxxyrious.com', password: 'buyer123' });
        break;
      case 'support':
        setFormData({ email: 'support@luxxyrious.com', password: 'support123' });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center section-padding py-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <span className="font-display text-3xl text-gold-gradient">Luxxy-rious</span>
          </Link>
          <h1 className="font-display text-3xl text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/20" />
              <span className="text-white/60 text-sm">Remember me</span>
            </label>
            <Link to="#" className="text-gold hover:text-gold-light text-sm">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-black hover:bg-gold-light font-medium py-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-3 text-center">Quick Login (Demo)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="px-3 py-2 text-xs bg-gold/10 text-gold rounded hover:bg-gold/20 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('seller')}
              className="px-3 py-2 text-xs bg-gold/10 text-gold rounded hover:bg-gold/20 transition-colors"
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('buyer')}
              className="px-3 py-2 text-xs bg-gold/10 text-gold rounded hover:bg-gold/20 transition-colors"
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('support')}
              className="px-3 py-2 text-xs bg-gold/10 text-gold rounded hover:bg-gold/20 transition-colors"
            >
              Support
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="mt-8 text-center text-white/60">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-gold hover:text-gold-light font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
