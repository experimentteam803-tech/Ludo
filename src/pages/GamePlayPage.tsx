import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, LogOut } from 'lucide-react';
import { LudoCanvasBoard } from '../game/engine/LudoCanvasBoard';
import { DiceRoller } from '../game/engine/DiceRoller';
import { useGameStore } from '../stores/useGameStore';
import { audioManager } from '../services/audio/audioManager';
import { LudoEngine } from '../game/rules/ludoEngine';

export const GamePlayPage: React.FC = () => {
  const { gameState, rollDice, selectToken, quitGame } = useGameStore();
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);
  const [animatingToken, setAnimatingToken] = useState<{ playerId: string; tokenId: number; stepPos: number } | null>(null);

  // Background Music Controller
  useEffect(() => {
    audioManager.startBGM();
    return () => {
      audioManager.stopBGM();
    };
  }, []);

  if (!gameState) return null;

  const activePlayer = gameState.players[gameState.activePlayerIndex];

  // Step-by-Step Animated Token Hop
  const handleAnimatedMove = (tokenId: number) => {
    if (!gameState || !gameState.diceValue) return;

    const token = activePlayer.tokens.find((t) => t.id === tokenId);
    if (!token) return;

    const dice = gameState.diceValue;

    if (token.stepPosition === -1) {
      // Coming out of yard (single hop with fanfare)
      audioManager.playTokenExit();
      setAnimatingToken({ playerId: activePlayer.id, tokenId, stepPos: 0 });
      setTimeout(() => {
        setAnimatingToken(null);
        selectToken(tokenId);
      }, 250);
    } else {
      // Step-by-step hopping along path
      const startPos = token.stepPosition;
      let currentHop = 0;

      const hopInterval = setInterval(() => {
        currentHop++;
        const intermediatePos = startPos + currentHop;
        setAnimatingToken({ playerId: activePlayer.id, tokenId, stepPos: intermediatePos });
        audioManager.playStepHop(currentHop);

        if (currentHop >= dice) {
          clearInterval(hopInterval);
          setTimeout(() => {
            setAnimatingToken(null);
            selectToken(tokenId);
          }, 100);
        }
      }, 120); // 120ms smooth jump per cell
    }
  };

  // Bot Auto Player Action
  useEffect(() => {
    if (gameState.isGameOver) return;
    const current = gameState.players[gameState.activePlayerIndex];

    if (current.isAi) {
      if (gameState.canRoll) {
        const rollTimer = setTimeout(() => {
          rollDice();
        }, 700);
        return () => clearTimeout(rollTimer);
      } else if (gameState.validTokenMoves.length > 0) {
        const moveTimer = setTimeout(() => {
          const bestMove = LudoEngine.pickBestBotMove(gameState, gameState.validTokenMoves);
          handleAnimatedMove(bestMove);
        }, 600);
        return () => clearTimeout(moveTimer);
      }
    }
  }, [gameState.activePlayerIndex, gameState.canRoll, gameState.validTokenMoves]);

  return (
    <div className="flex flex-col justify-between min-h-screen p-2 text-white select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e1b36] rounded-xl border border-yellow-500/40 shadow-lg">
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
          <span className="text-xs font-black text-yellow-400 uppercase tracking-wider">{gameState.mode}</span>
        </div>

        <button
          onClick={() => setShowQuitConfirm(true)}
          className="flex items-center gap-1 bg-red-600/80 px-3 py-1 rounded-lg text-xs font-bold shadow"
        >
          <LogOut className="w-3.5 h-3.5" /> Exit
        </button>
      </div>

      {/* Top Opponent Profile Area */}
      <div className="flex justify-between items-center px-4 py-1">
        {gameState.players.map((p, idx) => (
          <div
            key={p.id}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow ${
              idx === gameState.activePlayerIndex
                ? 'border-yellow-400 bg-yellow-400/20'
                : 'border-gray-700 bg-gray-900/50'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color.toLowerCase() }} />
            <span className="text-xs font-bold">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Main Board with Canvas Graphics */}
      <LudoCanvasBoard
        gameState={gameState}
        onSelectToken={handleAnimatedMove}
        animatingToken={animatingToken}
      />

      {/* Bottom Dice Control Area */}
      <div className="flex items-center justify-around py-2.5 px-3 bg-[#0d1b38] rounded-2xl border border-yellow-500/50 shadow-2xl mx-1">
        <DiceRoller
          value={gameState.diceValue}
          canRoll={gameState.canRoll && !activePlayer.isAi}
          onRoll={rollDice}
          playerName={activePlayer.name}
          avatarUrl={activePlayer.avatarUrl}
          isTurn={true}
        />
      </div>

      {/* Quit Dialog */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0e1b36] border-2 border-yellow-400 rounded-2xl p-5 text-center max-w-xs w-full shadow-2xl">
            <h3 className="text-base font-black text-yellow-400 mb-2">Quit Game?</h3>
            <p className="text-xs text-gray-300 mb-4">Are you sure you want to exit to lobby?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-2 bg-gray-700 rounded-xl text-xs font-bold text-white"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowQuitConfirm(false);
                  quitGame();
                }}
                className="flex-1 py-2 bg-red-600 rounded-xl text-xs font-bold text-white"
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
