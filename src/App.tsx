import { Header, AuthProvider } from './components';
import AppRouter from './routes/AppRouter';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isPlacementTest = location.pathname === '/placement-test';
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideSpeakingPracticeHeader = location.pathname === '/speaking-training/practice';
  const hideHeader = isAuthPage || isPlacementTest || isAdminPage || hideSpeakingPracticeHeader;

  return (
    <div className={`app ${hideHeader ? 'no-header' : ''}`}>
      {!hideHeader && <Header />}
      <AppRouter />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App
