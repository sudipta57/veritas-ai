import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import LiveAnalysisPage from './pages/LiveAnalysisPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import SourcesPage from './pages/SourcesPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import PrivacyPage from './pages/PrivacyPage';
import Soc2Page from './pages/Soc2Page';
import GdprPage from './pages/GdprPage';
import Iso27001Page from './pages/Iso27001Page';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import SecurityPage from './pages/SecurityPage';
import './index.css';

// Dashboard layout wraps pages that need the sidebar + topbar
function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page — no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard pages — with sidebar + topbar */}
        <Route path="/verify" element={<DashboardLayout><VerifyPage /></DashboardLayout>} />
        <Route path="/live" element={<DashboardLayout><LiveAnalysisPage /></DashboardLayout>} />
        <Route path="/history" element={<DashboardLayout><HistoryPage /></DashboardLayout>} />
        <Route path="/reports" element={<DashboardLayout><ReportsPage /></DashboardLayout>} />
        <Route path="/sources" element={<DashboardLayout><SourcesPage /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
        <Route path="/support" element={<DashboardLayout><SupportPage /></DashboardLayout>} />
        <Route path="/privacy" element={<DashboardLayout><PrivacyPage /></DashboardLayout>} />
        <Route path="/about" element={<DashboardLayout><AboutPage /></DashboardLayout>} />
        <Route path="/terms" element={<DashboardLayout><TermsPage /></DashboardLayout>} />
        <Route path="/security" element={<DashboardLayout><SecurityPage /></DashboardLayout>} />
        <Route path="/trust/soc-2" element={<DashboardLayout><Soc2Page /></DashboardLayout>} />
        <Route path="/trust/gdpr" element={<DashboardLayout><GdprPage /></DashboardLayout>} />
        <Route path="/trust/iso-27001" element={<DashboardLayout><Iso27001Page /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
