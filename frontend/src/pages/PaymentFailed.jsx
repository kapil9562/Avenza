import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";

const PaymentFailed = () => {

    return (
        <div className="lg:min-h-[calc(100dvh-124px)] md:min-h-[calc(100dvh-92px)] min-h-[calc(100dvh-124px)] flex items-center justify-center flex-col">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-4 border-2 border-gray-200/30">

                <div className="flex justify-center">
                    <RxCrossCircled size={70} className="text-red-500" />
                </div>

                <h1 className="text-2xl text-red-500 font-bold">
                    Payment Cancelled
                </h1>

                <p className="text-gray-600">
                    Payment Failed. We couldn't process your payment. Your order has not been completed. Please try again .
                </p>

                <div className="flex flex-col gap-3">

                    <Link
                        to="/my-account/my-orders"
                        className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        View Orders
                    </Link>

                    <Link
                        to="/home"
                        className="border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        Go Back
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;