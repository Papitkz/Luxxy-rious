import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'buyer', label: 'Buyer', description: 'Shop and purchase products' },
  { value: 'seller', label: 'Seller', description: 'Sell your products' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    const result = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.role
    );

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.message || 'Registration failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center section-padding py-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <span className="font-display text-3xl text-gold-gradient">Luxxy-rious</span>
          </Link>
          <h1 className="font-display text-3xl text-white mb-2">Create Account</h1>
          <p className="text-white/60">Join the world of luxury</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white/80">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20"
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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
                minLength={6}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white/80">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-white/80">I want to</Label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.role === role.value
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.role === role.value ? 'border-gold' : 'border-white/40'
                    }`}>
                      {formData.role === role.value && <div className="w-2 h-2 rounded-full bg-gold" />}
                    </div>
                    <span className="text-white font-medium text-sm">{role.label}</span>
                  </div>
                  <p className="text-white/50 text-xs mt-1 ml-6">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                agreedToTerms
                  ? 'bg-gold border-gold'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              {agreedToTerms && <Check className="w-3 h-3 text-black" />}
            </div>
            <span className="text-white/60 text-sm">
              I agree to the{' '}
              <Link to="#" className="text-gold hover:text-gold-light">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#" className="text-gold hover:text-gold-light">Privacy Policy</Link>
            </span>
          </label>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-black hover:bg-gold-light font-medium py-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-light font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
