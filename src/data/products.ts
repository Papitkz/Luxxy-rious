import type { ProductCategory, CategoryDisplay } from '@/types';

// Simple Product type for sample data (using Date instead of Timestamp)
export interface SampleProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: ProductCategory | string;
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
  createdAt: Date;
  updatedAt: Date;
}

export const categories: CategoryDisplay[] = [
  {
    id: 'fashion-accessories',
    name: 'Fashion & Accessories',
    description: 'Elegant apparel and timeless accessories',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Cutting-edge technology and gadgets',
    image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    description: 'Luxurious home décor and furnishings',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    description: 'Premium skincare and beauty essentials',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    description: 'High-performance athletic gear',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    description: 'Gourmet delicacies and fine drinks',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Holistic health and wellness products',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'toys-kids-babies',
    name: 'Toys, Kids & Babies',
    description: 'Premium toys and childcare essentials',
    image: 'https://images.unsplash.com/photo-1560506840-ec148e82a604?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'automotive-motorcycles',
    name: 'Automotive & Motorcycles',
    description: 'Luxury auto accessories and gear',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'books-media-gaming',
    name: 'Books, Media & Gaming',
    description: 'Curated collection of entertainment',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop',
    productCount: 0,
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    description: 'Luxury products for your beloved pets',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=800&fit=crop',
    productCount: 0,
  },
];

export const sampleProducts: SampleProduct[] = [
  // Fashion & Accessories
  {
    id: 'prod-1',
    name: 'Classic Timepiece',
    description: 'A timeless Swiss-made automatic watch featuring a sapphire crystal, genuine leather strap, and water resistance up to 100 meters. The perfect accessory for the discerning gentleman.',
    price: 299,
    compareAtPrice: 399,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=800&fit=crop',
    ],
    category: 'fashion-accessories',
    subcategory: 'Watches',
    sellerId: 'seller-1',
    sellerName: 'Luxury Timepieces',
    inventory: 25,
    sku: 'WATCH-001',
    tags: ['watch', 'luxury', 'accessories', 'gold'],
    rating: 4.8,
    reviewCount: 124,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'prod-2',
    name: 'Silk Aviator Sunglasses',
    description: 'Handcrafted acetate frames with polarized lenses. These aviators offer UV400 protection and unmatched style for the modern trendsetter.',
    price: 189,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop',
    ],
    category: 'fashion-accessories',
    subcategory: 'Sunglasses',
    sellerId: 'seller-1',
    sellerName: 'Luxury Timepieces',
    inventory: 50,
    sku: 'SUN-001',
    tags: ['sunglasses', 'fashion', 'accessories'],
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'prod-3',
    name: 'Gold Chain Necklace',
    description: '18k gold-plated sterling silver chain with a classic link design. A versatile piece that elevates any outfit.',
    price: 249,
    compareAtPrice: 299,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=800&fit=crop',
    ],
    category: 'fashion-accessories',
    subcategory: 'Jewelry',
    sellerId: 'seller-1',
    sellerName: 'Luxury Timepieces',
    inventory: 30,
    sku: 'JEW-001',
    tags: ['jewelry', 'gold', 'necklace', 'luxury'],
    rating: 4.9,
    reviewCount: 156,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'prod-4',
    name: 'Leather Weekender Bag',
    description: 'Full-grain Italian leather duffel bag with brass hardware. Spacious interior with multiple compartments for organized travel.',
    price: 449,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
    ],
    category: 'fashion-accessories',
    subcategory: 'Bags',
    sellerId: 'seller-1',
    sellerName: 'Luxury Timepieces',
    inventory: 15,
    sku: 'BAG-001',
    tags: ['bag', 'leather', 'travel', 'luxury'],
    rating: 4.7,
    reviewCount: 67,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'prod-5',
    name: 'Minimalist Leather Wallet',
    description: 'Slim-profile wallet crafted from premium vegetable-tanned leather. Features 6 card slots and a bill compartment.',
    price: 89,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606503825008-909a6184af56?w=600&h=800&fit=crop',
    ],
    category: 'fashion-accessories',
    subcategory: 'Wallets',
    sellerId: 'seller-1',
    sellerName: 'Luxury Timepieces',
    inventory: 100,
    sku: 'WAL-001',
    tags: ['wallet', 'leather', 'accessories'],
    rating: 4.5,
    reviewCount: 234,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },

  // Electronics
  {
    id: 'prod-6',
    name: 'Premium Wireless Headphones',
    description: 'Studio-quality sound with active noise cancellation. 30-hour battery life and plush memory foam ear cushions for all-day comfort.',
    price: 349,
    compareAtPrice: 399,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=800&fit=crop',
    ],
    category: 'electronics',
    subcategory: 'Audio',
    sellerId: 'seller-1',
    sellerName: 'Tech Elite',
    inventory: 40,
    sku: 'AUDIO-001',
    tags: ['headphones', 'audio', 'wireless', 'tech'],
    rating: 4.8,
    reviewCount: 312,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'prod-7',
    name: 'Smart Home Hub',
    description: 'Central control for all your smart devices. Voice-activated, compatible with major platforms, and features a sleek minimalist design.',
    price: 199,
    images: [
      'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1563770557364-bdf2b1d6f206?w=600&h=800&fit=crop',
    ],
    category: 'electronics',
    subcategory: 'Smart Home',
    sellerId: 'seller-1',
    sellerName: 'Tech Elite',
    inventory: 60,
    sku: 'SMART-001',
    tags: ['smart home', 'tech', 'automation'],
    rating: 4.4,
    reviewCount: 178,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },

  // Home & Living
  {
    id: 'prod-8',
    name: 'Artisan Ceramic Vase Set',
    description: 'Hand-thrown ceramic vases in a matte black finish. Set of three varying heights, perfect for modern minimalist interiors.',
    price: 129,
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1612196808214-b7e239e5bbae?w=600&h=800&fit=crop',
    ],
    category: 'home-living',
    subcategory: 'Decor',
    sellerId: 'seller-1',
    sellerName: 'Home Luxe',
    inventory: 35,
    sku: 'HOME-001',
    tags: ['home', 'decor', 'ceramic', 'vase'],
    rating: 4.7,
    reviewCount: 92,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 'prod-9',
    name: 'Cashmere Throw Blanket',
    description: '100% Mongolian cashmere throw in a sophisticated charcoal gray. Unparalleled softness and warmth for your living space.',
    price: 299,
    compareAtPrice: 349,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop',
    ],
    category: 'home-living',
    subcategory: 'Textiles',
    sellerId: 'seller-1',
    sellerName: 'Home Luxe',
    inventory: 20,
    sku: 'HOME-002',
    tags: ['home', 'blanket', 'cashmere', 'luxury'],
    rating: 4.9,
    reviewCount: 145,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },

  // Beauty & Personal Care
  {
    id: 'prod-10',
    name: 'Signature Scent Collection',
    description: 'A curated set of three luxury fragrances featuring notes of oud, amber, and rare spices. Long-lasting and distinctive.',
    price: 129,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
    ],
    category: 'beauty-personal-care',
    subcategory: 'Fragrance',
    sellerId: 'seller-1',
    sellerName: 'Beauty Elite',
    inventory: 45,
    sku: 'BEAUTY-001',
    tags: ['perfume', 'fragrance', 'luxury', 'beauty'],
    rating: 4.6,
    reviewCount: 203,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'prod-11',
    name: 'Premium Skincare Set',
    description: 'Complete skincare regimen with cleanser, serum, moisturizer, and eye cream. Formulated with rare botanical extracts.',
    price: 249,
    compareAtPrice: 299,
    images: [
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=800&fit=crop',
    ],
    category: 'beauty-personal-care',
    subcategory: 'Skincare',
    sellerId: 'seller-1',
    sellerName: 'Beauty Elite',
    inventory: 30,
    sku: 'BEAUTY-002',
    tags: ['skincare', 'beauty', 'luxury', 'set'],
    rating: 4.8,
    reviewCount: 267,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
  },

  // Sports & Outdoors
  {
    id: 'prod-12',
    name: 'Professional Yoga Mat',
    description: 'Natural rubber mat with superior grip and cushioning. Eco-friendly and durable, perfect for all yoga styles.',
    price: 89,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&h=800&fit=crop',
    ],
    category: 'sports-outdoors',
    subcategory: 'Fitness',
    sellerId: 'seller-1',
    sellerName: 'Fit Luxe',
    inventory: 75,
    sku: 'SPORT-001',
    tags: ['yoga', 'fitness', 'sports', 'mat'],
    rating: 4.5,
    reviewCount: 189,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
  },

  // Food & Beverages
  {
    id: 'prod-13',
    name: 'Artisan Coffee Collection',
    description: 'Single-origin beans from Ethiopia, Colombia, and Guatemala. Small-batch roasted for maximum flavor complexity.',
    price: 59,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=800&fit=crop',
    ],
    category: 'food-beverages',
    subcategory: 'Coffee',
    sellerId: 'seller-1',
    sellerName: 'Gourmet Delights',
    inventory: 100,
    sku: 'FOOD-001',
    tags: ['coffee', 'gourmet', 'food', 'beverage'],
    rating: 4.7,
    reviewCount: 156,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
  },

  // Health & Wellness
  {
    id: 'prod-14',
    name: 'Essential Oil Diffuser',
    description: 'Ceramic ultrasonic diffuser with ambient lighting. Includes a set of 6 pure essential oils for aromatherapy.',
    price: 79,
    compareAtPrice: 99,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=800&fit=crop',
    ],
    category: 'health-wellness',
    subcategory: 'Aromatherapy',
    sellerId: 'seller-1',
    sellerName: 'Wellness Co',
    inventory: 50,
    sku: 'HEALTH-001',
    tags: ['wellness', 'aromatherapy', 'diffuser', 'health'],
    rating: 4.6,
    reviewCount: 134,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18'),
  },

  // Toys, Kids & Babies
  {
    id: 'prod-15',
    name: 'Organic Cotton Baby Set',
    description: 'Soft, hypoallergenic baby clothing set including onesies, blankets, and bibs. Made from 100% organic cotton.',
    price: 99,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522771930-78848dc92939?w=600&h=800&fit=crop',
    ],
    category: 'toys-kids-babies',
    subcategory: 'Baby Clothing',
    sellerId: 'seller-1',
    sellerName: 'Little Luxuries',
    inventory: 40,
    sku: 'BABY-001',
    tags: ['baby', 'organic', 'clothing', 'kids'],
    rating: 4.9,
    reviewCount: 89,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-22'),
  },

  // Automotive & Motorcycles
  {
    id: 'prod-16',
    name: 'Leather Car Seat Covers',
    description: 'Premium Nappa leather seat covers with diamond stitching. Custom fit for luxury vehicles.',
    price: 499,
    compareAtPrice: 599,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=800&fit=crop',
    ],
    category: 'automotive-motorcycles',
    subcategory: 'Interior',
    sellerId: 'seller-1',
    sellerName: 'Auto Luxe',
    inventory: 15,
    sku: 'AUTO-001',
    tags: ['automotive', 'leather', 'interior', 'luxury'],
    rating: 4.4,
    reviewCount: 56,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
  },

  // Books, Media & Gaming
  {
    id: 'prod-17',
    name: 'Limited Edition Art Book',
    description: 'Coffee table book featuring contemporary art photography. Signed by the artist, only 500 copies worldwide.',
    price: 149,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop',
    ],
    category: 'books-media-gaming',
    subcategory: 'Books',
    sellerId: 'seller-1',
    sellerName: 'Cultural Curators',
    inventory: 25,
    sku: 'BOOK-001',
    tags: ['book', 'art', 'limited edition', 'collectible'],
    rating: 4.8,
    reviewCount: 42,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
  },

  // Pet Supplies
  {
    id: 'prod-18',
    name: 'Designer Pet Bed',
    description: 'Luxurious velvet pet bed with memory foam cushioning. Removable, washable cover in sophisticated charcoal.',
    price: 129,
    images: [
      'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=800&fit=crop',
    ],
    category: 'pet-supplies',
    subcategory: 'Beds',
    sellerId: 'seller-1',
    sellerName: 'Pet Luxe',
    inventory: 35,
    sku: 'PET-001',
    tags: ['pet', 'bed', 'luxury', 'dog', 'cat'],
    rating: 4.7,
    reviewCount: 178,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

// Helper functions
export const getProductsByCategory = (categoryId: ProductCategory): SampleProduct[] => {
  return sampleProducts.filter((product) => product.category === categoryId && product.isActive);
};

export const getFeaturedProducts = (): SampleProduct[] => {
  return sampleProducts.filter((product) => product.isFeatured && product.isActive);
};

export const getProductById = (id: string): SampleProduct | undefined => {
  return sampleProducts.find((product) => product.id === id);
};

export const searchProducts = (query: string): SampleProduct[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleProducts.filter(
    (product) =>
      product.isActive &&
      (product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
  );
};

export const filterProducts = (options: {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
}): SampleProduct[] => {
  let filtered = sampleProducts.filter((product) => product.isActive);

  if (options.category) {
    filtered = filtered.filter((product) => product.category === options.category);
  }

  if (options.minPrice !== undefined) {
    filtered = filtered.filter((product) => product.price >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    filtered = filtered.filter((product) => product.price <= options.maxPrice!);
  }

  if (options.minRating !== undefined) {
    filtered = filtered.filter((product) => product.rating >= options.minRating!);
  }

  if (options.sortBy) {
    switch (options.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  return filtered;
};
