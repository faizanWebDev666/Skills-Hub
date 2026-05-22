export default function GigSkeleton() {
    return (
        <div className="group bg-white rounded-lg sm:rounded-2xl border border-gray-200 overflow-hidden">
            <style>{`
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                .skeleton-shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 0%,
                        #e0e0e0 50%,
                        #f0f0f0 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>

            {/* Image Skeleton */}
            <div className="relative">
                <div className="h-32 sm:h-40 md:h-48 skeleton-shimmer overflow-hidden"></div>

                {/* Wishlist Button Skeleton */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full skeleton-shimmer"></div>

                {/* Category Badge Skeleton */}
                <div className="absolute bottom-3 left-3">
                    <div className="bg-gray-300 px-3 py-1 rounded-full w-24 h-5 skeleton-shimmer"></div>
                </div>
            </div>

            <div className="p-3 sm:p-5">
                {/* Avatar & Name Skeleton */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex-shrink-0 skeleton-shimmer"></div>
                    <div className="min-w-0 flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-1 skeleton-shimmer"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 skeleton-shimmer"></div>
                    </div>
                </div>

                {/* Title Skeleton */}
                <div className="mb-2 sm:mb-3 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full skeleton-shimmer"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 skeleton-shimmer"></div>
                </div>

                {/* Rating Skeleton */}
                <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <div className="h-4 bg-gray-300 rounded w-16 skeleton-shimmer"></div>
                </div>

                {/* Price & Button Skeleton */}
                <div className="border-t border-gray-100 pt-2 sm:pt-4 flex items-center justify-between">
                    <div>
                        <div className="h-3 bg-gray-200 rounded w-16 mb-1 skeleton-shimmer"></div>
                        <div className="h-6 bg-gray-300 rounded w-20 skeleton-shimmer"></div>
                    </div>
                    <div className="h-8 sm:h-10 bg-gray-300 rounded-lg sm:rounded-xl w-16 sm:w-20 skeleton-shimmer"></div>
                </div>
            </div>
        </div>
    );
}
