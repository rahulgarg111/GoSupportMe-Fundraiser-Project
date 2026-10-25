import { useEffect, useRef } from 'react';
import { markCampaign } from '../services/campaigns';
import { formatMoney } from '../utils/format';

/**
 * Shows one-time notifications for the signed-in user:
 * their campaign hit its goal, reached a milestone, or they earned a Top Donor medal.
 * Each alert is recorded on the campaign so it is shown only once.
 */
export const useCampaignAlerts = (user, campaigns, toast) => {
  const processed = useRef(false);

  useEffect(() => {
    if (!user || campaigns.length === 0 || processed.current) return;
    processed.current = true;

    campaigns.forEach((c) => {
      if (c.createdBy === user.uid && c.status === 'completed' && !c.notifiedCreator) {
        toast.celebrate(`🎉 Your fundraiser "${c.title}" reached its goal!`);
        markCampaign(c.id, { notifiedCreator: true }).catch(() => {});
      }

      if (c.createdBy === user.uid && c.milestones?.length) {
        const notified = c.notifiedMilestones || [];
        const reached = c.milestones
          .map((m, i) => ({ m, i }))
          .filter(({ m, i }) => (c.raised || 0) >= m.amount && !notified.includes(i));
        if (reached.length) {
          reached.forEach(({ m }) => toast.success(`🎯 "${c.title}" reached the ${formatMoney(m.amount)} milestone!`));
          markCampaign(c.id, { notifiedMilestones: [...notified, ...reached.map((r) => r.i)] }).catch(() => {});
        }
      }

      const medalUsers = c.notifiedMedalUsers || [];
      if ((c.topDonators || []).includes(user.uid) && !medalUsers.includes(user.uid)) {
        toast.celebrate(`🏅 You earned a Top Donor medal for "${c.title}"!`);
        markCampaign(c.id, { notifiedMedalUsers: [...medalUsers, user.uid] }).catch(() => {});
      }
    });
  }, [user, campaigns, toast]);
};
