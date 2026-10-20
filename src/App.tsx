import React, { useState } from 'react';
import { LobbyPage } from './pages/LobbyPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useGameStore } from './stores/useGameStore';
import { GameMode } from './types/game';

export const App: React.FC = () => {
  const { gameState, startNewGame } = useGameStore();
  const [isAdminView, setIsAdminView] = useState(false);

  if (isAdminView) {
    return <AdminDashboard onBack={() => setIsAdminView(false)} />;
  }

  if (gameState) {
    return <GamePlayPage />;
  }

  return (
    <LobbyPage
      onStartGame={(mode: GameMode, players: any[], fee = 0, prize = 0) => {
        startNewGame(mode, players, fee, prize);
      }}
      onOpenAdmin={() => setIsAdminView(true)}
    />
  );
};

export default App;
