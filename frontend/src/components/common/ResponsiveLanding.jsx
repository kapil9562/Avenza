import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {Hero} from "..";

function ResponsiveLanding() {
  const [isMdUp, setIsMdUp] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMdUp(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMdUp ? <Hero /> : <Navigate to="/home" replace />;
}

export default ResponsiveLanding;