import { FreeAdClaim } from '../types';

export class AdAdapter {
  private static KEY = 'ludo_free_game_claim_state';

  public static getClaim(): FreeAdClaim {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      adsWatched: 0,
      requiredAds: 2,
      cooldownExpiresAt: 0,
      unlockedSession: false
    };
  }

  public static saveClaim(claim: FreeAdClaim) {
    localStorage.setItem(this.KEY, JSON.stringify(claim));
  }

  public static async watchRewardedAd(onTick: (secLeft: number) => void): Promise<FreeAdClaim> {
    const claim = this.getClaim();
    const now = Date.now();

    if (claim.cooldownExpiresAt > now) {
      const waitMinutes = Math.ceil((claim.cooldownExpiresAt - now) / 60000);
      throw new Error(`Cooldown Active: Please wait ${waitMinutes} minutes.`);
    }

    // 5-second rewarded ad simulation
    await new Promise<void>((resolve) => {
      let sec = 5;
      onTick(sec);
      const timer = setInterval(() => {
        sec--;
        onTick(sec);
        if (sec <= 0) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });

    claim.adsWatched += 1;

    if (claim.adsWatched >= claim.requiredAds) {
      claim.unlockedSession = true;
      claim.adsWatched = 0;
      claim.cooldownExpiresAt = Date.now() + 60 * 60 * 1000; // 60-minute window
    }

    this.saveClaim(claim);
    return claim;
  }

  public static consumeUnlockedSession(): boolean {
    const claim = this.getClaim();
    if (claim.unlockedSession) {
      claim.unlockedSession = false;
      this.saveClaim(claim);
      return true;
    }
    return false;
  }
}
