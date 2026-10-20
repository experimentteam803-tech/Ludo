import React, { useRef, useEffect } from 'react';
import { GameState, Token } from '../../types/game';
import { SAFE_CELLS, LudoEngine } from '../rules/ludoEngine';
import { BOARD_COLORS } from '../rules/boardConstants';

interface Props {
  gameState: GameState;
  onSelectToken: (tokenId: number) => void;
}

export const LudoCanvasBoard: React.FC<Props> = ({ gameState, onSelectToken }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Map 15x15 standard grid to pixel coordinates
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cellSize = size / 15;

    ctx.clearRect(0, 0, size, size);

    // 1. Draw 4 Yard quadrants
    const drawYard = (x: number, y: number, colorKey: 'RED' | 'GREEN' | 'YELLOW' | 'BLUE') => {
      const c = BOARD_COLORS[colorKey];
      ctx.fillStyle = c.primary;
      ctx.fillRect(x * cellSize, y * cellSize, 6 * cellSize, 6 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 4 * cellSize, 4 * cellSize);
    };

    drawYard(0, 0, 'RED');
    drawYard(9, 0, 'GREEN');
    drawYard(9, 9, 'YELLOW');
    drawYard(0, 9, 'BLUE');

    // 2. Draw Center Triangles
    ctx.beginPath();
    ctx.moveTo(6 * cellSize, 6 * cellSize);
    ctx.lineTo(7.5 * cellSize, 7.5 * cellSize);
    ctx.lineTo(6 * cellSize, 9 * cellSize);
    ctx.fillStyle = BOARD_COLORS.RED.primary;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6 * cellSize, 6 * cellSize);
    ctx.lineTo(7.5 * cellSize, 7.5 * cellSize);
    ctx.lineTo(9 * cellSize, 6 * cellSize);
    ctx.fillStyle = BOARD_COLORS.GREEN.primary;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(9 * cellSize, 6 * cellSize);
    ctx.lineTo(7.5 * cellSize, 7.5 * cellSize);
    ctx.lineTo(9 * cellSize, 9 * cellSize);
    ctx.fillStyle = BOARD_COLORS.YELLOW.primary;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6 * cellSize, 9 * cellSize);
    ctx.lineTo(7.5 * cellSize, 7.5 * cellSize);
    ctx.lineTo(9 * cellSize, 9 * cellSize);
    ctx.fillStyle = BOARD_COLORS.BLUE.primary;
    ctx.fill();

    // 3. Grid lines & Cells
    ctx.strokeStyle = '#203a43';
    ctx.lineWidth = 1;

    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        // Skip yards & center
        if ((r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8)) continue;
        if (r >= 6 && r <= 8 && c >= 6 && c <= 8) continue;

        ctx.fillStyle = '#f8fafc';
        // Colored home lanes
        if (r === 7 && c >= 1 && c <= 5) ctx.fillStyle = BOARD_COLORS.RED.primary;
        if (c === 7 && r >= 1 && r <= 5) ctx.fillStyle = BOARD_COLORS.GREEN.primary;
        if (r === 7 && c >= 9 && c <= 13) ctx.fillStyle = BOARD_COLORS.YELLOW.primary;
        if (c === 7 && r >= 9 && r <= 13) ctx.fillStyle = BOARD_COLORS.BLUE.primary;

        // Entry colored squares
        if (r === 6 && c === 1) ctx.fillStyle = BOARD_COLORS.RED.light;
        if (r === 1 && c === 8) ctx.fillStyle = BOARD_COLORS.GREEN.light;
        if (r === 8 && c === 13) ctx.fillStyle = BOARD_COLORS.YELLOW.light;
        if (r === 13 && c === 6) ctx.fillStyle = BOARD_COLORS.BLUE.light;

        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }

    // 4. Draw Safe Star glyphs
    const starCoords = [
      { r: 6, c: 1 }, { r: 2, c: 6 }, { r: 1, c: 8 }, { r: 6, c: 12 },
      { r: 8, c: 13 }, { r: 12, c: 8 }, { r: 13, c: 6 }, { r: 8, c: 2 }
    ];
    ctx.fillStyle = '#d4af37';
    ctx.font = `${cellSize * 0.75}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    starCoords.forEach(pos => {
      ctx.fillText('★', (pos.c + 0.5) * cellSize, (pos.r + 0.55) * cellSize);
    });

    // 5. Render Tokens
    const activePlayer = gameState.players[gameState.activePlayerIndex];

    gameState.players.forEach((player) => {
      player.tokens.forEach((token) => {
        if (token.isFinished) return;

        let px = 0;
        let py = 0;

        if (token.stepPosition === -1) {
          // Inside yard base
          const yardOffset = {
            RED: { x: 2, y: 2 },
            GREEN: { x: 11, y: 2 },
            YELLOW: { x: 11, y: 11 },
            BLUE: { x: 2, y: 11 },
          }[token.color];

          const subX = (token.id % 2) * 1.8;
          const subY = Math.floor(token.id / 2) * 1.8;
          px = (yardOffset.x + subX) * cellSize;
          py = (yardOffset.y + subY) * cellSize;
        } else {
          const coords = getGridCoordinate(token);
          px = (coords.c + 0.5) * cellSize;
          py = (coords.r + 0.5) * cellSize;
        }

        // Token Body
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, cellSize * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = BOARD_COLORS[token.color].primary;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Inner crown / core
        ctx.beginPath();
        ctx.arc(px, py, cellSize * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Highlight legal move
        const isLegal =
          player.id === activePlayer.id &&
          gameState.validTokenMoves.includes(token.id);

        if (isLegal) {
          ctx.beginPath();
          ctx.arc(px, py, cellSize * 0.52, 0, Math.PI * 2);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();
      });
    });
  };

  // Convert global track path to row & col
  const getGridCoordinate = (token: Token): { r: number; c: number } => {
    // 52-step standard path mapped into row/col
    const path: [number, number][] = [
      [6,1],[6,2],[6,3],[6,4],[6,5],
      [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
      [1,8],[2,8],[3,8],[4,8],[5,8],
      [6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[7,14],[8,14],
      [8,13],[8,12],[8,11],[8,10],[8,9],
      [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[14,7],[14,6],
      [13,6],[12,6],[11,6],[10,6],[9,6],
      [8,5],[8,4],[8,3],[8,2],[8,1],[8,0],[7,0],[6,0]
    ];

    if (token.stepPosition >= 0 && token.stepPosition < 51) {
      const gPos = LudoEngine.getGlobalPosition(token);
      return { r: path[gPos][0], c: path[gPos][1] };
    }

    // Home corridors
    const stepInCorridor = token.stepPosition - 51;
    switch (token.color) {
      case 'RED': return { r: 7, c: 1 + stepInCorridor };
      case 'GREEN': return { r: 1 + stepInCorridor, c: 7 };
      case 'YELLOW': return { r: 7, c: 13 - stepInCorridor };
      case 'BLUE': return { r: 13 - stepInCorridor, c: 7 };
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const cellSize = canvas.width / 15;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (activePlayer.isAi) return;

    // Check tap proximity
    for (const tokenId of gameState.validTokenMoves) {
      const token = activePlayer.tokens.find((t) => t.id === tokenId);
      if (!token) continue;

      let tx = 0;
      let ty = 0;
      if (token.stepPosition === -1) {
        const yardOffset = {
          RED: { x: 2, y: 2 },
          GREEN: { x: 11, y: 2 },
          YELLOW: { x: 11, y: 11 },
          BLUE: { x: 2, y: 11 },
        }[token.color];
        tx = (yardOffset.x + (token.id % 2) * 1.8) * cellSize;
        ty = (yardOffset.y + Math.floor(token.id / 2) * 1.8) * cellSize;
      } else {
        const coords = getGridCoordinate(token);
        tx = (coords.c + 0.5) * cellSize;
        ty = (coords.r + 0.5) * cellSize;
      }

      const dist = Math.hypot(x - tx, y - ty);
      if (dist <= cellSize * 0.6) {
        onSelectToken(tokenId);
        break;
      }
    }
  };

  useEffect(() => {
    render();
  }, [gameState]);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto p-2 rounded-2xl bg-gradient-to-b from-[#1e3c72] to-[#2a5298] shadow-2xl border-2 border-yellow-500/50">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onClick={handleCanvasClick}
        className="w-full h-full rounded-xl touch-manipulation cursor-pointer"
      />
    </div>
  );
};
