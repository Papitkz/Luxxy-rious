import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  type Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Firebase configuration - Replace with your own config
const firebaseConfig = {
  apiKey: "AIzaSyBy1KRGWJEHG7njAFNrpHq5do_k1tSPyzQ",
  authDomain: "luxxy-ecommerce.firebaseapp.com",
  projectId: "luxxy-ecommerce",
  storageBucket: "luxxy-ecommerce.firebasestorage.app",
  messagingSenderId: "533047285236",
  appId: "1:533047285236:web:505f9d21dac1163d2fd5a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// ==================== AUTH SERVICES ====================

export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'seller' | 'buyer' | 'customer_service';
  status: 'active' | 'blocked' | 'disabled';
  avatar?: string;
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
}

export const authService = {
  // Register new user
  async register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    role: UserData['role'] = 'buyer'
  ): Promise<{ user: FirebaseUser; userData: UserData }> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      role,
      status: 'active',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      lastLogin: serverTimestamp() as Timestamp,
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    
    return { user, userData };
  },

  // Login with email/password
  async login(email: string, password: string): Promise<{ user: FirebaseUser; userData: UserData }> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data() as UserData;
    
    // Check if user is blocked
    if (userData.status === 'blocked' || userData.status === 'disabled') {
      await signOut(auth);
      throw new Error('Your account has been suspended');
    }

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp()
    });

    return { user, userData };
  },

  // Google Sign In
  async signInWithGoogle(role: UserData['role'] = 'buyer'): Promise<{ user: FirebaseUser; userData: UserData; isNewUser: boolean }> {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Check if this is a new user by checking if user document exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDocBefore = await getDoc(userDocRef);
    const isNewUser = !userDocBefore.exists();

    const userDoc = await getDoc(userDocRef);

    let userData: UserData;

    if (!userDoc.exists()) {
      // Create new user document
      const nameParts = user.displayName?.split(' ') || ['User', ''];
      userData = {
        uid: user.uid,
        email: user.email!,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || '',
        role,
        status: 'active',
        avatar: user.photoURL || undefined,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        lastLogin: serverTimestamp() as Timestamp,
      };
      await setDoc(userDocRef, userData);
    } else {
      userData = userDoc.data() as UserData;
      
      if (userData.status === 'blocked' || userData.status === 'disabled') {
        await signOut(auth);
        throw new Error('Your account has been suspended');
      }

      // Update last login
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
    }

    return { user, userData, isNewUser };
  },

  // Logout
  async logout(): Promise<void> {
    await signOut(auth);
  },

  // Get current user data
  async getCurrentUserData(uid: string): Promise<UserData | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() as UserData : null;
  },

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserData>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Update user status (admin only)
  async updateUserStatus(uid: string, status: UserData['status']): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      status,
      updatedAt: serverTimestamp()
    });
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<UserData[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => doc.data() as UserData);
  },

  // Listen to auth state
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

// ==================== PRODUCT SERVICES ====================

export interface ProductData {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const productService = {
  // Create new product
  async createProduct(productData: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductData> {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...productData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
  },

  // Get product by ID
  async getProduct(id: string): Promise<ProductData | null> {
    const docSnap = await getDoc(doc(db, 'products', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as ProductData : null;
  },

  // Get all products
  async getAllProducts(filters?: {
    category?: string;
    sellerId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Promise<ProductData[]> {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.sellerId) {
      q = query(q, where('sellerId', '==', filters.sellerId));
    }
    if (filters?.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    if (filters?.isFeatured !== undefined) {
      q = query(q, where('isFeatured', '==', filters.isFeatured));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProductData);
  },

  // Get featured products
  async getFeaturedProducts(limitCount: number = 6): Promise<ProductData[]> {
    const q = query(
      collection(db, 'products'),
      where('isFeatured', '==', true),
      where('isActive', '==', true),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProductData);
  },

  // Update product
  async updateProduct(id: string, updates: Partial<ProductData>): Promise<void> {
    await updateDoc(doc(db, 'products', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, 'products', id));
  },

  // Search products
  async searchProducts(searchTerm: string): Promise<ProductData[]> {
    // Note: For full-text search, consider using Algolia or Firebase Extensions
    const snapshot = await getDocs(collection(db, 'products'));
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProductData);
    
    const term = searchTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.some(tag => tag.toLowerCase().includes(term))
    );
  },

  // Subscribe to products (real-time)
  subscribeToProducts(callback: (products: ProductData[]) => void) {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProductData);
      callback(products);
    });
  },

  // Subscribe to seller products
  subscribeToSellerProducts(sellerId: string, callback: (products: ProductData[]) => void) {
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProductData);
      callback(products);
    });
  }
};

// ==================== CART SERVICES ====================

export interface CartItemData {
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

export interface CartData {
  userId: string;
  items: CartItemData[];
  totalItems: number;
  totalPrice: number;
  updatedAt: Timestamp;
}

export const cartService = {
  // Get cart
  async getCart(userId: string): Promise<CartData | null> {
    const cartDoc = await getDoc(doc(db, 'carts', userId));
    return cartDoc.exists() ? cartDoc.data() as CartData : null;
  },

  // Update cart
  async updateCart(userId: string, cart: Omit<CartData, 'updatedAt'>): Promise<void> {
    await setDoc(doc(db, 'carts', userId), {
      ...cart,
      updatedAt: serverTimestamp()
    });
  },

  // Add item to cart
  async addToCart(userId: string, product: Omit<ProductData, 'createdAt' | 'updatedAt'>, quantity: number = 1): Promise<void> {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);

    const cartItem: CartItemData = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      maxQuantity: product.inventory
    };

    if (cartDoc.exists()) {
      const cart = cartDoc.data() as CartData;
      const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);

      if (existingItemIndex >= 0) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push(cartItem);
      }

      // Recalculate totals
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await updateDoc(cartRef, {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new cart
      await setDoc(cartRef, {
        userId,
        items: [cartItem],
        totalItems: quantity,
        totalPrice: product.price * quantity,
        updatedAt: serverTimestamp()
      });
    }
  },

  // Remove item from cart
  async removeFromCart(userId: string, itemId: string): Promise<void> {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const cart = cartDoc.data() as CartData;
      cart.items = cart.items.filter(item => item.id !== itemId);
      
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await updateDoc(cartRef, {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        updatedAt: serverTimestamp()
      });
    }
  },

  // Update item quantity
  async updateQuantity(userId: string, itemId: string, quantity: number): Promise<void> {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const cart = cartDoc.data() as CartData;
      const itemIndex = cart.items.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await updateDoc(cartRef, {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: serverTimestamp()
        });
      }
    }
  },

  // Clear cart
  async clearCart(userId: string): Promise<void> {
    await deleteDoc(doc(db, 'carts', userId));
  },

  // Subscribe to cart (real-time)
  subscribeToCart(userId: string, callback: (cart: CartData | null) => void) {
    return onSnapshot(doc(db, 'carts', userId), (doc) => {
      callback(doc.exists() ? doc.data() as CartData : null);
    });
  }
};

// ==================== ORDER SERVICES ====================

export interface OrderItemData {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
}

export interface OrderData {
  id: string;
  userId: string;
  items: OrderItemData[];
  shippingAddress: AddressData;
  billingAddress: AddressData;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AddressData {
  id: string;
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

export const orderService = {
  // Create order
  async createOrder(orderData: Omit<OrderData, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderData> {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update product inventory
    const batch = writeBatch(db);
    for (const item of orderData.items) {
      const productRef = doc(db, 'products', item.productId);
      batch.update(productRef, {
        inventory: increment(-item.quantity)
      });
    }
    await batch.commit();

    return {
      id: docRef.id,
      ...orderData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
  },

  // Get order by ID
  async getOrder(id: string): Promise<OrderData | null> {
    const docSnap = await getDoc(doc(db, 'orders', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as OrderData : null;
  },

  // Get user orders
  async getUserOrders(userId: string): Promise<OrderData[]> {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as OrderData);
  },

  // Get seller orders
  async getSellerOrders(sellerId: string): Promise<OrderData[]> {
    const snapshot = await getDocs(collection(db, 'orders'));
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as OrderData);
    return orders.filter(order => order.items.some(item => item.sellerId === sellerId));
  },

  // Get all orders (admin)
  async getAllOrders(): Promise<OrderData[]> {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as OrderData);
  },

  // Update order status
  async updateOrderStatus(
    id: string, 
    status: OrderData['status'], 
    updates?: Partial<OrderData>
  ): Promise<void> {
    await updateDoc(doc(db, 'orders', id), {
      status,
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Subscribe to user orders
  subscribeToUserOrders(userId: string, callback: (orders: OrderData[]) => void) {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as OrderData);
      callback(orders);
    });
  }
};

// ==================== ADDRESS SERVICES ====================

export const addressService = {
  // Add address
  async addAddress(userId: string, address: Omit<AddressData, 'id'>): Promise<AddressData> {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    
    // If this is the default address, unset others
    if (address.isDefault) {
      const existingAddresses = await getDocs(addressesRef);
      const batch = writeBatch(db);
      existingAddresses.docs.forEach(doc => {
        batch.update(doc.ref, { isDefault: false });
      });
      await batch.commit();
    }

    const docRef = await addDoc(addressesRef, address);
    return { id: docRef.id, ...address };
  },

  // Get user addresses
  async getUserAddresses(userId: string): Promise<AddressData[]> {
    const q = query(collection(db, 'users', userId, 'addresses'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AddressData);
  },

  // Update address
  async updateAddress(userId: string, addressId: string, updates: Partial<AddressData>): Promise<void> {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    
    // If setting as default, unset others
    if (updates.isDefault) {
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const existingAddresses = await getDocs(addressesRef);
      const batch = writeBatch(db);
      existingAddresses.docs.forEach(doc => {
        if (doc.id !== addressId) {
          batch.update(doc.ref, { isDefault: false });
        }
      });
      await batch.commit();
    }

    await updateDoc(addressRef, updates);
  },

  // Delete address
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'addresses', addressId));
  },

  // Subscribe to addresses
  subscribeToAddresses(userId: string, callback: (addresses: AddressData[]) => void) {
    const q = query(collection(db, 'users', userId, 'addresses'));
    return onSnapshot(q, (snapshot) => {
      const addresses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AddressData);
      callback(addresses);
    });
  }
};

// ==================== TICKET SERVICES ====================

export interface TicketData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'refund' | 'feedback' | 'report' | 'general';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  assignedToName?: string;
  orderId?: string;
  productId?: string;
  responses: TicketResponseData[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TicketResponseData {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  createdAt: Timestamp;
}

export const ticketService = {
  // Create ticket
  async createTicket(ticketData: Omit<TicketData, 'id' | 'createdAt' | 'updatedAt' | 'responses'>): Promise<TicketData> {
    const docRef = await addDoc(collection(db, 'tickets'), {
      ...ticketData,
      responses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...ticketData,
      responses: [],
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
  },

  // Get all tickets
  async getAllTickets(): Promise<TicketData[]> {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TicketData);
  },

  // Get user tickets
  async getUserTickets(userId: string): Promise<TicketData[]> {
    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TicketData);
  },

  // Add response to ticket
  async addResponse(ticketId: string, response: Omit<TicketResponseData, 'id' | 'createdAt'>): Promise<void> {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (ticketDoc.exists()) {
      const ticket = ticketDoc.data() as TicketData;
      const newResponse: TicketResponseData = {
        id: `resp-${Date.now()}`,
        ...response,
        createdAt: serverTimestamp() as Timestamp
      };

      await updateDoc(ticketRef, {
        responses: [...ticket.responses, newResponse],
        updatedAt: serverTimestamp()
      });
    }
  },

  // Update ticket status
  async updateTicketStatus(
    ticketId: string, 
    status: TicketData['status'],
    assignedTo?: { uid: string; name: string }
  ): Promise<void> {
    const updates: any = { status, updatedAt: serverTimestamp() };
    if (assignedTo) {
      updates.assignedTo = assignedTo.uid;
      updates.assignedToName = assignedTo.name;
    }
    await updateDoc(doc(db, 'tickets', ticketId), updates);
  },

  // Subscribe to tickets
  subscribeToTickets(callback: (tickets: TicketData[]) => void) {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TicketData);
      callback(tickets);
    });
  }
};

// ==================== STORAGE SERVICES ====================

export const storageService = {
  // Upload image
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  // Upload product image
  async uploadProductImage(file: File, productId: string): Promise<string> {
    const path = `products/${productId}/${Date.now()}-${file.name}`;
    return this.uploadImage(file, path);
  },

  // Upload user avatar
  async uploadUserAvatar(file: File, userId: string): Promise<string> {
    const path = `avatars/${userId}/${Date.now()}-${file.name}`;
    return this.uploadImage(file, path);
  },

  // Delete image
  async deleteImage(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
};

export default app;
