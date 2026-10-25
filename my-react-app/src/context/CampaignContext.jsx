import { createContext, useContext, useEffect, useReducer } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from './AuthContext';

const CampaignContext = createContext();

const initialState = {
  campaigns: [],
  currentCampaign: null,
  loading: true,
  error: null,
};

const campaignReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload, loading: false };
    case 'SET_CURRENT_CAMPAIGN':
      return { ...state, currentCampaign: action.payload };
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [...state.campaigns, action.payload] };
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};

export const CampaignProvider = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, initialState);
  const { user } = useAuth();
  const uid = user?.uid;

  // Subscribe only once signed in: the database only allows authenticated reads, and a
  // listener rejected before login would never recover.
  useEffect(() => {
    if (!uid) {
      dispatch({ type: 'SET_CAMPAIGNS', payload: [] });
      return undefined;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    const unsubscribe = onValue(
      ref(database, 'campaigns'),
      (snapshot) => {
        const data = snapshot.val() || {};
        dispatch({ type: 'SET_CAMPAIGNS', payload: Object.entries(data).map(([id, c]) => ({ id, ...c })) });
      },
      (error) => {
        console.error('Could not load campaigns:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_CAMPAIGNS', payload: [] });
      }
    );
    return () => unsubscribe();
  }, [uid]);

  const setCampaigns = (campaigns) => {
    dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
  };

  const setCurrentCampaign = (campaign) => {
    dispatch({ type: 'SET_CURRENT_CAMPAIGN', payload: campaign });
  };

  const addCampaign = (campaign) => {
    dispatch({ type: 'ADD_CAMPAIGN', payload: campaign });
  };

  const updateCampaign = (campaign) => {
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: campaign });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value = {
    ...state,
    setCampaigns,
    setCurrentCampaign,
    addCampaign,
    updateCampaign,
    setLoading,
    setError,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};
