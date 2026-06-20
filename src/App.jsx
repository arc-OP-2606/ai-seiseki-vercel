import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import { GAS_API_URL } from './config';
import './index.css';

function App() {
  const [view, setView] = useState('login'); // 'login' | 'dashboard' | 'admin'
  const [studentKey, setStudentKey] = useState('');
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // URLからキーを自動取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const k = urlParams.get('k');
    if (k) {
      handleLogin(k);
    }
  }, []);

  const handleLogin = async (key) => {
    if (!key || key.length !== 8) {
      setError('アクセスキーは8桁で入力してください。');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // GAS API呼び出し
      const res = await fetch(`${GAS_API_URL}?action=getData&key=${encodeURIComponent(key)}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        setScoreData(null);
      } else {
        setStudentKey(key);
        setScoreData(json);
        setView('dashboard');
        
        // URLにキーを反映
        const newUrl = window.location.pathname + '?k=' + encodeURIComponent(key);
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    } catch (err) {
      setError('通信エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setStudentKey('');
    setScoreData(null);
    setView('login');
    // URLパラメータの削除
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div className="app-container">
      {view === 'login' && (
        <Login 
          onLogin={handleLogin} 
          loading={loading} 
          error={error} 
          onAdminClick={() => setView('admin')} 
        />
      )}
      {view === 'dashboard' && scoreData && (
        <Dashboard 
          data={scoreData} 
          studentKey={studentKey} 
          onLogout={handleLogout} 
        />
      )}
      {view === 'admin' && (
        <Admin 
          onBack={() => setView('login')} 
        />
      )}
      <footer className="app-footer">
        <p>© 2026 個別指導塾 AI成績書</p>
      </footer>
    </div>
  );
}

export default App;
