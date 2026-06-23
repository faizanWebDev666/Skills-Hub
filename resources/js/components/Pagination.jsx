import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links, className = "" }) {
    if (!links || links.length === 0) {
        return null;
    }

    const baseStyles =
        "inline-flex items-center justify-center rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-cream-50";

    return (
        <nav className={`w-full overflow-x-auto ${className}`} aria-label="Pagination">
            <div className="inline-flex min-w-full flex-wrap items-center justify-center gap-2 px-2 py-4 sm:gap-3">
                {links.map((link, index) => {
                    const isActive = !!link.active;
                    const isDisabled = !link.url;
                    const itemClasses = [
                        baseStyles,
                        isActive
                            ? "bg-gradient-to-r from-brand-500 to-purple-600 text-white border-transparent shadow-lg shadow-brand-500/30"
                            : isDisabled
                            ? "bg-white/40 backdrop-blur-sm text-gray-400 border-white/50 cursor-not-allowed"
                            : "bg-white/70 backdrop-blur-sm text-gray-700 border-white/50 hover:bg-white hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5",
                        "whitespace-nowrap",
                    ].join(" ");

                    if (link.url && !isActive) {
                        return (
                            <Link
                                key={index}
                                href={link.url}
                                className={itemClasses}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <span
                            key={index}
                            className={itemClasses}
                            aria-current={isActive ? "page" : undefined}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </nav>
    );
}
