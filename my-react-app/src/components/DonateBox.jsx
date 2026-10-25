import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { donate } from '../services/campaigns';
import { formatMoney } from '../utils/format';

const QUICK_AMOUNTS = [100, 500, 1000, 2500];

const DonateBox = ({ campaign }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  if (campaign.status === 'completed') {
    return <div className="donate-box done">🎉 This fundraiser reached its goal. Thank you to every supporter!</div>;
  }

  const submit = async (e) => {
    e.preventDefault();
    const value = Math.floor(Number(amount));
    if (!value || value < 1) { toast.error('Enter an amount of at least ₹1.'); return; }
    if (value > 1000000) { toast.error('For donations above ₹10,00,000 please contact the organiser.'); return; }
    setBusy(true);
    try {
      const updated = await donate(campaign.id, user.uid, value);
      setAmount('');
      if (updated?.status === 'completed') toast.celebrate(`🎉 Your ${formatMoney(value)} completed the goal for "${campaign.title}"!`);
      else toast.success(`Thank you! You donated ${formatMoney(value)} to "${campaign.title}".`);
    } catch (error) {
      toast.error(error.message || 'Donation failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="donate-box" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
      <div className="quick-amounts">
        {QUICK_AMOUNTS.map((a) => (
          <button type="button" key={a} className={`chip ${Number(amount) === a ? 'active' : ''}`} onClick={() => setAmount(String(a))}>
            {formatMoney(a)}
          </button>
        ))}
      </div>
      <div className="donate-row">
        <span className="currency">₹</span>
        <input type="number" min="1" step="1" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Other amount" aria-label="Donation amount" />
        <button className="btn btn-primary" disabled={busy || !amount}>{busy ? 'Processing…' : 'Donate'}</button>
      </div>
      <small className="muted">This is a demo: no real payment is taken.</small>
    </form>
  );
};

export default DonateBox;
