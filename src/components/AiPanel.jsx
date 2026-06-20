import { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { GAS_API_URL } from '../config';

export default function AiPanel({ studentKey, data, currentTest }) {
  const [tone, setTone] = useState('standard');
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState('');
  
  const [schoolInput, setSchoolInput] = useState('');
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagResult, setDiagResult] = useState('');

  const createMarkup = (html) => ({ __html: DOMPurify.sanitize(html) });

  const handleRunEval = async () => {
    setEvalLoading(true);
    try {
      const res = await fetch(`${GAS_API_URL}?action=runAi&key=${studentKey}&tone=${tone}`);
      const json = await res.json();
      if (json.error || (json.result && json.result.error)) {
        setEvalResult(`<div style="color:#ef4444">${json.error || json.result.error}</div>`);
      } else {
        setEvalResult(marked(json.result));
      }
    } catch (err) {
      setEvalResult(`<div style="color:#ef4444">通信エラーが発生しました</div>`);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleRunDiag = async () => {
    if (!schoolInput.trim()) {
      alert('志望校を入力してください');
      return;
    }
    setDiagLoading(true);
    try {
      const res = await fetch(`${GAS_API_URL}?action=runSchool&key=${studentKey}&school=${encodeURIComponent(schoolInput)}`);
      const json = await res.json();
      if (json.error || (json.result && json.result.error)) {
        setDiagResult(`<div style="color:#ef4444">${json.error || json.result.error}</div>`);
      } else {
        setDiagResult(marked(json.result));
      }
    } catch (err) {
      setDiagResult(`<div style="color:#ef4444">通信エラーが発生しました</div>`);
    } finally {
      setDiagLoading(false);
    }
  };

  return (
    <>
      {/* AI評価 */}
      <section className="card glass ai-card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✨</span><h3 style={{ margin: 0 }}>AIの評価とアドバイス</h3>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
            {['standard', 'energetic', 'logical'].map(t => (
              <button 
                key={t}
                onClick={() => setTone(t)}
                style={{
                  background: tone === t ? '#38bdf8' : 'transparent',
                  color: tone === t ? '#0f172a' : '#94a3b8',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: tone === t ? 'bold' : 'normal'
                }}
              >
                {t === 'standard' ? '標準' : t === 'energetic' ? '熱血' : '分析'}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <div 
            className="ai-content-box" 
            style={{ 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '8px', 
              padding: '15px', 
              minHeight: '100px', 
              maxHeight: '400px', 
              overflowY: 'auto',
              marginBottom: '15px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#cbd5e1'
            }}
          >
            {evalResult ? (
              <div dangerouslySetInnerHTML={createMarkup(evalResult)} />
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>💬</div>
                「AIに評価してもらう」を押すとアドバイスが届きます。
              </div>
            )}
          </div>
          <button 
            className="btn btn-primary btn-block" 
            onClick={handleRunEval}
            disabled={evalLoading}
            style={{ background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', border: 'none', width: '100%' }}
          >
            {evalLoading ? '⏳ AIが分析中...' : '✨ AIに評価してもらう'}
          </button>
        </div>
      </section>

      {/* AI志望校診断 */}
      <section className="card glass ai-card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏫</span><h3 style={{ margin: 0 }}>志望校とAI診断</h3>
          </div>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>志望校を入力</label>
            <input 
              type="text" 
              value={schoolInput}
              onChange={(e) => setSchoolInput(e.target.value)}
              placeholder="例：高津高校 文理科"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
            />
          </div>
          
          <div 
            className="ai-content-box" 
            style={{ 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '8px', 
              padding: '15px', 
              minHeight: '100px', 
              maxHeight: '400px', 
              overflowY: 'auto',
              marginBottom: '15px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#cbd5e1'
            }}
          >
            {diagResult ? (
              <div dangerouslySetInnerHTML={createMarkup(diagResult)} />
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔍</div>
                志望校を入力して診断を実行すると結果が表示されます。
              </div>
            )}
          </div>
          
          <button 
            className="btn btn-block" 
            onClick={handleRunDiag}
            disabled={diagLoading}
            style={{ background: 'linear-gradient(45deg, #10b981, #3b82f6)', border: 'none', width: '100%' }}
          >
            {diagLoading ? '⏳ AIが判定中...' : '🎯 AI志望校診断'}
          </button>
        </div>
      </section>
    </>
  );
}
