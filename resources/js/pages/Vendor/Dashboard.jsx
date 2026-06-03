import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import VendorNavbar from "../../components/VendorNavbar";
import VendorSidebar from "../../components/VendorSidebar";

// Mini chart component for stats
function MiniLineChart({ color }) {
    return (
        <svg viewBox="0 0 100 30" className="w-20 h-10">
            <path
                d="M0 25 Q10 20 20 22 T40 18 T60 20 T80 15 T100 18 L100 30 L0 30 Z"
                fill={color}
                fillOpacity="0.2"
            />
            <path
                d="M0 25 Q10 20 20 22 T40 18 T60 20 T80 15 T100 18"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

// Stat card component
function StatCard({ icon, label, value, trend, trendUp, color, bgColor, borderColor }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${bgColor} ${borderColor}`}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {icon}
                </svg>
            </div>
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                        <svg
                            className={`w-6 h-6 ${color}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {icon}
                        </svg>
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={trendUp ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"}
                                />
                            </svg>
                            {trend}
                        </div>
                    )}
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
                <MiniLineChart color={color.replace('text-', '#')} />
            </div>
        </div>
    );
}

// Action card component
function ActionCard({ icon, title, description, link, buttonText, gradient }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl p-8 border border-gray-100 ${gradient} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}>
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icon}
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/80 mb-6 max-w-sm">{description}</p>
                <Link
                    href={link}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                    {buttonText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

// Feature tile component
function FeatureTile({ icon, title, description, color }) {
    return (
        <div className="group bg-white rounded-3xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-brand-200 hover:-translate-y-1">
            <div className={`w-14 h-14 ${color.replace('text-', 'bg-').replace('600', '100')} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <svg className={`w-7 h-7 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}

// Order Stats Chart Component
function OrderStatsChart({ initialChartData }) {
    const [period, setPeriod] = useState('7days');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartData, setChartData] = useState(initialChartData || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { period };
            if (period === 'custom' && startDate && endDate) {
                params.start_date = startDate;
                params.end_date = endDate;
            }
            console.log('Fetching stats with params:', params);
            
            const response = await axios.get('/vendor/order-stats', { params });
            console.log('Received response:', response.data);
            
            setChartData(response.data.chartData || []);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [period, startDate, endDate]);

    const colors = {
        pending: '#f59e0b',
        in_progress: '#3b82f6',
        completed: '#10b981',
        cancelled: '#ef4444'
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Order Flow</h3>
                    <p className="text-gray-500 mt-1">Track your orders over time</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="custom">Custom</option>
                    </select>

                    {period === 'custom' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
            ) : error ? (
                <div className="h-80 flex items-center justify-center text-red-500">
                    Error: {error}
                </div>
            ) : chartData.length === 0 ? (
                <div className="h-80 flex flex-col items-center justify-center text-gray-500 gap-4">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg">No orders found for this period</p>
                </div>
            ) : (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line 
                                type="monotone" 
                                dataKey="pending" 
                                stroke={colors.pending} 
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Pending"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="in_progress" 
                                stroke={colors.in_progress} 
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="In Progress"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="completed" 
                                stroke={colors.completed} 
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Completed"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="cancelled" 
                                stroke={colors.cancelled} 
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Cancelled"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
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
            color: "text-emerald-600",
            bgColor: "bg-white",
            borderColor: "border-emerald-100"
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
            label: "Active Gigs",
            value: stats?.activeGigs || 0,
            trend: "+2 this week",
            trendUp: true,
            color: "text-brand-600",
            bgColor: "bg-white",
            borderColor: "border-brand-100"
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
            label: "Pending Orders",
            value: stats?.pendingOrders || 0,
            trend: "-3 from last week",
            trendUp: false,
            color: "text-amber-600",
            bgColor: "bg-white",
            borderColor: "border-amber-100"
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
            label: "Completed",
            value: stats?.completedOrders || 0,
            trend: "+18%",
            trendUp: true,
            color: "text-violet-600",
            bgColor: "bg-white",
            borderColor: "border-violet-100"
        },
    ];

    const features = [
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
            title: "Create New Gig",
            description: "Add a new service and start getting more orders from clients.",
            color: "text-brand-600"
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
            title: "Update Profile",
            description: "Improve your profile to attract more clients and build trust.",
            color: "text-emerald-600"
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
            title: "Check Messages",
            description: "Don't miss any important messages from your clients.",
            color: "text-purple-600"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream-50 to-gray-100">
            <VendorNavbar user={user} />

            <div className="flex items-start">
                <VendorSidebar
                    user={user}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    conversations={conversations || []}
                    totalUnreadMessages={totalUnreadMessages || 0}
                />

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                        {/* Header */}
                        <div className="mb-10">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                                            <span className="text-2xl">👋</span>
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
                                    <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-purple-600 px-5 py-3 rounded-2xl shadow-lg shadow-brand-600/20">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        <div className="text-white">
                                            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Current Plan</p>
                                            <p className="font-bold">{subscription.plan?.charAt(0).toUpperCase() + subscription.plan?.slice(1)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {statCards.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* Order Stats Chart */}
                        <OrderStatsChart initialChartData={initialChartData} />

                        {/* Wallet Quick Access */}
                        <div className="mb-10">
                            <Link href="/wallet" className="group block">
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 border border-violet-500/30 shadow-2xl shadow-purple-500/20 transition-all duration-500 group-hover:shadow-3xl group-hover:-translate-y-1">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>
                                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Action Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                            <ActionCard
                                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />}
                                title="Create a New Gig"
                                description="Add a new service to your portfolio and start getting more orders from clients looking for your skills."
                                link="/vendor/gigs/create"
                                buttonText="Create Gig"
                                gradient="bg-gradient-to-br from-brand-600 to-purple-600"
                            />
                            <ActionCard
                                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                                title="Complete Your Profile"
                                description="A complete profile builds trust with clients and increases your chances of getting hired."
                                link="/vendor/profile"
                                buttonText="Update Profile"
                                gradient="bg-gradient-to-br from-emerald-600 to-teal-600"
                            />
                        </div>

                        {/* Features Grid */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {features.map((feature, index) => (
                                    <Link key={index} href={
                                        index === 0 ? "/vendor/gigs/create" :
                                        index === 1 ? "/vendor/profile" : "/chat"
                                    }>
                                        <FeatureTile {...feature} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Subscription Section */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
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
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-brand-700 hover:to-purple-700 transition-all shadow-xl shadow-brand-600/20 hover:shadow-2xl hover:shadow-brand-600/30"
                                >
                                    View Plans
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                                {[
                                    {
                                        icon: "⚡",
                                        title: "Featured Placement",
                                        description: "Get your gigs featured at the top of search results",
                                        color: "bg-brand-50 border-brand-200",
                                        textColor: "text-brand-600"
                                    },
                                    {
                                        icon: "⭐",
                                        title: "Priority Matching",
                                        description: "Get matched with high-value clients first",
                                        color: "bg-amber-50 border-amber-200",
                                        textColor: "text-amber-600"
                                    },
                                    {
                                        icon: "🚀",
                                        title: "Verified Badge",
                                        description: "Build trust with a verified seller badge on your profile",
                                        color: "bg-emerald-50 border-emerald-200",
                                        textColor: "text-emerald-600"
                                    },
                                ].map((feature, index) => (
                                    <div key={index} className={`p-6 rounded-2xl border ${feature.color}`}>
                                        <div className={`text-4xl mb-4`}>{feature.icon}</div>
                                        <h3 className={`font-bold text-lg mb-2 ${feature.textColor}`}>{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
