import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-sidebar text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-brand-400">SkillHub</h3>
                        <p className="text-gray-400">
                            Connect with talented freelancers and get your projects done.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Freelancers</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Become a Seller</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Fees & Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Buyers</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Browse Gigs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-sidebar-light mt-12 pt-8 text-center text-slate-400">
                    <p>&copy; 2026 SkillHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
