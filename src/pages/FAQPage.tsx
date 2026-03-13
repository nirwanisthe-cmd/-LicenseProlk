import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: "How will I receive my license key?",
      a: "Immediately after your payment is confirmed, you will receive an automated email containing your license key, official download links, and step-by-step activation instructions."
    },
    {
      q: "Are these licenses genuine and legal?",
      a: "Yes, 100%. We only sell authorized retail and volume licenses sourced directly from official distribution partners. Every key is guaranteed to activate and receive all official updates."
    },
    {
      q: "What if the license key doesn't work?",
      a: "In the rare event that a key doesn't work, our technical support team is available 24/7 to assist you. If we cannot resolve the issue, we provide a full refund or a replacement key immediately."
    },
    {
      q: "Can I use the license on multiple computers?",
      a: "Most retail licenses are for a single device unless specified otherwise in the product description. Please check the specific product details for multi-device support."
    },
    {
      q: "Do you provide technical support for installation?",
      a: "Yes! We provide comprehensive installation guides with every purchase. If you still have trouble, our support team can help you via live chat or remote assistance."
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">Everything you need to know about our digital licenses and delivery process.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors">
                <span className="font-bold text-slate-900">{faq.q}</span>
                <ChevronDown size={20} className="text-slate-400" />
              </button>
              <div className="px-8 pb-6 text-slate-600 text-sm leading-relaxed">
                {faq.a}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-indigo-600 rounded-3xl p-10 text-center text-white shadow-xl shadow-indigo-200">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-8 opacity-90">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
