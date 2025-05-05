import React, { useState, useEffect } from "react";
import { PiGear, PiMagnifyingGlass } from "react-icons/pi";

const LoaderFeedback = ({ uiConfig, language = "EN" }) => {
  const [isSearching, setIsSearching] = useState(true);
  const [popClass, setPopClass] = useState("popIn");
  const [textOpacity, setTextOpacity] = useState(1);
  const [displayText, setDisplayText] = useState("Analizando...");

  const textMappings = {
    "Analizando...": {
      EN: "Analyzing...",
      ES: "Analizando...",
      FR: "Analyse en cours...",
      IT: "Analizzando...",
      CA: "Analitzant...",
      PT: "Analisando...",
    },
    "Buscando información...": {
      EN: "Searching for information...",
      ES: "Buscando información...",
      FR: "Recherche d'informations...",
      IT: "Cercando informazioni...",
      CA: "Cercant informació...",
      PT: "Procurando informações...",
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Fade out del texto
      setTextOpacity(0);

      // 2. Pop out del icono
      setPopClass("popOut");

      setTimeout(() => {
        // 3. Cambio de estado isSearching
        setIsSearching((prev) => !prev);

        // 4. Actualizar texto según el estado
        setDisplayText((prev) =>
          prev === "Analizando..." ? "Buscando información..." : "Analizando..."
        );

        // 5. Pop in del icono
        setPopClass("popIn");

        // 6. Fade in del texto
        setTextOpacity(1);
      }, 500); // Este timeout coincide con la duración del popOut
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          position: "relative",
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <div
          className={`pop-wrapper ${popClass}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "16px",
              height: "16px",
              animation: isSearching
                ? "gearBurst 4s ease-in-out infinite"
                : "swayIcon 4s ease-in-out infinite",
              transformOrigin: "center",
            }}
          >
            {isSearching ? (
              <PiGear size={16} color="#000" />
            ) : (
              <PiMagnifyingGlass size={16} color="#000" />
            )}
          </div>
        </div>

        <svg
          viewBox="0 0 36 36"
          style={{
            position: "absolute",
            width: "28px",
            height: "28px",
            transform: "rotate(-90deg)",
          }}
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#ddd"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeDasharray="101"
            strokeDashoffset="101"
            style={{
              animation:
                "progressFillEase 4s cubic-bezier(0.5, 0, 0.5, 1) infinite",
            }}
          />
        </svg>
      </div>

      <span
        style={{
          fontSize: "14px",
          fontFamily: "Inter",
          backgroundImage:
            "linear-gradient(90deg, #bbb 0%, #bbb 40%, #333 50%, #bbb 60%, #bbb 100%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "100% 0",
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          animation: "textShineLinear 1.5s linear infinite",
          opacity: textOpacity,
          transition: "opacity 0.25s ease-in-out",
        }}
      >
        {uiConfig.multilanguage && language
          ? textMappings[displayText][language]
          : textMappings[displayText]["ES"]}
      </span>

      <style>{`
        @keyframes progressFillEase {
          0% { stroke-dashoffset: 101; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes textShineLinear {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        @keyframes gearBurst {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(0deg); }
          35% { transform: rotate(360deg); }
          55% { transform: rotate(360deg); }
          75% { transform: rotate(720deg); }
          90% { transform: rotate(720deg); }
          100% { transform: rotate(720deg); }
        }

        @keyframes swayIcon {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, -1px); }
          50% { transform: translate(-1px, 1px); }
          75% { transform: translate(1px, -1px); }
          100% { transform: translate(0, 0); }
        }

        @keyframes popIn {
          0% { transform: scale(0); opacity: 1; }
          25% { transform: scale(1.25); opacity: 1; }
          50% { transform: scale(0.9); opacity: 1; }
          75% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes popOut {
          0% { transform: scale(1); opacity: 1; }
          25% { transform: scale(1.05); opacity: 1; }
          50% { transform: scale(0.9); opacity: 1; }
          75% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(0); opacity: 1; }
        }

        .pop-wrapper.popIn {
          animation: popIn 0.5s ease forwards;
        }

        .pop-wrapper.popOut {
          animation: popOut 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default LoaderFeedback;
