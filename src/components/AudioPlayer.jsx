import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Procedural Web Audio API Music Box / Kalimba lullaby
 * - Defaults to OFF (muted)
 * - Zero external assets needed
 * - Plays a gentle, peaceful melody when enabled
 */
export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  // Pentatonic notes in Hz (C major / A minor pentatonic: C4, D4, E4, G4, A4, C5, D5, E5)
  const notes = [
    261.63, 293.66, 329.63, 392.00, 440.00,
    523.25, 587.33, 659.25, 783.99
  ];

  // Peaceful lullaby sequence
  const sequence = [
    { note: 2, dur: 0.6 },
    { note: 4, dur: 0.6 },
    { note: 5, dur: 0.8 },
    { note: 4, dur: 0.6 },
    { note: 2, dur: 0.6 },
    { note: 0, dur: 1.0 },
    { note: 3, dur: 0.6 },
    { note: 5, dur: 0.6 },
    { note: 7, dur: 0.8 },
    { note: 5, dur: 0.6 },
    { note: 3, dur: 0.8 },
    { note: 1, dur: 1.0 }
  ];

  function playTone(freq, time = 0.8) {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sine + subtle triangle for warm music box / chime timbre
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + time);
  }

  function toggleAudio() {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    } else {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      let step = 0;
      playTone(notes[sequence[0].note], sequence[0].dur);

      timerRef.current = setInterval(() => {
        step = (step + 1) % sequence.length;
        const currentNote = sequence[step];
        playTone(notes[currentNote.note], currentNote.dur);
      }, 750);

      setIsPlaying(true);
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      className="icon-btn"
      onClick={toggleAudio}
      title={isPlaying ? 'Tắt giai điệu' : 'Bật giai điệu nhẹ nhàng'}
      aria-label={isPlaying ? 'Tắt giai điệu' : 'Bật giai điệu nhẹ nhàng'}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
