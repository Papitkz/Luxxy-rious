import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Check, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

// Sample addresses (in a real app, these would come from the user's saved addresses)
const sampleAddresses = [
  {
    id: 'addr-1',
    label: 'Home',
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '123 Luxury Lane',
    city: 'Beverly Hills',
    state: 'CA',
    postalCode: '90210',
    country: 'USA',
  },
  {
    id: 'addr-2',
    label: 'Office',
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '456 Business Blvd',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'USA',
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [selectedAddress, setSelectedAddress] = useState('addr-1');
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = cart && cart.totalPrice > 100 ? 0 : 15;
  const tax = cart ? cart.totalPrice * 0.08 : 0;
  const total = cart ? cart.totalPrice + shippingCost + tax : 0;

  const handlePlaceOrder = async () => {
    if (!cart) return;
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/orders');
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="section-padding">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-display text-3xl text-white">Checkout</h1>
            <p className="text-white/60">Complete your purchase</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          {['shipping', 'payment', 'review'].map((s, index) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-gold text-black'
                    : index < ['shipping', 'payment', 'review'].indexOf(step)
                    ? 'bg-gold/20 text-gold'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {index < ['shipping', 'payment', 'review'].indexOf(step) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-sm capitalize ${
                  step === s ? 'text-white' : 'text-white/40'
                }`}
              >
                {s}
              </span>
              {index < 2 && <div className="w-8 h-px bg-white/10 mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-gold" />
                    <h2 className="font-display text-xl text-white">Select Shipping Address</h2>
                  </div>

                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    <div className="space-y-4">
                      {sampleAddresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedAddress === address.id
                              ? 'border-gold bg-gold/5'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <RadioGroupItem value={address.id} className="mt-1" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium">{address.label}</span>
                              {address.id === 'addr-1' && (
                                <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 text-sm">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-white/60 text-sm">{address.addressLine1}</p>
                            <p className="text-white/60 text-sm">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-white/60 text-sm">{address.country}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  <Button
                    variant="outline"
                    onClick={() => toast.info('Add address feature coming soon')}
                    className="mt-4 w-full border-white/20 text-white hover:bg-white/5"
                  >
                    + Add New Address
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep('payment')}
                    className="bg-gold text-black hover:bg-gold-light"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5 text-gold" />
                    <h2 className="font-display text-xl text-white">Payment Method</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-gold bg-gold/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                          <span className="text-white text-xs">VISA</span>
                        </div>
                        <div>
                          <p className="text-white">•••• •••• •••• 4242</p>
                          <p className="text-white/50 text-sm">Expires 12/25</p>
                        </div>
                        <span className="ml-auto px-2 py-1 bg-gold/20 text-gold text-xs rounded">
                          Default
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => toast.info('Add payment method coming soon')}
                      className="w-full border-white/20 text-white hover:bg-white/5"
                    >
                      + Add New Payment Method
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep('shipping')}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('review')}
                    className="bg-gold text-black hover:bg-gold-light"
                  >
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                {/* Order Items */}
                <div className="p-6 bg-white/5 rounded-lg border border-white/5">
                  <h2 className="font-display text-xl text-white mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {cart?.items?.map((item) => (
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
                <div className="p-6 bg-white/5 rounded-lg border border-white/5">
                  <h2 className="font-display text-xl text-white mb-4">Shipping To</h2>
                  {sampleAddresses.find((a) => a.id === selectedAddress) && (
                    <div>
                      <p className="text-white">
                        {sampleAddresses.find((a) => a.id === selectedAddress)?.firstName}{' '}
                        {sampleAddresses.find((a) => a.id === selectedAddress)?.lastName}
                      </p>
                      <p className="text-white/60">
                        {sampleAddresses.find((a) => a.id === selectedAddress)?.addressLine1}
                      </p>
                      <p className="text-white/60">
                        {sampleAddresses.find((a) => a.id === selectedAddress)?.city},{' '}
                        {sampleAddresses.find((a) => a.id === selectedAddress)?.state}{' '}
                        {sampleAddresses.find((a) => a.id === selectedAddress)?.postalCode}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep('payment')}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-gold text-black hover:bg-gold-light"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-6 bg-white/5 rounded-lg border border-white/5">
              <h2 className="font-display text-xl text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal ({cart?.totalItems || 0} items)</span>
                  <span>${(cart?.totalPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-white">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-2xl text-gold">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-white/40 text-sm">
                <Lock className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
