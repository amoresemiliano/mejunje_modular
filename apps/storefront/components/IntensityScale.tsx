import React from "react";

interface IntensityScaleProps {
  intensity: number; // 1 to 5
  showLabel?: boolean;
  className?: string;
}

export const IntensityScale: React.FC<IntensityScaleProps> = ({
  intensity,
  showLabel = true,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-[10px] font-typewriter tracking-widest text-mejunje-muted uppercase">
          <span>SUTIL</span>
          <span className="text-mejunje-charcoal font-bold">NIVEL {intensity}/5</span>
          <span>INTENSO</span>
        </div>
      )}
      <div className="flex items-center gap-1.5 py-0.5">
        {[1, 2, 3, 4, 5].map((dot) => {
          const isActive = dot <= intensity;
          return (
            <div
              key={dot}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-mejunje-amber"
                  : "bg-mejunje-borderLight"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
