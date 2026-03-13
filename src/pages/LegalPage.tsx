import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function LegalPage() {
  const location = useLocation();
  const title = location.pathname.includes('privacy') ? 'Privacy Policy' : 
                location.pathname.includes('terms') ? 'Terms & Conditions' : 
                'Refund Policy';

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">{title}</h1>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-lg font-medium text-slate-900">Last updated: March 12, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p>Welcome to LicensePro. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Digital Delivery</h2>
            <p>All products sold on LicensePro are digital goods. Upon successful payment, you will receive your license keys and activation instructions via the email address provided during checkout. No physical products will be shipped.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Refund Policy</h2>
            <p>Due to the nature of digital products, we generally do not offer refunds once a license key has been delivered and viewed. However, if a key is found to be defective and our technical support team cannot resolve the issue, a full refund or replacement will be issued within 30 days of purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Authorized Use</h2>
            <p>By purchasing from LicensePro, you agree to use the software in accordance with the End User License Agreement (EULA) provided by the software manufacturer. We sell authorized retail and volume licenses intended for legitimate use.</p>
          </section>
          
          <p className="pt-8 border-t border-slate-100 italic text-sm">
            This is a demonstration legal page for the LicensePro application. In a real-world scenario, you should consult with legal professionals to draft these documents.
          </p>
        </div>
      </div>
    </div>
  );
}
