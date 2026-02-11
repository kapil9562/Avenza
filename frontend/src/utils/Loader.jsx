import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const Loader = () => {
  const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch("/assets/loader.json")
            .then(res => res.json())
            .then(data => setAnimationData(data));
    }, []);

  return (
    <div className="absolute flex items-center justify-center h-screen backdrop-blur-xs w-full z-999">
      <Lottie
        animationData={animationData}
        loop={true}
        className="w-35 h-35 hue-rotate-90"
      />
    </div>
  );
};

export default Loader;