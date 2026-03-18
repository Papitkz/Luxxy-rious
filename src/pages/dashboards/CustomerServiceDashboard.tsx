import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  AlertTriangle,
  LogOut,
  Search,
  CheckCircle,
  Clock,
  Filter,
  Send,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { sampleProducts } from '@/data/products';
import { toast } from 'sonner';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/support' },
  { icon: MessageSquare, label: 'Tickets', href: '/support/tickets' },
  { icon: AlertTriangle, label: 'Reports', href: '/support/reports' },
  { icon: Package, label: 'Inventory', href: '/support/inventory' },
];

// Sample tickets
const sampleTickets = [
  {
    id: 'TKT-001',
    user: 'John Doe',
    email: 'john@example.com',
    type: 'refund',
    subject: 'Request refund for order ORD-001',
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15',
  },
  {
    id: 'TKT-002',
    user: 'Jane Smith',
    email: 'jane@example.com',
    type: 'feedback',
    subject: 'Great experience!',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-14',
  },
  {
    id: 'TKT-003',
    user: 'Mike Johnson',
    email: 'mike@example.com',
    type: 'report',
    subject: 'Issue with seller',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-03-13',
  },
  {
    id: 'TKT-004',
    user: 'Sarah Williams',
    email: 'sarah@example.com',
    type: 'general',
    subject: 'Question about shipping',
    status: 'open',
    priority: 'low',
    createdAt: '2024-03-12',
  },
];

// Sample reports
const sampleReports = [
  {
    id: 'RPT-001',
    reporter: 'Buyer One',
    reported: 'Seller One',
    type: 'user',
    reason: 'Fraudulent activity',
    status: 'investigating',
    createdAt: '2024-03-15',
  },
  {
    id: 'RPT-002',
    reporter: 'Buyer Two',
    reported: 'Product XYZ',
    type: 'product',
    reason: 'Counterfeit item',
    status: 'pending',
    createdAt: '2024-03-14',
  },
];

// Overview Component
function Overview() {
  const stats = [
    { label: 'Open Tickets', value: '12', icon: MessageSquare, color: 'text-amber-400' },
    { label: 'Resolved Today', value: '8', icon: CheckCircle, color: 'text-green-400' },
    { label: 'Pending Reports', value: '3', icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Avg Response Time', value: '2h', icon: Clock, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white/5 rounded-lg border border-white/5">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-white/60 text-sm">{stat.label}</p>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/5">
        <h3 className="font-display text-xl text-white mb-4">Recent Tickets</h3>
        <div className="space-y-4">
          {sampleTickets.slice(0, 3).map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-white font-medium">{ticket.subject}</p>
                <p className="text-white/50 text-sm">by {ticket.user}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  ticket.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                  ticket.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                  ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tickets Management
function TicketsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<typeof sampleTickets[0] | null>(null);
  const [reply, setReply] = useState('');

  const filteredTickets = sampleTickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReply = () => {
    if (!reply.trim()) return;
    toast.success('Reply sent successfully');
    setReply('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">Support Tickets</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-white/5 border-white/10 text-white"
            />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Ticket ID</TableHead>
              <TableHead className="text-white/60">Customer</TableHead>
              <TableHead className="text-white/60">Subject</TableHead>
              <TableHead className="text-white/60">Type</TableHead>
              <TableHead className="text-white/60">Priority</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white/60">{ticket.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-white">{ticket.user}</p>
                    <p className="text-white/50 text-sm">{ticket.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-white">{ticket.subject}</TableCell>
                <TableCell>
                  <span className="text-white/60 capitalize">{ticket.type}</span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                    ticket.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {ticket.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                    ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTicket(ticket)}
                    className="text-gold hover:bg-gold/10"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl bg-black/95 border-white/10">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              {selectedTicket?.subject}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-white/60">From: <span className="text-white">{selectedTicket.user}</span></span>
                <span className="text-white/60">Type: <span className="text-white capitalize">{selectedTicket.type}</span></span>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white/80">
                  Customer inquiry about {selectedTicket.type}. This is a sample ticket message.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">Reply</Label>
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your response..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSendReply} className="bg-gold text-black hover:bg-gold-light">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  Mark as Resolved
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reports Management
function ReportsManagement() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-white">Reports</h2>
      
      <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Report ID</TableHead>
              <TableHead className="text-white/60">Reporter</TableHead>
              <TableHead className="text-white/60">Reported</TableHead>
              <TableHead className="text-white/60">Type</TableHead>
              <TableHead className="text-white/60">Reason</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleReports.map((report) => (
              <TableRow key={report.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white/60">{report.id}</TableCell>
                <TableCell className="text-white">{report.reporter}</TableCell>
                <TableCell className="text-white">{report.reported}</TableCell>
                <TableCell>
                  <span className="text-white/60 capitalize">{report.type}</span>
                </TableCell>
                <TableCell className="text-white/80">{report.reason}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    report.status === 'investigating' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {report.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Inventory View
function InventoryView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = sampleProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">Inventory View</h2>
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
              <TableHead className="text-white/60">Category</TableHead>
              <TableHead className="text-white/60">Price</TableHead>
              <TableHead className="text-white/60">Inventory</TableHead>
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
                <TableCell className="text-white/60 capitalize">{product.category.replace('-', ' ')}</TableCell>
                <TableCell className="text-gold">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-white/60">{product.inventory}</TableCell>
                <TableCell className="text-white/60">{product.sellerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Main Dashboard Layout
export default function CustomerServiceDashboard() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/5 border-r border-white/5 fixed left-0 top-20">
          <div className="p-6">
            <p className="text-gold uppercase tracking-wider text-xs mb-4">Support Panel</p>
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
            <Route path="/tickets" element={<TicketsManagement />} />
            <Route path="/reports" element={<ReportsManagement />} />
            <Route path="/inventory" element={<InventoryView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
