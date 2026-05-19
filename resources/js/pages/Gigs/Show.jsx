import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, Clock, RefreshCw, Check, ChevronRight, 
    Share2, Heart, Award, ShieldCheck, Zap, MessageSquare
} from 'lucide-react';

export default function Show({ gig, user, isInWishlist = false, sellerStats, reviews = [] }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');
    const [shareMessage, setShareMessage] = useState('');

    const handleShareClick = async () => {
        const shareUrl = `${window.location.origin}/gigs/${gig.id}`;
        const shareText = `Check out this gig: ${gig.title}`;

        // Try native Web Share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: gig.title,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled share
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShareMessage('Link copied to clipboard!');
                setTimeout(() => setShareMessage(''), 3000);
            } catch (err) {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setShareMessage('Link copied to clipboard!');
                setTimeout(() => setShareMessage(''), 3000);
            }
        }
    };

    const handleWishlistToggle = () => {
        if (!user) return router.get('/login');
        router.post(`/wishlist/${gig.id}/toggle`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const formattedString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
        const date = new Date(formattedString);
        const now = new Date();
        const diffMs = now - date;
        
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffSecs < 60) return 'just now';
        if (diffMins === 1) return '1 minute ago';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours === 1) return '1 hour ago';
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const breadcrumbs = [
        { name: 'Home', url: '/home' },
        { name: 'Services', url: '/gigs' },
        { name: gig.title, url: '#' }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-brand-500/30">
            <Navbar user={user} />

            {flash?.success && (
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {flash.error}
                    </div>
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 lg:px-8 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        {breadcrumbs.map((crumb, i) => (
                            <React.Fragment key={i}>
                                <Link href={crumb.url} className="hover:text-brand-600 transition-colors">
                                    {crumb.name}
                                </Link>
                                {i < breadcrumbs.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                    {/* Left Column - Main Content */}
                    <div className="flex-1 max-w-4xl">
                        
                        {/* Title & Metadata */}
                        <div className="mb-8">
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl lg:text-4xl xl:text-[42px] font-extrabold text-gray-900 leading-tight tracking-tight mb-6"
                            >
                                {gig.title}
                            </motion.h1>

                            <div className="flex flex-wrap items-center gap-6">
                                {/* Seller info mini */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                                        {gig.user?.avatar ? (
                                            <img 
                                                src={`/storage/${gig.user.avatar}`} 
                                                alt={gig.user?.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{gig.user?.name?.charAt(0) || 'S'}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                                            {gig.user?.name || 'Service Provider'}
                                            <ShieldCheck className="w-4 h-4 text-brand-500" />
                                        </p>
                                        <p className="text-sm text-gray-500 font-medium">{gig.user?.professional_title || 'Freelancer'}</p>
                                        <p className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wide">
                                            <span className="w-2 h-2 rounded-full bg-brand-600" />
                                            Vendor Level {gig.user?.vendor_level || 1}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>

                                {/* Stats mini */}
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                        <span className="text-gray-900 text-base font-bold">{sellerStats?.avgRating || 0}</span>
                                        <span className="text-gray-500 underline decoration-gray-300 decoration-1 underline-offset-2 hover:text-brand-600 transition-colors cursor-pointer">
                                            ({sellerStats?.reviewsCount || 0} reviews)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Award className="w-5 h-5 text-gray-400" />
                                        <span>{sellerStats?.totalOrders || 0} Orders</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-3xl lg:h-[550px] mb-12 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group bg-white border border-gray-100"
                        >
                            {gig.image ? (
                                <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                                    <span className="text-brand-300 font-bold text-4xl">No Image</span>
                                </div>
                            )}
                            {/* Glassmorphism Badge */}
                            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm flex items-center gap-2">
                                <Zap className="w-4 h-4 text-brand-600 fill-brand-600" />
                                <span className="text-sm font-bold text-gray-900">Highly Rated</span>
                            </div>
                        </motion.div>

                        {/* Tabs Navigation */}
                        <div className="flex gap-8 mb-8 border-b border-gray-200 sticky top-20 bg-[#FAFAFA]/90 backdrop-blur-xl z-20 pt-4">
                            {['overview', 'about the seller', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-base font-bold transition-colors relative capitalize ${
                                        activeTab === tab ? 'text-brand-600' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div 
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tabs Content */}
                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div 
                                        key="overview"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="mb-12 max-w-none"
                                    >
                                        {/* Premium Highlights Card */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="mb-10 bg-gradient-to-br from-brand-50 via-indigo-50 to-purple-50 p-8 rounded-3xl border border-brand-100 shadow-[0_8px_20px_rgba(99,102,241,0.1)] relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200 opacity-5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Zap className="w-5 h-5 text-brand-600 fill-brand-600" />
                                                    <span className="text-sm font-bold uppercase tracking-widest text-brand-600">Service Highlights</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            <Check className="w-6 h-6 text-brand-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 mb-1">Quality Assured</p>
                                                            <p className="text-sm text-gray-600">Professional & vetted service</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            <RefreshCw className="w-6 h-6 text-brand-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 mb-1">Revisions Included</p>
                                                            <p className="text-sm text-gray-600">Unlimited revisions available</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            <Clock className="w-6 h-6 text-brand-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 mb-1">Fast Delivery</p>
                                                            <p className="text-sm text-gray-600">Quick turnaround time</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            <Award className="w-6 h-6 text-brand-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 mb-1">Expert Service</p>
                                                            <p className="text-sm text-gray-600">Highly experienced seller</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Category & Tags Enhanced */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                            className="mb-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="mb-6">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Service Category</h3>
                                                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100 px-6 py-3 rounded-2xl">
                                                    <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                                                    <span className="text-lg font-extrabold text-gray-900">{gig.category || 'Uncategorized'}</span>
                                                </div>
                                            </div>
                                            {gig.tags && gig.tags.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Skills & Keywords</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {gig.tags.map((tag, idx) => (
                                                            <motion.span 
                                                                key={idx}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                className="px-5 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-brand-50 hover:to-indigo-50 text-gray-700 hover:text-brand-700 rounded-full text-sm font-semibold border border-gray-200 hover:border-brand-200 transition-all cursor-default shadow-sm"
                                                            >
                                                                {tag}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                        
                                        {/* Service Details Enhanced */}
                                        {gig.category_fields && Object.keys(gig.category_fields).length > 0 && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="mb-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-600"></div>
                                                    Service Specifications
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {Object.entries(gig.category_fields).map(([key, value], idx) => (
                                                        <motion.div 
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.25 + idx * 0.05 }}
                                                            className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 hover:border-brand-100 hover:from-brand-50/30 hover:to-indigo-50/30 transition-all"
                                                        >
                                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                                                {key.replace(/_/g, ' ')}
                                                            </p>
                                                            {Array.isArray(value) && value.length > 0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {value.map((item, i) => (
                                                                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold shadow-xs">
                                                                            {item}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-base font-bold text-gray-900">{value}</p>
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                        {/* About This Gig Section Enhanced */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25 }}
                                            className="mb-10"
                                        >
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600"></div>
                                                About This Gig
                                            </h2>
                                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line font-medium text-base lg:text-lg">
                                                    {gig.description}
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* What You'll Get Section */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="mb-10 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl border border-emerald-100 shadow-sm"
                                        >
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                <Check className="w-6 h-6 text-emerald-600" />
                                                What You'll Receive
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                    <span className="text-gray-800 font-semibold">Professional delivery</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                    <span className="text-gray-800 font-semibold">On-time completion</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                    <span className="text-gray-800 font-semibold">Quality assurance</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                    <span className="text-gray-800 font-semibold">Responsive communication</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                        
                                        {/* Category Fields if available - DEPRECATED, moved above */}
                                    </motion.div>
                                )}

                                {activeTab === 'about the seller' && (
                                    <motion.div 
                                        key="about"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="mb-12"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">About the Seller</h2>
                                        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                                            <div className="w-28 h-28 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-xl shrink-0 border-4 border-white overflow-hidden">
                                                {gig.user?.avatar ? (
                                                    <img 
                                                        src={`/storage/${gig.user.avatar}`} 
                                                        alt={gig.user?.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{gig.user?.name?.charAt(0) || 'S'}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 w-full">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{gig.user?.name || 'Service Provider'}</h3>
                                                <p className="text-brand-600 font-bold mb-4">{gig.user?.professional_title || 'Professional Freelancer'}</p>
                                                <p className="text-gray-600 leading-relaxed mb-6 font-medium">{gig.user?.bio || 'Passionate about delivering high-quality work and helping clients achieve their business goals.'}</p>
                                                
                                                {/* Seller Details Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                                    {gig.user?.location && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                                                            <p className="text-base font-semibold text-gray-900">{gig.user.location}</p>
                                                        </div>
                                                    )}
                                                    {gig.user?.vendor_level !== undefined && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Vendor Level</p>
                                                            <p className="text-base font-semibold text-gray-900">Level {gig.user.vendor_level || 1}</p>
                                                        </div>
                                                    )}
                                                    {gig.user?.years_of_experience && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                                                            <p className="text-base font-semibold text-gray-900">{gig.user.years_of_experience}</p>
                                                        </div>
                                                    )}
                                                    {gig.user?.hourly_rate && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Hourly Rate</p>
                                                            <p className="text-base font-semibold text-gray-900">${gig.user.hourly_rate}/hr</p>
                                                        </div>
                                                    )}
                                                    {gig.user?.delivery_time && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Delivery Time</p>
                                                            <p className="text-base font-semibold text-gray-900">{gig.user.delivery_time}</p>
                                                        </div>
                                                    )}
                                                    {gig.user?.service_type && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Service Type</p>
                                                            <p className="text-base font-semibold text-gray-900">{gig.user.service_type}</p>
                                                        </div>
                                                    )}
                                                    {gig.user?.languages && gig.user.languages.length > 0 && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Languages</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {gig.user.languages.map((lang, idx) => (
                                                                    <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                                                                        {lang}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {gig.user?.available_days && gig.user.available_days.length > 0 && (
                                                        <div className="p-4 bg-gray-50 rounded-2xl sm:col-span-2">
                                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Available Days</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {gig.user.available_days.map((day, idx) => (
                                                                    <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                                                                        {day}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1 font-medium">Rating</p>
                                                        <p className="text-xl font-bold text-gray-900 flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400"/> {sellerStats?.avgRating || 0}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1 font-medium">Reviews</p>
                                                        <p className="text-xl font-bold text-gray-900">{sellerStats?.reviewsCount || 0}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1 font-medium">Orders Completed</p>
                                                        <p className="text-xl font-bold text-gray-900">{sellerStats?.completedOrders || 0}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1 font-medium">Total Orders</p>
                                                        <p className="text-xl font-bold text-gray-900">{sellerStats?.totalOrders || 0}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Portfolio & Certifications */}
                                                {gig.user?.portfolio_images && gig.user.portfolio_images.length > 0 && (
                                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Portfolio</h4>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                            {gig.user.portfolio_images.slice(0, 6).map((img, idx) => (
                                                                <div key={idx} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                                                                    <img 
                                                                        src={`/storage/${img}`} 
                                                                        alt={`Portfolio ${idx + 1}`} 
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="mt-6">
                                                    {(() => {
                                                        const isOwner = user?.id === gig.user_id;
                                                        const isVendor = user?.roles?.some(r => ['vendor', 'freelancer'].includes(r.name));
                                                        const isDisabled = isOwner || isVendor;

                                                        if (isDisabled) {
                                                            return (
                                                                <button 
                                                                    disabled
                                                                    className="inline-flex bg-gray-100 border border-gray-200 text-gray-400 font-bold py-3 px-8 rounded-xl items-center justify-center gap-2 cursor-not-allowed"
                                                                    title={isOwner ? "You cannot contact yourself" : "Vendors cannot contact sellers"}
                                                                >
                                                                    <MessageSquare className="w-5 h-5" /> Contact Me
                                                                </button>
                                                            );
                                                        }

                                                        return (
                                                            <Link 
                                                                href={gig.user?.id ? `/chat/user/${gig.user.id}` : '#'}
                                                                className="inline-flex bg-brand-50 border border-brand-100 hover:bg-brand-100 text-brand-600 font-bold py-3 px-8 rounded-xl transition-colors items-center justify-center gap-2"
                                                            >
                                                                <MessageSquare className="w-5 h-5" /> Contact Me
                                                            </Link>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'reviews' && (
                                    <motion.div 
                                        key="reviews"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="mb-12"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Client Reviews</h2>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black text-gray-900">{sellerStats?.avgRating || 0}</span>
                                                <div className="flex text-amber-400"><Star className="w-5 h-5 fill-amber-400"/></div>
                                            </div>
                                        </div>
                                        
                                        {reviews && reviews.length > 0 ? (
                                            <div className="grid gap-6">
                                                {reviews.map((review) => (
                                                    <div key={review.id} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg overflow-hidden">
                                                                    {review.reviewer?.avatar ? (
                                                                        <img 
                                                                            src={`/storage/${review.reviewer.avatar}`} 
                                                                            alt={review.reviewer?.name} 
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span>{review.reviewer?.name?.charAt(0) || 'U'}</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900">{review.reviewer?.name || 'User'}</p>
                                                                    <p className="text-sm text-gray-500 font-medium">{formatDate(review.created_at)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex text-amber-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400' : 'text-gray-300'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed font-medium">"{review.comment}"</p>
                                                        
                                                        {review.reply && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 8 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                                className="mt-4 ml-0 sm:ml-4 p-0 relative"
                                                            >
                                                                {/* Connection line - very subtle */}
                                                                <div className="absolute -left-5 top-0 w-0.5 h-8 bg-gradient-to-b from-brand-300 to-brand-100 hidden sm:block"></div>
                                                                
                                                                <div className="bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 rounded-xl p-3 md:p-3.5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
                                                                    {/* Vendor Header - Compact */}
                                                                    <div className="flex items-center gap-2.5 mb-2 relative z-10">
                                                                        {/* Vendor Avatar - Small */}
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white flex-shrink-0 overflow-hidden">
                                                                            {gig.user?.avatar ? (
                                                                                <img 
                                                                                    src={`/storage/${gig.user.avatar}`} 
                                                                                    alt={gig.user?.name} 
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <span>{gig.user?.name?.charAt(0) || 'V'}</span>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        {/* Vendor Info - Compact */}
                                                                        <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                                                            <p className="text-xs md:text-sm font-bold text-gray-900 truncate">
                                                                                {gig.user?.name || 'Service Provider'}
                                                                            </p>
                                                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-[9px] font-bold uppercase tracking-wide rounded-full shadow-sm flex-shrink-0">
                                                                                <ShieldCheck className="w-2.5 h-2.5" />
                                                                                Vendor
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        {/* Timestamp - Right aligned */}
                                                                        <p className="text-xs text-gray-500 font-medium flex-shrink-0 ml-auto">
                                                                            {formatDate(review.replied_at)}
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    {/* Reply Content - Compact */}
                                                                    <div className="relative z-10 pl-0 sm:pl-0">
                                                                        <p className="text-gray-700 leading-snug font-medium text-xs md:text-sm">
                                                                            {review.reply}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
                                                <p className="text-gray-500">Be the first to review this seller!</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <aside className="lg:w-96 flex-shrink-0">
                        <div className="sticky lg:top-28">
                            
                            {shareMessage && (
                                <div className="mb-3 md:mb-4 bg-success-50 border border-success-200 text-success-700 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium">
                                    {shareMessage}
                                </div>
                            )}

                            <div className="flex gap-2 mb-4">
                                <button 
                                    onClick={handleShareClick}
                                    className="flex-1 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 md:py-3 rounded-lg md:rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm md:text-base"
                                    title="Share this gig"
                                >
                                    <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
                                </button>
                                <button 
                                    onClick={handleWishlistToggle}
                                    className={`flex-1 border font-bold py-2.5 md:py-3 rounded-lg md:rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm md:text-base ${
                                        isInWishlist 
                                            ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} /> 
                                    <span className="hidden sm:inline">{isInWishlist ? 'Saved' : 'Save'}</span>
                                </button>
                            </div>

                            {/* Single Pricing Card */}
                            <div className="bg-white rounded-lg md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-5 md:p-8 relative overflow-hidden">
                                {/* Decorative top gradient */}
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-indigo-600"></div>
                                
                                <div className="pt-2">
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <h3 className="font-bold text-gray-900 text-lg md:text-2xl">Service Price</h3>
                                        <span className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">${gig.price}</span>
                                    </div>
                                    
                                    <p className="text-gray-600 font-medium leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
                                        Get professional, high-quality service tailored to your needs by a verified expert.
                                    </p>

                                    <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8 text-xs md:text-sm font-bold text-gray-700">
                                        <div className="flex flex-1 items-center justify-center gap-2 bg-gray-50/80 border border-gray-100 py-2 md:py-3 rounded-lg md:rounded-xl">
                                            <Clock className="w-4 h-4 text-brand-500" />
                                            <span className="hidden sm:inline">Standard Delivery</span>
                                            <span className="sm:hidden">Standard</span>
                                        </div>
                                        <div className="flex flex-1 items-center justify-center gap-2 bg-gray-50/80 border border-gray-100 py-2 md:py-3 rounded-lg md:rounded-xl">
                                            <ShieldCheck className="w-4 h-4 text-brand-500" />
                                            <span className="hidden sm:inline">Verified Expert</span>
                                            <span className="sm:hidden">Verified</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                        {['High-quality execution', 'Professional communication', 'Satisfaction guaranteed', 'Secure payment protection'].map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 md:gap-3 text-gray-700 font-medium text-sm md:text-base">
                                                <Check className="w-4 md:w-5 h-4 md:h-5 text-brand-500 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {(() => {
                                        const isOwner = user?.id === gig.user_id;
                                        const isVendor = user?.roles?.some(r => ['vendor', 'freelancer'].includes(r.name));
                                        const isDisabled = isOwner || isVendor;

                                        if (isDisabled) {
                                            return (
                                                <button
                                                    disabled
                                                    className="w-full bg-gray-400 text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 text-base md:text-lg opacity-60 cursor-not-allowed text-center"
                                                    title={isOwner ? "You cannot buy your own service" : "Vendors cannot buy services"}
                                                >
                                                    Continue <ChevronRight className="w-5 h-5" />
                                                </button>
                                            );
                                        }

                                        return (
                                            <Link
                                                href={user ? `/gigs/${gig.id}/checkout` : '/login'}
                                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base md:text-lg text-center"
                                            >
                                                Continue <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        );
                                    })()}

                                    {(() => {
                                        const isOwner = user?.id === gig.user_id;
                                        const isVendor = user?.roles?.some(r => ['vendor', 'freelancer'].includes(r.name));
                                        const isDisabled = isOwner || isVendor;

                                        if (isDisabled) {
                                            return (
                                                <button 
                                                    disabled
                                                    className="w-full mt-3 md:mt-4 bg-gray-50 border border-gray-200 text-gray-400 font-bold py-3 md:py-4 rounded-lg md:rounded-xl shadow-sm flex items-center justify-center gap-2 text-base md:text-lg cursor-not-allowed"
                                                    title={isOwner ? "You cannot contact yourself" : "Vendors cannot contact sellers"}
                                                >
                                                    <MessageSquare className="w-5 h-5" /> Contact Seller
                                                </button>
                                            );
                                        }

                                        return (
                                            <Link 
                                                href={gig.user?.id ? `/chat/user/${gig.user.id}` : '#'}
                                                className="w-full mt-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
                                            >
                                                <MessageSquare className="w-5 h-5" /> Contact Seller
                                            </Link>
                                        );
                                    })()}
                                    
                                    <p className="text-center text-sm text-gray-400 mt-4 font-medium">You won't be charged yet</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
