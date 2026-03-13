import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Mail, Download, ArrowRight, ShieldCheck, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../lib/utils';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');

  useEffect(() => {
    // Paper bomb animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // "Yeh!" sound effect
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"); // A cheerful "yeah/yay" sound
    audio.play().catch(err => console.log("Audio play blocked:", err));

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-40 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100"
        >
          <CheckCircle2 size={48} />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Payment Successful!</h1>
        <p className="text-lg text-slate-600 mb-12">
          Thank you for your purchase. Your order <span className="font-bold text-slate-900">#{orderNumber}</span> has been confirmed.
        </p>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-left mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Next Steps</h3>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Check your Email</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We've sent your license keys and activation instructions to your email address. Please check your inbox (and spam folder).</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Download Software</h4>
                <p className="text-slate-600 text-sm leading-relaxed">The email contains official download links from the manufacturer. Always download from official sources.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Activate & Enjoy</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Follow the step-by-step guide in the email to activate your software. If you need help, our support team is ready.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight size={20} />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Printer size={20} /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
