import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import { Header } from "./components";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import SideMenu from "./components/sideMenu/SideMenu";
import Snowfall from "react-snowfall";
import flowerSrc from "./assets/flower.png";

function App() {
  const { isDark } = useTheme();
  const { pathname } = useLocation();
  const scrollRef = useRef(null);
  const [show, setShow] = useState(false);

  const [activeTab, setActiveTab] = useState("HOME");

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const flowerImage = useMemo(() => {
    const img = new Image();
    img.src = flowerSrc;
    img.onload = () => { };
    return img;
  }, []);


  return (
    <div
      ref={scrollRef}
      className={`h-screen overflow-y-scroll custom-scroll will-change-scroll`}
      style={{
        scrollbarColor: isDark
          ? "#c562b0d7 #0F172A"
          : "#c562b0d7 transparent",
        scrollbarWidth: "thin",
      }}
    >
      <Header activeTab={activeTab} setShow={setShow} setActiveTab={setActiveTab} />
      <main className="grow">
        <Outlet context={{ activeTab, setActiveTab, scrollRef }} />
      </main>
      <SideMenu activeTab={activeTab} setShow={setShow} setActiveTab={setActiveTab} show={show} />
      <Snowfall
        snowflakeCount={6}
        images={[flowerImage]}
        speed={[0.5, 1.5]}
        wind={[-0.5, 0.5]}
        radius={[10, 15]}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9999,

          maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
        }}
      />

    </div>
  );
}

export default App;