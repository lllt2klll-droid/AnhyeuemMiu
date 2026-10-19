import React from 'react';
import { Sun, Moon, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer.jsx';
import { SITE_METADATA } from '../data/flowerMessages.js';

export function OverlayUI({
  isNightMode,
  onToggleNightMode,
  onResetCamera,
  onOpenLetter,
  discoveredCount = 0,
  totalFlowers = 7
}) {
  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <div className="header-badge">
          <Sparkles size={14} />
          <span>20 THÁNG 10 ♡</span>
        </div>
        <h1 className="header-title">{SITE_METADATA.headerTitle}</h1>
        <p className="header-subtitle">{SITE_METADATA.introSubtitle}</p>
      </header>

      {/* Floating Bottom Controls */}
      <div className="floating-controls">
        {/* Left: Mode Toggle & Audio */}
        <div className="control-group">
          <button
            className="icon-btn"
            onClick={onToggleNightMode}
            title={isNightMode ? 'Chuyển sang ban ngày' : 'Chuyển sang ban đêm'}
            aria-label={isNightMode ? 'Chuyển sang ban ngày' : 'Chuyển sang ban đêm'}
          >
            {isNightMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <AudioPlayer />
        </div>

        {/* Center: Hint & Exploration Progress */}
        <button
          type="button"
          className="bottom-hint-pill"
          onClick={onOpenLetter}
          title="Chạm vào nơ hoặc bấm vào đây để mở thư"
          aria-label="Mở lá thư gửi Quỳnh"
        >
          <span>✨</span>
          <span>{SITE_METADATA.introHint}</span>
          {discoveredCount > 0 && (
            <span style={{ opacity: 0.8, fontSize: '0.8rem', marginLeft: 4 }}>
              ({discoveredCount}/{totalFlowers})
            </span>
          )}
        </button>

        {/* Right: Reset Camera & Open Letter */}
        <div className="control-group">
          <button
            className="icon-btn"
            onClick={onResetCamera}
            title="Đưa camera về góc ban đầu"
            aria-label="Đưa camera về góc ban đầu"
          >
            <RotateCcw size={19} />
          </button>

          <button
            className="icon-btn"
            onClick={onOpenLetter}
            title="Mở lá thư gửi Quỳnh"
            aria-label="Mở lá thư gửi Quỳnh"
            style={{ color: '#E63946' }}
          >
            <Heart size={20} fill="#E63946" />
          </button>
        </div>
      </div>
    </>
  );
}
