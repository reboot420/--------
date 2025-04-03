// チャートインスタンスを格納する変数
let expenseChart, investmentChart, paybackChart, cumulativeProfitChart;

// Chart.jsの共通設定
Chart.register(ChartDataLabels);

// グラフの初期化
function initCharts() {
  // 支出内訳チャート
  const expenseCtx = document.getElementById('expense-chart').getContext('2d');
  expenseChart = new Chart(expenseCtx, {
    type: 'doughnut',
    data: {
      labels: ['食材費', '家賃', '水道光熱費', '人件費', 'その他固定費', '利益'],
      datasets: [{
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(76, 175, 80, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '50%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 10,
            font: { size: 11 }
          }
        },
        datalabels: {
          formatter: (value, ctx) => {
            const total = ctx.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round(value / total * 100);
            return value > 0 ? `${Math.round(value)}万円\n(${percentage}%)` : '';
          },
          color: 'white',
          font: {
            weight: 'bold',
            size: 10
          },
          textStrokeColor: 'rgba(0, 0, 0, 0.2)',
          textStrokeWidth: 1
        }
      }
    }
  });

  // 初期投資内訳チャート
  const investmentCtx = document.getElementById('investment-chart').getContext('2d');
  investmentChart = new Chart(investmentCtx, {
    type: 'doughnut',
    data: {
      labels: ['内装工事', '厨房設備', '家具・備品', '保証金・敷金', 'その他初期費用'],
      datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '50%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 10,
            font: { size: 11 }
          }
        },
        datalabels: {
          formatter: (value, ctx) => {
            const total = ctx.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round(value / total * 100);
            return value > 0 ? `${Math.round(value)}万円\n(${percentage}%)` : '';
          },
          color: 'white',
          font: {
            weight: 'bold',
            size: 10
          },
          textStrokeColor: 'rgba(0, 0, 0, 0.2)',
          textStrokeWidth: 1
        }
      }
    }
  });

  // 投資回収シミュレーションチャート
  const paybackCtx = document.getElementById('payback-chart').getContext('2d');
  paybackChart = new Chart(paybackCtx, {
    type: 'line',
    data: {
      labels: Array.from({length: 11}, (_, i) => `${i}年目`),
      datasets: [
        {
          label: '損益',
          data: [],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: '初期投資額',
          data: [],
          borderColor: '#e74c3c',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${Math.round(context.parsed.y)}万円`;
            }
          }
        },
        legend: {
          position: 'top'
        },
        datalabels: {
          display: false
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return value + '万円';
            }
          }
        }
      }
    }
  });

  // 累積利益チャート
  const cumulativeProfitCtx = document.getElementById('cumulative-profit-chart').getContext('2d');
  cumulativeProfitChart = new Chart(cumulativeProfitCtx, {
    type: 'bar',
    data: {
      labels: Array.from({length: 11}, (_, i) => `${i}年目`),
      datasets: [{
        label: '累積利益',
        data: [],
        backgroundColor: 'rgba(46, 204, 113, 0.8)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1,
        barThickness: 20
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `累積利益: ${Math.round(context.parsed.x)}万円`;
            }
          }
        },
        legend: {
          display: false
        },
        datalabels: {
          anchor: 'end',
          align: 'right',
          formatter: function(value) {
            return Math.round(value) + '万円';
          },
          color: 'black',
          font: {
            weight: 'bold'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            callback: function(value) {
              return value + '万円';
            }
          }
        }
      }
    }
  });
}

// グラフの更新
function updateCharts(data) {
  // 支出内訳チャートの更新
  expenseChart.data.datasets[0].data = [
    Math.round(data.foodCost),
    Math.round(data.rent),
    Math.round(data.utilities),
    Math.round(data.salaries),
    Math.round(data.otherFixed),
    Math.round(data.profit)
  ];
  expenseChart.update();

  // 初期投資内訳チャートの更新
  investmentChart.data.datasets[0].data = [
    Math.round(data.renovation),
    Math.round(data.equipment),
    Math.round(data.furniture),
    Math.round(data.deposit),
    Math.round(data.otherInitial)
  ];
  investmentChart.update();

  // 投資回収シミュレーションチャートの更新
  updatePaybackChart(data);
  
  // 累積利益チャートの更新
  updateCumulativeProfitChart(data);
}

// 投資回収シミュレーションチャートの更新
function updatePaybackChart(data) {
  if (!paybackChart) return;
  
  const initialInvestment = data.investmentLine[0];
  const profitLoss = data.cumulativeProfits.map(profit => profit - initialInvestment);
  
  paybackChart.data.datasets[0].data = profitLoss;
  paybackChart.data.datasets[1].data = data.investmentLine;
  
  paybackChart.update();
}

// 累積利益チャートの更新
function updateCumulativeProfitChart(data) {
  if (!cumulativeProfitChart) return;
  
  cumulativeProfitChart.data.datasets[0].data = data.cumulativeProfits;
  
  cumulativeProfitChart.update();
} 