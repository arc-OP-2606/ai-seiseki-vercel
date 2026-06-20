import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function BarChart({ data, currentTest }) {
  const { student, averages, analysis } = data;
  const FIVE_SUBJS = ["国", "数", "英", "理", "社", "国語", "数学", "英語", "理科", "社会"];

  const currentAnalysis = analysis && analysis[currentTest] ? analysis[currentTest] : null;
  const currentAverages = averages && averages[currentTest] ? averages[currentTest] : null;

  if (!currentAnalysis) return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>データがありません</div>;

  const labels = [];
  const studentScores = [];
  const classAverages = [];

  for (const [subj, info] of Object.entries(currentAnalysis)) {
    if (subj !== "5科合計" && FIVE_SUBJS.includes(subj)) {
      labels.push(subj);
      studentScores.push(info.score);
      
      // 教室平均の取得
      let classAvgVal = null;
      if (currentAverages) {
        if (currentAverages[subj] !== undefined) {
          classAvgVal = currentAverages[subj];
        } else {
          // 科目名の日本語バリエーション（例: '国' と '国語'）に対応
          const mappedKey = Object.keys(currentAverages).find(
            k => k.startsWith(subj) || subj.startsWith(k)
          );
          if (mappedKey) classAvgVal = currentAverages[mappedKey];
        }
      }
      classAverages.push(classAvgVal);
    }
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `${student.studentName} さん`,
        data: studentScores,
        backgroundColor: 'rgba(99, 102, 241, 0.4)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: '教室平均',
        data: classAverages,
        backgroundColor: 'rgba(20, 184, 166, 0.4)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#cbd5e1' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#cbd5e1' },
        min: 0,
        max: 100,
        title: {
          display: true,
          text: '得点 (点)',
          color: '#cbd5e1',
          font: { size: 12 }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { 
          color: '#cbd5e1',
          usePointStyle: true,
          padding: 15,
          font: { size: 12 }
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 11 },
        anchor: 'end',
        align: 'top',
        offset: -2,
        formatter: (val) => val !== null ? val : ''
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}点`
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
