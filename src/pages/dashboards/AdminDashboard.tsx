import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  DollarSign,
  UserCheck,
  AlertCircle,
  Search,
  Ban,
  CheckCircle,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { sampleProducts } from '@/data/products';
import { toast } from 'sonner';
import type { User } from '@/types';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Package, label: 'Inventory', href: '/admin/inventory' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

// Stats component
function Overview() {
  const stats = [
    { label: 'Total Revenue', value: '$124,500', change: '+12%', icon: DollarSign },
    { label: 'Total Orders', value: '1,234', change: '+8%', icon: ShoppingCart },
    { label: 'Active Users', value: '5,678', change: '+15%', icon: UserCheck },
    { label: 'Products', value: sampleProducts.length.toString(), change: '+3%', icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white/5 rounded-lg border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gold" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-white/60 text-sm">{stat.label}</p>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/5">
        <h3 className="font-display text-xl text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New order placed', user: 'John Doe', time: '2 minutes ago' },
            { action: 'User registered', user: 'Jane Smith', time: '15 minutes ago' },
            { action: 'Product added', user: 'Seller One', time: '1 hour ago' },
            { action: 'Order delivered', user: 'Mike Johnson', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-white">{activity.action}</p>
                <p className="text-white/50 text-sm">by {activity.user}</p>
              </div>
              <span className="text-white/40 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Users Management
function UsersManagement() {
  const { getAllUsers, updateUserStatus } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    loadUsers();
  }, [getAllUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockUser = (userId: string) => {
    updateUserStatus(userId, 'blocked');
    toast.success('User blocked successfully');
  };

  const handleActivateUser = (userId: string) => {
    updateUserStatus(userId, 'active');
    toast.success('User activated successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'blocked':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'disabled':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default:
        return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">User Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">User</TableHead>
              <TableHead className="text-white/60">Role</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60">Joined</TableHead>
              <TableHead className="text-white/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold font-medium">{user.firstName[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-white/50 text-sm">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-white/80 capitalize">{user.role.replace('_', ' ')}</span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-white/60">
                  {user.createdAt 
                    ? (user.createdAt instanceof Date 
                        ? user.createdAt.toLocaleDateString()
                        : typeof user.createdAt === 'object' && 'toDate' in user.createdAt
                          ? user.createdAt.toDate().toLocaleDateString()
                          : '-')
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5">
                        <MoreHorizontal className="h-4 w-4 text-white/60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/95 border-white/10">
                      {user.status === 'active' ? (
                        <DropdownMenuItem
                          onClick={() => handleBlockUser(user.uid)}
                          className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Block User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleActivateUser(user.uid)}
                          className="text-green-400 hover:bg-green-500/10 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activate User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Inventory Management
function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = sampleProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">Inventory Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Product</TableHead>
              <TableHead className="text-white/60">SKU</TableHead>
              <TableHead className="text-white/60">Price</TableHead>
              <TableHead className="text-white/60">Inventory</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60">Seller</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    <span className="text-white">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white/60">{product.sku}</TableCell>
                <TableCell className="text-gold">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-white/60">{product.inventory}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-white/60">{product.sellerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Orders Management
function OrdersManagement() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-white">Orders Management</h2>
      <div className="p-12 text-center bg-white/5 rounded-lg border border-white/5">
        <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <p className="text-white/60">Orders management feature coming soon</p>
      </div>
    </div>
  );
}

// Settings
function SettingsManagement() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-white">Settings</h2>
      <div className="p-12 text-center bg-white/5 rounded-lg border border-white/5">
        <Settings className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <p className="text-white/60">Settings feature coming soon</p>
      </div>
    </div>
  );
}

// Main Dashboard Layout
export default function AdminDashboard() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/5 border-r border-white/5 fixed left-0 top-20">
          <div className="p-6">
            <p className="text-gold uppercase tracking-wider text-xs mb-4">Admin Panel</p>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-gold/10 text-gold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-red-400 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/settings" element={<SettingsManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
