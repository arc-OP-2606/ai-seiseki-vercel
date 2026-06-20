import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TrendChart({ data }) {
  const { tests, analysis } = data;
  const FIVE_SUBJS = ["国", "数", "英", "理", "社", "国語", "数学", "英語", "理科", "社会"];

  // 使われている科目のリストを取得
  const allSubjs = new Set();
  tests.forEach(test => {
    if (analysis[test]) {
      Object.keys(analysis[test]).forEach(s => {
        if (s !== "5科合計" && FIVE_SUBJS.includes(s)) allSubjs.add(s);
      });
    }
  });

  const subjList = Array.from(allSubjs);
  const colors = ["#4ade80", "#fbbf24", "#f87171", "#c084fc", "#60a5fa"];

  const datasets = subjList.map((subj, idx) => {
    return {
      label: subj,
      data: tests.map(test => analysis[test] && analysis[test][subj] ? analysis[test][subj].score : null),
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length],
      tension: 0.3,
      yAxisID: 'y'
    };
  });

  // 5科合計のデータセットを追加
  datasets.push({
    label: "5科合計",
    data: tests.map(test => analysis[test] && analysis[test]["5科合計"] ? analysis[test]["5科合計"].score : null),
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderDash: [5, 5],
    tension: 0.3,
    yAxisID: 'y1'
  });

  const chartData = {
    labels: tests,
    datasets: datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 500,
        grid: { drawOnChartArea: false },
        ticks: { color: '#fff' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#cbd5e1', usePointStyle: true }
      },
      datalabels: {
        display: false // 推移グラフではごちゃつくので非表示
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
