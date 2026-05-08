import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';

export default function FreelancerShow({ freelancer, authUser }) {
    const hasChatAccess = authUser?.id !== freelancer?.id;
    const roleLabel = freelancer?.roles?.[0]?.name ? freelancer.roles[0].name.charAt(0).toUpperCase() + freelancer.roles[0].name.slice(1) : 'Freelancer';

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={authUser} />

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-brand-600 font-semibold">Freelancer Profile</p>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2">{freelancer?.name || 'Freelancer'}</h1>
                        <p className="text-gray-500 mt-2 max-w-2xl">A complete profile page for freelancers, including service highlights, biography, top gigs, and contact actions.</p>
                    </div>
                    {hasChatAccess && (
                        <Link
                            href={route('chat.with-user', freelancer.id)}
                            className="inline-flex items-center justify-center px-5 py-3 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 transition-colors"
                        >
                            Message Freelancer
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-3xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold">
                                    {freelancer?.name?.charAt(0) || 'F'}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{roleLabel}</p>
                                    <h2 className="text-2xl font-bold text-gray-900">{freelancer?.name || 'Freelancer'}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{freelancer?.email}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                                <p className="text-gray-600 mt-3 leading-7 whitespace-pre-line">
                                    {freelancer?.bio || 'This freelancer has not added a bio yet. A great freelancer profile helps clients understand skills, expertise, and service quality.'}
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="rounded-3xl bg-cream-100 p-4 text-center">
                                    <p className="text-sm text-gray-500">Gigs</p>
                                    <p className="text-2xl font-bold text-gray-900">{freelancer?.gigs?.length || 0}</p>
                                </div>
                                <div className="rounded-3xl bg-cream-100 p-4 text-center">
                                    <p className="text-sm text-gray-500">Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{freelancer?.orderCount || 0}</p>
                                </div>
                                <div className="rounded-3xl bg-cream-100 p-4 text-center">
                                    <p className="text-sm text-gray-500">Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{freelancer?.rating || '4.9'}</p>
                                </div>
                                <div className="rounded-3xl bg-cream-100 p-4 text-center">
                                    <p className="text-sm text-gray-500">Reviews</p>
                                    <p className="text-2xl font-bold text-gray-900">{freelancer?.reviewCount || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">Top Gigs</h3>
                                <Link href="/gigs" className="text-sm text-brand-600 hover:text-brand-700">Browse more</Link>
                            </div>
                            <div className="space-y-4">
                                {freelancer?.gigs?.length > 0 ? freelancer.gigs.map((gig) => (
                                    <Link
                                        key={gig.id}
                                        href={`/gigs/${gig.id}`}
                                        className="block p-4 rounded-3xl bg-cream-50 border border-gray-100 hover:border-brand-200 transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{gig.title}</p>
                                                <p className="text-sm text-gray-500 mt-1">${Number(gig.price).toLocaleString()}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{gig.active ? 'Active' : 'Paused'}</span>
                                        </div>
                                    </Link>
                                )) : (
                                    <p className="text-gray-500">This freelancer has no active gigs yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                            <p className="text-gray-600">Want to discuss a project, ask about availability, or request a custom offer? Start a conversation now.</p>
                            {hasChatAccess && (
                                <Link
                                    href={route('chat.with-user', freelancer.id)}
                                    className="mt-6 inline-flex w-full items-center justify-center px-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
                                >
                                    Message {freelancer?.name?.split(' ')[0] || 'Freelancer'}
                                </Link>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link href="/chat" className="block px-4 py-3 rounded-2xl bg-cream-50 border border-gray-200 text-gray-700 hover:border-brand-200 transition-colors">
                                    Open chat inbox
                                </Link>
                                <Link href="/gigs" className="block px-4 py-3 rounded-2xl bg-cream-50 border border-gray-200 text-gray-700 hover:border-brand-200 transition-colors">
                                    Browse all gigs
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
