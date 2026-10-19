class AppController {
  constructor() {
    this.audio = new AudioManager();
    this.renderer = null;
    this.rules = null;
    this.adAdapter = new AdProviderAdapter();

    this.state = {
      activeMode: 'classic',
      numPlayers: 2,
      playerColor: 'red',
      gameRunning: false,
      gameSession: null
    };
  }

  init() {
    // 1. Safe Firebase Init
    if (window.firebase && window.FIREBASE_CONFIG) {
      try {
        firebase.initializeApp(window.FIREBASE_CONFIG);
        firebase.auth().signInAnonymously().catch(() => {});
      } catch (e) {
        console.warn('Firebase initialized in guest offline mode.');
      }
    }

    // 2. Setup Canvas
    const canvas = document.getElementById('ludoCanvas');
    this.renderer = new CanvasRenderer(canvas, 600);
    this.renderer.drawBoard();

    // 3. Setup Listeners
    this.setupUIEvents();
    this.updateAdStatusUI();
  }

  setupUIEvents() {
    // Game Modes
    document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
      card.addEventListener('click', () => {
        this.audio.ensureContext();
        this.state.activeMode = card.getAttribute('data-mode');
        this.switchView('view-setup');
      });
    });

    // Free Game Modal
    document.getElementById('btn-mode-free').addEventListener('click', () => {
      this.audio.ensureContext();
      this.updateAdStatusUI();
      document.getElementById('modal-ad-cooldown').style.display = 'flex';
    });

    document.getElementById('btn-close-ad-modal').addEventListener('click', () => {
      document.getElementById('modal-ad-cooldown').style.display = 'none';
    });

    // Ad Watch Button
    document.getElementById('btn-watch-ad').addEventListener('click', async () => {
      const btn = document.getElementById('btn-watch-ad');
      btn.disabled = true;
      try {
        const res = await this.adAdapter.watchRewardedAd((p) => {
          document.getElementById('ad-steps-label').innerText = 'Playing promo video...';
        });

        this.updateAdStatusUI();

        if (res.unlocked) {
          alert('🎉 2 Ads Completed! 1 Free Match Session Unlocked!');
          document.getElementById('modal-ad-cooldown').style.display = 'none';
          this.state.activeMode = 'classic';
          this.startMatch();
        }
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
      }
    });

    // Setup Back
    document.getElementById('btn-setup-back').addEventListener('click', () => {
      this.switchView('view-home');
    });

    // Player Count Selector
    document.querySelectorAll('#setup-player-count .pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('#setup-player-count .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.state.numPlayers = parseInt(pill.getAttribute('data-players'), 10);
      });
    });

    // Color Selector
    document.querySelectorAll('#setup-color-picker .color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('#setup-color-picker .color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        this.state.playerColor = dot.getAttribute('data-color');
      });
    });

    // Start Match Button
    document.getElementById('btn-start-match').addEventListener('click', () => {
      this.startMatch();
    });

    // Exit Game
    document.getElementById('btn-game-exit').addEventListener('click', () => {
      if (confirm('Exit current match?')) {
        this.state.gameRunning = false;
        this.switchView('view-home');
      }
    });

    // Dice Tap
    document.getElementById('ui-dice-box').addEventListener('click', () => {
      if (this.state.gameSession) {
        this.state.gameSession.handleDiceClick();
      }
    });

    // Canvas Token Tap Listener
    document.getElementById('ludoCanvas').addEventListener('click', (e) => {
      if (!this.state.gameSession) return;
      const rect = e.target.getBoundingClientRect();
      const scale = 600 / rect.width;
      const clickX = (e.clientX - rect.left) * scale;
      const clickY = (e.clientY - rect.top) * scale;
      this.state.gameSession.handleCanvasClick(clickX, clickY);
    });
  }

  switchView(id) {
    document.querySelectorAll('#view-container > section').forEach(s => {
      s.classList.remove('view-active');
      s.classList.add('view-hidden');
    });
    document.getElementById(id).classList.remove('view-hidden');
    document.getElementById(id).classList.add('view-active');
  }

  updateAdStatusUI() {
    const claim = this.adAdapter.getClaimData();
    const now = Date.now();
    const label = document.getElementById('free-game-status-label');
    const watchBtn = document.getElementById('btn-watch-ad');

    if (claim.cooldownExpires > now) {
      const mins = Math.ceil((claim.cooldownExpires - now) / 60000);
      label.innerText = `Cooldown: Available in ${mins}m.`;
      watchBtn.disabled = true;
      watchBtn.innerText = `Cooldown (${mins}m left)`;
    } else {
      label.innerText = `${claim.adsWatched} of 2 ads completed. Ready to unlock!`;
      watchBtn.disabled = false;
      watchBtn.innerText = `Watch Ad (${claim.adsWatched + 1}/2)`;
    }

    const pct = (claim.adsWatched / 2) * 100;
    document.getElementById('ad-progress-fill').style.width = `${pct}%`;
    document.getElementById('ad-steps-label').innerText = `${claim.adsWatched} of 2 ads watched`;
  }

  startMatch() {
    this.rules = new LudoRules.RulesEngine({ mode: this.state.activeMode });
    this.switchView('view-gameplay');
    this.state.gameRunning = true;

    const assignedColors = this.state.numPlayers === 2
      ? [this.state.playerColor, this.state.playerColor === 'red' ? 'yellow' : 'red']
      : ['red', 'green', 'yellow', 'blue'];

    const players = assignedColors.map((color, idx) => ({
      idx,
      name: idx === 0 ? 'You' : `Bot ${color.toUpperCase()}`,
      color: color,
      isHuman: idx === 0,
      tokens: Array.from({ length: this.rules.tokensPerPlayer }, (_, i) => ({
        id: i,
        color: color,
        step: -1
      }))
    }));

    // In-Memory Game Controller
    this.state.gameSession = {
      players: players,
      activeIdx: 0,
      diceVal: null,
      hasRolled: false,
      legalMoves: [],

      getActivePlayer: () => players[this.state.gameSession.activeIdx],

      handleDiceClick: () => {
        const session = this.state.gameSession;
        const curPlayer = session.getActivePlayer();
        if (!curPlayer.isHuman || session.hasRolled) return;

        this.audio.playDiceShake();
        session.rollDice();
      },

      rollDice: () => {
        const session = this.state.gameSession;
        const curPlayer = session.getActivePlayer();
        const dice = Math.floor(Math.random() * 6) + 1;
        session.diceVal = dice;
        session.hasRolled = true;

        document.getElementById('ui-dice-value').innerText = dice;

        session.legalMoves = [];
        curPlayer.tokens.forEach(tok => {
          if (this.rules.isValidMove(tok, dice)) {
            session.legalMoves.push({ tokenId: tok.id, color: tok.color });
          }
        });

        this.renderer.drawBoard();
        this.renderer.drawTokens(session.players, session.legalMoves);

        if (session.legalMoves.length === 0) {
          document.getElementById('ui-instruction').innerText = 'No moves possible!';
          setTimeout(() => session.nextTurn(), 1000);
        } else {
          document.getElementById('ui-instruction').innerText = 'Select highlighted token!';
          if (!curPlayer.isHuman) {
            setTimeout(() => {
              session.executeMove(session.legalMoves[0].tokenId);
            }, 800);
          }
        }
      },

      executeMove: (tokenId) => {
        const session = this.state.gameSession;
        const curPlayer = session.getActivePlayer();
        const token = curPlayer.tokens.find(t => t.id === tokenId);

        const dest = this.rules.computeDestination(token, session.diceVal);
        session.legalMoves = [];

        this.renderer.animateTokenMovement(token, dest.step, () => {
          this.audio.playStep();
          const captured = this.rules.resolveCollisions(token, session.players);
          if (captured.length > 0) this.audio.playCapture();

          this.renderer.drawBoard();
          this.renderer.drawTokens(session.players);

          // Check Win
          if (this.rules.isPlayerWinner(curPlayer)) {
            this.audio.playVictory();
            alert(`🏆 ${curPlayer.name} Wins the match!`);
            this.switchView('view-home');
            return;
          }

          // Bonus Roll if 6, capture, or home goal
          if (session.diceVal === 6 || captured.length > 0 || dest.enteredHome) {
            session.hasRolled = false;
            document.getElementById('ui-instruction').innerText = 'Bonus roll awarded!';
            if (!curPlayer.isHuman) setTimeout(() => session.rollDice(), 900);
          } else {
            session.nextTurn();
          }
        });
      },

      handleCanvasClick: (cx, cy) => {
        const session = this.state.gameSession;
        const curPlayer = session.getActivePlayer();
        if (!curPlayer.isHuman || !session.hasRolled) return;

        session.legalMoves.forEach(m => {
          const tok = curPlayer.tokens.find(t => t.id === m.tokenId);
          const pos = this.renderer.geometry.getTokenPixelCoordinates(tok.color, tok.id, tok.step);
          const dist = Math.hypot(cx - pos.x, cy - pos.y);
          if (dist < 25) {
            session.executeMove(tok.id);
          }
        });
      },

      nextTurn: () => {
        const session = this.state.gameSession;
        session.hasRolled = false;
        session.diceVal = null;
        session.legalMoves = [];
        session.activeIdx = (session.activeIdx + 1) % session.players.length;

        const nextP = session.getActivePlayer();
        document.getElementById('turn-dot-indicator').style.background = `var(--color-${nextP.color})`;
        document.getElementById('turn-text-indicator').innerText = `${nextP.name}'s Turn`;
        document.getElementById('ui-instruction').innerText = nextP.isHuman ? 'Tap dice to roll!' : 'Bot thinking...';
        document.getElementById('ui-dice-value').innerText = '🎲';

        this.renderer.drawBoard();
        this.renderer.drawTokens(session.players);

        if (!nextP.isHuman) {
          setTimeout(() => session.rollDice(), 900);
        }
      }
    };

    // Render Initial Board & Tokens
    this.renderer.drawBoard();
    this.renderer.drawTokens(players);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.init();
});
