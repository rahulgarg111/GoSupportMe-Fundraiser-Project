import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';
import DonateBox from './DonateBox';
import { coverGradient, daysLeftLabel, formatMoney, progressOf, supporterCount } from '../utils/format';

const CampaignModal = ({ campaign, onClose }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!campaign) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [campaign, onClose]);

  if (!campaign) return null;

  const progress = progressOf(campaign);
  const myTotal = campaign.donors?.[user?.uid] || 0;
  const topDonors = Object.entries(campaign.donors || {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const isOwner = campaign.createdBy === user?.uid;

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={campaign.title}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-media" style={campaign.media?.length ? undefined : { background: coverGradient(campaign.id) }}>
          {campaign.media?.[0]?.type === 'image' && <img src={campaign.media[0].url} alt="" />}
          {campaign.media?.[0]?.type === 'video' && <video src={campaign.media[0].url} controls />}
          {!campaign.media?.length && <span className="cover-initial big">{campaign.title?.charAt(0)}</span>}
        </div>
        {campaign.media?.length > 1 && (
          <div className="media-strip">
            {campaign.media.slice(1).map((m, i) => (
              <div key={i} className="media-thumb">{m.type === 'image' ? <img src={m.url} alt="" /> : <video src={m.url} controls />}</div>
            ))}
          </div>
        )}

        <div className="modal-body">
          <div className="modal-title-row">
            <h2>{campaign.title}</h2>
            <span className={`status-pill static ${campaign.status === 'completed' ? 'funded' : ''}`}>{campaign.status === 'completed' ? 'Funded' : daysLeftLabel(campaign)}</span>
          </div>
          {isOwner && <p className="owner-note">You're the organiser of this fundraiser.</p>}

          <div className="progress progress-lg"><span style={{ width: `${progress}%` }} /></div>
          <div className="stat-row">
            <div><strong>{formatMoney(campaign.raised)}</strong><small>raised</small></div>
            <div><strong>{formatMoney(campaign.goal)}</strong><small>goal</small></div>
            <div><strong>{supporterCount(campaign)}</strong><small>supporters</small></div>
            <div><strong>{Math.round(progress)}%</strong><small>funded</small></div>
          </div>

          {myTotal > 0 && <p className="my-support">💚 You've given {formatMoney(myTotal)} to this fundraiser{campaign.topDonators?.includes(user.uid) ? ' and earned a Top Donor medal 🏅' : ''}.</p>}

          <DonateBox campaign={campaign} />

          <h3 className="section-label">The story</h3>
          <p className="story">{campaign.description || 'No description yet.'}</p>

          {campaign.milestones?.length > 0 && (
            <>
              <h3 className="section-label">Milestones</h3>
              <ul className="milestones">
                {[...campaign.milestones].sort((a, b) => a.amount - b.amount).map((m, i) => {
                  const reached = (campaign.raised || 0) >= m.amount;
                  return (
                    <li key={m.id || i} className={reached ? 'reached' : ''}>
                      <span className="milestone-dot">{reached ? '✓' : ''}</span>
                      <strong>{formatMoney(m.amount)}</strong>
                      {m.description && <span className="muted"> · {m.description}</span>}
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {topDonors.length > 0 && (
            <>
              <h3 className="section-label">Top supporters</h3>
              <ol className="top-donors">
                {topDonors.map(([uid, total], i) => (
                  <li key={uid}><span>{['🥇', '🥈', '🥉'][i]} {uid === user?.uid ? 'You' : `Supporter ${i + 1}`}</span><strong>{formatMoney(total)}</strong></li>
                ))}
              </ol>
            </>
          )}

          <p className="muted small">Started {new Date(campaign.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>

          <hr />
          <CommentSection campaignId={campaign.id} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CampaignModal;
