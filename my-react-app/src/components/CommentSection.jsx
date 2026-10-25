import { useEffect, useRef, useState } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, nameFromEmail } from '../utils/format';

const CommentSection = ({ campaignId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onValue(
      ref(database, `comments/${campaignId}`),
      (snapshot) => {
        const data = snapshot.val() || {};
        setComments(Object.entries(data).map(([id, c]) => ({ id, ...c })).sort((a, b) => a.createdAt - b.createdAt));
        setLoading(false);
      },
      () => { setError('Could not load comments.'); setLoading(false); }
    );
    return () => unsubscribe();
  }, [campaignId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [comments.length]);

  const submit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || !user) return;
    setPosting(true);
    try {
      await push(ref(database, `comments/${campaignId}`), { uid: user.uid, email: user.email, text: value.slice(0, 1000), createdAt: Date.now() });
      setText('');
      setError('');
    } catch {
      setError('Could not post your comment. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="comments">
      <h3 className="section-label">Words of support ({comments.length})</h3>
      {loading && <p className="muted small">Loading comments…</p>}
      {!loading && comments.length === 0 && <p className="muted small">No messages yet. Leave the first one!</p>}
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.id} className="comment">
            <span className="avatar avatar-sm">{nameFromEmail(c.email).charAt(0)}</span>
            <div>
              <div className="comment-meta"><strong>{c.uid === user?.uid ? 'You' : nameFromEmail(c.email)}</strong><span className="muted small">{formatDateTime(c.createdAt)}</span></div>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {isAuthenticated && (
        <form className="comment-form" onSubmit={submit}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message of support…" maxLength={1000} aria-label="Write a comment" />
          <button className="btn btn-primary btn-sm" disabled={!text.trim() || posting}>{posting ? 'Posting…' : 'Post'}</button>
        </form>
      )}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
};

export default CommentSection;
