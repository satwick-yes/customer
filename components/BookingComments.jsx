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
</div>
  );
}
