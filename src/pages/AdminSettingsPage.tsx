import React, { useState, useEffect } from 'react';
import { Settings, Shield, Mail, CreditCard, Globe, Bell, Save, Lock, Eye, EyeOff, BarChart3, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

type TabType = 'general' | 'payment' | 'analytics' | 'email' | 'security' | 'notifications';

import { settingsService } from '../lib/db';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.getSettings().then(data => {
      setSettings(data || {});
      setLoading(false);
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.saveSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Store Settings</h1>
        <p className="text-slate-500">Configure your marketplace, payments, and integrations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-4">
          <SettingsTab 
            icon={<Globe size={20} />} 
            label="General Settings" 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
          />
          <SettingsTab 
            icon={<CreditCard size={20} />} 
            label="Payment Gateway" 
            active={activeTab === 'payment'} 
            onClick={() => setActiveTab('payment')}
          />
          <SettingsTab 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
          />
          <SettingsTab 
            icon={<Mail size={20} />} 
            label="Email Templates" 
            active={activeTab === 'email'} 
            onClick={() => setActiveTab('email')}
          />
          <SettingsTab 
            icon={<Shield size={20} />} 
            label="Security & Auth" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          />
          <SettingsTab 
            icon={<Bell size={20} />} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'general' && (
            <>
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Store Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Store Name</label>
                      <input 
                        type="text" 
                        value={settings.store_name || ''} 
                        onChange={(e) => handleChange('store_name', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.support_email || ''} 
                        onChange={(e) => handleChange('support_email', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Store Description</label>
                    <textarea 
                      rows={3} 
                      value={settings.store_description || ''} 
                      onChange={(e) => handleChange('store_description', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Currency & Localization</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Currency</label>
                    <select 
                      value={settings.currency || 'USD'} 
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Timezone</label>
                    <select 
                      value={settings.timezone || 'UTC'} 
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'payment' && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Stripe Configuration</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stripe Publishable Key</label>
                  <input 
                    type="text" 
                    value={settings.stripe_publishable_key || ''} 
                    onChange={(e) => handleChange('stripe_publishable_key', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stripe Secret Key</label>
                  <input 
                    type="password" 
                    value={settings.stripe_secret_key || ''} 
                    onChange={(e) => handleChange('stripe_secret_key', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'analytics' && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Google Analytics</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Measurement ID (G-XXXXXXXXXX)</label>
                  <input 
                    type="text" 
                    value={settings.ga_measurement_id || ''} 
                    onChange={(e) => handleChange('ga_measurement_id', e.target.value)}
                    placeholder="G-XXXXXXXXXX" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>
            </section>
          )}

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SettingsTab = ({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick: () => void
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-left",
      active ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-500 hover:bg-white hover:text-slate-900"
    )}
  >
    {icon}
    {label}
  </button>
);

