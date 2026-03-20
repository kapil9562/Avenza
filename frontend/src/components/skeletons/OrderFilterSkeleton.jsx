import React from "react";
import { useTheme } from "../../context/ThemeContext";

const OrderFilterSkeleton = () => {
  const { isDark } = useTheme();

  const bg = isDark ? "bg-[#1E293B]" : "bg-gray-300";
  const bgLight = isDark ? "bg-[#334155]" : "bg-gray-200";
  const border = isDark ? "border-[#334155]" : "border-gray-200";

  return (
    <div className="w-full h-fit animate-pulse">

      {/* ORDER STATUS */}
      <div className={`flex flex-col px-4 py-3 border-b gap-3 ${border}`}>
        <div className={`h-4 w-28 rounded ${bg}`}></div>

        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded ${bg}`}></div>
            <div className={`h-4 w-32 rounded ${bgLight}`}></div>
          </div>
        ))}
      </div>

      {/* ORDER TIME */}
      <div className="flex flex-col px-4 py-3 gap-3">
        <div className={`h-4 w-24 rounded ${bg}`}></div>

        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded ${bg}`}></div>
            <div className={`h-4 w-28 rounded ${bgLight}`}></div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderFilterSkeleton;