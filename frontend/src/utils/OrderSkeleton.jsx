import React from "react";
import { useTheme } from "../context/ThemeContext";

const OrderSkeleton = () => {
  const { isDark } = useTheme();

  const bg = isDark ? "bg-[#1E293B]" : "bg-gray-300";
  const bgLight = isDark ? "bg-[#334155]" : "bg-gray-200";
  const container = isDark
    ? "bg-[#0F172A] border-[#334155]"
    : "bg-white border-[#87878730]";

  return (
    <div className={`px-5 rounded-lg border-2 animate-pulse ${container}`}>
      <table className="w-full table-fixed">
        <tbody>
          <tr>
            {/* Product */}
            <td className="px-4 py-4 w-1/2 pl-10">
              <div className="flex items-center gap-3">
                <div className={`h-20 w-20 rounded ${bg}`}></div>

                <div className="flex flex-col gap-2">
                  <div className={`h-4 w-40 rounded ${bg}`}></div>
                  <div className={`h-3 w-20 rounded ${bgLight}`}></div>
                </div>
              </div>
            </td>

            {/* Amount */}
            <td className="px-4 py-4 w-1/6">
              <div className={`h-4 w-16 rounded ${bg}`}></div>
            </td>

            {/* Status */}
            <td className="px-4 py-4 w-1/3">
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${bg}`}></div>
                <div className={`h-4 w-24 rounded ${bg}`}></div>
              </div>
            </td>

            {/* Payment */}
            <td className="px-4 py-4 w-1/6">
              <div className="flex flex-col gap-2 items-center">
                <div className={`h-3 w-20 rounded ${bgLight}`}></div>
                <div className={`h-6 w-16 rounded-full ${bg}`}></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderSkeleton;