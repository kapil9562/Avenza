import React from 'react'
import { useTheme } from '../../context/ThemeContext'

function ShowCaseSkeleton() {
    const { isDark } = useTheme();

    return (
        <div className="py-10 font-[Poppins] animate-pulse">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {[...Array(3)].map((_, idx) => (
                    <div key={idx}>

                        {/* heading skeleton */}
                        <div className={`border-b pb-4 ${isDark? "border-gray-700" : "border-gray-300"} `}>
                            <div className={`h-6 w-40 rounded-md ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"} shimmer`}></div>
                        </div>

                        {/* cards */}
                        <div className="flex flex-col gap-4 py-6 px-1">

                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`border rounded-xl p-4 flex items-center gap-4 ${isDark? "border-gray-700" : "border-gray-300"}`}
                                >

                                    {/* image skeleton */}
                                    <div className={`w-17.5 h-17.5 shimmer rounded-lg shrink-0 ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"}`}></div>

                                    {/* content skeleton */}
                                    <div className="flex flex-col gap-3 w-full">

                                        {/* title */}
                                        <div className={`h-4 w-[85%] rounded shimmer ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"}`}></div>

                                        {/* category */}
                                        <div className={`h-3 w-24 rounded shimmer ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"}`}></div>

                                        {/* price */}
                                        <div className="flex items-center gap-3 mt-1">

                                            <div className={`h-4 w-20 rounded shimmer ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"}`}></div>

                                            <div className={`h-4 w-16 rounded shimmer ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"}`}></div>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}

export default ShowCaseSkeleton