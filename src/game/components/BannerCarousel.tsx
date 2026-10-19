import React, { useState, useEffect } from 'react';

const BANNERS = [
  {
    tag: 'REGISTER & GET',
    title: '1,000 Coins Free',
    desc: 'Instant welcome reward granted to every new player!'
  },
  {
    tag: 'SEASON 1',
    title: 'Royal Championship',
    desc: 'Compete in 1 Goti, 2 Goti & Classic arenas!'
  },
  {
    tag: 'FREE PASS',
    title: '2 Ads = 1 Free Game',
    desc: 'Unlock tournament passes without spending virtual coins.'
  }
];

export const BannerCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const b = BANNERS[index];

  return (
    <div className="banner-container">
      <span style={{ fontSize: '0.65rem', background: 'rgba(255,200,59,0.2)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>
        {b.tag}
      </span>
      <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '4px 0 2px 0' }}>{b.title}</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.desc}</p>
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        {BANNERS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? '16px' : '6px',
              height: '4px',
              borderRadius: '2px',
              background: i === index ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.25s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};
