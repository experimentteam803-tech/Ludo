export interface VirtualTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DAILY_BONUS' | 'REWARDED_AD' | 'MATCH_WIN' | 'MATCH_ENTRY' | 'REFERRAL';
  description: string;
  timestamp: number;
}

export interface AdRewardCooldown {
  completedAdsCount: number;
  cooldownEndsAt: number | null;
  isUnlocked: boolean;
}
