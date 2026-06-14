import React from 'react';

interface GridOverlayProps {
  className?: string;
}

export default function GridOverlay({ className = "" }: GridOverlayProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} id="toaster-grid-wrapper">
      {/* Dynamic Grid Background with thin lines */}
      <div 
        className="absolute inset-0 opacity-[0.06] sm:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        id="bg-grid-mesh"
      />
      
      {/* Decorative architectural grid lines */}
      <div className="absolute inset-0 flex justify-between px-10 sm:px-20 opacity-10">
        <div className="w-[1px] h-full bg-white hidden md:block" />
        <div className="w-[1px] h-full bg-white hidden md:block" />
        <div className="w-[1px] h-full bg-white hidden md:block" />
        <div className="w-[1px] h-full bg-white hidden md:block" />
      </div>

      {/* Aesthetic glowing orbits */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#ff2e93] rounded-full filter blur-[120px] opacity-[0.08]" id="ambient-neon-glow-right" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] bg-purple-600 rounded-full filter blur-[100px] opacity-[0.05]" id="ambient-neon-glow-left" />
    </div>
  );
}
