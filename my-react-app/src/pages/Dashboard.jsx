import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCampaignAlerts } from '../hooks/useCampaignAlerts';
import CampaignCard from '../components/CampaignCard';
import CampaignModal from '../components/CampaignModal';
import { formatMoney, progressOf, supporterCount } from '../utils/format';

const SORTS = {
  newest: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
  closest: (a, b) => progressOf(b) - progressOf(a),
  popular: (a, b) => supporterCount(b) - supporterCount(a),
};

const Dashboard = () => {
  const { user } = useAuth();
  const { campaigns, loading } = useCampaigns();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('active');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  useCampaignAlerts(user, campaigns, toast);

  const totals = useMemo(() => ({
    raised: campaigns.reduce((s, c) => s + (c.raised || 0), 0),
    active: campaigns.filter((c) => c.status === 'active').length,
    funded: campaigns.filter((c) => c.status === 'completed').length,
    supporters: new Set(campaigns.flatMap((c) => Object.keys(c.donors || {}))).size,
  }), [campaigns]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns
      .filter((c) => filter === 'all' || (filter === 'active' ? c.status !== 'completed' : c.status === 'completed'))
      .filter((c) => !q || `${c.title} ${c.description}`.toLowerCase().includes(q))
      .sort(SORTS[sort]);
  }, [campaigns, filter, sort, search]);

  const selected = campaigns.find((c) => c.id === selectedId) || null;

  return (
    <main className="page">
      <section className="hero">
        <div>
          <h1>Small acts, big impact.</h1>
          <p>Support a cause you believe in, or start a fundraiser of your own in a few minutes.</p>
          <Link to="/create-campaign" className="btn btn-light">＋ Start a fundraiser</Link>
        </div>
        <div className="hero-stats">
          <div><strong>{formatMoney(totals.raised)}</strong><span>raised in total</span></div>
          <div><strong>{totals.active}</strong><span>active fundraisers</span></div>
          <div><strong>{totals.funded}</strong><span>fully funded</span></div>
          <div><strong>{totals.supporters}</strong><span>supporters</span></div>
        </div>
      </section>

      <div className="toolbar">
        <div className="search-box">
          <span aria-hidden="true">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fundraisers" aria-label="Search fundraisers" />
        </div>
        <div className="segmented">
          {[['active', 'Active'], ['completed', 'Funded'], ['all', 'All']].map(([v, l]) => (
            <button key={v} className={filter === v ? 'active' : ''} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort fundraisers">
          <option value="newest">Newest</option>
          <option value="closest">Closest to goal</option>
          <option value="popular">Most supporters</option>
        </select>
      </div>

      {loading ? (
        <div className="grid">{[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}</div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>{campaigns.length ? 'No fundraisers match your filters' : 'No fundraisers yet'}</h3>
          <p className="muted">{campaigns.length ? 'Try another filter or search term.' : 'Be the first to start one. It only takes a few minutes.'}</p>
          <Link to="/create-campaign" className="btn btn-primary">Start a fundraiser</Link>
        </div>
      ) : (
        <div className="grid">
          {visible.map((c) => (
            <CampaignCard key={c.id} campaign={c} onOpen={(x) => setSelectedId(x.id)} />
          ))}
        </div>
      )}

      <CampaignModal campaign={selected} onClose={() => setSelectedId(null)} />
    </main>
  );
};

export default Dashboard;
