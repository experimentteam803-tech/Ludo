import React, { useState } from 'react';
import { SoundManager } from '../audio/SoundManager';

interface DiceBoxProps {
  value: number | null;
  disabled: boolean;
  onRoll: () => void;
}

export const DiceBox: React.FC<DiceBoxProps> = ({ value, disabled, onRoll }) => {
  const [rolling, setRolling] = useState(false);

  const handleClick = () => {
    if (disabled || rolling) return;
    SoundManager.playDiceShake();
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
      onRoll();
    }, 400);
  };

  const renderDots = (val: number) => {
    const dotMap: Record<number, number[]> = {
      1: [5],
      2: [1, 9],
      3: [1, 5, 9],
      4: [1, 3, 7, 9],
      5: [1, 3, 5, 7, 9],
      6: [1, 3, 4, 6, 7, 9]
    };
    const active = dotMap[val] || [5];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '38px', height: '38px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {active.includes(i) && (
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: val === 1 ? '#ff3366' : '#1a2035' }} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '58px',
        height: '58px',
        background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
        borderRadius: '14px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255,255,255,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transform: rolling ? 'rotate(180deg) scale(0.92)' : 'none',
        transition: 'transform 0.25s ease'
      }}
    >
      {value ? renderDots(value) : <span style={{ fontSize: '1.6rem' }}>🎲</span>}
    </div>
  );
};
