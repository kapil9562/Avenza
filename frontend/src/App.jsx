import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import { Footer, Header, SideMenu } from "./components";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Snowfall from "react-snowfall";

function App() {
  const { isDark } = useTheme();
  const { pathname } = useLocation();
  const scrollRef = useRef(null);
  const [show, setShow] = useState(false);

  const { category } = useParams();

  const [activeTab, setActiveTab] = useState(category ? category : "HOME");

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const flowerImage = useMemo(() => {
    const img = new Image();
    img.src = '/assets/flower.png';
    img.onload = () => { };
    return img;
  }, []);


  return (
    <>
      <div
        ref={scrollRef}
        className={`h-dvh overflow-y-scroll custom-scroll scroll-smooth will-change-scroll transform-gpu overflow-x-hidden`}
        style={{
          scrollbarColor: isDark
            ? "#c562b0d7 #0F172A"
            : "#c562b0d7 transparent",
          scrollbarWidth: "thin",
        }}
      >
        <Header activeTab={activeTab} setShow={setShow} setActiveTab={setActiveTab} />
        <main className="grow lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)]">
          <Outlet context={{ activeTab, setActiveTab, scrollRef }} />
        </main>
        <Footer setActiveTab={setActiveTab} scrollRef={scrollRef} />
      </div>
      <SideMenu activeTab={activeTab} setShow={setShow} setActiveTab={setActiveTab} show={show} />
      <Snowfall
        snowflakeCount={6}
        images={[flowerImage]}
        speed={[0.5, 1.5]}
        wind={[-0.5, 0.5]}
        radius={[10, 15]}
        className="absolute top-0 pointer-events-none"
        style={{
          zIndex: 9999,

          maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
        }}
      />
    </>
  );
}

export default App;