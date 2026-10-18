import React, { useState, useEffect } from 'react';
import { BouquetCanvas } from './components/BouquetCanvas.jsx';
import { FlowerModal } from './components/FlowerModal.jsx';
import { LoveLetterModal } from './components/LoveLetterModal.jsx';
import { OverlayUI } from './components/OverlayUI.jsx';
import { FLOWER_MESSAGES } from './data/flowerMessages.js';

export function App() {
  const [isNightMode, setIsNightMode] = useState(false);
  const [selectedFlowerId, setSelectedFlowerId] = useState(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [discoveredFlowers, setDiscoveredFlowers] = useState(() => new Set());
  const [showToast, setShowToast] = useState(false);

  const totalFlowerTypes = Object.keys(FLOWER_MESSAGES).length;

  function handleSelectFlower(flowerId) {
    setSelectedFlowerId(flowerId);
    setDiscoveredFlowers((prev) => {
      const next = new Set(prev);
      next.add(flowerId);
      return next;
    });
  }

  function handleCloseModal() {
    setSelectedFlowerId(null);
  }

  function handleToggleNightMode() {
    setIsNightMode((prev) => !prev);
  }

  function handleResetCamera() {
    setResetTrigger((prev) => prev + 1);
  }

  function handleOpenLetter() {
    setIsLetterOpen(true);
    setSelectedFlowerId(null); // close flower card if open
  }

  function handleCloseLetter() {
    setIsLetterOpen(false);
  }

  // Toast hint on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
      const hideTimer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`app-container ${isNightMode ? 'night-mode' : 'day-mode'}`}>
      {/* 3D WebGL Canvas */}
      <BouquetCanvas
        isNightMode={isNightMode}
        selectedFlowerId={selectedFlowerId}
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
        <div className="interaction-hint-toast">
          ✨ Chạm vào hoa để đọc lời nhắn • Chạm vào nơ để mở thư
        </div>
      )}

      {/* Flower Details Modal Card */}
      {selectedFlowerId && (
        <FlowerModal
          flowerId={selectedFlowerId}
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
