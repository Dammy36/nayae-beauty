import { useEffect, useRef, useState } from "react";

// Adds a fade-and-rise-in effect the first time a section scrolls into
// view (see the "reveal" styles in global.css). Give the returned ref
// and className to the section's own top-level element - no extra
// wrapper div needed, so it never disturbs the section's own layout.
export function useReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Reveals once and stays revealed - scrolling back up
          // shouldn't hide content the visitor already saw.
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, className: isVisible ? "reveal reveal--visible" : "reveal" };
}
