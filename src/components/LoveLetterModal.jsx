import React, { useEffect, useRef, useState } from 'react';
import { Move, RotateCcw, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOVE_LETTER } from '../data/flowerMessages.js';

export function LoveLetterModal({ isOpen, onClose }) {
  const letterRef = useRef(null);
  const dragRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

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

  function handleRotationStart(event) {
    if (event.target.closest('button')) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY
    };
    setIsDragging(true);
  }

  function handleRotationMove(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    rotationRef.current.x -= deltaY * 0.7;
    rotationRef.current.y += deltaX * 0.7;
    letterRef.current.style.setProperty('--letter-rotate-x', `${rotationRef.current.x}deg`);
    letterRef.current.style.setProperty('--letter-rotate-y', `${rotationRef.current.y}deg`);
  }

  function handleRotationEnd(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
  }

  function handleRotationReset() {
    rotationRef.current = { x: 0, y: 0 };
    letterRef.current.style.setProperty('--letter-rotate-x', '0deg');
    letterRef.current.style.setProperty('--letter-rotate-y', '0deg');
  }

  if (!isOpen) return null;

  return (
    <div className="letter-modal-wrap">
      <div className="letter-backdrop" onClick={onClose} aria-label="Close love letter" />
      
      <div
        ref={letterRef}
        className={`letter-paper${isDragging ? ' is-dragging' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="letter-close-btn"
          onClick={onClose}
          aria-label="Đóng thư"
          title="Đóng thư"
        >
          <X size={20} />
        </button>

        {/* Letter Header */}
        <div
          className="letter-header-decor letter-rotation-handle"
          onPointerDown={handleRotationStart}
          onPointerMove={handleRotationMove}
          onPointerUp={handleRotationEnd}
          onPointerCancel={handleRotationEnd}
          onLostPointerCapture={handleRotationEnd}
        >
          <div className="letter-stamp">💌</div>
          <div className="letter-date">{LOVE_LETTER.date}</div>
          <h2 className="letter-title">{LOVE_LETTER.title}</h2>
          <div className="letter-rotation-hint">
            <Move size={15} aria-hidden="true" />
            <span>Kéo để xoay thư 3D</span>
            <button
              className="letter-reset-btn"
              onClick={handleRotationReset}
              aria-label="Đưa thư về chính diện"
              title="Đưa thư về chính diện"
            >
              <RotateCcw size={15} />
            </button>
          </div>
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
