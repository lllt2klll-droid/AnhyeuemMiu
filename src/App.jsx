import React, { useState, useEffect } from 'react';
import { BouquetCanvas } from './components/BouquetCanvas.jsx';
import { FlowerModal } from './components/FlowerModal.jsx';
import { LoveLetterModal } from './components/LoveLetterModal.jsx';
import { OverlayUI } from './components/OverlayUI.jsx';
import { FLOWER_MESSAGES } from './data/flowerMessages.js';

export function App() {
  const [isNightMode, setIsNightMode] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [discoveredFlowers, setDiscoveredFlowers] = useState(() => new Set());
  const [showToast, setShowToast] = useState(true);

  const totalFlowerTypes = Object.keys(FLOWER_MESSAGES).length;

  function handleSelectFlower(flowerId, flowerObject) {
    setSelectedFlower({ id: flowerId, object: flowerObject });
    setDiscoveredFlowers((prev) => {
      const next = new Set(prev);
      next.add(flowerId);
      return next;
    });
  }

  function handleCloseModal() {
    setSelectedFlower(null);
  }

  function handleToggleNightMode() {
    setIsNightMode((prev) => !prev);
  }

  function handleResetCamera() {
    setResetTrigger((prev) => prev + 1);
  }

  function handleOpenLetter() {
    setIsLetterOpen(true);
    setSelectedFlower(null); // close flower card if open
  }

  function handleCloseLetter() {
    setIsLetterOpen(false);
  }

  // Toast hint on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`app-container ${isNightMode ? 'night-mode' : 'day-mode'}`}
      onPointerDownCapture={() => setShowToast(false)}
    >
      {/* 3D WebGL Canvas */}
      <BouquetCanvas
        isNightMode={isNightMode}
        selectedFlower={selectedFlower}
        onSelectFlower={handleSelectFlower}
        onOpenLetter={handleOpenLetter}
        resetTrigger={resetTrigger}
      />

      {/* Floating UI Elements */}
      <OverlayUI
        isNightMode={isNightMode}
        onToggleNightMode={handleToggleNightMode}
        onResetCamera={handleResetCamera}
        onOpenLetter={handleOpenLetter}
        discoveredCount={discoveredFlowers.size}
        totalFlowers={totalFlowerTypes}
      />

      {/* Floating Gentle Hint Toast */}
      {showToast && (
        <div className="interaction-hint-toast" role="status" aria-live="polite">
          ✨ Kéo để xoay • Chạm vào hoa để khám phá • Chọn ♥ để đọc thư
        </div>
      )}

      {/* Flower Details Modal Card */}
      {selectedFlower && (
        <FlowerModal
          flowerId={selectedFlower.id}
          onClose={handleCloseModal}
        />
      )}

      {/* Love Letter Modal (Chiếc nơ ruy băng) */}
      <LoveLetterModal
        isOpen={isLetterOpen}
        onClose={handleCloseLetter}
      />
    </div>
  );
}

export default App;
