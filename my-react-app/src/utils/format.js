export const formatMoney = (amount = 0) =>
  `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const progressOf = (campaign) =>
  campaign.goal > 0 ? Math.min(((campaign.raised || 0) / campaign.goal) * 100, 100) : 0;

export const daysLeft = (campaign) => {
  if (!campaign.endDate) return null;
  return Math.ceil((campaign.endDate - Date.now()) / 86400000);
};

export const daysLeftLabel = (campaign) => {
  if (campaign.status === 'completed') return 'Goal reached 🎉';
  const d = daysLeft(campaign);
  if (d === null) return '';
  if (d < 0) return 'Ended';
  if (d === 0) return 'Last day';
  return `${d} day${d === 1 ? '' : 's'} left`;
};

export const supporterCount = (campaign) => Object.keys(campaign.donors || {}).length;

export const nextMilestone = (campaign) =>
  [...(campaign.milestones || [])]
    .sort((a, b) => a.amount - b.amount)
    .find((m) => (campaign.raised || 0) < m.amount);

export const formatDateTime = (ts) =>
  new Date(ts).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export const nameFromEmail = (email = '') => {
  const base = email.split('@')[0] || 'Supporter';
  return base.charAt(0).toUpperCase() + base.slice(1);
};

const GRADIENTS = [
  'linear-gradient(135deg, #10b981, #0ea5e9)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #14b8a6, #6366f1)',
  'linear-gradient(135deg, #f97316, #eab308)',
];

/** Cover for campaigns without uploaded media. */
export const coverGradient = (id = '') => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
};
