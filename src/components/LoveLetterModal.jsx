import React, { useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOVE_LETTER } from '../data/flowerMessages.js';

export function LoveLetterModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      // Romantic confetti burst: warm pastel pinks, gold, and cream
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F78DA7', '#FFD166', '#FF9F1C', '#E63946', '#FFE3E8'],
          disableForReducedMotion: true
        });
      } catch (e) {
        // Fallback if canvas-confetti is not supported
      }

      function handleKeyDown(e) {
        if (e.key === 'Escape') onClose();
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="letter-modal-wrap">
      <div className="letter-backdrop" onClick={onClose} aria-label="Close love letter" />
      
      <div className="letter-paper" role="dialog" aria-modal="true">
        <button
          className="letter-close-btn"
          onClick={onClose}
          aria-label="Đóng thư"
          title="Đóng thư"
        >
          <X size={20} />
        </button>

        {/* Letter Header */}
        <div className="letter-header-decor">
          <div className="letter-stamp">💌</div>
          <div className="letter-date">{LOVE_LETTER.date}</div>
          <h2 className="letter-title">{LOVE_LETTER.title}</h2>
        </div>

        {/* Letter Body */}
        <div className="letter-content-body">
          {LOVE_LETTER.paragraphs.map((para, idx) => (
            <p key={idx} className="letter-paragraph">
              {para}
            </p>
          ))}
          <div className="letter-signature">{LOVE_LETTER.signature}</div>
        </div>
      </div>
    </div>
  );
}
