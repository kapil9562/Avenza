import React from "react";

const OrderFilterSkeleton = () => {
  return (
    <div className="w-full h-fit animate-pulse">

      {/* ORDER STATUS */}
      <div className="flex flex-col px-4 py-3 border-b border-gray-200 gap-3">
        <div className="h-4 w-28 bg-gray-300 rounded"></div>

        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* ORDER TIME */}
      <div className="flex flex-col px-4 py-3 gap-3">
        <div className="h-4 w-24 bg-gray-300 rounded"></div>

        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderFilterSkeleton;