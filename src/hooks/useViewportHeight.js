import { useState, useEffect } from "react";

export function useViewportHeight() {
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const update = () =>
      setVh(window.visualViewport?.height || window.innerHeight);

    // Chrome, Safari y Firefox modernos:
    window.visualViewport?.addEventListener("resize", update);
    // Compatibilidad fallback:
    window.addEventListener("resize", update);

    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return vh;
}
