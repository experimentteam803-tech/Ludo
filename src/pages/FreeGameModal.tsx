import React, { useState } from 'react';
import { FreeAdClaim } from '../types';
import { AdAdapter } from '../services/adAdapter';
import { X } from 'lucide-react';

interface FreeGameModalProps {
  onClose: () => void;
  onUnlocked: () => void;
}

export const FreeGameModal: React.FC<FreeGameModalProps> = ({ onClose, onUnlocked }) => {
  const [claim, setClaim] = useState<FreeAdClaim>(AdAdapter.getClaim());
  const [loading, setLoading] = useState(false);
  const [timerText, setTimerText] = useState<string>('');

  const now = Date.now();
  const isCooldown = claim.cooldownExpiresAt > now;
  const minutesLeft = Math.ceil((claim.cooldownExpiresAt - now) / 60000);

  const handleWatchAd = async () => {
    setLoading(true);
    try {
      const updated = await AdAdapter.watchRewardedAd((sec) => {
        setTimerText(`Playing Sponsor Promo... ${sec}s`);
      });
      setClaim(updated);
      setTimerText('');
      if (updated.unlockedSession) {
        alert('🎉 2 Ads Completed! 1 Free Match Session Unlocked!');
        onUnlocked();
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '8px', textAlign: 'center' }}>
          Free Game Pass
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '14px' }}>
          Watch 2 short sponsor promotions to earn 1 free match entry! (60-minute cooldown applies).
        </p>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '6px' }}>
          <div style={{ height: '100%', width: `${(claim.adsWatched / 2) * 100}%`, background: 'var(--accent-green)', transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>
          {claim.adsWatched} of 2 ads completed
        </div>

        {isCooldown ? (
          <div style={{ padding: '10px', background: 'rgba(255,183,3,0.15)', border: '1px solid var(--accent-gold)', borderRadius: '10px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
            Cooldown Active: Ready in {minutesLeft} minutes
          </div>
        ) : (
          <button
            className="btn btn-gold btn-block"
            disabled={loading}
            onClick={handleWatchAd}
          >
            {loading ? timerText : `Watch Ad (${claim.adsWatched + 1}/2)`}
          </button>
        )}
      </div>
    </div>
  );
};
