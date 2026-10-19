import React, { useRef, useEffect } from 'react';
import { Player, MoveOption } from '../../types';
import { BoardGeometry, SAFE_STAR_INDICES, TRACK_MATRIX } from '../engine/boardGeometry';

interface LudoCanvasBoardProps {
  players: Player[];
  activeLegalMoves: MoveOption[];
  onTokenClick: (tokenId: number) => void;
}

export const LudoCanvasBoard: React.FC<LudoCanvasBoardProps> = ({
  players,
  activeLegalMoves,
  onTokenClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const geomRef = useRef<BoardGeometry>(new BoardGeometry(600));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const geom = geomRef.current;
    const size = geom.canvasSize;
    const cSize = geom.cellSize;

    ctx.clearRect(0, 0, size, size);

    // Board background
    ctx.fillStyle = '#0f1738';
    ctx.fillRect(0, 0, size, size);

    // Color definitions
    const colors = {
      red: '#ff3366',
      green: '#00d66f',
      yellow: '#ffb703',
      blue: '#2196f3',
      gridLine: 'rgba(255, 255, 255, 0.08)'
    };

    // Draw 4 Yards
    const drawYard = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 6 * cSize, 6 * cSize);
      ctx.fillStyle = '#090f28';
      ctx.beginPath();
      ctx.roundRect(x + 18, y + 18, 6 * cSize - 36, 6 * cSize - 36, 12);
      ctx.fill();
    };

    drawYard(0, 0, colors.red);
    drawYard(9 * cSize, 0, colors.green);
    drawYard(9 * cSize, 9 * cSize, colors.yellow);
    drawYard(0, 9 * cSize, colors.blue);

    // Grid lines
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 15; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cSize, 0);
      ctx.lineTo(i * cSize, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cSize);
      ctx.lineTo(size, i * cSize);
      ctx.stroke();
    }

    // Home Runway Paths
    const paintCell = (r: number, c: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(c * cSize, r * cSize, cSize, cSize);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.strokeRect(c * cSize, r * cSize, cSize, cSize);
    };

    for (let i = 1; i <= 5; i++) {
      paintCell(7, i, colors.red);
      paintCell(i, 7, colors.green);
      paintCell(7, 14 - i, colors.yellow);
      paintCell(14 - i, 7, colors.blue);
    }

    // Starting cells
    paintCell(6, 1, colors.red);
    paintCell(1, 8, colors.green);
    paintCell(8, 13, colors.yellow);
    paintCell(13, 6, colors.blue);

    // Center Home Triangles
    const start = 6 * cSize;
    const end = 9 * cSize;
    const mid = 7.5 * cSize;

    // Green
    ctx.fillStyle = colors.green;
    ctx.beginPath();
    ctx.moveTo(start, start);
    ctx.lineTo(end, start);
    ctx.lineTo(mid, mid);
    ctx.fill();

    // Yellow
    ctx.fillStyle = colors.yellow;
    ctx.beginPath();
    ctx.moveTo(end, start);
    ctx.lineTo(end, end);
    ctx.lineTo(mid, mid);
    ctx.fill();

    // Blue
    ctx.fillStyle = colors.blue;
    ctx.beginPath();
    ctx.moveTo(start, end);
    ctx.lineTo(end, end);
    ctx.lineTo(mid, mid);
    ctx.fill();

    // Red
    ctx.fillStyle = colors.red;
    ctx.beginPath();
    ctx.moveTo(start, start);
    ctx.lineTo(start, end);
    ctx.lineTo(mid, mid);
    ctx.fill();

    // Safe Stars
    SAFE_STAR_INDICES.forEach(idx => {
      const coord = TRACK_MATRIX[idx];
      const pos = geom.gridToPixel(coord[0], coord[1]);
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('★', pos.x, pos.y);
    });

    // Draw Tokens
    players.forEach(p => {
      p.tokens.forEach(tok => {
        const pos = geom.getTokenPixelCoords(p.color, tok.id, tok.step);
        const isLegal = activeLegalMoves.some(m => m.tokenId === tok.id);

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;

        // Outer Ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Main Token Body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.color];
        ctx.fill();

        // 3D Highlight Gem
        ctx.beginPath();
        ctx.arc(pos.x - 3, pos.y - 3, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fill();

        // Highlight ring if legal
        if (isLegal) {
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 17, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });
    });
  }, [players, activeLegalMoves]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = 600 / rect.width;
    const clickX = (e.clientX - rect.left) * scale;
    const clickY = (e.clientY - rect.top) * scale;

    const geom = geomRef.current;
    for (const m of activeLegalMoves) {
      for (const p of players) {
        const tok = p.tokens.find(t => t.id === m.tokenId);
        if (tok) {
          const pos = geom.getTokenPixelCoords(tok.color, tok.id, tok.step);
          const dist = Math.hypot(clickX - pos.x, clickY - pos.y);
          if (dist <= 22) {
            onTokenClick(tok.id);
            return;
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', aspectRatio: '1/1', maxWidth: '420px', margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
          cursor: activeLegalMoves.length > 0 ? 'pointer' : 'default'
        }}
      />
    </div>
  );
};
