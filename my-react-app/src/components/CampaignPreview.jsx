import CampaignCard from './CampaignCard';

/** Live preview of the campaign card while it is being created. */
const CampaignPreview = ({ campaign }) => {
  const preview = {
    id: 'preview',
    title: campaign.title || 'Your campaign title',
    description: campaign.description || 'Your story will appear here. Tell supporters why you are raising money and how it will be used.',
    goal: Number(campaign.goal) || 0,
    raised: 0,
    media: campaign.media,
    milestones: campaign.milestones,
    endDate: campaign.endDate ? new Date(campaign.endDate).getTime() : Date.now() + 30 * 86400000,
    status: 'active',
  };

  return (
    <aside className="preview-panel">
      <p className="eyebrow">Live preview</p>
      <CampaignCard campaign={preview} onOpen={() => {}} />
      <p className="muted small">This is how your fundraiser will appear on the Explore page.</p>
    </aside>
  );
};

export default CampaignPreview;
