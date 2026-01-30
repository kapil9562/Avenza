import { useEffect, useRef, useState } from "react";
import "./index.css";
import { Header } from "./components";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import SideMenu from "./components/sideMenu/SideMenu";

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
    </div>
  );
}

export default App;