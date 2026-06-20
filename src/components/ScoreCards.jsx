export default function ScoreCards({ data, currentTest }) {
  const { student, analysis } = data;
  const currentAnalysis = analysis && analysis[currentTest] ? analysis[currentTest] : null;
  const FIVE_SUBJS = ["国", "数", "英", "理", "社", "国語", "数学", "英語", "理科", "社会"];

  // 5科目に絞り込む
  const activeSubjs = [];
  if (currentAnalysis) {
    for (const [subj, info] of Object.entries(currentAnalysis)) {
      if (subj !== "5科合計" && FIVE_SUBJS.includes(subj)) {
        activeSubjs.push({ subj, ...info });
      }
    }
  }

  const total5 = currentAnalysis && currentAnalysis["5科合計"] ? currentAnalysis["5科合計"] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 5科合計 */}
      {total5 && (
        <div className="total-card glass" style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(56,189,248,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
          <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px' }}>5科合計</div>
          <div style={{ fontSize: '48px', fontWeight: '800', color: '#fff', fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{total5.score} <span style={{fontSize:'20px', color:'#94a3b8'}}>/ 500</span></div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '12px', fontSize: '13px' }}>
            <div style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>偏差値 {total5.deviation}</div>
            <div style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>教室内 {total5.rank}位</div>
          </div>
        </div>
      )}

      {/* 各科目 */}
      <div className="score-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
        {activeSubjs.map(item => (
          <div key={item.subj} className="score-card glass" style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>{item.subj}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: "'Outfit', sans-serif" }}>{item.score}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              <span>偏差値 {item.deviation}</span>
              <span>{item.rank}位</span>
            </div>
            {item.classAvgDiff !== null && (
              <div style={{ fontSize: '11px', marginTop: '4px', color: item.classAvgDiff >= 0 ? '#4ade80' : '#f87171' }}>
                平均比 {item.classAvgDiff >= 0 ? '+' : ''}{item.classAvgDiff}
              </div>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
}
