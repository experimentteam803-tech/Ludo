import React, { useState } from 'react';
import { Volume2, VolumeX, LogOut } from 'lucide-react';
import { LudoCanvasBoard } from '../game/engine/LudoCanvasBoard';
import { DiceRoller } from '../game/engine/DiceRoller';
import { useGameStore } from '../stores/useGameStore';
import { audioManager } from '../services/audio/audioManager';

export const GamePlayPage: React.FC = () => {
  const { gameState, rollDice, selectToken, quitGame } = useGameStore();
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);

  if (!gameState) return null;

  const activePlayer = gameState.players[gameState.activePlayerIndex];

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#070d18] text-white p-2">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#101b33] rounded-xl border border-yellow-500/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioManager.isMuted = !isMuted;
              setIsMuted(!isMuted);
            }}
            className="p-1 text-yellow-400"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <span className="text-xs font-bold text-yellow-400">{gameState.mode}</span>
        </div>

        <button
          onClick={() => setShowQuitConfirm(true)}
          className="flex items-center gap-1 bg-red-600/80 px-2.5 py-1 rounded-lg text-xs font-bold"
        >
          <LogOut className="w-3.5 h-3.5" /> Exit
        </button>
      </div>

      {/* Opponent Player Bar */}
      <div className="flex justify-between items-center px-4 py-1">
        {gameState.players.map((p, idx) => (
          <div
            key={p.id}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              idx === gameState.activePlayerIndex
                ? 'border-yellow-400 bg-yellow-400/20'
                : 'border-gray-700 bg-gray-900/40'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color.toLowerCase() }} />
            <span className="text-xs font-bold">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Main Board */}
      <LudoCanvasBoard gameState={gameState} onSelectToken={selectToken} />

      {/* Bottom Dice Control Area */}
      <div className="flex items-center justify-around py-3 bg-[#0d1627] rounded-2xl border border-yellow-500/40 mx-2">
        <div className="text-center">
          <p className="text-[11px] text-gray-400">Current Turn</p>
          <p className="text-sm font-black text-yellow-400">{activePlayer.name}</p>
        </div>

        <DiceRoller
          value={gameState.diceValue}
          canRoll={gameState.canRoll && !activePlayer.isAi}
          onRoll={rollDice}
          colorName={activePlayer.color}
        />
      </div>

      {/* Winner Overlay */}
      {gameState.winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-[#1b2a47] to-[#0a1128] border-2 border-yellow-400 p-6 rounded-2xl text-center max-w-xs w-full shadow-2xl">
            <h2 className="text-2xl font-black text-yellow-400 mb-1">VICTORY!</h2>
            <p className="text-white font-bold mb-4">{gameState.winner.name} won the match!</p>
            {gameState.prizePool > 0 && (
              <p className="text-xs text-yellow-300 font-mono mb-4">+₹{gameState.prizePool} Virtual Coins added</p>
            )}
            <button
              onClick={quitGame}
              className="w-full py-2 bg-yellow-400 text-gray-950 font-black rounded-xl shadow-lg"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}

      {/* Quit Dialog */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#101b33] border border-yellow-400/80 rounded-2xl p-5 text-center max-w-xs w-full">
            <h3 className="text-lg font-bold text-white mb-2">Quit Game?</h3>
            <p className="text-xs text-gray-300 mb-4">Leaving will count as forfeit.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-1.5 bg-gray-700 rounded-lg text-xs font-bold"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowQuitConfirm(false);
                  quitGame();
                }}
                className="flex-1 py-1.5 bg-red-600 rounded-lg text-xs font-bold"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
