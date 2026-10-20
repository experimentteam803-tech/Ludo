import React, { useState } from 'react';
import { ArrowLeft, Users, ShieldAlert, Award, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [adCooldownMinutes, setAdCooldownMinutes] = useState(60);
  const [adsRequired, setAdsRequired] = useState(2);
  const [mockUsers] = useState([
    { uid: 'u101', name: 'Arif Khan', coins: 80, role: 'USER' },
    { uid: 'u102', name: 'Suresh Raina', coins: 1540, role: 'USER' },
    { uid: 'u103', name: 'System Admin', coins: 99999, role: 'ADMIN' },
  ]);

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4">
      {/* Admin Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <button onClick={onBack} className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to App
        </button>
        <span className="text-xs font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded">
          SECURE ADMIN CONSOLE
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rewarded Ads & Cooldown Config */}
        <div className="bg-[#0f1b33] p-4 rounded-xl border border-yellow-500/30">
          <h3 className="text-sm font-black text-yellow-400 flex items-center gap-2 mb-3">
            <Award className="w-4 h-4" /> Rewarded Ad Policy
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Required Ads for Free Pass</label>
              <input
                type="number"
                value={adsRequired}
                onChange={(e) => setAdsRequired(Number(e.target.value))}
                className="w-full bg-black/50 border border-gray-700 rounded p-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Pass Cooldown (Minutes)</label>
              <input
                type="number"
                value={adCooldownMinutes}
                onChange={(e) => setAdCooldownMinutes(Number(e.target.value))}
                className="w-full bg-black/50 border border-gray-700 rounded p-1.5 text-white"
              />
            </div>
            <button
              onClick={() => alert('Ad policy updated successfully!')}
              className="py-1.5 px-4 bg-yellow-400 text-gray-950 font-bold rounded text-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* User Search & Ledger Inspection */}
        <div className="bg-[#0f1b33] p-4 rounded-xl border border-yellow-500/30">
          <h3 className="text-sm font-black text-yellow-400 flex items-center gap-2 mb-3">
            <Users className="w-4 h-4" /> Registered Players Ledger
          </h3>
          <div className="space-y-2">
            {mockUsers.map((u) => (
              <div key={u.uid} className="flex justify-between items-center p-2 rounded bg-black/40 text-xs">
                <div>
                  <p className="font-bold text-white">{u.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{u.uid}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-yellow-400">₹{u.coins}</p>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-300">{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
