import { useTheme } from "../context/ThemeContext";

function ProductDetailsSkeleton() {

    const {isDark} = useTheme();

    return (
        <div className={`${isDark? "bg-[#0F172A95]" : "bg-white"} flex flex-col sm:flex-row gap-8 p-6 min-h-screen rounded-2xl animate-pulse animate-easeIn`}>
            {/* LEFT */}
            <div className="flex flex-col gap-4 w-full">
                <div className={`${isDark? "bg-[#2A2E5A] border-2 shadow shadow-[#00000040] border-[#2A2E5A] shimmer" : "bg-gray-300"} h-70 sm:h-100 w-full rounded-xl`} />
                <div className="flex flex-row gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className={`${isDark? "bg-[#2A2E5A] border-2 shadow shadow-[#00000040] border-[#2A2E5A] shimmer" : "bg-gray-300"} h-20 w-20 rounded-xl`}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4 w-full">
                <div className={`${isDark? "bg-[#5257ab] shimmer" : "bg-gray-300"} h-8 w-3/4 rounded-xl`} />
                <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} h-4 w-full rounded-xl`} />
                <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} h-4 w-5/6 rounded-xl`} />
                <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} h-6 w-1/4 rounded-xl`} />
                <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
                    <div className={`${isDark? "bg-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.4)] shimmer" : "bg-gray-300"} h-10 w-full sm:w-full rounded-xl`} />
                    <div className={`${isDark? "bg-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.4)] shimmer" : "bg-gray-300"} h-10 w-full sm:w-full rounded-xl`} />
                </div>
                <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} h-20 w-full rounded-xl`}/>
                <div className={`${isDark? "bg-[#2A2E5A] shimmer" : "bg-gray-300"} h-60 w-full rounded-xl`} />
            </div>
        </div>
    );
}

export default ProductDetailsSkeleton;
