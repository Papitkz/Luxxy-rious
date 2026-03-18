import type { Timestamp } from 'firebase/firestore';

// User Roles
export type UserRole = 'admin' | 'seller' | 'buyer' | 'customer_service';

// User Status
export type UserStatus = 'active' | 'blocked' | 'disabled';

// Product Categories
export type ProductCategory = 
  | 'fashion-accessories'
  | 'electronics'
  | 'home-living'
  | 'beauty-personal-care'
  | 'sports-outdoors'
  | 'food-beverages'
  | 'health-wellness'
  | 'toys-kids-babies'
  | 'automotive-motorcycles'
  | 'books-media-gaming'
  | 'pet-supplies';

// Order Status
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Payment Status
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Ticket Status
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

// Ticket Priority
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

// Ticket Type
export type TicketType = 'refund' | 'feedback' | 'report' | 'general';

// User Interface
export interface User {
  uid: string;
  id?: string; // For compatibility
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  lastLogin?: Timestamp | Date;
}

// Product Interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  inventory: number;
  sku: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Cart Item Interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sellerId: string;
  sellerName: string;
  maxQuantity: number;
}

// Cart Interface
export interface Cart {
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Address Interface
export interface Address {
  id: string;
  userId: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Order Item Interface
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
}

// Order Interface
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Ticket Response Interface
export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: Timestamp | Date;
}

// Ticket Interface
export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  assignedToName?: string;
  orderId?: string;
  productId?: string;
  responses: TicketResponse[];
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Filter Options Interface
export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
  search?: string;
}

// Category Display Interface
export interface CategoryDisplay {
  id: ProductCategory | string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

// Dashboard Stats Interface
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingTickets: number;
  recentOrders: Order[];
  topProducts: Product[];
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'ticket' | 'product' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
