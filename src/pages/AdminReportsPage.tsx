import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

import { statsService } from '../lib/db';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    statsService.getStats().then(data => setStats(data));
  }, []);

  if (!stats) return <div className="animate-pulse space-y-10">
    <div className="h-32 bg-slate-200 rounded-3xl" />
    <div className="grid grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-200 rounded-3xl" />)}
    </div>
  </div>;

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Reports</h1>
          <p className="text-slate-500">Detailed insights into your store's performance and profitability.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportStat title="Gross Revenue" value={formatCurrency(stats.totalSales)} change="+15.2%" positive />
        <ReportStat title="Total Orders" value={stats.totalOrders.toString()} change="+8.2%" positive />
        <ReportStat title="Average Order Value" value={formatCurrency(stats.totalSales / (stats.totalOrders || 1))} change="+3.1%" positive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center justify-between">
            Revenue Trend
            <BarChart3 size={20} className="text-slate-400" />
          </h3>
          <div className="h-64 flex items-end gap-6">
            {stats.dailyRevenue.map((day: any) => (
              <div key={day.date} className="flex-grow flex flex-col gap-1">
                <div className="flex flex-col-reverse h-full gap-1">
                  <div className="bg-indigo-500 rounded-t-sm" style={{ height: `${(day.revenue / 3000) * 100}%` }} />
                  <div className="bg-rose-400 rounded-t-sm" style={{ height: `${(day.cost / 3000) * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 text-center">{day.date.split('-').slice(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm" /> Revenue
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-3 h-3 bg-rose-400 rounded-sm" /> Ad Spend
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center justify-between">
            Performance Metrics
            <PieChart size={20} className="text-slate-400" />
          </h3>
          <div className="space-y-6">
            <MetricItem name="Conversion Rate" value="3.42%" percentage={34} />
            <MetricItem name="Customer Retention" value="18.5%" percentage={18} />
            <MetricItem name="Support Satisfaction" value="98%" percentage={98} />
            <MetricItem name="Refund Rate" value="0.5%" percentage={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

const MetricItem = ({ name, value, percentage }: { name: string, value: string, percentage: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm font-bold">
      <span className="text-slate-900">{name}</span>
      <span className="text-indigo-600">{value}</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

const ReportStat = ({ title, value, change, positive }: { title: string, value: string, change: string, positive: boolean }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</div>
    <div className="text-3xl font-extrabold text-slate-900 mb-4">{value}</div>
    <div className={cn("flex items-center gap-1 text-sm font-bold", positive ? "text-emerald-600" : "text-rose-600")}>
      {positive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
      {change} <span className="text-slate-400 font-medium ml-1">vs last month</span>
    </div>
  </div>
);
