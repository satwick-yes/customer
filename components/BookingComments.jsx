'use client';

import { useState } from 'react';

export default function BookingComments({ booking, isAdmin = false }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const comments = booking.comments || [];

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/bookings/${booking.jobId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), author: isAdmin ? 'Admin' : 'Customer' })
      });
      if (!res.ok) {
        throw new Error('Failed to post comment');
      }
      setText('');
      // Polling will update the UI automatically.
    } catch (err) {
      setError('Could not send comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-wrap">
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Leave a message below if you have any questions or updates.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className={`comment ${c.author === 'Admin' ? 'admin' : 'customer'}`}>
              <div className="comment-bubble">
                <div className="comment-header">
                  <strong>{c.author}</strong>
                  <span>{new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handlePost} className="comment-form">
        <textarea
          className="form-input"
          placeholder="Type your message here..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={2}
          style={{ resize: 'vertical' }}
        />
        {error && <p className="form-error">⚠️ {error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading || !text.trim()} style={{ alignSelf: 'flex-end', marginTop: '8px' }}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <style jsx>{`
        .comments-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 8px;
        }
        .no-comments {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-align: center;
          padding: 12px;
          background: var(--bg-soft);
          border-radius: var(--radius-md);
        }
        .comment {
          display: flex;
          flex-direction: column;
        }
        .comment.customer {
          align-items: flex-end;
        }
        .comment.admin {
          align-items: flex-start;
        }
        .comment-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 16px;
          background: var(--bg-soft);
        }
        .comment.customer .comment-bubble {
          background: var(--primary-ultra-light);
          color: var(--text);
          border-bottom-right-radius: 4px;
        }
        .comment.admin .comment-bubble {
          background: #f1f5f9;
          border-bottom-left-radius: 4px;
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.75rem;
          margin-bottom: 4px;
          color: var(--text-light);
        }
        .comment-header strong {
          color: var(--text);
        }
        .comment.customer .comment-header strong {
          color: var(--primary);
        }
        .comment-text {
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-wrap;
        }
        .comment-form {
          display: flex;
          flex-direction: column;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
