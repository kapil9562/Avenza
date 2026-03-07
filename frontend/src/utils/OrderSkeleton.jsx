import React from "react";

const OrderSkeleton = () => {
  return (
    <div className="px-5 bg-white rounded-lg border-2 border-[#87878730] animate-pulse">
      <table className="w-full table-fixed">
        <tbody>
          <tr>
            {/* Product */}
            <td className="px-4 py-4 w-1/2 pl-10">
              <div className="flex items-center gap-3">
                <div className="h-20 w-20 bg-gray-300 rounded"></div>

                <div className="flex flex-col gap-2">
                  <div className="h-4 w-40 bg-gray-300 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </td>

            {/* Amount */}
            <td className="px-4 py-4 w-1/6">
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </td>

            {/* Status */}
            <td className="px-4 py-4 w-1/3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
            </td>

            {/* Payment */}
            <td className="px-4 py-4 w-1/6">
              <div className="flex flex-col gap-2 items-center">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderSkeleton;