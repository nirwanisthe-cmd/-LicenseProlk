import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-600">Have questions about a license or need technical assistance? Our team is here to help you 24/7.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <ContactInfoCard 
              icon={<Mail className="text-indigo-600" />} 
              title="Email Support" 
              detail="support@licensepro.com" 
              description="Average response time: 2 hours"
            />
            <ContactInfoCard 
              icon={<MessageSquare className="text-emerald-600" />} 
              title="Live Chat" 
              detail="Available 24/7" 
              description="Chat with our experts in real-time"
            />
            <ContactInfoCard 
              icon={<Phone className="text-amber-600" />} 
              title="Phone Support" 
              detail="+1 (888) 123-4567" 
              description="Mon-Fri, 9am - 6pm EST"
            />
          </div>

          <div className="lg:col-span-2">
            <form className="bg-slate-50 p-10 rounded-3xl border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option>Technical Support</option>
                  <option>Sales Inquiry</option>
                  <option>License Activation Issue</option>
                  <option>Refund Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                <textarea rows={5} placeholder="How can we help you?" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const ContactInfoCard = ({ icon, title, detail, description }: { icon: React.ReactNode, title: string, detail: string, description: string }) => (
  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <div className="text-indigo-600 font-bold mb-2">{detail}</div>
    <p className="text-slate-500 text-sm">{description}</p>
  </div>
);
