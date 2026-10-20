import React, { useState } from 'react';
import { Trophy, Users, Dices, PlayCircle, MessageSquare, Send, ShieldCheck, Wallet } from 'lucide-react';
import { TopProfileBar } from '../components/lobby/TopProfileBar';
import { PromoBanner } from '../components/lobby/PromoBanner';
import { GameModeCard } from '../components/lobby/GameModeCard';
import { NoticeModal } from '../components/modals/NoticeModal';
import { BetSelectionModal } from '../components/modals/BetSelectionModal';
import { PassAndPlaySetupModal } from '../components/modals/PassAndPlaySetupModal';
import { StoreModal } from '../components/modals/StoreModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { RewardedAdModal } from '../components/modals/RewardedAdModal';
import { GameMode } from '../types/game';

interface Props {
  onStartGame: (mode: GameMode, players: any[], fee?: number, prize?: number) => void;
  onOpenAdmin: () => void;
}

export const LobbyPage: React.FC<Props> = ({ onStartGame, onOpenAdmin }) => {
  const [showNotice, setShowNotice] = useState(true);
  const [showStore, setShowStore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [selectedBetMode, setSelectedBetMode] = useState<GameMode | null>(null);
  const [showPassPlay, setShowPassPlay] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#070d18] text-white select-none pb-6">
      {/* Top Profile Header */}
      <TopProfileBar
        onOpenWallet={() => setShowStore(true)}
        onOpenStore={() => setShowStore(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Marquee Ticker */}
      <div className="bg-[#0b172a] border-y border-yellow-500/20 py-1 px-3 overflow-hidden whitespace-nowrap">
        <p className="text-[11px] font-semibold text-yellow-400 animate-pulse">
          ★ Welcome to Reddy Anna Ludo | Complete 2 Rewarded Ads to Play Free | Virtual Coins Only ★
        </p>
      </div>

      {/* Dynamic Promo Banner */}
      <PromoBanner onClaimFree={() => setShowAdModal(true)} />

      {/* Quick Action Bar */}
      <div className="flex gap-2 px-3 pt-3">
        <button
          onClick={() => setShowAdModal(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 border border-blue-400/40 text-xs font-bold"
        >
          <PlayCircle className="w-4 h-4 text-yellow-400" />
          Free Unlock
        </button>
        <button
          onClick={() => setShowStore(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 border border-yellow-300 text-xs font-bold text-gray-950"
        >
          <Wallet className="w-4 h-4 text-gray-950" />
          Virtual Coins
        </button>
      </div>

      {/* 4 Primary Game Mode Cards */}
      <main className="grid grid-cols-2 gap-3 p-3 mt-1">
        <GameModeCard
          title="Classic"
          subtitle="4 Tokens Run"
          icon={<Trophy className="w-6 h-6" />}
          badge="Popular"
          onClick={() => setSelectedBetMode('CLASSIC')}
        />
        <GameModeCard
          title="1 Goti"
          subtitle="Fast Match"
          icon={<Dices className="w-6 h-6" />}
          onClick={() => setSelectedBetMode('ONE_GOTI')}
        />
        <GameModeCard
          title="2 Goti"
          subtitle="Quick Battles"
          icon={<Users className="w-6 h-6" />}
          badge="Live"
          onClick={() => setSelectedBetMode('TWO_GOTI')}
        />
        <GameModeCard
          title="Pass & Play"
          subtitle="Local Offline"
          icon={<PlayCircle className="w-6 h-6" />}
          onClick={() => setShowPassPlay(true)}
        />
      </main>

      {/* Support / Telegram / WhatsApp Footer */}
      <footer className="mt-auto px-4 flex flex-col items-center gap-2">
        <span className="text-[11px] text-gray-400 font-medium">Need Help? Connect With Us</span>
        <div className="flex gap-4">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow"
          >
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-600/90 text-white text-xs font-bold shadow"
          >
            <Send className="w-4 h-4" /> Telegram
          </a>
        </div>
        <button
          onClick={onOpenAdmin}
          className="mt-2 text-[10px] text-gray-500 hover:text-yellow-400 flex items-center gap-1"
        >
          <ShieldCheck className="w-3 h-3" /> Admin Portal
        </button>
      </footer>

      {/* Modals */}
      {showNotice && <NoticeModal onClose={() => setShowNotice(false)} />}
      {showStore && <StoreModal onClose={() => setShowStore(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAdModal && <RewardedAdModal onClose={() => setShowAdModal(false)} />}
      {selectedBetMode && (
        <BetSelectionModal
          mode={selectedBetMode}
          onClose={() => setSelectedBetMode(null)}
          onStart={(players, fee, prize) => {
            const m = selectedBetMode;
            setSelectedBetMode(null);
            onStartGame(m, players, fee, prize);
          }}
        />
      )}
      {showPassPlay && (
        <PassAndPlaySetupModal
          onClose={() => setShowPassPlay(false)}
          onStart={(players) => {
            setShowPassPlay(false);
            onStartGame('PASS_AND_PLAY', players);
          }}
        />
      )}
    </div>
  );
};
