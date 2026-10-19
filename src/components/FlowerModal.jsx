import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { FLOWER_MESSAGES } from '../data/flowerMessages.js';

export function FlowerModal({ flowerId, onClose }) {
  const flowerData = FLOWER_MESSAGES[flowerId];

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!flowerData) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop-click" onClick={onClose} aria-label="Close modal overlay" />
      <div className="flower-card" role="dialog" aria-modal="true">
        {/* Card Header */}
        <div className="flower-card-header">
          <div
            className="flower-icon-wrap"
            style={{
              background: flowerData.bgGradient,
              border: `1.5px solid ${flowerData.accentColor}33`
            }}
          >
            <span>{flowerData.icon}</span>
          </div>

          <button
            className="card-close-btn"
            onClick={onClose}
            aria-label="Đóng lời nhắn"
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Titles */}
        <div className="flower-titles">
          <div
            className="flower-badge-tag"
            style={{
              color: flowerData.accentColor,
              background: `${flowerData.accentColor}18`
            }}
          >
            {flowerData.badge}
          </div>
          <h2 className="flower-name">{flowerData.name}</h2>
          <p className="flower-subtitle">“{flowerData.subtitle}”</p>
        </div>

        {/* Meaning Box */}
        <div
          className="flower-meaning-box"
          style={{ borderLeftColor: flowerData.accentColor }}
        >
          <strong>Ý nghĩa:</strong> {flowerData.meaning}
        </div>

        {/* Message Content */}
        <div className="flower-message-text">
          {flowerData.content}
        </div>

        {/* Footer */}
        <div className="flower-card-footer">
          <button className="btn-secondary" onClick={onClose}>
            Còn nhiều lời thương đang chờ em ♡
          </button>
        </div>
      </div>
    </div>
  );
}
