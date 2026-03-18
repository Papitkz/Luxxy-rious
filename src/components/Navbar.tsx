import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ShoppingBag,
  User,
  Menu,
  LogOut,
  Package,
  Heart,
  ChevronDown,
  LayoutDashboard,
  HeadphonesIcon,
} from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/products' },
  { name: 'Categories', href: '/products' },
  { name: 'About', href: '/#about' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard };
      case 'seller':
        return { href: '/seller', label: 'Seller Dashboard', icon: Package };
      case 'customer_service':
        return { href: '/support', label: 'Support Dashboard', icon: HeadphonesIcon };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="section-padding">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl text-gold-gradient tracking-wider">
              Luxxy-rious
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-body font-medium tracking-wider uppercase transition-colors duration-300 gold-underline ${
                  location.pathname === link.href
                    ? 'text-gold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-white/80 hover:text-gold transition-colors" />
              {(cart?.totalItems || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {(cart?.totalItems || 0) > 99 ? '99+' : cart?.totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-full transition-colors">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full object-cover border border-gold/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                        <User className="w-4 h-4 text-gold" />
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-white/60 hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-black/95 backdrop-blur-xl border border-white/10"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-white/50 capitalize">{user?.role.replace('_', ' ')}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  {user?.role === 'buyer' && (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate('/profile')}
                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                      >
                        <User className="w-4 h-4 mr-2 text-gold" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/orders')}
                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                      >
                        <Package className="w-4 h-4 mr-2 text-gold" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/addresses')}
                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                      >
                        <Heart className="w-4 h-4 mr-2 text-gold" />
                        Addresses
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {dashboardLink && (
                    <DropdownMenuItem
                      onClick={() => navigate(dashboardLink.href)}
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                    >
                      <dashboardLink.icon className="w-4 h-4 mr-2 text-gold" />
                      {dashboardLink.label}
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-white/5 focus:bg-white/5 text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-white/80 hover:text-white hover:bg-white/5"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gold text-black hover:bg-gold-light font-medium"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 hover:bg-white/5 rounded-full transition-colors">
                  <Menu className="w-6 h-6 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-80 bg-black/98 border-l border-white/10"
              >
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl text-gold-gradient">
                    Luxxy-rious
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-body font-medium text-white/80 hover:text-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {!isAuthenticated && (
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate('/login');
                          setIsMobileMenuOpen(false);
                        }}
                        className="border-white/20 text-white hover:bg-white/5"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => {
                          navigate('/register');
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-gold text-black hover:bg-gold-light"
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
