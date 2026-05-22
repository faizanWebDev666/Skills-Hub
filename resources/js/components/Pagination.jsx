import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links, className = "" }) {
    if (!links || links.length === 0) {
        return null;
    }

    const baseStyles =
        "inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2";

    return (
        <nav className={`w-full overflow-x-auto ${className}`} aria-label="Pagination">
            <div className="inline-flex min-w-full flex-wrap items-center justify-center gap-2 px-2 py-3 sm:gap-3">
                {links.map((link, index) => {
                    const isActive = !!link.active;
                    const isDisabled = !link.url || isActive;
                    const itemClasses = [
                        baseStyles,
                        isActive
                            ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                            : isDisabled
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
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
