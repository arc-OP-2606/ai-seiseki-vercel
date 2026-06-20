export default function AnalysisPanel({ analysisData }) {
  if (!analysisData) return <div style={{color: '#94a3b8'}}>データがありません</div>;

  const FIVE_SUBJS = ["国", "数", "英", "理", "社", "国語", "数学", "英語", "理科", "社会"];
  const subjs = Object.keys(analysisData).filter(s => s !== "5科合計" && FIVE_SUBJS.includes(s));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
      {subjs.map(subj => {
        const d = analysisData[subj];
        return (
          <div key={subj} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1' }}>{subj}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8' }}>教室平均差</span>
                <span style={{ color: d.classAvgDiff >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
                  {d.classAvgDiff > 0 ? '+' : ''}{d.classAvgDiff}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8' }}>自己平均差</span>
                <span style={{ color: d.selfAvgDiff >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
                  {d.selfAvgDiff > 0 ? '+' : ''}{d.selfAvgDiff}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
