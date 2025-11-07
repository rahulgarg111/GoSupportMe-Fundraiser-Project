import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ref, push } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { addCampaign } from '../store/campaignSlice';
import MediaUpload from '../components/MediaUpload';
import CampaignPreview from '../components/CampaignPreview';
import MilestoneTracker from '../components/MilestoneTracker';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    goal: '',
    endDate: '',
    media: [],
    milestones: []
  });
  const [loading, setLoading] = useState(false);

  const updateCampaign = (field, value) => {
    setCampaign(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaUpload = (media) => {
    setCampaign(prev => ({ ...prev, media: [...prev.media, media] }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const campaignData = {
        ...campaign,
        goal: parseFloat(campaign.goal) || 0,
        endDate: campaign.endDate ? new Date(campaign.endDate).getTime() : Date.now() + (30 * 24 * 60 * 60 * 1000),
        raised: 0,
        createdBy: user.uid,
        createdAt: Date.now(),
        status: 'active'
      };

      const campaignsRef = ref(database, 'campaigns');
      const newCampaignRef = await push(campaignsRef, campaignData);
      
      dispatch(addCampaign({ ...campaignData, id: newCampaignRef.key }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Create Your Campaign</h1>
      
      <div style={{ display: 'flex', marginBottom: '30px' }}>
        {[1, 2, 3, 4].map(num => (
          <div key={num} style={{ 
            flex: 1, 
            textAlign: 'center', 
            padding: '10px',
            backgroundColor: step >= num ? '#007bff' : '#e9ecef',
            color: step >= num ? 'white' : '#666',
            margin: '0 2px'
          }}>
            Step {num}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          {step === 1 && (
            <div>
              <h3>Basic Information</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Campaign Title:</label>
                <input
                  type="text"
                  value={campaign.title}
                  onChange={(e) => updateCampaign('title', e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  placeholder="Enter your campaign title"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Fundraising Goal ($):</label>
                <input
                  type="number"
                  value={campaign.goal}
                  onChange={(e) => updateCampaign('goal', e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  placeholder="Enter your fundraising goal"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>End Date:</label>
                <input
                  type="date"
                  value={campaign.endDate}
                  onChange={(e) => updateCampaign('endDate', e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  placeholder="Enter your end date"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3>Campaign Description</h3>
              <textarea
                value={campaign.description}
                onChange={(e) => updateCampaign('description', e.target.value)}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
                placeholder="Tell your story... Why are you raising funds? What will the money be used for?"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>Media Upload</h3>
              <MediaUpload 
                onMediaUpload={handleMediaUpload}
                existingMedia={campaign.media}
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h3>Milestones & Review</h3>
              <MilestoneTracker
                milestones={campaign.milestones}
                onMilestonesChange={(milestones) => updateCampaign('milestones', milestones)}
              />
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !campaign.title || !campaign.goal}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: loading ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating Campaign...' : 'Publish Campaign'}
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={prevStep}
              disabled={step === 1}
              style={{
                padding: '10px 20px',
                backgroundColor: step === 1 ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: step === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={step === 4}
              style={{
                padding: '10px 20px',
                backgroundColor: step === 4 ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: step === 4 ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>

        <div>
          <CampaignPreview campaign={campaign} />
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
