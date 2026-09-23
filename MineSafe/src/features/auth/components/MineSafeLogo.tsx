import React from 'react';

export const MineSafeLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Visual Emblem: Geometric mountain peaks + yellow mining haul truck */}
      <div className="relative w-14 h-12 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 110 80" className="w-full h-full drop-shadow-xs">
          <defs>
            <linearGradient id="mtnLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="mtnRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="truckBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Left Dark Mountain Peak */}
          <polygon points="12,62 38,12 62,62" fill="url(#mtnLeftGrad)" />
          {/* Left Peak Highlight */}
          <polygon points="38,12 48,32 38,30 30,32" fill="#93c5fd" opacity="0.9" />
          <polygon points="38,12 44,24 38,62" fill="#1e40af" opacity="0.4" />

          {/* Right Vibrant Blue Mountain Peak */}
          <polygon points="42,62 72,16 98,62" fill="url(#mtnRightGrad)" />
          {/* Right Peak Snowcap Highlight */}
          <polygon points="72,16 82,34 72,32 64,34" fill="#ffffff" opacity="0.95" />
          <polygon points="72,16 78,30 72,62" fill="#2563eb" opacity="0.5" />

          {/* Heavy Haul Dump Truck in foreground */}
          <g transform="translate(18, 38)">
            {/* Dump bed (tilted container) */}
            <polygon points="4,10 46,6 40,24 8,24" fill="url(#truckBodyGrad)" stroke="#b45309" strokeWidth="0.75" />
            {/* Dump bed ribbing */}
            <line x1="16" y1="9" x2="18" y2="23" stroke="#b45309" strokeWidth="1" />
            <line x1="28" y1="8" x2="29" y2="23" stroke="#b45309" strokeWidth="1" />
            
            {/* Truck Cab / Driver Cabin */}
            <polygon points="44,11 58,11 60,24 40,24" fill="#f59e0b" stroke="#b45309" strokeWidth="0.75" />
            {/* Windshield */}
            <polygon points="48,13 56,13 57,18 46,18" fill="#38bdf8" />
            
            {/* Radiator Grill & Bumper */}
            <rect x="58" y="16" width="4" height="8" rx="1" fill="#475569" />
            {/* Headlights */}
            <circle cx="61" cy="18" r="1.2" fill="#fef08a" />
            
            {/* Chassis */}
            <rect x="10" y="23" width="48" height="4" fill="#1e293b" />
            
            {/* Left Giant Mining Wheel (Double) */}
            <circle cx="16" cy="27" r="6" fill="#0f172a" />
            <circle cx="16" cy="27" r="4" fill="#334155" />
            <circle cx="16" cy="27" r="2" fill="#fbbf24" />

            <circle cx="28" cy="27" r="6" fill="#0f172a" />
            <circle cx="28" cy="27" r="4" fill="#334155" />
            <circle cx="28" cy="27" r="2" fill="#fbbf24" />

            {/* Right Front Giant Wheel */}
            <circle cx="52" cy="27" r="6" fill="#0f172a" />
            <circle cx="52" cy="27" r="4" fill="#334155" />
            <circle cx="52" cy="27" r="2" fill="#fbbf24" />
          </g>
        </svg>
      </div>

      {/* Brand Title & Sub-headlines */}
      <div className="flex flex-col text-left">
        <div className="flex items-center tracking-tight leading-none">
          <span className="text-2xl font-black text-[#0f172a] tracking-tight">3RD</span>
          <span className="text-2xl font-black text-[#2563eb] tracking-tight ml-1.5">VISION</span>
        </div>
        <div className="text-xs font-bold text-slate-800 tracking-tight mt-0.5">
          AI-Powered Safety & Monitoring System
        </div>
        <div className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
          <span>Safer Mines</span>
          <span className="text-slate-300">•</span>
          <span>Smarter Operations</span>
          <span className="text-slate-300">•</span>
          <span>Sustainable Future</span>
        </div>
      </div>
    </div>
  );
};

export const ThirdVisionLogo = MineSafeLogo;

