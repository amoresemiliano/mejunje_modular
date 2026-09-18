import React from "react";

interface ProductVisualProps {
  type?: "candle" | "diffuser" | "spray" | "textile" | "blend";
  name: string;
  notes?: string[];
  accentColor?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type = "candle",
  name,
  notes = [],
  accentColor = "#C87D38",
  className = "",
  size = "md",
}) => {
  const noteText = notes.slice(0, 2).join(" · ").toUpperCase();
  const initials = name
    .split(" ")
    .slice(1, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "MJ";

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden transition-transform duration-500 hover:scale-105 ${className}`}
    >
      {/* Background organic botanical aura */}
      <div
        className="absolute inset-0 opacity-20 blur-2xl rounded-full transform scale-75 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {type === "candle" && (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-64 drop-shadow-md">
          <defs>
            <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C87D38" />
              <stop offset="40%" stopColor="#9E5A20" />
              <stop offset="100%" stopColor="#4A2609" />
            </linearGradient>
            <linearGradient id="waxGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF8EE" />
              <stop offset="100%" stopColor="#ECDCC7" />
            </linearGradient>
            <linearGradient id="flameGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBE6" />
              <stop offset="50%" stopColor="#FFC83B" />
              <stop offset="100%" stopColor="#E65100" />
            </linearGradient>
            <filter id="flameBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>

          {/* Flame Halo */}
          <circle cx="100" cy="50" r="18" fill="#FFE082" opacity="0.25" filter="url(#flameBlur)" />
          {/* Flame */}
          <path
            d="M100,32 C104,42 108,48 100,58 C92,48 96,42 100,32 Z"
            fill="url(#flameGlow)"
          />
          {/* Wooden Wick */}
          <rect x="98.5" y="55" width="3" height="12" fill="#5D4037" rx="0.5" />

          {/* Amber Jar Outer Rim */}
          <ellipse cx="100" cy="70" rx="48" ry="12" fill="#783F04" opacity="0.6" />
          {/* Wax Surface */}
          <ellipse cx="100" cy="70" rx="44" ry="10" fill="url(#waxGlow)" />

          {/* Jar Body */}
          <path
            d="M52,70 L52,190 C52,204 148,204 148,190 L148,70 Z"
            fill="url(#amberGlass)"
            opacity="0.95"
          />

          {/* Glass Highlight */}
          <path
            d="M58,74 L58,186 C58,192 68,196 68,190 L68,76 Z"
            fill="#FFFFFF"
            opacity="0.15"
          />

          {/* Paper Label (Handmade tactile cotton look) */}
          <rect x="64" y="96" width="72" height="78" fill="#FAF7F0" rx="1.5" stroke="#E4DCCE" strokeWidth="0.8" />
          <line x1="68" y1="102" x2="132" y2="102" stroke="#2B2927" strokeWidth="0.5" strokeDasharray="1.5 1.5" />

          {/* Label Typewriter Text */}
          <text x="100" y="114" textAnchor="middle" fontSize="6.5" fontFamily="Courier, monospace" fontWeight="bold" fill="#2B2927" letterSpacing="0.8">
            MEJUNJE
          </text>
          <text x="100" y="122" textAnchor="middle" fontSize="4.5" fontFamily="Courier, monospace" fill="#6B6760" letterSpacing="0.5">
            BUENOS AIRES
          </text>
          <line x1="78" y1="126" x2="122" y2="126" stroke="#C87D38" strokeWidth="0.6" />
          <text x="100" y="136" textAnchor="middle" fontSize="5.5" fontFamily="Courier, monospace" fontWeight="600" fill="#2B2927">
            {initials} · BOTÁNICA
          </text>
          <text x="100" y="145" textAnchor="middle" fontSize="3.8" fontFamily="Courier, monospace" fill="#6B6760">
            {noteText.slice(0, 18) || "CERA PURA DE SOJA"}
          </text>
          <text x="100" y="153" textAnchor="middle" fontSize="3.5" fontFamily="Courier, monospace" fill="#9C9890">
            250g · PABILO MADERA
          </text>
          <text x="100" y="166" textAnchor="middle" fontSize="4" fontFamily="Courier, monospace" fill="#C87D38" fontWeight="bold">
            N° 04 / ATELIER
          </text>
        </svg>
      )}

      {type === "diffuser" && (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-64 drop-shadow-md">
          <defs>
            <linearGradient id="diffuserLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5D99B" />
              <stop offset="100%" stopColor="#C87D38" />
            </linearGradient>
            <linearGradient id="glassApothecary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9E5A20" />
              <stop offset="50%" stopColor="#D8934E" />
              <stop offset="100%" stopColor="#5D3008" />
            </linearGradient>
          </defs>

          {/* Rattan Reeds */}
          <line x1="100" y1="110" x2="60" y2="18" stroke="#D7C4A5" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="110" x2="78" y2="10" stroke="#C2AC8A" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="100" y1="110" x2="100" y2="8" stroke="#E3D5BE" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="110" x2="122" y2="12" stroke="#C2AC8A" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="100" y1="110" x2="140" y2="20" stroke="#D7C4A5" strokeWidth="3" strokeLinecap="round" />

          {/* Diffuser Bottle Neck */}
          <rect x="88" y="100" width="24" height="18" fill="#5D3008" rx="2" />
          <ellipse cx="100" cy="100" rx="14" ry="4" fill="#3D1D04" />

          {/* Glass Bottle Body */}
          <path
            d="M62,118 C62,114 74,112 88,114 L112,114 C126,112 138,114 138,118 L142,198 C142,208 58,208 58,198 Z"
            fill="url(#glassApothecary)"
            opacity="0.95"
          />

          {/* Liquid Level inside */}
          <ellipse cx="100" cy="140" rx="35" ry="6" fill="#FFE2A4" opacity="0.3" />
          <path
            d="M65,140 L65,196 C65,203 135,203 135,196 L135,140 Z"
            fill="url(#diffuserLiquid)"
            opacity="0.35"
          />

          {/* Glass Specular Reflection */}
          <path d="M68,122 L68,194 C68,198 75,200 75,194 L75,124 Z" fill="#FFFFFF" opacity="0.18" />

          {/* Typewriter Label */}
          <rect x="72" y="142" width="56" height="48" fill="#FAF7F0" rx="1.5" stroke="#E4DCCE" strokeWidth="0.8" />
          <text x="100" y="154" textAnchor="middle" fontSize="5.5" fontFamily="Courier, monospace" fontWeight="bold" fill="#2B2927" letterSpacing="0.8">
            MEJUNJE
          </text>
          <text x="100" y="161" textAnchor="middle" fontSize="4" fontFamily="Courier, monospace" fill="#6B6760">
            DIFUSOR BOTÁNICO
          </text>
          <line x1="80" y1="164" x2="120" y2="164" stroke="#8F9E84" strokeWidth="0.5" />
          <text x="100" y="172" textAnchor="middle" fontSize="4.5" fontFamily="Courier, monospace" fontWeight="600" fill="#2B2927">
            200 ML · 8 VARILLAS
          </text>
          <text x="100" y="180" textAnchor="middle" fontSize="3.5" fontFamily="Courier, monospace" fill="#8F9E84" fontWeight="bold">
            VARILLAS DE RATÁN
          </text>
        </svg>
      )}

      {type === "spray" && (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-64 drop-shadow-md">
          <defs>
            <linearGradient id="sprayGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E3D2F" />
              <stop offset="50%" stopColor="#4F6650" />
              <stop offset="100%" stopColor="#1B241C" />
            </linearGradient>
          </defs>

          {/* Trigger Spray Cap */}
          <rect x="90" y="52" width="20" height="24" fill="#232220" rx="1" />
          <path d="M82,52 L124,52 L120,40 L76,40 Z" fill="#2B2927" />
          {/* Nozzle */}
          <rect x="68" y="42" width="10" height="8" fill="#1A1918" rx="1" />
          <circle cx="68" cy="46" r="1.5" fill="#D4A346" />
          {/* Trigger Handle */}
          <path d="M84,54 C74,65 72,82 74,90 C76,92 80,90 80,84 C78,76 82,64 88,58 Z" fill="#383633" />

          {/* Glass Bottle */}
          <path
            d="M70,82 C70,76 80,74 90,74 L110,74 C120,74 130,76 130,82 L134,204 C134,212 66,212 66,204 Z"
            fill="url(#sprayGlass)"
            opacity="0.95"
          />

          {/* Glass highlight */}
          <path d="M74,86 L74,200 C74,204 80,206 80,200 L80,88 Z" fill="#FFFFFF" opacity="0.15" />

          {/* Cotton Label */}
          <rect x="76" y="112" width="48" height="66" fill="#FAF7F0" rx="1.5" stroke="#E4DCCE" strokeWidth="0.8" />
          <text x="100" y="125" textAnchor="middle" fontSize="5.5" fontFamily="Courier, monospace" fontWeight="bold" fill="#2B2927" letterSpacing="0.8">
            MEJUNJE
          </text>
          <text x="100" y="133" textAnchor="middle" fontSize="4" fontFamily="Courier, monospace" fill="#6B6760">
            HOME SPRAY
          </text>
          <line x1="82" y1="137" x2="118" y2="137" stroke="#2E3D2F" strokeWidth="0.5" />
          <text x="100" y="147" textAnchor="middle" fontSize="4.5" fontFamily="Courier, monospace" fontWeight="600" fill="#2B2927">
            250 ML
          </text>
          <text x="100" y="156" textAnchor="middle" fontSize="3.6" fontFamily="Courier, monospace" fill="#6B6760">
            BRUMA BOTÁNICA
          </text>
          <text x="100" y="167" textAnchor="middle" fontSize="3.5" fontFamily="Courier, monospace" fill="#2E3D2F" fontWeight="bold">
            BAUTISMO VEGETAL
          </text>
        </svg>
      )}

      {type === "textile" && (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-64 drop-shadow-md">
          <defs>
            <linearGradient id="textileAmber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9E4738" />
              <stop offset="50%" stopColor="#D47363" />
              <stop offset="100%" stopColor="#6E2B20" />
            </linearGradient>
          </defs>

          {/* Fine Mist Atomizer */}
          <rect x="91" y="48" width="18" height="28" fill="#1C1B1A" rx="1" />
          <rect x="88" y="38" width="24" height="12" fill="#D4A346" rx="1.5" />
          <rect x="93" y="24" width="14" height="16" fill="#1C1B1A" rx="2" />
          <circle cx="100" cy="30" r="1.5" fill="#FAF8F5" />

          {/* Bottle Body */}
          <path
            d="M68,80 C68,74 80,72 90,72 L110,72 C120,72 132,74 132,80 L136,204 C136,212 64,212 64,204 Z"
            fill="url(#textileAmber)"
            opacity="0.95"
          />

          {/* Glass Highlight */}
          <path d="M72,84 L72,200 C72,204 78,206 78,200 L78,86 Z" fill="#FFFFFF" opacity="0.18" />

          {/* Cotton Label */}
          <rect x="74" y="108" width="52" height="70" fill="#FAF7F0" rx="1.5" stroke="#E4DCCE" strokeWidth="0.8" />
          <text x="100" y="122" textAnchor="middle" fontSize="5.5" fontFamily="Courier, monospace" fontWeight="bold" fill="#2B2927" letterSpacing="0.8">
            MEJUNJE
          </text>
          <text x="100" y="130" textAnchor="middle" fontSize="3.8" fontFamily="Courier, monospace" fill="#6B6760">
            PERFUME TEXTIL
          </text>
          <line x1="80" y1="134" x2="120" y2="134" stroke="#9E4738" strokeWidth="0.5" />
          <text x="100" y="144" textAnchor="middle" fontSize="4.5" fontFamily="Courier, monospace" fontWeight="600" fill="#2B2927">
            {initials} · LINOS & TELAS
          </text>
          <text x="100" y="153" textAnchor="middle" fontSize="3.5" fontFamily="Courier, monospace" fill="#6B6760">
            NO MANCHA SEDAS
          </text>
          <text x="100" y="165" textAnchor="middle" fontSize="3.5" fontFamily="Courier, monospace" fill="#9E4738" fontWeight="bold">
            250 ML · ATELIER
          </text>
        </svg>
      )}

      {type === "blend" && (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-64 drop-shadow-md">
          <defs>
            <linearGradient id="dropperAmber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#783F04" />
              <stop offset="50%" stopColor="#C87D38" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="lavaStone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A4744" />
              <stop offset="100%" stopColor="#201F1D" />
            </linearGradient>
          </defs>

          {/* Volcanic Porous Diffuser Stone Base */}
          <ellipse cx="100" cy="204" rx="60" ry="18" fill="url(#lavaStone)" />
          <ellipse cx="100" cy="200" rx="56" ry="14" fill="#3D3B38" />
          <circle cx="85" cy="198" r="2.5" fill="#232220" opacity="0.6" />
          <circle cx="118" cy="202" r="3" fill="#232220" opacity="0.6" />
          <circle cx="102" cy="196" r="2" fill="#232220" opacity="0.6" />

          {/* Rubber Bulb Pipette */}
          <path d="M93,52 C93,42 107,42 107,52 L105,62 L95,62 Z" fill="#1C1B1A" />
          <rect x="91" y="62" width="18" height="8" fill="#D4A346" rx="1" />

          {/* Dropper Amber Bottle */}
          <path
            d="M74,76 C74,70 84,68 91,68 L109,68 C116,68 126,70 126,76 L128,172 C128,180 72,180 72,172 Z"
            fill="url(#dropperAmber)"
            opacity="0.95"
          />

          {/* Highlight */}
          <path d="M78,80 L78,168 C78,172 83,174 83,168 L83,82 Z" fill="#FFFFFF" opacity="0.2" />

          {/* Label */}
          <rect x="80" y="96" width="40" height="58" fill="#FAF7F0" rx="1.5" stroke="#E4DCCE" strokeWidth="0.8" />
          <text x="100" y="108" textAnchor="middle" fontSize="5" fontFamily="Courier, monospace" fontWeight="bold" fill="#2B2927" letterSpacing="0.8">
            MEJUNJE
          </text>
          <text x="100" y="116" textAnchor="middle" fontSize="3.5" fontFamily="Courier, monospace" fill="#6B6760">
            BLEND PURO
          </text>
          <line x1="85" y1="120" x2="115" y2="120" stroke="#BC6C4D" strokeWidth="0.5" />
          <text x="100" y="130" textAnchor="middle" fontSize="4.2" fontFamily="Courier, monospace" fontWeight="600" fill="#2B2927">
            30 ML
          </text>
          <text x="100" y="139" textAnchor="middle" fontSize="3.2" fontFamily="Courier, monospace" fill="#BC6C4D" fontWeight="bold">
            + PIEDRA LAVA
          </text>
        </svg>
      )}
    </div>
  );
};
