import { Header, AuthProvider } from './components';
import AppRouter from './routes/AppRouter';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App
