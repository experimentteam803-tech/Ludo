import React from 'react';

interface Props {
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const GameModeCard: React.FC<Props> = ({ title, subtitle, badge, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-[#1b2a47] to-[#0f172a] border-2 border-yellow-400/80 shadow-xl active:scale-95 transition-all text-center overflow-hidden group"
    >
      {badge && (
        <span className="absolute top-1.5 right-1.5 bg-yellow-400 text-[#0d1b2a] text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 mb-1.5 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-200 p-2 flex items-center justify-center text-[#0d1b2a] shadow-md group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <span className="text-white font-extrabold text-sm tracking-wide leading-tight">{title}</span>
      <span className="text-[11px] text-yellow-400/90 font-medium">{subtitle}</span>
    </button>
  );
};
