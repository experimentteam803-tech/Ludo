import React, { useRef, useEffect, useState } from 'react';
import { GameState, Token } from '../../types/game';
import { LudoEngine } from '../rules/ludoEngine';
import { SAFE_CELLS, BOARD_COLORS } from '../rules/boardConstants';

interface AnimatedGoti {
  playerId: string;
  tokenId: number;
  currentR: number;
  currentC: number;
  targetR: number;
  targetC: number;
  jumpArc: number;
}

interface Props {
  gameState: GameState;
  onSelectToken: (tokenId: number) => void;
  animatingToken?: { playerId: string; tokenId: number; stepPos: number } | null;
}

export const LudoCanvasBoard: React.FC<Props> = ({ gameState, onSelectToken, animatingToken }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getGridCoordinate = (token: Token): { r: number; c: number } => {
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

    const stepInCorridor = token.stepPosition - 51;
    switch (token.color) {
      case 'RED': return { r: 7, c: 1 + stepInCorridor };
      case 'GREEN': return { r: 1 + stepInCorridor, c: 7 };
      case 'YELLOW': return { r: 7, c: 13 - stepInCorridor };
      case 'BLUE': return { r: 13 - stepInCorridor, c: 7 };
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cellSize = size / 15;

    ctx.clearRect(0, 0, size, size);

    // 1. Draw 4 Yards with glossy borders
    const drawYard = (x: number, y: number, colorKey: 'RED' | 'GREEN' | 'YELLOW' | 'BLUE') => {
      const c = BOARD_COLORS[colorKey];
      // Outer colored box
      ctx.fillStyle = c.primary;
      ctx.fillRect(x * cellSize, y * cellSize, 6 * cellSize, 6 * cellSize);

      // Inner white area with rounded bevel
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 4 * cellSize, 4 * cellSize);

      // 4 Base Yard Seats with silver rim
      const baseCoords = [
        { bx: x + 1.8, by: y + 1.8 },
        { bx: x + 3.2, by: y + 1.8 },
        { bx: x + 1.8, by: y + 3.2 },
        { bx: x + 3.2, by: y + 3.2 }
      ];

      baseCoords.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.bx * cellSize, pos.by * cellSize, cellSize * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = c.light;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#d1d5db';
        ctx.stroke();
      });
    };

    drawYard(0, 0, 'RED');
    drawYard(9, 0, 'GREEN');
    drawYard(9, 9, 'YELLOW');
    drawYard(0, 9, 'BLUE');

    // 2. Central Home Triangles
    const centerTriangles = [
      { coords: [[6,6],[7.5,7.5],[6,9]], color: BOARD_COLORS.RED.primary },
      { coords: [[6,6],[7.5,7.5],[9,6]], color: BOARD_COLORS.GREEN.primary },
      { coords: [[9,6],[7.5,7.5],[9,9]], color: BOARD_COLORS.YELLOW.primary },
      { coords: [[6,9],[7.5,7.5],[9,9]], color: BOARD_COLORS.BLUE.primary },
    ];
    centerTriangles.forEach(t => {
      ctx.beginPath();
      ctx.moveTo(t.coords[0][0] * cellSize, t.coords[0][1] * cellSize);
      ctx.lineTo(t.coords[1][0] * cellSize, t.coords[1][1] * cellSize);
      ctx.lineTo(t.coords[2][0] * cellSize, t.coords[2][1] * cellSize);
      ctx.fillStyle = t.color;
      ctx.fill();
    });

    // 3. Grid Cells & Home Corridors
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;

    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        if ((r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8)) continue;
        if (r >= 6 && r <= 8 && c >= 6 && c <= 8) continue;

        ctx.fillStyle = '#ffffff';

        // Colored home lanes
        if (r === 7 && c >= 1 && c <= 5) ctx.fillStyle = BOARD_COLORS.RED.primary;
        if (c === 7 && r >= 1 && r <= 5) ctx.fillStyle = BOARD_COLORS.GREEN.primary;
        if (r === 7 && c >= 9 && c <= 13) ctx.fillStyle = BOARD_COLORS.YELLOW.primary;
        if (c === 7 && r >= 9 && r <= 13) ctx.fillStyle = BOARD_COLORS.BLUE.primary;

        // Entry colored squares
        if (r === 6 && c === 1) ctx.fillStyle = BOARD_COLORS.RED.primary;
        if (r === 1 && c === 8) ctx.fillStyle = BOARD_COLORS.GREEN.primary;
        if (r === 8 && c === 13) ctx.fillStyle = BOARD_COLORS.YELLOW.primary;
        if (r === 13 && c === 6) ctx.fillStyle = BOARD_COLORS.BLUE.primary;

        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }

    // 4. Safe Stars
    const starCoords = [
      { r: 6, c: 1 }, { r: 2, c: 6 }, { r: 1, c: 8 }, { r: 6, c: 12 },
      { r: 8, c: 13 }, { r: 12, c: 8 }, { r: 13, c: 6 }, { r: 8, c: 2 }
    ];
    ctx.fillStyle = '#f59e0b';
    ctx.font = `bold ${cellSize * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    starCoords.forEach(pos => {
      ctx.fillText('★', (pos.c + 0.5) * cellSize, (pos.r + 0.53) * cellSize);
    });

    // 5. Draw Glossy 3D Gotis (Tokens)
    const activePlayer = gameState.players[gameState.activePlayerIndex];

    gameState.players.forEach((player) => {
      player.tokens.forEach((token) => {
        if (token.isFinished) return;

        let px = 0;
        let py = 0;

        if (token.stepPosition === -1) {
          const yardOffset = {
            RED: { x: 1.8, y: 1.8 },
            GREEN: { x: 10.8, y: 1.8 },
            YELLOW: { x: 10.8, y: 10.8 },
            BLUE: { x: 1.8, y: 10.8 },
          }[token.color];

          const subX = (token.id % 2) * 1.4;
          const subY = Math.floor(token.id / 2) * 1.4;
          px = (yardOffset.x + subX) * cellSize;
          py = (yardOffset.y + subY) * cellSize;
        } else {
          // If this token is currently in middle of hop animation
          const coords = getGridCoordinate(
            animatingToken && animatingToken.tokenId === token.id && animatingToken.playerId === player.id
              ? { ...token, stepPosition: animatingToken.stepPos }
              : token
          );
          px = (coords.c + 0.5) * cellSize;
          py = (coords.r + 0.5) * cellSize;
        }

        ctx.save();

        // Legal move pulsating halo ring
        const isLegal =
          player.id === activePlayer.id &&
          gameState.validTokenMoves.includes(token.id);

        if (isLegal) {
          ctx.beginPath();
          ctx.arc(px, py, cellSize * 0.52, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
          ctx.fill();
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Token Drop Shadow
        ctx.beginPath();
        ctx.arc(px, py + 2.5, cellSize * 0.36, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fill();

        // 3D Goti Outer Cone
        const grad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, cellSize * 0.4);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, BOARD_COLORS[token.color].light);
        grad.addColorStop(1, BOARD_COLORS[token.color].dark);

        ctx.beginPath();
        ctx.arc(px, py, cellSize * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Top glossy crown circle
        ctx.beginPath();
        ctx.arc(px - 2, py - 3, cellSize * 0.14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();

        ctx.restore();
      });
    });
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

    for (const tokenId of gameState.validTokenMoves) {
      const token = activePlayer.tokens.find((t) => t.id === tokenId);
      if (!token) continue;

      let tx = 0;
      let ty = 0;
      if (token.stepPosition === -1) {
        const yardOffset = {
          RED: { x: 1.8, y: 1.8 },
          GREEN: { x: 10.8, y: 1.8 },
          YELLOW: { x: 10.8, y: 10.8 },
          BLUE: { x: 1.8, y: 10.8 },
        }[token.color];
        tx = (yardOffset.x + (token.id % 2) * 1.4) * cellSize;
        ty = (yardOffset.y + Math.floor(token.id / 2) * 1.4) * cellSize;
      } else {
        const coords = getGridCoordinate(token);
        tx = (coords.c + 0.5) * cellSize;
        ty = (coords.r + 0.5) * cellSize;
      }

      const dist = Math.hypot(x - tx, y - ty);
      if (dist <= cellSize * 0.65) {
        onSelectToken(tokenId);
        break;
      }
    }
  };

  useEffect(() => {
    render();
  }, [gameState, animatingToken]);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto p-1.5 rounded-2xl bg-gradient-to-b from-[#1b2f56] to-[#0d182d] shadow-2xl border-2 border-yellow-500/70">
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
