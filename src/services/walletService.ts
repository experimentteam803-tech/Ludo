import { UserProfile } from '../types';

export class WalletService {
  private static STORAGE_KEY = 'ludo_user_wallet_profile';

  public static getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    const defaultProfile: UserProfile = {
      uid: 'USER_' + Math.floor(1000 + Math.random() * 9000),
      displayName: 'Arif Khan',
      avatar: '👑',
      coins: 1000,
      wins: 14,
      losses: 5,
      level: 3,
      xp: 420
    };
    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  public static saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {}
  }

  public static creditVirtualCoins(amount: number, reason: string): UserProfile {
    const prof = this.getProfile();
    prof.coins += amount;
    this.saveProfile(prof);
    return prof;
  }
}
