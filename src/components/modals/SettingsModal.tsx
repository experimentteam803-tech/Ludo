import React, { useState } from 'react';
import { X, Volume2, Music, Shield, FileText } from 'lucide-react';
import { audioManager } from '../../services/audio/audioManager';

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [sfx, setSfx] = useState(!audioManager.isMuted);
  const [music, setMusic] = useState(!audioManager.musicMuted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black text-yellow-400">SETTINGS</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2.5 bg-[#15233e] rounded-xl border border-gray-700">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-white">Sound Effects</span>
            </div>
            <button
              onClick={() => {
                audioManager.isMuted = sfx;
                setSfx(!sfx);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                sfx ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {sfx ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#15233e] rounded-xl border border-gray-700">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-white">Lobby Music</span>
            </div>
            <button
              onClick={() => {
                audioManager.musicMuted = music;
                setMusic(!music);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                music ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {music ? 'ON' : 'OFF'}
            </button>
          </div>

          <a
            href="#terms"
            className="flex items-center justify-between p-2.5 bg-[#15233e] rounded-xl border border-gray-700 text-xs font-bold text-gray-300"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-yellow-400" />
              <span>Terms of Service</span>
            </div>
            <span className="text-gray-500">Read</span>
          </a>

          <a
            href="#privacy"
            className="flex items-center justify-between p-2.5 bg-[#15233e] rounded-xl border border-gray-700 text-xs font-bold text-gray-300"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>Fair Play & Privacy</span>
            </div>
            <span className="text-gray-500">Read</span>
          </a>
        </div>
      </div>
    </div>
  );
};
