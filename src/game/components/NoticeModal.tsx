import React from 'react';
import { X } from 'lucide-react';

interface NoticeModalProps {
  onClose: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ border: '2px solid var(--accent-gold)' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '12px', textAlign: 'center', fontSize: '1.2rem' }}>
          Notice
        </h3>
        <p style={{ fontSize: '0.88rem', lineHeight: '1.5', textAlign: 'center', color: '#e0e7ff', marginBottom: '16px' }}>
          24 Hours Virtual Practice & Tournaments Available.<br />
          <strong>Happy Gaming!</strong>
        </p>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' }}>
          * Free gaming platform. Virtual coins hold zero real cash value.
        </div>
        <button className="btn btn-gold btn-block" onClick={onClose}>
          Continue to Arena
        </button>
      </div>
    </div>
  );
};
