import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../lib/utils';
import { ShieldCheck, CreditCard, ArrowLeft, CheckCircle2, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'United States',
    zipCode: ''
  });

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-indigo-600 font-bold">Return to Shop</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            items: items,
            total_amount: total()
          })
        });
        const data = await response.json();
        if (data.success) {
          clearCart();
          navigate(`/order-success?order=${data.orderNumber}`);
        }
      } catch (error) {
        console.error("Order failed", error);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Mail size={24} className="text-indigo-600" /> Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="you@example.com" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all" 
                  />
                  <p className="mt-2 text-xs text-slate-400">Your digital license will be sent to this email address.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <CreditCard size={24} className="text-indigo-600" /> Payment Details
              </h2>
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                    <Lock size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-indigo-900">Secure Stripe Payment</div>
                    <div className="text-xs text-indigo-700">All transactions are encrypted and secure.</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="xxxx xxxx xxxx xxxx" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 grayscale opacity-50">
                        <div className="w-8 h-5 bg-slate-300 rounded" />
                        <div className="w-8 h-5 bg-slate-300 rounded" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expiry Date</label>
                    <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            </section>

            <button 
              onClick={handleSubmit}
              disabled={isProcessing}
              className={cn(
                "w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3",
                isProcessing && "opacity-70 cursor-not-allowed"
              )}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>Complete Purchase {formatCurrency(total())}</>
              )}
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-32">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{item.name}</div>
                      <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total())}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 pt-4">
                  <span>Total</span>
                  <span>{formatCurrency(total())}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 size={14} /> Guaranteed Delivery
                </div>
                <p className="text-emerald-600 text-xs leading-relaxed">
                  Your license keys are guaranteed to work or your money back. 24/7 support available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
