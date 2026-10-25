import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createCampaign } from '../services/campaigns';
import MediaUpload from '../components/MediaUpload';
import CampaignPreview from '../components/CampaignPreview';
import MilestoneTracker from '../components/MilestoneTracker';
import { formatMoney } from '../utils/format';

const STEPS = ['Basics', 'Your story', 'Photos & video', 'Milestones & publish'];

const todayPlus = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [campaign, setCampaign] = useState({ title: '', description: '', goal: '', endDate: todayPlus(30), media: [], milestones: [] });

  const update = (field, value) => {
    setCampaign((prev) => ({ ...prev, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (campaign.title.trim().length < 5) e.title = 'Give your fundraiser a title of at least 5 characters.';
      if (!(Number(campaign.goal) >= 100)) e.goal = 'Set a goal of at least ₹100.';
      if (!campaign.endDate || new Date(campaign.endDate) <= new Date()) e.endDate = 'Pick an end date in the future.';
    }
    if (s === 2 && campaign.description.trim().length < 30) e.description = 'Tell your story in at least 30 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const publish = async () => {
    if (!validate(1)) { setStep(1); return; }
    if (!validate(2)) { setStep(2); return; }
    setLoading(true);
    try {
      await createCampaign({
        title: campaign.title.trim(),
        description: campaign.description.trim(),
        goal: Math.round(Number(campaign.goal)),
        endDate: new Date(campaign.endDate).getTime(),
        media: campaign.media,
        milestones: campaign.milestones.filter((m) => m.amount <= Number(campaign.goal)),
        raised: 0,
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: Date.now(),
        status: 'active',
      });
      toast.success('🚀 Your fundraiser is live!');
      navigate('/my-campaigns');
    } catch (error) {
      console.error(error);
      toast.error('Could not publish your fundraiser. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Start a fundraiser</h1>
          <p className="muted">Four quick steps. You can see a live preview on the right as you go.</p>
        </div>
      </div>

      <ol className="stepper">
        {STEPS.map((label, i) => (
          <li key={label} className={step === i + 1 ? 'current' : step > i + 1 ? 'done' : ''}>
            <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
            <span className="step-label">{label}</span>
          </li>
        ))}
      </ol>

      <div className="create-layout">
        <section className="card">
          {step === 1 && (
            <>
              <h2>The basics</h2>
              <label className="field">
                <span>Fundraiser title</span>
                <input value={campaign.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Books and laptops for our village library" maxLength={80} />
                {errors.title && <small className="error-text">{errors.title}</small>}
              </label>
              <div className="grid-2">
                <label className="field">
                  <span>Goal (₹)</span>
                  <input type="number" min="100" value={campaign.goal} onChange={(e) => update('goal', e.target.value)} placeholder="50000" />
                  {errors.goal && <small className="error-text">{errors.goal}</small>}
                </label>
                <label className="field">
                  <span>End date</span>
                  <input type="date" min={todayPlus(1)} value={campaign.endDate} onChange={(e) => update('endDate', e.target.value)} />
                  {errors.endDate && <small className="error-text">{errors.endDate}</small>}
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Your story</h2>
              <p className="muted small">Explain why you're raising money, who it helps and how the funds will be used.</p>
              <label className="field">
                <textarea rows={9} value={campaign.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell your story…" maxLength={4000} />
                <small className="muted">{campaign.description.length}/4000</small>
                {errors.description && <small className="error-text">{errors.description}</small>}
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Photos & video</h2>
              <p className="muted small">Fundraisers with a photo get noticed far more. The first file becomes the cover.</p>
              <MediaUpload
                existingMedia={campaign.media}
                onMediaUpload={(m) => update('media', [...campaign.media, m])}
                onRemove={(i) => update('media', campaign.media.filter((_, idx) => idx !== i))}
              />
            </>
          )}

          {step === 4 && (
            <>
              <h2>Milestones & publish</h2>
              <MilestoneTracker milestones={campaign.milestones} goal={Number(campaign.goal)} onMilestonesChange={(m) => update('milestones', m)} />
              <div className="review">
                <h3>Review</h3>
                <p><strong>{campaign.title || '—'}</strong></p>
                <p className="muted small">Goal {formatMoney(campaign.goal)} · ends {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} · {campaign.media.length} media · {campaign.milestones.length} milestone{campaign.milestones.length === 1 ? '' : 's'}</p>
              </div>
            </>
          )}

          <div className="step-actions">
            <button className="btn btn-ghost" onClick={back} disabled={step === 1 || loading}>← Back</button>
            {step < STEPS.length ? (
              <button className="btn btn-primary" onClick={next}>Continue →</button>
            ) : (
              <button className="btn btn-primary" onClick={publish} disabled={loading}>{loading ? 'Publishing…' : '🚀 Publish fundraiser'}</button>
            )}
          </div>
        </section>

        <CampaignPreview campaign={campaign} />
      </div>
    </main>
  );
};

export default CreateCampaign;
