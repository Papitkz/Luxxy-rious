import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { getProductById, sampleProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, canAddToCart, getItemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setIsLoading(false);
      } else {
        navigate('/products');
      }
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (user?.role !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }

    const check = canAddToCart(product, quantity);
    if (!check.canAdd) {
      toast.error(check.reason || 'Cannot add to cart');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.inventory || 1)) {
      setQuantity(newQuantity);
    }
  };

  const relatedProducts = sampleProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id && p.isActive)
    .slice(0, 4);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const cartItemCount = getItemCount(product.id);
  const maxCanAdd = product.inventory - cartItemCount;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="section-padding">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-gold transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.compareAtPrice && (
                <div className="absolute top-4 left-4 bg-gold text-black text-sm font-bold px-3 py-1 rounded">
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-gold uppercase tracking-wider text-sm mb-2">
                {product.category.replace('-', ' ')}
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-gold text-gold'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/60">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-semibold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-2xl text-white/40 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/5 text-white/60 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-white/5 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 text-white/60 hover:text-white disabled:opacity-30"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxCanAdd}
                  className="p-3 text-white/60 hover:text-white disabled:opacity-30"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.inventory === 0 || maxCanAdd === 0}
                className="flex-1 bg-gold text-black hover:bg-gold-light font-medium py-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inventory === 0
                  ? 'Out of Stock'
                  : maxCanAdd === 0
                  ? 'Max in Cart'
                  : 'Add to Cart'}
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                onClick={() => toast.info('Wishlist feature coming soon')}
                className="border-white/20 text-white hover:bg-white/5 px-4"
              >
                <Heart className="w-5 h-5" />
              </Button>

              {/* Share */}
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }}
                className="border-white/20 text-white hover:bg-white/5 px-4"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Stock Info */}
            {product.inventory <= 10 && product.inventory > 0 && (
              <p className="text-amber-400 text-sm">
                Only {product.inventory} items left in stock!
              </p>
            )}
            {cartItemCount > 0 && (
              <p className="text-gold text-sm">
                <Check className="w-4 h-4 inline mr-1" />
                {cartItemCount} in your cart
              </p>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-white/60 text-xs">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-white/60 text-xs">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-white/60 text-xs">30-Day Returns</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm mb-1">Sold by</p>
              <p className="text-white font-medium">{product.sellerName}</p>
              <p className="text-white/40 text-xs mt-1">SKU: {product.sku}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none">
              <TabsTrigger
                value="description"
                className="data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none text-white/60"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none text-white/60"
              >
                Shipping & Returns
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none text-white/60"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="max-w-3xl">
                <p className="text-white/70 leading-relaxed">{product.description}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-sm">Category</p>
                    <p className="text-white">{product.category.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Subcategory</p>
                    <p className="text-white">{product.subcategory || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">SKU</p>
                    <p className="text-white">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Availability</p>
                    <p className="text-white">{product.inventory > 0 ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="max-w-3xl space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Shipping Information</h4>
                  <p className="text-white/70">
                    Free worldwide shipping on orders over $100. Standard delivery takes 5-7 business days.
                    Express shipping available for an additional fee.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Return Policy</h4>
                  <p className="text-white/70">
                    We offer a 30-day return policy for all unused items in their original packaging.
                    Simply contact our support team to initiate a return.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-12">
                <p className="text-white/60">Reviews feature coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-3xl text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
