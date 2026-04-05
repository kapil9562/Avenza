import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { IoCheckmarkCircleSharp, IoClose } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";
import { MdError } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";

const ToastContext = createContext();

let externalToast = null;

export const ToastProvider = ({ children }) => {
    const [currentToast, setCurrentToast] = useState(null);
    const queueRef = useRef([]);
    const timerRef = useRef(null);

    const removeCurrentToast = useCallback(() => {
        setCurrentToast(null);
    }, []);

    const processQueue = useCallback(() => {
        if (currentToast || queueRef.current.length === 0) return;

        const nextToast = queueRef.current.shift();
        setCurrentToast(nextToast);

        timerRef.current = setTimeout(() => {
            setCurrentToast(null);
        }, nextToast.duration || 3000);
    }, [currentToast]);

    useEffect(() => {
        if (!currentToast) {
            processQueue();
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentToast, processQueue]);

    const showToast = useCallback((type, message, duration = 3000) => {
        const id = Date.now() + Math.random();

        queueRef.current.push({
            id,
            type,
            message,
            duration,
        });

        processQueue();
    }, [processQueue]);

    const toast = {
        success: (message, duration) => showToast("success", message, duration),
        error: (message, duration) => showToast("error", message, duration),
        warn: (message, duration) => showToast("warn", message, duration),
        info: (message, duration) => showToast("info", message, duration),
    };

    externalToast = toast;

    const handleClose = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        removeCurrentToast();
    };

    useEffect(() => {
        if (!currentToast) return;

        const timer = setTimeout(() => {
            removeCurrentToast();
        }, 3000);

        return () => clearTimeout(timer);
    }, [currentToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}

            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999999] flex flex-col gap-3">
                {currentToast && (
                    <div
                        key={currentToast.id}
                        className={`w-fit px-2 p-2 shadow-lg border-l-4 rounded-md animate-fadeUp ${currentToast.type === "success"
                            ? "bg-green-100 text-green-600 border-green-400"
                            : currentToast.type === "error"
                                ? "bg-red-100 border-red-400 text-red-600"
                                : currentToast.type === "warn"
                                    ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                                    : "bg-blue-100 border-blue-400 text-blue-700"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-2xl">
                                    {currentToast.type === "success" ? (
                                        <IoCheckmarkCircleSharp />
                                    ) : currentToast.type === "error" ? (
                                        <MdError />
                                    ) : currentToast.type === "warn" ? (
                                        <GoAlertFill />
                                    ) : (
                                        <FaInfoCircle />
                                    )}
                                </span>

                                <p className="text-lg font-semibold nunitoFont">{currentToast.message}</p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="text-lg leading-none cursor-pointer text-center"
                            >
                                <IoClose />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

export const toast = {
    success: (message, duration) => externalToast?.success(message, duration),
    error: (message, duration) => externalToast?.error(message, duration),
    warn: (message, duration) => externalToast?.warn(message, duration),
    info: (message, duration) => externalToast?.info(message, duration),
};