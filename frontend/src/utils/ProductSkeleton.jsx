import React from 'react'
import { useTheme } from '../context/ThemeContext'

function ProductSkeleton() {

    const {isDark} = useTheme();

    return (
        <div className={`${isDark? "bg-[#171A2E]  border-2 shadow shadow-[#00000040] border-[#2A2E5A]":"bg-white"} max-w-sm rounded-xl shadow-lg p-2 animate-pulse animate-easeIn`}>
            <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} w-full h-48 rounded-lg mb-4`}></div>
            <div className={`${isDark? "bg-[#5257ab] shimmer" : "bg-gray-300"} h-6 rounded-xl w-3/4 mb-2`}></div>
            <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} h-4 rounded-xl w-full mb-2`}></div>
            <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} h-4 rounded-xl w-1/2 mb-4`}></div>
            <div className={`${isDark? "bg-[#8B5CF6] shimmer shadow-[0_0_30px_rgba(139,92,246,0.4)]" : "bg-gray-300"} h-10 rounded-4xl w-full`}></div>
        </div>
    )
}

export default ProductSkeleton