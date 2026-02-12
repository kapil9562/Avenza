import React from 'react'
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from '../utils/OnlineStatus';

function PageNotFound({ type = "404" }) {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  // Handlers
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const isNetworkError = !isOnline || type === "network";

  return (
    <div className="notFound min-h-screen w-full flex items-center justify-center overflow-hidden p-4 sm:p-8">

      {/* Glass Card */}
      <div className="w-full max-w-6xl rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 
                  p-6 sm:p-8
                  flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">

          {/* 404 Title Row */}
          <div className="flex flex-row items-center justify-center lg:justify-start gap-3 
                      text-4xl sm:text-5xl xl:text-8xl 
                      font-bold bg-linear-to-r from-purple-300 to-white bg-clip-text text-transparent">

            <span>404</span>

            {/* linear Icon */}
            <svg width="0" height="0">
              <linearlinear id="iconlinear" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FF6A00" />
              </linearlinear>
            </svg>

            <GoAlertFill
              className="text-4xl sm:text-5xl xl:text-8xl"
              style={{ fill: "url(#iconlinear)" }}
            />

            <span className="text-xl sm:text-2xl  xl:text-4xl font-medium text-white whitespace-normal font-[Playfair_Display]">
              <span className="text-purple-300">Oops</span>! Page not found
            </span>
          </div>

          <h2 className="mt-4 text-lg sm:text-xl lg:text-3xl text-purple-100 font-semibold">
            No Internet Connection
          </h2>

          <p className="mt-3 text-sm sm:text-base text-purple-200 max-w-md mx-auto lg:mx-0">
            It seems you're disconnected. Check your network and try again.
          </p>

          {isNetworkError ? (
            <button
              className="mt-6 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-white font-medium 
                     bg-linear-to-r from-[#ff8a7a] to-[#ff5e8a]
                     transition-all duration-300 text-base sm:text-lg
                     active:scale-95"
              onClick={handleRetry}
            >
              Retry
            </button>
          ) : (
            <button
              className="mt-6 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-white font-medium 
                     bg-linear-to-r from-[#ff8a7a] to-[#ff5e8a]
                     transition-all duration-300 text-base sm:text-lg
                     active:scale-95"
              onClick={handleGoBack}
            >
              Go Back
            </button>
          )}
        </div>

        {/* Right Illustration */}
        <div className="flex-1 flex justify-center w-full">
          <img
            src='/assets/error.png'
            alt="No internet"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-lg h-auto object-contain float-img"
          />
        </div>

      </div>
    </div>

  )
}

export default PageNotFound