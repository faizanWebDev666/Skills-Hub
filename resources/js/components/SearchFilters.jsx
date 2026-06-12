import React, { useState } from "react";

export default function SearchFilters({
    filters: initialFilters,
    searchFields,
    onSubmit,
    className = "",
}) {
    const [filters, setFilters] = useState(initialFilters || {});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(filters);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`flex flex-wrap gap-3 items-center ${className}`}>
            {searchFields.map((field) => {
                if (field.type === "text" || field.type === "search") {
                    return (
                        <div key={field.name} className="flex-1 min-w-[200px]">
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder || `Search ${field.label}...`}
                                value={filters[field.name] || ""}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, [field.name]: e.target.value }))
                                }
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                            />
                        </div>
                    );
                }

                if (field.type === "select") {
                    return (
                        <div key={field.name}>
                            <select
                                name={field.name}
                                value={filters[field.name] || ""}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, [field.name]: e.target.value }))
                                }
                                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white"
                            >
                                <option value="">{field.placeholder || `All ${field.label}`}</option>
                                {(field.options || []).map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                return null;
            })}

            <button
                type="submit"
                className="rounded-xl bg-brand-600 text-white px-4 py-2 text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
                Search
            </button>
        </form>
    );
}
