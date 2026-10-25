import { coverGradient, daysLeftLabel, formatMoney, nextMilestone, progressOf, supporterCount } from '../utils/format';

/** Shared card used on Explore, My Campaigns and My Medals. */
const CampaignCard = ({ campaign, onOpen, badge, footer }) => {
  const progress = progressOf(campaign);
  const cover = campaign.media?.[0];
  const milestone = nextMilestone(campaign);
  const supporters = supporterCount(campaign);

  return (
    <article className="campaign-card" onClick={() => onOpen(campaign)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(campaign)}>
      <div className="campaign-cover" style={cover ? undefined : { background: coverGradient(campaign.id) }}>
        {cover?.type === 'image' && <img src={cover.url} alt="" loading="lazy" />}
        {cover?.type === 'video' && <video src={cover.url} muted />}
        {!cover && <span className="cover-initial">{campaign.title?.charAt(0) || '♥'}</span>}
        <span className={`status-pill ${campaign.status === 'completed' ? 'funded' : ''}`}>
          {campaign.status === 'completed' ? 'Funded' : daysLeftLabel(campaign) || 'Active'}
        </span>
        {badge}
      </div>

      <div className="campaign-body">
        <h3>{campaign.title}</h3>
        <p className="campaign-desc">{campaign.description}</p>

        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="campaign-stats">
          <div><strong>{formatMoney(campaign.raised)}</strong><small>raised of {formatMoney(campaign.goal)}</small></div>
          <div className="right"><strong>{Math.round(progress)}%</strong><small>{supporters} supporter{supporters === 1 ? '' : 's'}</small></div>
        </div>

        {milestone && <p className="milestone-hint">🎯 Next milestone: {formatMoney(milestone.amount)}{milestone.description ? ` · ${milestone.description}` : ''}</p>}
        {footer}
      </div>
    </article>
  );
};

export default CampaignCard;
