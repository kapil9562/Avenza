import { useState } from "react";
import l1 from '../assets/1.png'
import l2 from '../assets/2.png'
import l3 from '../assets/3.png'
import l4 from '../assets/4.png'
import d1 from '../assets/d1.png'
import d2 from '../assets/d2.png'
import d3 from '../assets/d3.png'
import d4 from '../assets/d4.png'
import { useTheme } from "../context/ThemeContext";

const bgImages = [l1, l2, l3, l4];
const darkBgImages = [d1, d2, d3, d4];

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
