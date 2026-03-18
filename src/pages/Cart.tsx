import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, MAX_CART_ITEMS } = useCart();
  const { isAuthenticated, user } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }

    if (user?.role !== 'buyer') {
      toast.error('Only buyers can place orders');
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/checkout');
  };

  const shippingCost = cart && cart.totalPrice > 100 ? 0 : 15;
  const tax = cart ? cart.totalPrice * 0.08 : 0;
  const total = cart ? cart.totalPrice + shippingCost + tax : 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-white/30" />
          </div>
          <h1 className="font-display text-3xl text-white mb-4">Your Cart is Empty</h1>
          <p className="text-white/60 mb-8">Discover our luxury collection and add items to your cart</p>
          <Link to="/products">
            <Button className="bg-gold text-black hover:bg-gold-light">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="section-padding">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl text-white mb-2">Shopping Cart</h1>
            <p className="text-white/60">
              {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
              {cart.totalItems >= MAX_CART_ITEMS && (
                <span className="text-amber-400 ml-2">(Cart is full)</span>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="border-white/20 text-white/60 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/5 w-fit"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.items?.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/5"
              >
                {/* Image */}
                <Link to={`/product/${item.productId}`} className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.productId}`}
                    className="font-medium text-white hover:text-gold transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-white/50 text-sm mb-2">Sold by {item.sellerName}</p>
                  <p className="text-gold font-semibold">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center bg-white/5 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-white/60 hover:text-white disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-white text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="p-2 text-white/60 hover:text-white disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Progress Bar */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Cart Capacity</span>
                <span className="text-white">{cart.totalItems} / {MAX_CART_ITEMS}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${(cart.totalItems / MAX_CART_ITEMS) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-6 bg-white/5 rounded-lg border border-white/5">
              <h2 className="font-display text-2xl text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${(cart?.totalPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shippingCost === 0 && cart && cart.totalPrice > 0 && (
                  <p className="text-gold text-sm flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    You qualify for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-white">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-2xl text-gold">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-gold text-black hover:bg-gold-light font-medium py-6"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Link to="/products">
                <Button
                  variant="outline"
                  className="w-full mt-3 border-white/20 text-white hover:bg-white/5"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
