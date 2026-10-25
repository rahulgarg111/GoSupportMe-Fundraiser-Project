import { useState } from 'react';
import { formatMoney } from '../utils/format';

const MilestoneTracker = ({ milestones, onMilestonesChange, goal }) => {
  const [draft, setDraft] = useState({ amount: '', description: '' });
  const [error, setError] = useState('');

  const add = () => {
    const amount = Number(draft.amount);
    if (!amount || amount <= 0) { setError('Enter a milestone amount.'); return; }
    if (goal && amount > goal) { setError(`Milestones can't be above your goal (${formatMoney(goal)}).`); return; }
    if (milestones.some((m) => m.amount === amount)) { setError('You already have a milestone at this amount.'); return; }
    onMilestonesChange([...milestones, { id: Date.now(), amount, description: draft.description.trim() }]);
    setDraft({ amount: '', description: '' });
    setError('');
  };

  const sorted = [...milestones].sort((a, b) => a.amount - b.amount);

  return (
    <div>
      <p className="muted small">Milestones show supporters what each stage of funding unlocks.</p>
      <div className="milestone-input">
        <input type="number" min="1" placeholder="Amount (₹)" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} />
        <input type="text" placeholder="What it unlocks (optional)" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} />
        <button type="button" className="btn btn-outline" onClick={add}>Add</button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {sorted.length > 0 && (
        <ul className="milestones editable">
          {sorted.map((m) => (
            <li key={m.id}>
              <span className="milestone-dot" />
              <strong>{formatMoney(m.amount)}</strong>
              {m.description && <span className="muted"> · {m.description}</span>}
              <button type="button" className="link-btn danger" onClick={() => onMilestonesChange(milestones.filter((x) => x.id !== m.id))}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MilestoneTracker;
