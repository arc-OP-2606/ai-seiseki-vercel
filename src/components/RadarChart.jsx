import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function RadarChart({ data, currentTest }) {
  const { analysis } = data;
  const currentAnalysis = analysis && analysis[currentTest] ? analysis[currentTest] : null;
  const FIVE_SUBJS = ["国", "数", "英", "理", "社", "国語", "数学", "英語", "理科", "社会"];

  const [targets, setTargets] = useState({});

  useEffect(() => {
    // ローカルストレージから目標点を取得
    const saved = localStorage.getItem(`targets_${data.student.studentName}`);
    if (saved) {
      try { setTargets(JSON.parse(saved)); } catch(e) {}
    }
  }, [data.student.studentName]);

  if (!currentAnalysis) return <div style={{color: '#94a3b8', textAlign: 'center'}}>データがありません</div>;

  const labels = [];
  const scores = [];
  const targetScores = [];

  for (const [subj, info] of Object.entries(currentAnalysis)) {
    if (subj !== "5科合計" && FIVE_SUBJS.includes(subj)) {
      labels.push(subj);
      scores.push(info.score);
      targetScores.push(targets[subj] || null); // 目標がない場合はnull
    }
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: '得点',
        data: scores,
        backgroundColor: 'rgba(56, 189, 248, 0.4)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(56, 189, 248, 1)'
      }
    ]
  };

  // 目標点が1つでも設定されていればデータセット追加
  if (targetScores.some(t => t !== null && t > 0)) {
    chartData.datasets.push({
      label: '目標',
      data: targetScores,
      backgroundColor: 'transparent',
      borderColor: 'rgba(248, 113, 113, 0.8)',
      borderWidth: 2,
      borderDash: [5, 5],
      pointBackgroundColor: 'rgba(248, 113, 113, 1)',
      pointBorderColor: '#fff',
      pointRadius: 4,
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#cbd5e1',
          font: { size: 14, family: "'Outfit', sans-serif" }
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1' }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 12 },
        formatter: (val, ctx) => {
          if (ctx.datasetIndex === 0) return val; // 実際の点数のみ表示
          return ''; // 目標のラベルは非表示
        }
      }
    }
  };

  const handleTargetChange = (subj, val) => {
    setTargets(prev => ({ ...prev, [subj]: parseInt(val) || '' }));
  };

  const saveTargets = () => {
    localStorage.setItem(`targets_${data.student.studentName}`, JSON.stringify(targets));
    alert('目標を保存しました！');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ height: '300px', position: 'relative' }}>
        <Radar data={chartData} options={options} />
      </div>
      
      {/* 目標点入力欄 */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>🎯 目標点設定</span>
          <button onClick={saveTargets} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>保存</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
          {labels.map(subj => (
            <div key={subj} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{subj}</span>
              <input 
                type="number" 
                value={targets[subj] || ''}
                onChange={(e) => handleTargetChange(subj, e.target.value)}
                style={{ width: '45px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textAlign: 'center', borderRadius: '4px', padding: '4px', fontSize: '12px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
