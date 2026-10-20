import React from 'react';
import { X, Sparkles } from 'lucide-react';

export const NoticeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-b from-[#1b2b48] to-[#0a1128] border-2 border-yellow-400 rounded-2xl w-full max-w-xs p-5 shadow-2xl relative text-center">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-yellow-400 mb-2">Welcome Notice</h3>
        <p className="text-xs text-gray-200 leading-relaxed mb-4">
          Experience authentic Ludo with Pass & Play, AI challenges, and 1-Goti blitz. Virtual coins carry zero monetary risk.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-yellow-400 text-gray-950 font-black rounded-xl text-xs uppercase tracking-wider"
        >
          Happy Gaming
        </button>
      </div>
    </div>
  );
};
