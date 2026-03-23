import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Hero } from "..";

function ResponsiveLanding() {
  const [isMobile] = useState(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua);
  });

  return isMobile ? <Navigate to="/home" replace /> : <Hero />;
}

export default ResponsiveLanding;