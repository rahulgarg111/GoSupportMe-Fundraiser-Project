import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { useAuth } from '../context/AuthContext';
import CampaignCard from '../components/CampaignCard';
import CampaignModal from '../components/CampaignModal';
import { formatMoney, supporterCount } from '../utils/format';

const MyCampaigns = () => {
  const { user } = useAuth();
  const { campaigns, loading } = useCampaigns();
  const [selectedId, setSelectedId] = useState(null);

  const mine = useMemo(
    () => campaigns.filter((c) => c.createdBy === user?.uid).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [campaigns, user]
  );
  const raised = mine.reduce((s, c) => s + (c.raised || 0), 0);
  const supporters = mine.reduce((s, c) => s + supporterCount(c), 0);
  const selected = campaigns.find((c) => c.id === selectedId) || null;

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>My fundraisers</h1>
          <p className="muted">{mine.length} fundraiser{mine.length === 1 ? '' : 's'} · {formatMoney(raised)} raised · {supporters} supporter{supporters === 1 ? '' : 's'}</p>
        </div>
        <Link to="/create-campaign" className="btn btn-primary">＋ New fundraiser</Link>
      </div>

      {loading ? (
        <div className="grid">{[1, 2].map((i) => <div key={i} className="skeleton" />)}</div>
      ) : mine.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📣</div>
          <h3>You haven't started a fundraiser yet</h3>
          <p className="muted">Tell your story, set a goal and add milestones. Your supporters will do the rest.</p>
          <Link to="/create-campaign" className="btn btn-primary">Start your first fundraiser</Link>
        </div>
      ) : (
        <div className="grid">
          {mine.map((c) => <CampaignCard key={c.id} campaign={c} onOpen={(x) => setSelectedId(x.id)} />)}
        </div>
      )}

      <CampaignModal campaign={selected} onClose={() => setSelectedId(null)} />
    </main>
  );
};

export default MyCampaigns;
