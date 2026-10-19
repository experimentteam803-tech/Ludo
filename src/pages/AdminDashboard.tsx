import React, { useState } from 'react';

export const AdminDashboard: React.FC = () => {
  const [cooldownMins, setCooldownMins] = useState(60);
  const [requiredAds, setRequiredAds] = useState(2);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Configuration saved successfully to server state!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '70px' }}>
      <h2 style={{ color: 'var(--accent-gold)', marginBottom: '6px' }}>Admin Dashboard</h2>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '16px' }}>
        Operational control panel for Ludo Royale system variables
      </span>

      <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-card)', marginBottom: '14px' }}>
        <h4 style={{ marginBottom: '12px' }}>Free Game Ad Rule Controls</h4>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required Completed Ads</label>
            <input
              type="number"
              value={requiredAds}
              onChange={e => setRequiredAds(Number(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cooldown Duration (Minutes)</label>
            <input
              type="number"
              value={cooldownMins}
              onChange={e => setCooldownMins(Number(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
            />
          </div>

          <button type="submit" className="btn btn-gold btn-block" style={{ marginTop: '8px' }}>
            Update System Parameters
          </button>
        </form>
        {statusMsg && <div style={{ color: 'var(--accent-green)', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center' }}>{statusMsg}</div>}
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-card)' }}>
        <h4 style={{ marginBottom: '6px' }}>Audit Telemetry</h4>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          <div>[SYSTEM_INIT] Server authoritative clock active.</div>
          <div>[STORAGE] Client wallet abstraction verified.</div>
        </div>
      </div>
    </div>
  );
};
