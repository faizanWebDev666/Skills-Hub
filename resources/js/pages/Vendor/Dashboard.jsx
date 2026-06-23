import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import VendorNavbar from "../../components/VendorNavbar";
import VendorSidebar from "../../components/VendorSidebar";

// Stat Card Component - Glassmorphism style
function StatCard({ icon, label, value, trend, trendUp, color }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-black/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-2xl ${color} shadow-lg shadow-black/5`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {icon}
            </svg>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                trendUp
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    trendUp
                      ? "M5 10l7-7m0 0l7 7m-7-7v18"
                      : "M19 14l-7 7m0 0l-7-7m7 7V3"
                  }
                />
              </svg>
              {trend}
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Recent Activity Item
function ActivityItem({ icon, title, time, iconBg, iconColor }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors">
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

// Order Stats Chart Component - Modern Style
function OrderStatsChart({ initialChartData }) {
  const [period, setPeriod] = useState("7days");
  const [chartData, setChartData] = useState(initialChartData || []);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = { period };
      const response = await axios.get("/vendor/order-stats", { params });
      setChartData(response.data.chartData || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Order Flow</h3>
            <p className="text-gray-500 mt-1 text-sm">
              Track your orders over time
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/70 p-1 rounded-xl border border-white/50">
            {[
              { value: "7days", label: "7 Days" },
              { value: "30days", label: "30 Days" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p.value
                    ? "bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-gray-400 gap-4">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-sm">No orders found for this period</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorCompleted)"
                />
                <Line
                  type="monotone"
                  dataKey="in_progress"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorInProgress)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Action Button
function QuickAction({ icon, label, href, gradient }) {
  return (
    <Link href={href} className="group">
      <div className={`relative overflow-hidden rounded-3xl p-6 ${gradient} border border-white/20 shadow-xl shadow-black/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{label}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
            <span>Get started</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VendorDashboard({
  stats,
  user,
  subscription,
  conversations,
  totalUnreadMessages,
  initialChartData,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statCards = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
      label: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`,
      trend: "+12.5%",
      trendUp: true,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
      label: "Active Gigs",
      value: stats?.activeGigs || 0,
      trend: "+2 this week",
      trendUp: true,
      color: "bg-gradient-to-br from-brand-500 to-purple-600",
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
      label: "Pending Orders",
      value: stats?.pendingOrders || 0,
      trend: "-3 from last week",
      trendUp: false,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
      label: "Completed",
      value: stats?.completedOrders || 0,
      trend: "+18%",
      trendUp: true,
      color: "bg-gradient-to-br from-violet-500 to-indigo-600",
    },
  ];

  const recentActivity = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
      title: "New order received from John D.",
      time: "2 minutes ago",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
      title: "Order #1234 completed successfully",
      time: "1 hour ago",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
      title: "New message from Sarah M.",
      time: "3 hours ago",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600"
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
      title: "5-star review received",
      time: "Yesterday",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cream-50 to-slate-100">
      <VendorNavbar user={user} />

      <div className="flex items-start">
        <VendorSidebar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          totalUnreadMessages={totalUnreadMessages || 0}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="relative">
                      {user?.avatar ? (
                        <img
                          src={`/storage/${user.avatar}`}
                          alt={user.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/30">
                          {user?.name?.charAt(0) || "V"}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Welcome back,
                      </p>
                      <h1 className="text-3xl font-extrabold text-gray-900">
                        {user?.name?.split(" ")[0] || "Vendor"}
                      </h1>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm sm:text-base max-w-lg">
                    Here's what's happening with your gigs and orders today.
                  </p>
                </div>
                {subscription && (
                  <Link href="/vendor/subscriptions">
                    <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl shadow-black/5 border border-white/50 hover:shadow-2xl hover:shadow-black/10 transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Plan</p>
                        <p className="font-bold text-gray-900">{subscription.plan?.charAt(0).toUpperCase() + subscription.plan?.slice(1)}</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Two Column Layout - Chart & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Chart Section */}
              <div className="lg:col-span-2">
                <OrderStatsChart initialChartData={initialChartData} />
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="relative overflow-hidden rounded-3xl p-6 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-black/5 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                      <Link href="/vendor/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</Link>
                    </div>
                    <div className="space-y-1">
                      {recentActivity.map((activity, index) => (
                        <ActivityItem key={index} {...activity} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="mb-8">
              <Link href="/wallet" className="group block">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 shadow-2xl shadow-purple-500/20 transition-all duration-500 group-hover:shadow-3xl group-hover:shadow-purple-500/30">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-white/80 text-sm font-medium">Wallet Balance</p>
                      </div>
                      <p className="text-4xl sm:text-5xl font-extrabold text-white mb-2">$0.00</p>
                      <p className="text-white/70 text-sm">Manage your earnings and withdrawals</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <p className="text-white/80 text-xs uppercase tracking-wider mb-1">View Details</p>
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <span>Go to Wallet</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <QuickAction
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />}
                label="Create New Gig"
                href="/vendor/gigs/create"
                gradient="bg-gradient-to-br from-brand-500 to-purple-600"
              />
              <QuickAction
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                label="Update Profile"
                href="/vendor/profile"
                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              />
              <QuickAction
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                label="Check Messages"
                href="/chat"
                gradient="bg-gradient-to-br from-violet-500 to-indigo-600"
              />
            </div>

            {/* Subscription Section */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-black/5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-brand-600 font-semibold mb-3">
                      Upgrade Your Experience
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Supercharge your freelancing business
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl">
                      Unlock premium features to get more visibility, higher conversions, and faster bookings.
                    </p>
                  </div>
                  <Link
                    href={route("vendor.subscriptions")}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-brand-600 hover:to-purple-700 transition-all shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40"
                  >
                    View Plans
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  {[
                    {
                      icon: "⚡",
                      title: "Featured Placement",
                      description: "Get your gigs featured at the top of search results",
                    },
                    {
                      icon: "⭐",
                      title: "Priority Matching",
                      description: "Get matched with high-value clients first",
                    },
                    {
                      icon: "🚀",
                      title: "Verified Badge",
                      description: "Build trust with a verified seller badge on your profile",
                    },
                  ].map((feature, index) => (
                    <div key={index} className="p-6 rounded-2xl bg-white/50 border border-white/50">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
