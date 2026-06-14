import React from 'react'
import { useTheme } from '../../context/ThemeContext'

function CartSkeleton() {

    const { isDark } = useTheme();

    return (
        <div className={`${isDark ? "text-gray-300" : "text-gray-600"} max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-2 sm:p-4 h-full`}>

            {/* Cart Items Skeleton */}
            <div className="space-y-2 md:w-3/4">

                {/* Header */}
                <div className="flex justify-between items-center mb-3 animate-pulse">
                    <div className={`h-8 w-40 rounded-lg shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"}`} />
                    <div className={`h-5 w-20 rounded shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"}`} />
                </div>

                <div className={`${isDark ? "border-gray-800" : "border-gray-200"} border rounded-2xl overflow-hidden`}>

                    {[...Array(4)].map((_, idx) => (
                        <div key={idx}>
                            <div className="p-4 flex gap-4 animate-pulse">

                                {/* Product Image */}
                                <div
                                    className={`w-24 h-24 rounded-xl shrink-0 shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                        }`}
                                />

                                {/* Product Details */}
                                <div className="flex-1 space-y-3">
                                    <div
                                        className={`h-5 w-3/4 shimmer rounded ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                            }`}
                                    />

                                    <div
                                        className={`h-4 w-1/2 shimmer rounded ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                            }`}
                                    />

                                    <div className="flex justify-between items-center">
                                        <div
                                            className={`h-8 w-24  shimmer rounded-lg ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                                }`}
                                        />

                                        <div
                                            className={`h-6 w-16 shimmer rounded ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {idx !== 3 && (
                                <div className="px-4">
                                    <div
                                        className={`border-t ${isDark ? "border-gray-800" : "border-gray-200"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary Skeleton */}
            <div className={`${isDark ? "border-gray-800" : "border-gray-200"} border rounded-2xl h-fit md:w-1/2`}>

                <div className="p-6 space-y-5 animate-pulse">

                    <div
                        className={`h-7 w-40 rounded shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                            }`}
                    />

                    {[...Array(3)].map((_, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between"
                        >
                            <div
                                className={`h-5 w-24 rounded shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                    }`}
                            />

                            <div
                                className={`h-5 w-16 rounded shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                    }`}
                            />
                        </div>
                    ))}

                    <div
                        className={`h-px ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                            }`}
                    />

                    <div className="flex justify-between">
                        <div
                            className={`h-6 w-16 rounded shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                }`}
                        />

                        <div
                            className={`h-6 w-24 rounded shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                                }`}
                        />
                    </div>

                    <div
                        className={`h-12 w-full rounded-xl shimmer ${isDark ? "bg-[#2A2E5A]" : "bg-gray-300"
                            }`}
                    />
                </div>
            </div>

        </div>
    )
}

export default CartSkeleton