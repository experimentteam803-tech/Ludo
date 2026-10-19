class CanvasRenderer {
  constructor(canvasElement, size = 600) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.size = size;
    this.canvas.width = size;
    this.canvas.height = size;
    this.geometry = new LudoGeometry.BoardGeometry(size);

    this.colors = {
      boardBg: '#0f142e',
      gridLines: 'rgba(255, 255, 255, 0.08)',
      red: '#ff3366',
      green: '#00d66f',
      yellow: '#ffb703',
      blue: '#2196f3',
      gold: '#ffd13b',
      star: '#ffffff'
    };
  }

  drawBoard() {
    const ctx = this.ctx;
    const cSize = this.geometry.cellSize;
    ctx.clearRect(0, 0, this.size, this.size);

    ctx.fillStyle = this.colors.boardBg;
    ctx.fillRect(0, 0, this.size, this.size);

    // 4 Yards
    this.drawYard(0, 0, this.colors.red);
    this.drawYard(9 * cSize, 0, this.colors.green);
    this.drawYard(9 * cSize, 9 * cSize, this.colors.yellow);
    this.drawYard(0, 9 * cSize, this.colors.blue);

    // Grid Lines
    ctx.strokeStyle = this.colors.gridLines;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 15; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cSize, 0);
      ctx.lineTo(i * cSize, this.size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cSize);
      ctx.lineTo(this.size, i * cSize);
      ctx.stroke();
    }

    // Home Straight Paths
    for (let i = 1; i <= 5; i++) {
      this.paintCell(7, i, this.colors.red);
      this.paintCell(i, 7, this.colors.green);
      this.paintCell(7, 14 - i, this.colors.yellow);
      this.paintCell(14 - i, 7, this.colors.blue);
    }

    // Starting arrow cells
    this.paintCell(6, 1, this.colors.red);
    this.paintCell(1, 8, this.colors.green);
    this.paintCell(8, 13, this.colors.yellow);
    this.paintCell(13, 6, this.colors.blue);

    // Center Triangles
    this.drawCenterTriangle();

    // Safe Stars
    LudoRules.BOARD_PATHS.SAFE_STAR_INDICES.forEach(trackIdx => {
      const coord = LudoGeometry.TRACK_MATRIX[trackIdx];
      const pixel = this.geometry.gridToPixel(coord[0], coord[1]);
      this.drawStar(pixel.x, pixel.y, 5, this.colors.star);
    });
  }

  drawYard(x, y, color) {
    const ctx = this.ctx;
    const yardSize = 6 * this.geometry.cellSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, yardSize, yardSize);

    ctx.fillStyle = '#0a0d24';
    ctx.beginPath();
    ctx.roundRect(x + 18, y + 18, yardSize - 36, yardSize - 36, 12);
    ctx.fill();
  }

  paintCell(row, col, color) {
    const ctx = this.ctx;
    const cSize = this.geometry.cellSize;
    ctx.fillStyle = color;
    ctx.fillRect(col * cSize, row * cSize, cSize, cSize);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeRect(col * cSize, row * cSize, cSize, cSize);
  }

  drawCenterTriangle() {
    const ctx = this.ctx;
    const start = 6 * this.geometry.cellSize;
    const end = 9 * this.geometry.cellSize;
    const center = 7.5 * this.geometry.cellSize;

    // Green
    ctx.fillStyle = this.colors.green;
    ctx.beginPath();
    ctx.moveTo(start, start);
    ctx.lineTo(end, start);
    ctx.lineTo(center, center);
    ctx.fill();

    // Yellow
    ctx.fillStyle = this.colors.yellow;
    ctx.beginPath();
    ctx.moveTo(end, start);
    ctx.lineTo(end, end);
    ctx.lineTo(center, center);
    ctx.fill();

    // Blue
    ctx.fillStyle = this.colors.blue;
    ctx.beginPath();
    ctx.moveTo(start, end);
    ctx.lineTo(end, end);
    ctx.lineTo(center, center);
    ctx.fill();

    // Red
    ctx.fillStyle = this.colors.red;
    ctx.beginPath();
    ctx.moveTo(start, start);
    ctx.lineTo(start, end);
    ctx.lineTo(center, center);
    ctx.fill();
  }

  drawStar(cx, cy, spikes, color) {
    const ctx = this.ctx;
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    const outerRadius = 8;
    const innerRadius = 3.5;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawTokens(players, legalMoves = []) {
    const ctx = this.ctx;

    players.forEach(p => {
      p.tokens.forEach(tok => {
        let pos = this.geometry.getTokenPixelCoordinates(p.color, tok.id, tok.step);

        if (tok.animating) {
          pos.x = tok.currentX;
          pos.y = tok.currentY;
        }

        const isLegal = legalMoves.some(m => m.tokenId === tok.id && p.color === m.color);

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;

        // Outer White
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Color Body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = this.colors[p.color];
        ctx.fill();

        // Inner 3D Bead
        ctx.beginPath();
        ctx.arc(pos.x - 3, pos.y - 3, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        // Pulsing Gold Halo for Legal Move
        if (isLegal) {
          ctx.strokeStyle = this.colors.gold;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 17, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });
    });
  }

  animateTokenMovement(token, targetStep, onComplete) {
    const startStep = token.step;
    const totalDiff = targetStep - startStep;
    let stepCount = 0;

    const runNextHop = () => {
      if (stepCount >= totalDiff) {
        token.step = targetStep;
        token.animating = false;
        if (onComplete) onComplete();
        return;
      }

      stepCount++;
      const currentHopStep = startStep + stepCount;
      const targetPos = this.geometry.getTokenPixelCoordinates(token.color, token.id, currentHopStep);

      const startTime = performance.now();
      const duration = 120;
      token.animating = true;

      const origin = { x: token.currentX || targetPos.x, y: token.currentY || targetPos.y };

      const hopFrame = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const arcY = Math.sin(progress * Math.PI) * 12;

        token.currentX = origin.x + (targetPos.x - origin.x) * progress;
        token.currentY = (origin.y + (targetPos.y - origin.y) * progress) - arcY;

        if (progress < 1) {
          requestAnimationFrame(hopFrame);
        } else {
          runNextHop();
        }
      };

      requestAnimationFrame(hopFrame);
    };

    runNextHop();
  }
}
