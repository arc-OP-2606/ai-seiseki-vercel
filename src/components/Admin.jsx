import { useState } from 'react';
import { GAS_API_URL } from '../config';

export default function Admin({ onBack }) {
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keys, setKeys] = useState(null);
  const [search, setSearch] = useState('');

  const handleLogin = async () => {
    if (!pass) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${GAS_API_URL}?action=adminLogin&pass=${encodeURIComponent(pass)}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        setKeys(null);
      } else {
        setKeys(json.data);
      }
    } catch (err) {
      setError('通信エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (key) => {
    const url = `${window.location.origin}${window.location.pathname}?k=${key}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('URLをコピーしました:\n' + url);
    }).catch(() => {
      alert('コピーに失敗しました。');
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>⚙️ 管理者画面</h2>
        <button onClick={onBack} className="btn" style={{ padding: '6px 12px', fontSize: '12px' }}>戻る</button>
      </div>

      {!keys ? (
        <div className="card glass" style={{ maxWidth: '400px', margin: '0 auto', padding: '30px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px' }}>パスワードを入力</h3>
          <input 
            type="password" 
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', marginBottom: '20px' }}
          />
          {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
          <button 
            className="btn btn-primary btn-block" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '⏳ 認証中...' : 'ログイン'}
          </button>
        </div>
      ) : (
        <div className="card glass">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h3>🔑 生徒アクセスキー一覧</h3>
            <input 
              type="text" 
              placeholder="教室や名前で検索..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '13px' }}
            />
          </div>
          <div className="card-body" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px 8px', color: '#94a3b8' }}>教室</th>
                  <th style={{ padding: '12px 8px', color: '#94a3b8' }}>氏名</th>
                  <th style={{ padding: '12px 8px', color: '#94a3b8' }}>アクセスキー</th>
                  <th style={{ padding: '12px 8px', color: '#94a3b8' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {keys.filter(k => 
                  !search || 
                  k.classroom.includes(search) || 
                  k.studentName.includes(search)
                ).map(k => (
                  <tr key={k.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 8px' }}>{k.classroom}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{k.studentName}</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#38bdf8' }}>{k.key}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <button 
                        onClick={() => handleCopyUrl(k.key)}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '4px 8px', borderRadius: '4px', color: '#cbd5e1', cursor: 'pointer', fontSize: '12px' }}
                      >
                        URLコピー
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
