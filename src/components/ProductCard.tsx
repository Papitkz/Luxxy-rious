import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (user?.role !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }

    setIsAdding(true);
    const result = await addToCart(product);
    
    if (result.success) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error(result.message);
    }
    setIsAdding(false);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group block"
    >
      <div className="product-card relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-gold-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            {showAddToCart && (
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || product.inventory === 0}
                className="bg-gold text-black hover:bg-gold-light transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.info('Quick view coming soon');
              }}
              className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-gold"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-4 left-4 bg-gold text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{discount}%
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
              Featured
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.info('Wishlist feature coming soon');
            }}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold/20 border border-white/10 hover:border-gold/50"
          >
            <Heart className="w-4 h-4 text-white" />
          </button>

          {/* Low Stock Badge */}
          {product.inventory <= 5 && product.inventory > 0 && (
            <div className="absolute bottom-4 left-4 bg-red-500/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              Only {product.inventory} left
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.inventory === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-medium px-4 py-2 border border-white/30 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <p className="text-xs text-gold uppercase tracking-wider mb-2">
            {product.category.replace(/-/g, ' ')}
          </p>

          {/* Name */}
          <h3 className="font-body font-medium text-white group-hover:text-gold transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-gold text-gold'
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/50">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-white/40 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Seller */}
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
            {product.sellerAvatar ? (
              <img 
                src={product.sellerAvatar} 
                alt={product.sellerName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold text-xs">{product.sellerName[0]}</span>
              </div>
            )}
            <span className="text-white/50 text-xs">{product.sellerName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
