import React, { useEffect } from 'react'
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from '../utils/OnlineStatus';
import { useTheme } from '../context/ThemeContext';

function PageNotFound({ type = "404" }) {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { isDark } = useTheme();

  useEffect(() => {
    const move = (e) => {

      const x = e.clientX;
      const y = e.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const dx = x - centerX;
      const dy = y - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

      const radius = window.innerHeight - (distance / maxDistance) * 700;

      document.documentElement.style.setProperty("--x", x + "px");
      document.documentElement.style.setProperty("--y", y + "px");
      document.documentElement.style.setProperty("--r", radius + "px");
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  useEffect(()=>{
    document.title = "Page not found | Avenza";
  },[])


  const isNetworkError = !isOnline || type === "network";

  return (
    <div
      className={`min-h-dvh w-full flex items-center justify-center overflow-hidden`}
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >

      {/* overlay */}
      <div className="w-full h-full fixed inset-0 bg-black/90 torch p-6 sm:p-8 flex-col lg:flex-row items-center gap-8 lg:gap-12">
      </div>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 text-center justify-center items-center w-full'>
        <span className='font-extrabold text-white/80  md:text-6xl text-4xl glow whitespace-nowrap'>Page Not Found</span>
        <span className='text-white text-sm'>Hmm, the page you were looking for doesn’t seem to exist anymore.</span>
        <button
          className="w-fit mt-6 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-white font-medium 
                     bg-linear-to-b from-[#7e2f22] to-[#5d192b]
                     transition-all duration-300 text-base sm:text-lg
                     active:scale-95 cursor-pointer"
          onClick={handleGoBack}
        >
          Back to Avenza
        </button>
      </div>
    </div>

  )
}

export default PageNotFound