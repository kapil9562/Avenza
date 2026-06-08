import { createContext, useContext, useState } from "react";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import { RxCross2 } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [openModal, setOpenModal] = useState(false);

    const { isDark } = useTheme();
    const { logout } = useAuth();

    return (
        <ModalContext.Provider value={{ openModal, setOpenModal }}>
            {children}

            {openModal && (
                <>
                    {/* Overlay */}
                    <div
                        onClick={() => setOpenModal(false)}
                        className={`fixed inset-0 z-50 backdrop-blur-[1px] transition-all duration-300 ${isDark ? "bg-black/70" : "bg-black/50"
                            }`}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 duration-300 zoom-modal">
                        <div
                            className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${isDark
                                    ? "bg-[#0F172A] border-gray-800"
                                    : "bg-white border-gray-200"
                                }`}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setOpenModal(false)}
                                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition ${isDark
                                        ? "hover:bg-gray-800 text-gray-400"
                                        : "hover:bg-gray-100 text-gray-500"
                                    }`}
                            >
                                <RxCross2 size={20} />
                            </button>

                            <div className="p-8 flex flex-col items-center">
                                {/* Icon */}
                                <div
                                    className={`p-6 rounded-full flex items-center justify-center mb-6 ${isDark
                                            ? "bg-pink-500/10 border border-pink-500/20"
                                            : "bg-pink-100"
                                        }`}
                                >
                                    <FiLogOut
                                        size={38}
                                        className="text-pink-500"
                                    />
                                </div>

                                {/* Heading */}
                                <h2
                                    className={`text-3xl font-semibold text-center ${isDark ? "text-white" : "text-gray-800"
                                        }`}
                                >
                                    Log out of{" "}
                                    <span className="bg-linear-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                        Avenza
                                    </span>
                                    ?
                                </h2>

                                {/* Description */}
                                <p
                                    className={`mt-4 text-center text-sm max-w-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    You will be signed out of your account and
                                    need to log in again to continue.
                                </p>

                                {/* Divider */}
                                <div className="flex items-center w-full mb-2 mt-4">
                                    <div
                                        className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"
                                            }`}
                                    />
                                    <span
                                        className={`px-4 text-sm ${isDark ? "text-gray-500" : "text-gray-500"
                                            }`}
                                    >
                                        Are you sure?
                                    </span>
                                    <div
                                        className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"
                                            }`}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <button
                                        onClick={() => setOpenModal(false)}
                                        className={`h-12 rounded-xl font-semibold border transition-all duration-200 active:scale-95 ${isDark
                                                ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                                                : "border-gray-300 hover:bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {
                                            logout();
                                            setOpenModal(false);
                                        }}
                                        className="h-12 rounded-xl font-semibold text-white hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] transition-all border duration-300 active:scale-95"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);