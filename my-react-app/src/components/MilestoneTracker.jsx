import React, { useState } from 'react';

const MilestoneTracker = ({ milestones, onMilestonesChange }) => {
  const [newMilestone, setNewMilestone] = useState({ amount: '', description: '' });

  const addMilestone = () => {
    if (newMilestone.amount && !isNaN(newMilestone.amount)) {
      const milestone = {
        amount: parseFloat(newMilestone.amount),
        description: newMilestone.description,
        id: Date.now()
      };
      onMilestonesChange([...milestones, milestone]);
      setNewMilestone({ amount: '', description: '' });
    }
  };

  const removeMilestone = (id) => {
    onMilestonesChange(milestones.filter(m => m.id !== id));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4>Fundraising Milestones</h4>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="number"
          placeholder="Amount ($)"
          value={newMilestone.amount}
          onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
          style={{ 
            padding: '8px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            flex: '1'
          }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newMilestone.description}
          onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
          style={{ 
            padding: '8px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            flex: '2'
          }}
        />
        <button
          onClick={addMilestone}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {milestones.length > 0 && (
        <div>
          <h5>Current Milestones:</h5>
          {milestones
            .sort((a, b) => a.amount - b.amount)
            .map((milestone) => (
              <div key={milestone.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}>
                <div>
                  <strong>${milestone.amount.toLocaleString()}</strong>
                  {milestone.description && <span> - {milestone.description}</span>}
                </div>
                <button
                  onClick={() => removeMilestone(milestone.id)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;
