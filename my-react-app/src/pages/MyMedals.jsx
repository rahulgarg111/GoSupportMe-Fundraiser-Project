import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { useAuth } from '../context/AuthContext';
import CampaignCard from '../components/CampaignCard';
import CampaignModal from '../components/CampaignModal';
import { formatMoney } from '../utils/format';

const MyMedals = () => {
  const { user } = useAuth();
  const { campaigns, loading } = useCampaigns();
  const [selectedId, setSelectedId] = useState(null);

  const medals = useMemo(() => campaigns.filter((c) => (c.topDonators || []).includes(user?.uid)), [campaigns, user]);
  const supported = useMemo(() => campaigns.filter((c) => c.donors?.[user?.uid]), [campaigns, user]);
  const given = supported.reduce((s, c) => s + (c.donors[user.uid] || 0), 0);
  const selected = campaigns.find((c) => c.id === selectedId) || null;

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>My medals</h1>
          <p className="muted">You've supported {supported.length} fundraiser{supported.length === 1 ? '' : 's'} with {formatMoney(given)} and earned {medals.length} medal{medals.length === 1 ? '' : 's'}.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid">{[1, 2].map((i) => <div key={i} className="skeleton" />)}</div>
      ) : medals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏅</div>
          <h3>No medals yet</h3>
          <p className="muted">Become the top donor of a fundraiser to earn a medal.</p>
          <Link to="/dashboard" className="btn btn-primary">Explore fundraisers</Link>
        </div>
      ) : (
        <div className="grid">
          {medals.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onOpen={(x) => setSelectedId(x.id)}
              badge={<span className="medal-badge">🏅 Top donor</span>}
              footer={<p className="my-support small">You gave {formatMoney(c.donors?.[user.uid] || 0)}</p>}
            />
          ))}
        </div>
      )}

      <CampaignModal campaign={selected} onClose={() => setSelectedId(null)} />
    </main>
  );
};

export default MyMedals;
