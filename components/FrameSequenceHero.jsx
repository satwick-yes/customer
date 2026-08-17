'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const TOTAL_FRAMES = 192;

const padZero = (num) => String(num).padStart(5, '0');

export default function FrameSequenceHero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // References for physics-based smoothed linear interpolation (LERP)
  const imagesRef = useRef([]);
  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const animationFrameIdRef = useRef(null);
  const lastDrawnFrameRef = useRef(-1);

  // 1. Preload WebP frame images (Ultra fast ~20KB per frame)
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
        if (loaded >= 8) {
          setIsReady(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      isMounted = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // 2. High-performance canvas draw routine with sub-pixel rendering
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const roundedIndex = Math.min(Math.max(Math.round(frameIndex), 1), TOTAL_FRAMES);

    // Find nearest loaded frame if the exact frame is still downloading
    let img = imagesRef.current[roundedIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 10; offset++) {
        const prev = imagesRef.current[Math.max(0, roundedIndex - 1 - offset)];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    // High quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Cover scale calculations
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;
    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = width;
      renderH = width / imgRatio;
      offsetX = 0;
      offsetY = (height - renderH) / 2;
    } else {
      renderH = height;
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    lastDrawnFrameRef.current = roundedIndex;
  };

  // 3. Silky Continuous Smooth 60/120FPS LERP Loop with 50% Smoother Damping (0.070 inertia)
  useEffect(() => {
    const renderLoop = () => {
      // Smoothly interpolate current frame toward target scroll frame (50% smoother momentum damping)
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * 0.070; // 50% smoother Apple-style inertia (was 0.14)
        drawFrame(currentFrameRef.current);
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // 4. Scroll tracking with 50% slower progression (extended 510vh scroll track)
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

      const targetFrame = 1 + rawProgress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = targetFrame;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Initial draw
  useEffect(() => {
    if (isReady) {
      drawFrame(1);
    }
  }, [isReady]);

  return (
    <section ref={containerRef} className="frame-hero-wrapper" style={{ position: 'relative', height: '510vh', background: '#09090B' }}>
      {/* Sticky Fullscreen Canvas Viewport */}
      <div style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090B'
      }}>
        {/* Canvas for 60/120fps smooth sequence */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'contrast(1.06) brightness(0.96)',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />

        {/* Ambient Dark Gradient Overlays for High Contrast Readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.65) 50%, rgba(9,9,11,0.18) 100%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.45) 0%, transparent 28%, rgba(9,9,11,0.85) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Dynamic Storytelling Text Elements Synchronized with Scroll */}
        <div className="container" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', zIndex: 10 }}>
          
          {/* Phase 1: 0% - 32% Progress */}
          <div style={{
            maxWidth: '680px',
            opacity: progress < 0.32 ? Math.max(0, 1 - progress * 3.1) : 0,
            transform: `translate3d(0, ${progress * -40}px, 0)`,
            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: progress < 0.32 ? 'auto' : 'none'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(220, 38, 38, 0.22)',
              border: '1px solid #DC2626',
              color: '#F87171',
              padding: '6px 16px',
              borderRadius: 30,
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', animation: 'pulse 1.5s infinite' }}></span>
              📍 Chandigarh, Mohali, Panchkula & Tricity
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 18 }}>
              Be it your <span style={{ color: '#EF4444', textDecoration: 'underline', textDecorationColor: '#DC2626' }}>AC</span> or be it your <span style={{ color: '#EF4444', textDecoration: 'underline', textDecorationColor: '#DC2626' }}>Fridge</span>...
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#E4E4E7', lineHeight: 1.6, marginBottom: 28, maxWidth: '560px' }}>
              India's premier certified appliance repair service with <strong style={{ color: 'white' }}>30-minute average technician arrival</strong> at your doorstep.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#A1A1AA', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ animation: 'bounce 2s infinite' }}>↓</span> Scroll to explore precision repair
            </div>
          </div>

          {/* Phase 2: 32% - 68% Progress */}
          <div style={{
            position: 'absolute',
            maxWidth: '680px',
            opacity: progress >= 0.28 && progress < 0.70 ? Math.sin((progress - 0.28) / 0.42 * Math.PI) : 0,
            transform: `translate3d(0, ${(progress - 0.5) * -35}px, 0)`,
            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: progress >= 0.28 && progress < 0.70 ? 'auto' : 'none'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid #EF4444',
              color: '#FCA5A5',
              padding: '6px 16px',
              borderRadius: 30,
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16
            }}>
              ⚡ Precision Field Diagnostics
            </div>

            <h2 style={{ fontSize: 'clamp(2.3rem, 5.2vw, 3.8rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 18 }}>
              Master Diagnostics & <span style={{ color: '#EF4444' }}>Instant On-Site Quotes.</span>
            </h2>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#E4E4E7', lineHeight: 1.6, maxWidth: '580px' }}>
              Inspection from <strong style={{ color: '#EF4444' }}>₹299/₹499</strong>. Our master technicians test electricals, gas pressure & components, sending an exact digital quote to your phone before any work begins.
            </p>
          </div>

          {/* Phase 3: 68% - 100% Progress (Call to Action Finale) */}
          <div style={{
            position: 'absolute',
            maxWidth: '720px',
            opacity: progress >= 0.68 ? Math.min((progress - 0.68) * 3.5, 1) : 0,
            transform: `translate3d(0, ${(1 - progress) * 25}px, 0)`,
            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: progress >= 0.68 ? 'auto' : 'none'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(220, 38, 38, 0.3)',
              border: '1.5px solid #DC2626',
              color: '#FCA5A5',
              padding: '6px 18px',
              borderRadius: 30,
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16
            }}>
              🛡️ 60-Day Service Guarantee
            </div>

            <h2 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 18 }}>
              We Can <span style={{ color: '#EF4444' }}>Fix It All.</span>
            </h2>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#E4E4E7', lineHeight: 1.6, marginBottom: 28, maxWidth: '580px' }}>
              From jet deep cleaning & gas refills to inverter PCB repairs — backed by 100% genuine spare parts & 60-day warranty certificate.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link 
                href="/booking" 
                className="btn btn-primary"
                style={{
                  height: '56px',
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  padding: '0 32px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  border: 'none',
                  boxShadow: '0 8px 30px rgba(220, 38, 38, 0.45)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>⚡</span> Book Master Service Now
              </Link>
              
              <Link 
                href="/dashboard" 
                className="btn btn-outline"
                style={{
                  height: '56px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  padding: '0 24px',
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>📍</span> Track Live Booking
              </Link>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: 28, marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>4.9/5 ⭐</div>
                <div style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>12,000+ Happy Homes</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#EF4444' }}>30 Mins ⚡</div>
                <div style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>Avg. Arrival Time</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>60 Days 🛡️</div>
                <div style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>Official Warranty</div>
              </div>
            </div>
          </div>

        </div>

        {/* Smooth Scroll Progress Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progress * 100}%`,
          height: '4px',
          background: 'linear-gradient(90deg, #DC2626, #EF4444, #F87171)',
          zIndex: 20,
          transition: 'width 0.05s linear'
        }} />
      </div>
    </section>
  );
}
