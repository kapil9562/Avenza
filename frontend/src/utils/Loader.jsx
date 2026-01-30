import Lottie from "lottie-react";
import loaderAnimation from "../assets/loader.json";

const Loader = () => {
  return (
    <div className="absolute flex items-center justify-center h-screen backdrop-blur-xs w-full z-999">
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        className="w-35 h-35 hue-rotate-90"
      />
    </div>
  );
};

export default Loader;