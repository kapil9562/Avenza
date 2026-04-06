import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const PaymentFailed = () => {

    const { isDark } = useTheme();

    return (
        <div className={`lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] flex items-center justify-center px-4 ${isDark ? "bg-[#0F172A]" : "bg-[#F1F3F6]"}`}>
            <div className={`shadow-xl rounded-2xl p-8 max-w-md w-full text-center border-2 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-transparent"}`}>

                <div className="flex justify-center">
                    <RxCrossCircled size={70} className="text-red-500" />
                </div>

                <h1 className="text-2xl text-red-500 font-bold">
                    Payment Cancelled
                </h1>

                <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Payment Failed. We couldn't process your payment. Your order has not been completed. Please try again .
                </p>

                <div className="flex flex-col gap-3">

                    <Link
                        to="/my-account/my-orders"
                        className={`bg-[#FF6F61] border-[#ff3e2d] hover:bg-[#fc8479] text-white py-2 rounded-lg transition border-2 nunitoFont font-semibold`}
                    >
                        View Orders
                    </Link>

                    <Link
                        to="/home"
                        className={`border-2 py-2 rounded-lg transform-gpu font-semibold ${isDark ? "hover:bg-gray-800 text-white border-gray-700" : "hover:bg-gray-100 border-gray-300"} nunitoFont`}
                    >
                        Go Back
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;