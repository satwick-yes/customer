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
</div>
  );
}
