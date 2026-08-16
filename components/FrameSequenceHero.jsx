'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const TOTAL_FRAMES = 192;
const padZero = (num) => String(num).padStart(5, '0');

export default function FrameSequenceHero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const imagesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Preload optimized WebP frames into memory cache
  useEffect(() => {
    let isMounted = true;
    const images = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/${padZero(i)}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === 1) {
          drawFrame(1);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Draw frame on canvas with high DPI support & proper aspect fit
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;

    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, displayW, displayH);

    // Calculate aspect ratio fit (contain / aesthetic cover)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = displayW / displayH;
    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderH = displayH;
      renderW = displayH * imgRatio;
      offsetX = (displayW - renderW) / 2;
      offsetY = 0;
    } else {
      renderW = displayW;
      renderH = displayW / imgRatio;
      offsetX = 0;
      offsetY = (displayH - renderH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  };

  // Scroll listener for sequence scrubbing
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollDist = -rect.top;
      const totalScroll = container.offsetHeight - window.innerHeight;

      if (totalScroll <= 0) return;

      const rawProgress = Math.min(Math.max(scrollDist / totalScroll, 0), 1);
      setProgress(rawProgress);

      // Determine step
      if (rawProgress < 0.33) setActiveStep(0);
      else if (rawProgress < 0.68) setActiveStep(1);
      else setActiveStep(2);

      const frameIndex = Math.min(
        Math.max(Math.floor(rawProgress * (TOTAL_FRAMES - 1)) + 1, 1),
        TOTAL_FRAMES
      );

      requestAnimationFrame(() => {
        drawFrame(frameIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Play/Pause Auto Demonstration
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      setIsPlaying(true);
      let cur = Math.floor(progress * (TOTAL_FRAMES - 1)) + 1;
      const step = () => {
        cur++;
        if (cur > TOTAL_FRAMES) cur = 1;
        setProgress((cur - 1) / (TOTAL_FRAMES - 1));
        drawFrame(cur);
        animFrameRef.current = requestAnimationFrame(step);
      };
      animFrameRef.current = requestAnimationFrame(step);
    }
  };

  return (
    <section ref={containerRef} style={{ position: 'relative', height: '260vh', background: '#09090B' }}>
      {/* Sticky Fullscreen Master Section */}
      <div style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: '#09090B'
      }}>
        {/* Ambient Crimson Glow Gradients */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ width: '100%', zIndex: 10 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            
            {/* LEFT COLUMN: HERO COPY & CALLS TO ACTION */}
            <div style={{ maxWidth: '580px' }}>
              
              {/* Region Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.4)',
                color: '#F87171',
                padding: '6px 16px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 20
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', animation: 'pulse 1.5s infinite' }}></span>
                📍 Chandigarh • Mohali • Panchkula • Zirakpur
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                marginBottom: 20
              }}>
                Be it your <span style={{ color: '#EF4444' }}>AC</span> or be it your <span style={{ color: '#EF4444' }}>Fridge</span>...
                <br />
                <span style={{ color: '#F4F4F5' }}>We Can Fix It All.</span>
              </h1>

              {/* Dynamic Scroll Text Synchronized with Animation */}
              <div style={{
                minHeight: '70px',
                marginBottom: 28,
                transition: 'all 0.3s ease'
              }}>
                {activeStep === 0 && (
                  <p style={{ fontSize: '1.1rem', color: '#D4D4D8', lineHeight: 1.6 }}>
                    India's trusted doorstep appliance service. Certified master technicians with <strong style={{ color: '#FFFFFF' }}>30-minute average arrival</strong> and upfront diagnostic pricing.
                  </p>
                )}
                {activeStep === 1 && (
                  <p style={{ fontSize: '1.1rem', color: '#D4D4D8', lineHeight: 1.6 }}>
                    <strong style={{ color: '#EF4444' }}>⚡ Precision Field Diagnostics:</strong> Comprehensive electrical & gas testing on-site. Exact itemized digital quotation sent to your device before repair begins.
                  </p>
                )}
                {activeStep === 2 && (
                  <p style={{ fontSize: '1.1rem', color: '#D4D4D8', lineHeight: 1.6 }}>
                    <strong style={{ color: '#EF4444' }}>🛡️ 60-Day Master Warranty:</strong> Jet cleaning, compressor overhaul & PCB repairs backed by 100% genuine parts and our official digital warranty certificate.
                  </p>
                )}
              </div>

              {/* Interactive Step Indicators */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
                {[
                  { label: '1. Dispatch & Arrive', step: 0 },
                  { label: '2. Multi-point Diagnosis', step: 1 },
                  { label: '3. Quote & 60D Warranty', step: 2 }
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      const target = s.step === 0 ? 0 : s.step === 1 ? 0.5 : 1;
                      setProgress(target);
                      setActiveStep(s.step);
                      drawFrame(Math.floor(target * (TOTAL_FRAMES - 1)) + 1);
                    }}
                    style={{
                      background: activeStep === s.step ? 'rgba(220, 38, 38, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: activeStep === s.step ? '1.5px solid #DC2626' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: activeStep === s.step ? '#FCA5A5' : '#71717A',
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Primary Action Buttons */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link
                  href="/booking"
                  className="btn btn-primary"
                  style={{
                    height: '54px',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    padding: '0 28px',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    border: 'none',
                    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 12
                  }}
                >
                  <span>⚡</span> Book Master Service Now
                </Link>

                <Link
                  href="/dashboard"
                  className="btn btn-outline"
                  style={{
                    height: '54px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    padding: '0 22px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 12
                  }}
                >
                  <span>📍</span> Track Live Booking
                </Link>
              </div>

              {/* Trust Micro-Metrics */}
              <div style={{ display: 'flex', gap: 24, marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>4.9/5 ⭐</div>
                  <div style={{ fontSize: '0.72rem', color: '#A1A1AA' }}>12,000+ Happy Homes</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#EF4444' }}>30 Mins ⚡</div>
                  <div style={{ fontSize: '0.72rem', color: '#A1A1AA' }}>Avg. Arrival Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>60 Days 🛡️</div>
                  <div style={{ fontSize: '0.72rem', color: '#A1A1AA' }}>Official Warranty</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PRO STYLED INTERACTIVE 3D DISPLAY POD */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              
              {/* Outer Glowing Glass Pod */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                height: '540px',
                borderRadius: '28px',
                padding: '10px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(220,38,38,0.15) 50%, rgba(15,23,42,0.8) 100%)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                boxShadow: '0 25px 60px rgba(220, 38, 38, 0.25), 0 10px 30px rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                
                {/* Top Status Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 14px 10px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#D4D4D8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s infinite' }}></span>
                    <span style={{ color: '#FCA5A5' }}>LIVE WORKFLOW</span>
                  </div>
                  <button
                    type="button"
                    onClick={togglePlay}
                    style={{
                      background: 'rgba(220,38,38,0.3)',
                      border: '1px solid #DC2626',
                      color: 'white',
                      borderRadius: 14,
                      padding: '2px 10px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Auto Play'}
                  </button>
                </div>

                {/* Canvas Display */}
                <div style={{ position: 'relative', flex: 1, borderRadius: 20, overflow: 'hidden', background: '#09090B' }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />

                  {/* Floating Overlay Badge on Canvas */}
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    right: 12,
                    background: 'rgba(9, 9, 11, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 800, textTransform: 'uppercase' }}>
                        {activeStep === 0 ? 'Step 1 • Arrival' : activeStep === 1 ? 'Step 2 • Multi-Check' : 'Step 3 • Completed'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700 }}>
                        {activeStep === 0 ? 'Technician at Doorstep' : activeStep === 1 ? 'Testing & Parts Quote' : '60-Day Warranty Active'}
                      </div>
                    </div>
                    <span style={{ fontSize: '1.3rem' }}>
                      {activeStep === 0 ? '🛵' : activeStep === 1 ? '⚡' : '🛡️'}
                    </span>
                  </div>
                </div>

                {/* Bottom Scrub Progress Bar */}
                <div style={{ padding: '10px 14px 4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#A1A1AA', marginBottom: 4 }}>
                    <span>Scroll to scrub</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${progress * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #DC2626, #EF4444)',
                      transition: isPlaying ? 'none' : 'width 0.1s linear'
                    }} />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
