import React, { useEffect, useMemo, useState } from "react";
import { animate, motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext";

const defaultSteps = [
  {
    key: "processing",
    label: "Ordered",
    desc: "Your order has been placed",
  },
  {
    key: "packed",
    label: "Packed",
    desc: "Seller is preparing your package",
  },
  {
    key: "shipped",
    label: "Shipped",
    desc: "Package has left the warehouse",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    desc: "Rider is on the way",
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Your order has been delivered successfully.",
  },
];

const cancelledSteps = [
  {
    key: "processing",
    label: "Ordered",
    desc: "Your order has been placed",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    desc: "Your order has been cancelled.",
  },
];

function OrderStatusTracker({
  currentStatus,
  estimatedDelivery,
  steps: customSteps
}) {
  const { isDark } = useTheme();

  const isCancelled = currentStatus === "cancelled";

  const steps = useMemo(() => {
    if (Array.isArray(customSteps) && customSteps.length > 0) return customSteps;
    return isCancelled ? cancelledSteps : defaultSteps;
  }, [customSteps, isCancelled]);

  const totalSteps = steps.length;
  const lastStepIndex = Math.max(totalSteps - 1, 0);

  const currentStepIndex = steps.findIndex((step) => step.key === currentStatus);
  const safeCurrentStep = currentStepIndex === -1 ? 0 : currentStepIndex;

  const progress = useMemo(() => {
    if (totalSteps <= 1) return 100;

    const isLast = safeCurrentStep >= lastStepIndex;
    const rawProgress =
      ((safeCurrentStep + (isLast ? 0 : 0.5)) / lastStepIndex) * 100;

    return Math.max(0, Math.min(rawProgress, 100));
  }, [safeCurrentStep, lastStepIndex, totalSteps]);

  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const controls = animate(animatedProgress, progress, {
      duration: 6,
      ease: "easeInOut",
      onUpdate(value) {
        setAnimatedProgress(value);
      },
    });

    return () => controls.stop();
  }, [progress]);

  const lineInset = totalSteps > 1 ? `${100 / (totalSteps * 2)}%` : "50%";

  const getStepPercent = (index) => {
    if (totalSteps <= 1) return 100;
    return (index / lastStepIndex) * 100;
  };

  const getPrevStepPercent = (index) => {
    if (totalSteps <= 1 || index === 0) return 0;
    return ((index - 1) / lastStepIndex) * 100;
  };

  return (
    <div
      className={`w-full rounded-md border-2 p-5 ${isDark ? "border-gray-800 bg-[#0F172A95]" : "border-gray-100 bg-white"
        }`}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className={`text-lg sm:text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"
              }`}
          >
            Track your order
          </h2>

          {!isCancelled && (
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Estimated delivery:{" "}
              <span
                className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"
                  }`}
              >
                {estimatedDelivery}
              </span>
            </p>
          )}
        </div>

        <span
          className={`w-fit rounded-full border px-4 py-1.5 text-sm font-medium ${isCancelled
              ? isDark
                ? "border-red-400 bg-red-600/10 text-red-500"
                : "border-red-200 bg-red-50 text-red-600"
              : isDark
                ? "border-green-400 bg-green-600/10 text-green-500"
                : "border-green-200 bg-green-50 text-green-600"
            }`}
        >
          {currentStatus?.charAt(0)?.toUpperCase() + currentStatus?.slice(1) || "Processing"}
        </span>
      </div>

      {/* Desktop / Tablet */}
      <div className="relative hidden md:block">
        {totalSteps > 1 && (
          <>
            <div
              className={`absolute top-[9px] h-[2px] rounded-full ${isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
              style={{ left: lineInset, right: lineInset }}
            />

            <div
              className="absolute top-[9px] h-[2px]"
              style={{ left: lineInset, right: lineInset }}
            >
              <motion.div
                className={`h-full rounded-full bg-green-500`}
                initial={{ width: 0 }}
                animate={{ width: `${animatedProgress}%` }}
                transition={{ duration: 0 }}
              />
            </div>
          </>
        )}

        <div
          className="relative grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))`,
          }}
        >
          {steps.map((step, index) => {
            const stepPercent = getStepPercent(index);
            const prevStepPercent = getPrevStepPercent(index);

            const isCompleted =
              totalSteps === 1 ? true : animatedProgress >= stepPercent;

            const isCurrent =
              totalSteps === 1
                ? false
                : animatedProgress >= prevStepPercent &&
                animatedProgress < stepPercent;

            const isCancelledStep = step.key === "cancelled";

            return (
              <div
                key={step.key}
                className="flex min-w-0 flex-col items-center text-center"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.08, 1] : 1,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: isCurrent ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 ${isCompleted
                      ? isCancelledStep
                        ? "border-red-500 bg-red-500"
                        : "border-green-500 bg-green-500"
                      : isDark
                        ? "border-gray-600 bg-slate-900"
                        : "border-gray-300 bg-white"
                    }`}
                >
                  {isCompleted && <FaCheck className="text-[10px] text-white" />}

                  {isCurrent && !isCompleted && (
                    <span className={`absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full  ${isDark? "bg-gray-700" : "bg-gray-300"}`} />
                  )}
                </motion.div>

                <h3
                  className={`mt-3 text-sm font-medium wrap-break-words ${isCompleted
                      ? isDark
                        ? "text-gray-100"
                        : "text-gray-800"
                      : "text-gray-400"
                    }`}
                >
                  {step.label}
                </h3>

                <p
                  className={`mt-1 max-w-40 text-[11px] leading-4 wrap-break-words ${isCompleted
                      ? isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                      : "text-gray-400"
                    }`}
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="relative ml-1">
          {totalSteps > 1 && (
            <>
              <div
                className={`absolute left-[7px] top-[8px] bottom-[8px] w-[2px] rounded-full ${isDark ? "bg-gray-700" : "bg-gray-300"
                  }`}
                style={{ bottom: lineInset }}
              />

              <div className="absolute left-[7px] top-[8px] bottom-[8px] w-[2px] overflow-hidden"
                style={{ bottom: lineInset }}
              >
                <motion.div
                  className={`w-full rounded-full bg-green-500`}
                  initial={{ height: 0 }}
                  animate={{ height: `${animatedProgress}%` }}
                  transition={{ duration: 0 }}
                />
              </div>
            </>
          )}

          <div className="space-y-6">
            {steps.map((step, index) => {
              const stepPercent = getStepPercent(index);
              const prevStepPercent = getPrevStepPercent(index);

              const isCompleted =
                totalSteps === 1 ? true : animatedProgress >= stepPercent;

              const isCurrent =
                totalSteps === 1
                  ? false
                  : animatedProgress >= prevStepPercent &&
                  animatedProgress < stepPercent;

              const isCancelledStep = step.key === "cancelled";

              return (
                <div key={step.key} className="relative flex gap-4">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? [1, 1.08, 1] : 1,
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: isCurrent ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                    className={`relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${isCompleted
                        ? isCancelledStep
                          ? "border-red-500 bg-red-500"
                          : "border-green-500 bg-green-500"
                        : isDark
                          ? "border-gray-600 bg-slate-900"
                          : "border-gray-300 bg-white"
                      }`}
                  >
                    {isCompleted && <FaCheck className="text-[8px] text-white" />}

                    {isCurrent && !isCompleted && (
                      <span
                        className={`absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${isCancelled ? "bg-red-500" : "bg-green-500"
                          }`}
                      />
                    )}
                  </motion.div>

                  <div className="pb-1 min-w-0">
                    <h3
                      className={`text-sm font-medium break-words ${isCompleted
                          ? isDark
                            ? "text-gray-100"
                            : "text-gray-800"
                          : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </h3>
                    <p
                      className={`text-xs leading-5 break-words ${isCompleted
                          ? isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                          : "text-gray-400"
                        }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusTracker;