import { useState } from 'react';

export default function Login({ onLogin, loading, error, onAdminClick }) {
  const [key, setKey] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onLogin(key);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="login-box glass" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 className="login-title">個別指導塾 AI成績書</h1>
        <p className="login-desc">アクセスキー（8桁）を入力して<br/>自分の成績・分析ダッシュボードを開きます。</p>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            className="key-input" 
            placeholder="アクセスキー" 
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength="8"
            style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '18px' }}
          />
        </div>
        
        {error && <div className="login-error" style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
        
        <button 
          className="btn btn-primary btn-block" 
          onClick={() => onLogin(key)}
          disabled={loading}
        >
          {loading ? '⏳ 処理中...' : '開く'}
        </button>
        
        <button 
          className="btn-admin-toggle" 
          onClick={onAdminClick}
          style={{ marginTop: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
        >
          管理者用画面はこちら
        </button>
      </div>
    </div>
  );
}
