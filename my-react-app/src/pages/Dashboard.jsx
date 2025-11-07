import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import { setCampaigns } from '../store/campaignSlice';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { campaigns } = useSelector(state => state.campaigns);
  const [showDonateInput, setShowDonateInput] = useState(null);
  const [donateAmount, setDonateAmount] = useState('');
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const campaignsRef = ref(database, 'campaigns');
    const unsubscribe = onValue(campaignsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const campaignsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        dispatch(setCampaigns(campaignsList));

        if (user) {
          const userCompletedCampaigns = campaignsList.filter(c => 
            c.createdBy === user.uid && 
            c.status === 'completed' && 
            !c.notifiedCreator
          );

          userCompletedCampaigns.forEach(c => {
            alert(`Congratulations! Your campaign "${c.title}" has reached its funding goal!`);
            const campaignRef = ref(database, `campaigns/${c.id}`);
            update(campaignRef, { notifiedCreator: true });
          });
        }
      } else {
        dispatch(setCampaigns([]));
      }
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  const handleDonate = (campaignId) => {
    setDonating(true);
    const campaignToUpdate = campaigns.find(c => c.id === campaignId);
    if (!campaignToUpdate) {
      setDonating(false);
      return;
    }

    const newRaisedAmount = (campaignToUpdate.raised || 0) + parseInt(donateAmount);
    const updates = { raised: newRaisedAmount };

    if (newRaisedAmount >= campaignToUpdate.goal) {
      updates.status = 'completed';
    }

    const campaignRef = ref(database, `campaigns/${campaignId}`);
    update(campaignRef, updates)
      .then(() => {
        setDonating(false);
        setShowDonateInput(null);
        setDonateAmount('');
      })
      .catch((error) => {
        console.error('Donation failed:', error);
        setDonating(false);
      });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>GoSupportMe Dashboard</h1>
        <Link 
          to="/create-campaign"
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Create Campaign
        </Link>
      </div>

      {(() => {
        const activeCampaigns = campaigns.filter(c => c.status === 'active');
        return activeCampaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No campaigns yet</h3>
          <p>Start by creating your first campaign!</p>
          <Link 
            to="/create-campaign"
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block',
              marginTop: '20px'
            }}
          >
            Create Your First Campaign
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {activeCampaigns.map(campaign => {
            const progressPercentage = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0;
            
            return (
              <div key={campaign.id} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {campaign.media && campaign.media.length > 0 && (
                  <div style={{ marginBottom: '15px', height: '150px', overflow: 'hidden', borderRadius: '4px' }}>
                    {campaign.media[0].type === 'image' ? (
                      <img 
                        src={campaign.media[0].url} 
                        alt={campaign.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <video 
                        src={campaign.media[0].url}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                )}
                
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{campaign.title}</h3>
                
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  lineHeight: '1.4',
                  margin: '0 0 15px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {campaign.description}
                </p>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>${campaign.raised?.toLocaleString() || 0}</span>
                    <span style={{ color: '#666' }}>of ${campaign.goal?.toLocaleString()}</span>
                  </div>
                  <div style={{ backgroundColor: '#e9ecef', borderRadius: '10px', height: '8px' }}>
                    <div 
                      style={{ 
                        width: `${Math.min(progressPercentage, 100)}%`, 
                        height: '100%', 
                        backgroundColor: '#28a745', 
                        borderRadius: '10px'
                      }}
                    ></div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    {progressPercentage.toFixed(1)}% funded
                  </div>
                </div>

                {campaign.milestones && campaign.milestones.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      Next milestone: ${campaign.milestones.find(m => (campaign.raised || 0) < m.amount)?.amount.toLocaleString() || 'All reached!'}
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '12px', color: '#999' }}>
                  Created: {new Date(campaign.createdAt).toLocaleDateString()}
                </div>

                {showDonateInput === campaign.id ? (
                  <div style={{ marginTop: '15px', display: 'flex', gap: '5px' }}>
                    <input
                      type="number"
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(e.target.value)}
                      placeholder="Amount"
                      min="1"
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => handleDonate(campaign.id)}
                      disabled={!donateAmount || donating}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: donating ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: donating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowDonateInput(null)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowDonateInput(campaign.id)}
                    style={{
                      display: 'block',
                      marginTop: '15px',
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      width: '100%',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Donate
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )})()}
    </div>
  );
};

export default Dashboard;
