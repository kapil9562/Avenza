import React from 'react'
import { useTheme } from '../../context/ThemeContext'

function HeaderCategorySkeleton() {

  const { isDark } = useTheme();
  return (
    <div className='flex items-center gap-1'>
      <div className={`bg-gray-700 h-6 border-r-2 ${isDark ? "border-r-gray-800 " : "border-r-gray-200"}`}></div>
      <div className='px-2'>
        <div className={`${isDark ? "bg-[#2A2E5A] shimmer animate-pulse" : "bg-gray-300 shimmer animate-pulse"} min-h-8 min-w-31 rounded-lg`}></div>
      </div>
    </div>
  )
}

function BodyCategorySkeleton() {
   
  const {isDark} = useTheme();

  return (
    <div className='flex w-full justify-between'>
      <div className={`min-h-6 min-w-[70%] rounded-xl ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"} shimmer animate-pulse`}></div>
      <div className={`min-h-6 min-w-6 rounded-full ${isDark? "bg-[#2A2E5A]" : "bg-gray-300"} shimmer animate-pulse`}></div>
    </div>
  )
}

export {HeaderCategorySkeleton, BodyCategorySkeleton}