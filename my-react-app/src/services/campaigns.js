import { ref, push, update, runTransaction } from 'firebase/database';
import { database } from '../firebase';

export const createCampaign = async (data) => {
  const newRef = await push(ref(database, 'campaigns'), data);
  return newRef.key;
};

export const markCampaign = (campaignId, fields) => update(ref(database, `campaigns/${campaignId}`), fields);

/**
 * Adds a donation atomically. A transaction re-runs if someone else donates at the
 * same moment, so totals and the top-donor list can't overwrite each other.
 */
export const donate = async (campaignId, uid, amount) => {
  const result = await runTransaction(ref(database, `campaigns/${campaignId}`), (campaign) => {
    if (campaign === null) return campaign; // not loaded yet; Firebase retries with server data
    if (campaign.status === 'completed') return undefined; // abort: already funded

    const donors = { ...(campaign.donors || {}) };
    donors[uid] = (donors[uid] || 0) + amount;
    const raised = (campaign.raised || 0) + amount;

    // Medal for whoever is (or ties for) the top donor after this donation
    const topAmount = Math.max(...Object.values(donors));
    const topDonators = new Set(campaign.topDonators || []);
    if (donors[uid] >= topAmount) topDonators.add(uid);

    return {
      ...campaign,
      donors,
      raised,
      topDonators: [...topDonators],
      status: raised >= campaign.goal ? 'completed' : campaign.status,
      lastDonationAt: Date.now(),
    };
  });

  if (!result.committed) throw new Error('This campaign is no longer accepting donations.');
  return result.snapshot.val();
};
