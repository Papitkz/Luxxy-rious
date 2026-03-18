import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Order, OrderStatus, OrderItem } from '@/types';

// Sample orders
const sampleOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    userId: 'buyer-1',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Classic Timepiece',
        price: 299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
        sellerId: 'seller-1',
      },
    ],
    shippingAddress: {
      id: 'addr-1',
      userId: 'buyer-1',
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr-1',
      userId: 'buyer-1',
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
    subtotal: 299,
    shippingCost: 0,
    tax: 23.92,
    total: 322.92,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRK123456789',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: 'ORD-2024-002',
    userId: 'buyer-1',
    items: [
      {
        id: 'item-2',
        productId: 'prod-4',
        name: 'Leather Weekender Bag',
        price: 449,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        sellerId: 'seller-1',
      },
      {
        id: 'item-3',
        productId: 'prod-5',
        name: 'Minimalist Leather Wallet',
        price: 89,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop',
        sellerId: 'seller-1',
      },
    ],
    shippingAddress: {
      id: 'addr-1',
      userId: 'buyer-1',
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr-1',
      userId: 'buyer-1',
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
    subtotal: 627,
    shippingCost: 0,
    tax: 50.16,
    total: 677.16,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRK987654321',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: 'ORD-2024-003',
    userId: 'buyer-1',
    items: [
      {
        id: 'item-4',
        productId: 'prod-10',
        name: 'Signature Scent Collection',
        price: 129,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop',
        sellerId: 'seller-1',
      },
    ],
    shippingAddress: {
      id: 'addr-1',
      userId: 'buyer-1',
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr-1',
      userId: 'buyer-1',
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
    subtotal: 129,
    shippingCost: 15,
    tax: 11.52,
    total: 155.52,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
];

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'confirmed':
    case 'processing':
      return Package;
    case 'shipped':
      return Truck;
    case 'delivered':
      return CheckCircle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'text-amber-400 bg-amber-400/10';
    case 'confirmed':
    case 'processing':
      return 'text-blue-400 bg-blue-400/10';
    case 'shipped':
      return 'text-purple-400 bg-purple-400/10';
    case 'delivered':
      return 'text-green-400 bg-green-400/10';
    case 'cancelled':
      return 'text-red-400 bg-red-400/10';
    default:
      return 'text-white/40 bg-white/5';
  }
};

export default function Orders() {
  const [orders] = useState<Order[]>(sampleOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item: OrderItem) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl text-white mb-2">My Orders</h1>
              <p className="text-white/60">Track and manage your orders</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="p-6 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item: OrderItem, index: number) => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded border-2 border-black"
                              style={{ zIndex: order.items.length - index }}
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 bg-white/10 rounded border-2 border-black flex items-center justify-center text-white/60 text-xs">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.id}</p>
                          <p className="text-white/50 text-sm">
                            {order.createdAt instanceof Date ? order.createdAt.toLocaleDateString() : typeof order.createdAt === 'object' && order.createdAt && 'toDate' in order.createdAt ? (order.createdAt as { toDate: () => Date }).toDate().toLocaleDateString() : '-'} ·{' '}
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      {/* Status & Total */}
                      <div className="flex items-center gap-6">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm capitalize">{order.status}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-gold font-semibold">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Package className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="font-display text-2xl text-white mb-2">No orders found</h3>
                <p className="text-white/60">Start shopping to see your orders here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-black/95 border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-white">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Order Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">{selectedOrder.id}</p>
                  <p className="text-white/50 text-sm">
                    Placed on {selectedOrder.createdAt instanceof Date ? selectedOrder.createdAt.toLocaleDateString() : String(selectedOrder.createdAt)}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {(() => {
                    const StatusIcon = getStatusIcon(selectedOrder.status);
                    return <StatusIcon className="w-4 h-4" />;
                  })()}
                  <span className="text-sm capitalize">{selectedOrder.status}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-white font-medium mb-4">Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: OrderItem) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-white/50 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pb-4 border-b border-white/10">
                <h4 className="text-white font-medium mb-2">Shipping Address</h4>
                <div className="text-white/60 text-sm">
                  <p>
                    {selectedOrder.shippingAddress.firstName}{' '}
                    {selectedOrder.shippingAddress.lastName}
                  </p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.state}{' '}
                    {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-white font-medium mb-4">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>
                      {selectedOrder.shippingCost === 0
                        ? 'Free'
                        : `$${selectedOrder.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-medium pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-gold">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tracking */}
              {selectedOrder.trackingNumber && (
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Tracking Information</h4>
                  <p className="text-white/60 text-sm">
                    Tracking Number:{' '}
                    <span className="text-gold">{selectedOrder.trackingNumber}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
