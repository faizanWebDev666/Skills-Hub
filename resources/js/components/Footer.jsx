import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-sidebar text-white mt-12 md:mt-16 lg:mt-20">
            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-brand-400">SkillHub</h3>
                        <p className="text-xs md:text-sm text-gray-400">
                            Connect with talented freelancers and get your projects done.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm md:text-base font-semibold mb-2 md:mb-4">For Freelancers</h4>
                        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Become a Seller</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Fees & Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm md:text-base font-semibold mb-2 md:mb-4">For Buyers</h4>
                        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Browse Gigs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm md:text-base font-semibold mb-2 md:mb-4">Company</h4>
                        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-sidebar-light pt-6 md:pt-8 text-center text-xs md:text-sm text-slate-400">
                    <p>&copy; 2026 SkillHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
