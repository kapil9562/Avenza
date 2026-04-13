import { createContext, useContext, useState } from "react";
import { useTheme } from "./ThemeContext";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "./AuthContext";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [openModal, setOpenModal] = useState(false);
    const { isDark } = useTheme();
    const { logout } = useAuth();
    return (
        <ModalContext.Provider value={{ openModal, setOpenModal }}>
            {children}

            {openModal &&
                <div>
                    {/* {overlay} */}
                    <div className={`fixed inset-0 z-99 transition-opacity duration-700 cursor-pointer ease-in-out ${openModal
                        ? `opacity-100 pointer-events-auto ${isDark ? "bg-black/60" : "bg-black/50"}`
                        : "opacity-0 pointer-events-none bg-transparent"
                        }`}
                    />

                    {/* {Modal} */}
                    <div className="px-10 absolute top-1/2 w-full left-1/2 z-200 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center zoom-modal">
                        <div className={`w-fit flex flex-col items-center justify-between sm:min-h-55 min-h-45 rounded-lg nunitoFont font-semibold border-2 ${isDark ? "text-gray-200  shadow-xl border-gray-800 bg-[#0F172A]" : "text-gray-700 shadow-lg border-gray-300 bg-white"}`}>
                            <div className={`w-full flex justify-between items-center border-b-2 px-1 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                                <h1 className={`font-semibold p-2 ${isDark ? "text-gray-100" : "text-gray-800"}`}>Logout</h1>
                                <button onClick={() => setOpenModal(false)} className={`cursor-pointer p-2 rounded-lg ${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-200"}`}>
                                    <RxCross2 />
                                </button>
                            </div>
                            <p className={`px-6 text-center flex`}>Reauthorization is required after logging out.</p>
                            <div className="flex flex-row justify-between w-full px-6 pb-4">
                                <button
                                    className={`border-2 px-3 py-1 rounded transition-all duration-150 ease-out active:scale-95 transform-gpu will-change-transform cursor-pointer ${isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"}`}
                                    onClick={() => setOpenModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`bg-[#FF6F61] w-19 border-[#ff3e2d] border-2 rounded-lg px-3 py-1 hover:bg-[#ff3e2d] transition-all duration-150 ease-out active:scale-95 transform-gpu cursor-pointer flex justify-center items-center text-white will-change-transform`}
                                    onClick={() => {
                                        logout();
                                        setOpenModal(false);
                                    }}>
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext);