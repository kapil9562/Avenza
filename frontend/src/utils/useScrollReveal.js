import { useEffect, useRef, useState } from "react";

const useScrollReveal = (scrollRef, threshold = 0.3) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const container = scrollRef?.current || null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // re-trigger every time
        setShow(entry.isIntersecting);
      },
      {
        threshold,
        root: container,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [scrollRef, threshold]);

  return { ref, show };
};

export default useScrollReveal;
