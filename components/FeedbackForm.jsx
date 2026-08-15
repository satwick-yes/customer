'use client';

import { useState } from 'react';
import { submitFeedback } from '@/lib/bookingService';

export default function FeedbackForm({ booking }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(!!booking?.feedback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (submitted || booking?.feedback) {
    const fb = booking?.feedback;
    return (
      <div className="feedback-done anim-scale-in">
        <div className="success-icon">✓</div>
        <h4>Thanks for your feedback!</h4>
        {fb && (
          <>
            <div className="stars-display">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={`star-disp${i <= fb.rating ? ' filled' : ''}`}>★</span>
              ))}
            </div>
            {fb.review && <p className="review-text">"{fb.review}"</p>}
          </>
        )}
</div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setLoading(true);
    setError('');
    try {
      await submitFeedback(booking.docId, rating, review);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <div className="fb-header">
        <h3 className="fb-title">Share Your Experience</h3>
        <p className="fb-subtitle">How was the repair service?</p>
      </div>

      <div className="stars-row">
        {[1,2,3,4,5].map(i => (
          <button
            key={i}
            type="button"
            id={`star-${i}`}
            className={`star-btn${(hover || rating) >= i ? ' active' : ''}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i)}
            aria-label={`Rate ${i} stars`}
          >
            ★
          </button>
        ))}
      </div>

      {(hover || rating) > 0 && (
        <div className="rating-label anim-fade-in">{labels[hover || rating]}</div>
      )}

      <div className="form-group">
        <label htmlFor="review-text" className="form-label">Write a review (optional)</label>
        <textarea
          id="review-text"
          className="form-input"
          rows={3}
          placeholder="Tell us about your experience..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={400}
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'right' }}>
          {review.length}/400
        </span>
      </div>

      {error && <p className="form-error">⚠️ {error}</p>}

      <button id="submit-feedback" type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
        {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '⭐ Submit Feedback'}
      </button>

      <style jsx>{`
        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .fb-header { text-align: center; }
        .fb-title { font-size: 1.2rem; margin-bottom: 4px; }
        .fb-subtitle { color: var(--text-muted); font-size: 0.9rem; }
        .stars-row {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .star-btn {
          background: none;
          border: none;
          font-size: 2.5rem;
          color: #E5E7EB;
          transition: all 0.15s ease;
          cursor: pointer;
          line-height: 1;
        }
        .star-btn.active {
          color: #F59E0B;
          animation: starPop 0.2s ease;
        }
        .star-btn:hover {
          transform: scale(1.2);
        }
        .rating-label {
          text-align: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
        }
      `}</style>
    </form>
  );
}
