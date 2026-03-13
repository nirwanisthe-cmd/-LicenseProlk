import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ShoppingCart, ArrowLeft, Mail, Download, Lock, Zap, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="pt-32 max-w-7xl mx-auto px-4 animate-pulse h-screen bg-slate-50" />;
  if (!product) return <div className="pt-32 text-center">Product not found.</div>;

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 opacity-50">
                  <img src={product.image_url} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} /> Official License Key
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm text-slate-500 font-medium">4.9/5 (128 reviews)</span>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={16} /> In Stock
              </span>
            </div>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {product.short_description}
            </p>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
                {product.compare_price && (
                  <span className="text-xl text-slate-400 line-through mb-1">{formatCurrency(product.compare_price)}</span>
                )}
                <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg mb-1">
                  SAVE {Math.round((1 - product.price / product.compare_price) * 100)}%
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Zap size={18} className="text-indigo-600" />
                  <span>Instant delivery to your email address</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Download size={18} className="text-indigo-600" />
                  <span>Official download links provided</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Lock size={18} className="text-indigo-600" />
                  <span>Secure activation & lifetime updates</span>
                </div>
              </div>

              <button 
                onClick={() => addItem(product)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Product Details</h3>
              <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                <p>This is a genuine retail license key for {product.name}. It allows for a full installation and activation on one device. You will receive the license key and official download instructions via email immediately after purchase.</p>
                <ul className="mt-4 space-y-2">
                  <li>• Multi-language support</li>
                  <li>• Lifetime validity</li>
                  <li>• Official Microsoft/Adobe/Autodesk updates</li>
                  <li>• 24/7 Technical support included</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
