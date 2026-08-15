'use client';

import { useState, useEffect } from 'react';

const STATUS_STEPS = [
  { key: 'Pending',             label: 'Booking Confirmed',    icon: '📋', desc: 'Your booking has been received.' },
  { key: 'Technician Assigned', label: 'Technician Assigned',  icon: '👨‍🔧', desc: 'A certified technician is on the way.' },
  { key: 'Work in Progress',    label: 'Work in Progress',     icon: '🔧', desc: 'Repair work has started.' },
  { key: 'Completed',           label: 'Job Completed',        icon: '✅', desc: 'Your appliance is repaired.' },
];

const STATUS_INDEX = {
  'Pending': 0,
  'Technician Assigned': 1,
  'Work in Progress': 2,
  'Completed': 3,
};

export default function StatusTimeline({ status }) {
  const currentIdx = STATUS_INDEX[status] ?? 0;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const progressPercent = (currentIdx / (STATUS_STEPS.length - 1)) * 100;

  return (
    <div className="timeline">
      {/* Progress Bar */}
      <div className="timeline__bar-wrap">
        <div className="timeline__bar-track">
          <div
            className="timeline__bar-fill"
            style={{ width: animated ? `${progressPercent}%` : '0%' }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="timeline__steps">
        {STATUS_STEPS.map((step, idx) => {
          const isDone    = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;
          return (
            <div
              key={step.key}
              className={`timeline__step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="step__icon-wrap">
                {isCurrent && <div className="step__pulse-ring" />}
                <div className="step__icon">{step.icon}</div>
              </div>
              <div className="step__content">
                <div className="step__label">{step.label}</div>
                {isCurrent && <div className="step__desc">{step.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .timeline {
          padding: 8px 0;
        }
        .timeline__bar-wrap {
          padding: 0 40px;
          margin-bottom: 8px;
        }
        .timeline__bar-track {
          height: 6px;
          background: var(--primary-ultra-light);
          border-radius: 3px;
          overflow: hidden;
        }
        .timeline__bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
          border-radius: 3px;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .timeline__steps {
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }
        .timeline__step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: fadeInUp 0.5s ease both;
          gap: 10px;
        }
        .step__icon-wrap {
          position: relative;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step__pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid var(--primary);
          animation: pulseRing 1.5s ease-out infinite;
        }
        .step__icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          transition: var(--transition);
          position: relative;
          z-index: 1;
        }
        .done .step__icon {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          box-shadow: 0 4px 16px rgba(227, 30, 36, 0.3);
        }
        .current .step__icon {
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
          box-shadow: 0 4px 20px rgba(227, 30, 36, 0.5);
          animation: pulse 2s ease infinite;
        }
        .pending .step__icon {
          background: var(--primary-ultra-light);
          opacity: 0.5;
        }
        .step__content { width: 100%; }
        .step__label {
          font-size: 0.78rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--text);
        }
        .done .step__label    { color: var(--primary); }
        .pending .step__label { color: var(--text-light); }
        .step__desc {
          font-size: 0.72rem;
          color: var(--primary);
          margin-top: 4px;
          font-weight: 500;
        }
        @media (max-width: 480px) {
          .timeline__steps { gap: 4px; }
          .step__icon { width: 44px; height: 44px; font-size: 1.1rem; }
          .step__icon-wrap { width: 52px; height: 52px; }
          .step__label { font-size: 0.7rem; }
          .step__desc { display: none; }
          .timeline__bar-wrap { padding: 0 26px; }
        }
      `}</style>
    </div>
  );
}
