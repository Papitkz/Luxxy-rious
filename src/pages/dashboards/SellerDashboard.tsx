import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  LogOut,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon,
  Tag,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { sampleProducts, categories } from '@/data/products';
import { toast } from 'sonner';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/seller' },
  { icon: Package, label: 'My Products', href: '/seller/products' },
  { icon: PlusCircle, label: 'Add Product', href: '/seller/add-product' },
  { icon: ShoppingCart, label: 'Orders', href: '/seller/orders' },
];

// Overview Component
function Overview() {
  const myProducts = sampleProducts.filter((p) => p.sellerId === 'seller-1');
  const totalSales = 45678;
  const totalOrders = 123;
  const pendingOrders = 8;

  const stats = [
    { label: 'Total Sales', value: `$${totalSales.toLocaleString()}`, icon: DollarSign },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart },
    { label: 'Products', value: myProducts.length.toString(), icon: Package },
    { label: 'Pending Orders', value: pendingOrders.toString(), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white/5 rounded-lg border border-white/5">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <stat.icon className="w-6 h-6 text-gold" />
            </div>
            <p className="text-white/60 text-sm">{stat.label}</p>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/5">
        <h3 className="font-display text-xl text-white mb-4">Recent Orders</h3>
        <div className="space-y-4">
          {[
            { id: 'ORD-001', product: 'Classic Timepiece', amount: 299, status: 'delivered' },
            { id: 'ORD-002', product: 'Leather Weekender', amount: 449, status: 'processing' },
            { id: 'ORD-003', product: 'Gold Chain Necklace', amount: 249, status: 'shipped' },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-white font-medium">{order.id}</p>
                <p className="text-white/50 text-sm">{order.product}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gold">${order.amount}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                  order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Products List
function ProductsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const myProducts = sampleProducts.filter((p) => p.sellerId === 'seller-1');

  const filteredProducts = myProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">My Products</h2>
        <div className="flex gap-4">
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
          <Link to="/seller/add-product">
            <Button className="bg-gold text-black hover:bg-gold-light">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
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
              <TableHead className="text-white/60 text-right">Actions</TableHead>
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
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5">
                        <MoreHorizontal className="h-4 w-4 text-white/60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/95 border-white/10">
                      <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                        <Edit2 className="w-4 h-4 mr-2 text-gold" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
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

// Add Product
function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    inventory: '',
    category: '',
    sku: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product added successfully!');
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      inventory: '',
      category: '',
      sku: '',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-white">Add New Product</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Images */}
        <div className="p-6 bg-white/5 rounded-lg border border-white/5">
          <Label className="text-white/60 mb-4 block">Product Images</Label>
          <div className="grid grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => toast.info('Image upload coming soon')}
              className="aspect-square bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center hover:border-gold/50 transition-colors"
            >
              <ImageIcon className="w-8 h-8 text-white/40 mb-2" />
              <span className="text-white/40 text-xs">Add Image</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 bg-white/5 rounded-lg border border-white/5 space-y-4">
          <div className="space-y-2">
            <Label className="text-white/60">Product Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/60">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              className="bg-white/5 border-white/10 text-white min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/60">Category</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60">SKU</Label>
              <div className="relative">
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-001"
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6 bg-white/5 rounded-lg border border-white/5 space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Tag className="w-5 h-5 text-gold" />
            Pricing
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/60">Price</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60">Compare at Price (Optional)</Label>
              <Input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="0.00"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="p-6 bg-white/5 rounded-lg border border-white/5 space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Package className="w-5 h-5 text-gold" />
            Inventory
          </h3>
          <div className="space-y-2">
            <Label className="text-white/60">Quantity</Label>
            <Input
              type="number"
              value={formData.inventory}
              onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
              placeholder="0"
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" className="bg-gold text-black hover:bg-gold-light">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Link to="/seller/products">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

// Orders
function SellerOrders() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-white">Orders</h2>
      <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Order ID</TableHead>
              <TableHead className="text-white/60">Product</TableHead>
              <TableHead className="text-white/60">Customer</TableHead>
              <TableHead className="text-white/60">Amount</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: 'ORD-001', product: 'Classic Timepiece', customer: 'John Doe', amount: 299, status: 'delivered', date: '2024-03-01' },
              { id: 'ORD-002', product: 'Leather Weekender', customer: 'Jane Smith', amount: 449, status: 'processing', date: '2024-03-05' },
              { id: 'ORD-003', product: 'Gold Chain Necklace', customer: 'Mike Johnson', amount: 249, status: 'shipped', date: '2024-03-08' },
            ].map((order) => (
              <TableRow key={order.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white">{order.id}</TableCell>
                <TableCell className="text-white/80">{order.product}</TableCell>
                <TableCell className="text-white/60">{order.customer}</TableCell>
                <TableCell className="text-gold">${order.amount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                    order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-white/60">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Main Dashboard Layout
export default function SellerDashboard() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/5 border-r border-white/5 fixed left-0 top-20">
          <div className="p-6">
            <p className="text-gold uppercase tracking-wider text-xs mb-4">Seller Panel</p>
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
            <Route path="/products" element={<ProductsList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/orders" element={<SellerOrders />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
