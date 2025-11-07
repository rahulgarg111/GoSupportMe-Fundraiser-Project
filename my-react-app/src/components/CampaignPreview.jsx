import React from 'react';

const CampaignPreview = ({ campaign }) => {
  const { title, description, goal, raised = 0, media = [], milestones = [] } = campaign;
  const progressPercentage = goal > 0 ? (raised / goal) * 100 : 0;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>Campaign Preview</h3>
      
      {title && <h2 style={{ color: '#007bff' }}>{title}</h2>}
      
      {media.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {media.slice(0, 3).map((item, index) => (
              <div key={index} style={{ width: '150px', height: '100px', borderRadius: '4px', overflow: 'hidden' }}>
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={item.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            ))}
            {media.length > 3 && (
              <div style={{ width: '150px', height: '100px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                +{media.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {description && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Description:</h4>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{description}</p>
        </div>
      )}

      {goal > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Fundraising Goal: ${goal.toLocaleString()}</h4>
          <div style={{ backgroundColor: '#e9ecef', borderRadius: '10px', height: '20px', marginBottom: '10px' }}>
            <div 
              style={{ 
                width: `${Math.min(progressPercentage, 100)}%`, 
                height: '100%', 
                backgroundColor: '#28a745', 
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span>${raised.toLocaleString()} raised</span>
            <span>{progressPercentage.toFixed(1)}% funded</span>
          </div>
        </div>
      )}

      {milestones.length > 0 && (
        <div>
          <h4>Milestones:</h4>
          {milestones.map((milestone, index) => {
            const milestoneReached = raised >= milestone.amount;
            return (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: milestoneReached ? '#d4edda' : '#fff',
                border: '1px solid ' + (milestoneReached ? '#c3e6cb' : '#ddd'),
                borderRadius: '4px'
              }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: milestoneReached ? '#28a745' : '#6c757d',
                  marginRight: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {milestoneReached && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                </div>
                <div>
                  <strong>${milestone.amount.toLocaleString()}</strong>
                  {milestone.description && <span> - {milestone.description}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!title && !description && !goal && media.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          Start filling out the form to see your campaign preview here
        </p>
      )}
    </div>
  );
};

export default CampaignPreview;
