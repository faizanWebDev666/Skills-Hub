import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import VendorSidebar from '../../components/VendorSidebar';
import { Star, MessageCircle, Clock, CheckCircle } from 'lucide-react';

export default function VendorReviews({ reviews, gigs, filters }) {
    const { props } = usePage();
    const user = props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const [replyData, setReplyData] = useState({});
    const [confirmModal, setConfirmModal] = useState(null);

    const safeDate = (dateString) => {
        if (!dateString) return '';
        const d = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
        return new Date(d).toLocaleDateString();
    };

    const handleFilterChange = (key, value) => {
        router.get(
            '/vendor/reviews',
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReplyChange = (reviewId, text) => {
        setReplyData(prev => ({ ...prev, [reviewId]: text }));
    };

    const handleReplyClick = (e, reviewId) => {
        e.preventDefault();
        setConfirmModal(reviewId);
    };

    const confirmReply = () => {
        if (!confirmModal) return;
        const reviewId = confirmModal;
        router.post(`/vendor/reviews/${reviewId}/reply`, {
            reply: replyData[reviewId]
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyData(prev => {
                    const next = { ...prev };
                    delete next[reviewId];
                    return next;
                });
                setConfirmModal(null);
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <VendorSidebar user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            <main className="flex-1 w-full lg:w-[calc(100%-16rem)] ml-0">
                <div className="p-4 lg:p-8 w-full max-w-6xl mx-auto mt-16 lg:mt-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Reviews</h1>
                        <p className="text-gray-500">Manage and reply to reviews from your customers.</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 mb-8 items-center">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Product/Service</label>
                            <select 
                                value={filters.gig_id || 'all'} 
                                onChange={(e) => handleFilterChange('gig_id', e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none font-medium min-w-[200px]"
                            >
                                <option value="all">All Products</option>
                                {gigs.map(gig => (
                                    <option key={gig.id} value={gig.id}>{gig.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                            <select 
                                value={filters.status || 'all'} 
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none font-medium min-w-[150px]"
                            >
                                <option value="all">All Reviews</option>
                                <option value="pending">Pending Reply</option>
                                <option value="replied">Replied</option>
                            </select>
                        </div>
                    </div>

                    {/* Reviews List */}
                    {reviews.data.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.data.map(review => (
                                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        
                                        {/* Review Left Side */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                    {review.reviewer?.avatar ? (
                                                        <img src={`/storage/${review.reviewer.avatar}`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        review.reviewer?.name?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{review.reviewer?.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        On: <Link href={`/gigs/${review.order?.gig?.id}`} className="text-brand-600 hover:underline">{review.order?.gig?.title}</Link>
                                                    </p>
                                                </div>
                                                <div className="ml-auto flex flex-col items-end">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {safeDate(review.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm mb-4">
                                                {review.comment || <span className="italic text-gray-400">No comment provided.</span>}
                                            </div>

                                            {/* Reply Section */}
                                            {review.reply ? (
                                                <div className="ml-8 border-l-2 border-brand-200 pl-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">You</div>
                                                        <span className="text-sm font-bold text-gray-900">Your Reply</span>
                                                        <span className="text-xs text-gray-400 ml-auto">
                                                            {safeDate(review.replied_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">{review.reply}</p>
                                                </div>
                                            ) : (
                                                <form onSubmit={(e) => handleReplyClick(e, review.id)} className="mt-4">
                                                    <textarea
                                                        className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition-all"
                                                        rows="3"
                                                        placeholder="Write a public reply..."
                                                        value={replyData[review.id] || ''}
                                                        onChange={(e) => handleReplyChange(review.id, e.target.value)}
                                                        required
                                                    ></textarea>
                                                    <div className="flex justify-end mt-2">
                                                        <button 
                                                            type="submit" 
                                                            disabled={!replyData[review.id]?.trim()}
                                                            className="px-5 py-2 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                                        >
                                                            <MessageCircle className="w-4 h-4" /> Reply Publicly
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                            <Star className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
                            <p className="text-gray-500">You don't have any reviews matching your filters yet.</p>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {reviews.links && reviews.links.length > 3 && (
                        <div className="flex justify-center mt-8 gap-2">
                            {reviews.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                        link.active ? 'bg-brand-600 text-white shadow-sm' : 
                                        link.url ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200' : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Publish Reply</h3>
                        <p className="text-gray-500 text-center mb-8">
                            Are you sure you want to publish this reply? It will be publicly visible to all customers.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReply}
                                className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/30"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
