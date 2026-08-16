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
  const imagesRef = useRef([]);

  // Preload frame images for buttery smooth 60fps canvas rendering
  useEffect(() => {
    let isMounted = true;
    const images = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/${padZero(i)}.png`;
      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= 15) { // Show canvas as soon as first 15 frames are ready
          setIsReady(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      isMounted = false;
    };
  }, []);

  // Draw current frame on canvas
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Set canvas dimensions to container size
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    // Cover scale algorithm
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
  };

  // Scroll event listener
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
  }, [isReady]);

  // Initial draw when ready
  useEffect(() => {
    if (isReady) {
      drawFrame(1);
    }
  }, [isReady]);

  return (
    <section ref={containerRef} className="frame-hero-wrapper" style={{ position: 'relative', height: '320vh', background: '#09090B' }}>
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
        {/* Canvas for 60fps sequence */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'contrast(1.08) brightness(0.95)'
          }}
        />

        {/* Ambient Dark Gradient Overlays for High Contrast Readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.65) 50%, rgba(9,9,11,0.2) 100%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.5) 0%, transparent 30%, rgba(9,9,11,0.85) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Dynamic Storytelling Text Elements Based on Scroll Position */}
        <div className="container" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', zIndex: 10 }}>
          
          {/* Phase 1: 0% - 33% Progress */}
          <div style={{
            maxWidth: '680px',
            opacity: progress < 0.32 ? 1 - progress * 2.8 : 0,
            transform: `translateY(${progress * -40}px)`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            pointerEvents: progress < 0.32 ? 'auto' : 'none'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(220, 38, 38, 0.2)',
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
              <span>↓ Scroll to explore technical mastery</span>
            </div>
          </div>

          {/* Phase 2: 34% - 66% Progress */}
          <div style={{
            position: 'absolute',
            maxWidth: '680px',
            opacity: progress >= 0.32 && progress < 0.68 ? Math.sin((progress - 0.32) / 0.36 * Math.PI) : 0,
            transform: `translateY(${(progress - 0.5) * -30}px)`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            pointerEvents: progress >= 0.32 && progress < 0.68 ? 'auto' : 'none'
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
            opacity: progress >= 0.68 ? Math.min((progress - 0.68) * 4, 1) : 0,
            transform: `translateY(${(1 - progress) * 20}px)`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
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

        {/* Scroll Progress Bar at the top of the viewport */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progress * 100}%`,
          height: '4px',
          background: 'linear-gradient(90deg, #DC2626, #EF4444, #F87171)',
          zIndex: 20,
          transition: 'width 0.1s linear'
        }} />
      </div>
    </section>
  );
}
