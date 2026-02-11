import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const bgImages = ['/assets/1.png', '/assets/2.png', '/assets/3.png', '/assets/4.png'];
const darkBgImages = ['/assets/d1.png', '/assets/d2.png', '/assets/d3.png', '/assets/d4.png'];

export const getBg = (index) => {
  const { isDark } = useTheme();
  if (!isDark) {
    return bgImages[index % bgImages.length]
  } else {
    return darkBgImages[index % bgImages.length]
  }
}

export default function ProductImage({ src, alt, className, idx }) {
  const [loaded, setLoaded] = useState(false);

  const {isDark} = useTheme();

  return (
    <div className="relative w-full h-50 justify-center items-center flex">

      <div className="absolute inset-0 rounded-xl h-full"
        style={{
          backgroundImage: `url(${getBg(idx)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6
        }} />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority='low'
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"
          }`}
      />
    </div>
  );
}
