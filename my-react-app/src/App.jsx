import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CampaignProvider } from './context/CampaignContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import MyCampaigns from './pages/MyCampaigns';
import MyMedals from './pages/MyMedals';

const protectedPage = (element) => <PrivateRoute>{element}</PrivateRoute>;

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CampaignProvider>
            <div className="app">
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
                <Route path="/create-campaign" element={protectedPage(<CreateCampaign />)} />
                <Route path="/my-campaigns" element={protectedPage(<MyCampaigns />)} />
                <Route path="/my-medals" element={protectedPage(<MyMedals />)} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </CampaignProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
