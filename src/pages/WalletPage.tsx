import React, { useState } from 'react';
import { UserProfile } from '../types';
import { WalletService } from '../services/walletService';

interface WalletPageProps {
  profile: UserProfile;
  onRefresh: (p: UserProfile) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ profile, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'balance' | 'store'>('balance');

  const coinPacks = [
    { coins: 500, label: 'Starter Pack', icon: '💰' },
    { coins: 1000, label: 'Royale Pack', icon: '🏆' },
    { coins: 5000, label: 'Champion Chest', icon: '👑' }
  ];

  const handleClaimFreeCoins = () => {
    const updated = WalletService.creditVirtualCoins(250, 'Daily Free Allowance');
    onRefresh(updated);
    alert('Claimed 250 Free Virtual Coins!');
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '70px' }}>
      <h2 style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}>Virtual Wallet</h2>

      {/* Total Balance Card */}
      <div style={{ background: 'linear-gradient(135deg, #152763, #09112e)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '18px', textAlign: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Balance</span>
        <h1 style={{ color: 'var(--accent-gold)', fontSize: '2.4rem', margin: '4px 0' }}>{profile.coins.toLocaleString()}</h1>
        <span style={{ fontSize: '0.8rem', color: '#ffd700' }}>Royale Coins (RC)</span>
        <div style={{ fontSize: '0.68rem', color: '#ff9900', marginTop: '8px' }}>
          ⚠️ Virtual currency only. No real money deposits or withdrawals.
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button className="btn btn-gold" style={{ flex: 1 }} onClick={handleClaimFreeCoins}>
          + Free Daily Coins
        </button>
      </div>

      <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Virtual Coin Rewards</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {coinPacks.map((p, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>{p.icon}</span>
              <div>
                <strong style={{ fontSize: '0.85rem' }}>{p.label}</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{p.coins} Virtual Coins</div>
              </div>
            </div>
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={handleClaimFreeCoins}>
              Claim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
