import { useState } from 'react';
import ScoreCards from './ScoreCards';
import RadarChart from './RadarChart';
import BarChart from './BarChart';
import TrendChart from './TrendChart';
import AnalysisPanel from './AnalysisPanel';
import AiPanel from './AiPanel';

export default function Dashboard({ data, studentKey, onLogout }) {
  const { student, tests, subjects, analysis } = data;
  const [currentTest, setCurrentTest] = useState(tests[tests.length - 1]);

  const handleTestChange = (test) => {
    setCurrentTest(test);
  };

  return (
    <div id="dashboard" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>👤 {student.studentName} さん <span style={{fontSize: '14px', color: '#94a3b8'}}>({student.classroom})</span></h2>
        <button onClick={onLogout} className="btn" style={{ padding: '6px 12px', fontSize: '12px' }}>ログアウト</button>
      </div>

      {/* テスト選択タブ */}
      <div className="test-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
        {tests.map(test => (
          <button 
            key={test} 
            className={`tab-btn ${test === currentTest ? 'active' : ''}`}
            onClick={() => handleTestChange(test)}
            style={{ 
              whiteSpace: 'nowrap', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              border: '1px solid #334155',
              background: test === currentTest ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.5)',
              color: test === currentTest ? '#38bdf8' : '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            {test}
          </button>
        ))}
      </div>

      {/* 科目別スコアカード */}
      <ScoreCards data={data} currentTest={currentTest} />

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', marginTop: '20px' }}>
        <div className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 5科バランス と 得点分析 */}
          <section className="card glass">
            <div className="card-header"><h3>🕸️ 5科バランス と 得点分析</h3></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
                <RadarChart data={data} currentTest={currentTest} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                  <span>📊</span> 科目別得点分析 (教室平均比較)
                </h4>
                <BarChart data={data} currentTest={currentTest} />
              </div>
            </div>
          </section>

          {/* 点数の推移 */}
          <section className="card glass">
            <div className="card-header"><h3>📈 点数の推移</h3></div>
            <div className="card-body">
              <TrendChart data={data} />
            </div>
          </section>

          {/* 分析パネル */}
          <section className="card glass">
            <div className="card-header"><h3>📋 詳細分析 ({currentTest})</h3></div>
            <div className="card-body">
              <AnalysisPanel analysisData={analysis[currentTest]} />
            </div>
          </section>
        </div>

        <div className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AiPanel studentKey={studentKey} data={data} currentTest={currentTest} />
        </div>
      </div>
      
      {/* モバイル用レスポンシブスタイル */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
