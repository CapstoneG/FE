import { Header, AuthProvider } from './components';
import AppRouter from './routes/AppRouter';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`app ${isAuthPage ? 'no-header' : ''}`}>
      {!isAuthPage && <Header />}
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
