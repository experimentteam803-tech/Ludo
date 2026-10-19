class AdProviderAdapter {
  constructor() {
    this.localKey = 'ludo_free_game_tracker';
  }

  getClaimData() {
    try {
      const data = localStorage.getItem(this.localKey);
      return data ? JSON.parse(data) : { adsWatched: 0, cooldownExpires: 0 };
    } catch (e) {
      return { adsWatched: 0, cooldownExpires: 0 };
    }
  }

  saveClaimData(data) {
    try {
      localStorage.setItem(this.localKey, JSON.stringify(data));
    } catch (e) {}
  }

  async watchRewardedAd(onProgress) {
    const current = this.getClaimData();
    const now = Date.now();

    if (current.cooldownExpires > now) {
      const minsLeft = Math.ceil((current.cooldownExpires - now) / 60000);
      throw new Error(`Cooldown Active! Wait ${minsLeft} minutes.`);
    }

    onProgress({ status: 'PLAYING_AD' });

    // Show Mobile Ad Overlay
    await this.simulateAdVideo();

    current.adsWatched += 1;
    let unlocked = false;

    if (current.adsWatched >= 2) {
      unlocked = true;
      current.adsWatched = 0;
      current.cooldownExpires = now + (60 * 60 * 1000); // 60 Minutes
    }

    this.saveClaimData(current);
    return {
      success: true,
      unlocked: unlocked,
      adsWatched: current.adsWatched,
      cooldownExpires: current.cooldownExpires
    };
  }

  simulateAdVideo() {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.style.display = 'flex';
      modal.innerHTML = `
        <div class="modal-card">
          <span class="badge badge-gold" style="margin-bottom:8px;">SPONSORED AD</span>
          <h3>Partner Promotion</h3>
          <p style="margin:10px 0; color:var(--text-muted);">Please wait <strong id="ad-sec" style="color:#fff;">5</strong> seconds...</p>
          <button id="ad-done-btn" class="btn btn-gold btn-block" disabled>Watching Video...</button>
        </div>
      `;
      document.body.appendChild(modal);

      let left = 5;
      const timer = setInterval(() => {
        left--;
        const el = document.getElementById('ad-sec');
        if (el) el.innerText = left;
        if (left <= 0) {
          clearInterval(timer);
          const btn = document.getElementById('ad-done-btn');
          btn.disabled = false;
          btn.innerText = 'Claim Verified Reward ✓';
          btn.onclick = () => {
            document.body.removeChild(modal);
            resolve();
          };
        }
      }, 1000);
    });
  }
}
