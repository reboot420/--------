// チャートインスタンスを格納する変数
let expenseChart, investmentChart, breakevenChart, paybackChart;

// Chart.jsの共通設定
Chart.register(ChartDataLabels);

// グラフの初期化
function initCharts() {
  initExpenseChart();
  initInvestmentChart();
  initBreakevenChart();
  initPaybackChart();
}

// 月間収支内訳のグラフ初期化
function initExpenseChart() {
  const expenseCtx = document.getElementById('expense-chart').getContext('2d');
  expenseChart = new Chart(expenseCtx, {
    type: 'pie',
    data: {
      labels: ['食材費', '家賃', '水道光熱費', '人件費', 'その他固定費', '営業利益'],
      datasets: [{
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 152, 0, 0.8)',  // 食材費
          'rgba(76, 175, 80, 0.8)',  // 家賃
          'rgba(33, 150, 243, 0.8)', // 水道光熱費
          'rgba(156, 39, 176, 0.8)', // 人件費
          'rgba(96, 125, 139, 0.8)', // その他固定費
          'rgba(40, 167, 69, 0.8)',  // 利益
        ],
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: getExpenseChartOptions()
  });
}

// 初期投資内訳のグラフ初期化
function initInvestmentChart() {
  const investmentCtx = document.getElementById('investment-chart').getContext('2d');
  investmentChart = new Chart(investmentCtx, {
    type: 'doughnut',
    data: {
      labels: ['内装工事', '厨房設備', '家具・備品', '保証金・敷金', 'その他'],
      datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(233, 30, 99, 0.8)',
          'rgba(63, 81, 181, 0.8)',
          'rgba(0, 188, 212, 0.8)',
          'rgba(139, 195, 74, 0.8)',
          'rgba(255, 87, 34, 0.8)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: getInvestmentChartOptions()
  });
}

// 損益分岐点分析のグラフ初期化
function initBreakevenChart() {
  const breakevenCtx = document.getElementById('breakeven-chart').getContext('2d');
  breakevenChart = new Chart(breakevenCtx, {
    type: 'line',
    data: {
      labels: ['0', '20', '40', '60', '80', '100', '120', '140'],
      datasets: [
        {
          label: '売上',
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgba(33, 150, 243, 1)',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.1,
          pointBackgroundColor: 'rgba(33, 150, 243, 1)'
        },
        {
          label: '費用合計',
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgba(244, 67, 54, 1)',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.1,
          pointBackgroundColor: 'rgba(244, 67, 54, 1)'
        }
      ]
    },
    options: getBreakevenChartOptions()
  });
}

// 投資回収シミュレーションのグラフ初期化
function initPaybackChart() {
  const paybackCtx = document.getElementById('payback-chart').getContext('2d');
  paybackChart = new Chart(paybackCtx, {
    type: 'bar',
    data: {
      labels: ['1年目', '2年目', '3年目', '4年目', '5年目'],
      datasets: [
        {
          label: '累積利益',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 2,
          borderRadius: 5,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        },
        {
          label: '初期投資',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 3,
          borderDash: [5, 5],
          type: 'line',
          pointRadius: 0
        }
      ]
    },
    options: getPaybackChartOptions()
  });
}

// グラフのオプション設定
function getExpenseChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: { size: 12 }
        }
      },
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          const total = ctx.dataset.data.reduce((acc, data) => acc + data, 0);
          const percentage = (value / total * 100).toFixed(1) + '%';
          return value > 0 ? `${value.toFixed(1)}万円\n(${percentage})` : '';
        },
        color: 'white',
        font: {
          weight: 'bold',
          size: 11
        },
        textAlign: 'center',
        textStrokeColor: 'rgba(0, 0, 0, 0.2)',
        textStrokeWidth: 1,
        padding: 6
      }
    }
  };
}

function getInvestmentChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: { size: 12 }
        }
      },
      datalabels: {
        formatter: (value, ctx) => {
          const total = ctx.dataset.data.reduce((acc, data) => acc + data, 0);
          const percentage = Math.round(value / total * 100);
          return value > 0 ? `${value}万円\n(${percentage}%)` : '';
        },
        color: 'white',
        font: {
          weight: 'bold',
          size: 11
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.2)',
        textStrokeWidth: 1,
        padding: 6
      }
    }
  };
}

function getBreakevenChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 12 }
        }
      },
      datalabels: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '金額（万円）'
        },
        ticks: {
          callback: function(value) {
            return value + '万円';
          }
        }
      },
      x: {
        title: {
          display: true,
          text: '1日あたりの来客数'
        }
      }
    }
  };
}

function getPaybackChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 12 }
        }
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.dataset.type === 'line') return null;
          return value > 0 ? `${value.toFixed(0)}万円` : '';
        },
        color: 'rgba(0, 0, 0, 0.7)',
        font: {
          weight: 'bold',
          size: 11
        },
        anchor: 'end',
        align: 'top',
        offset: 0
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '金額（万円）'
        },
        ticks: {
          callback: function(value) {
            return value + '万円';
          }
        }
      }
    }
  };
}

// グラフの更新
function updateCharts(data) {
  updateExpenseChart(data);
  updateInvestmentChart(data);
  updateBreakevenChart(data);
  updatePaybackChart(data);
}

function updateExpenseChart(data) {
  expenseChart.data.datasets[0].data = [
    data.foodCost,
    data.rent,
    data.utilities,
    data.salaries,
    data.otherFixed,
    data.profit
  ];
  expenseChart.update();
}

function updateInvestmentChart(data) {
  investmentChart.data.datasets[0].data = [
    data.renovation,
    data.equipment,
    data.furniture,
    data.deposit,
    data.otherInitial
  ];
  investmentChart.update();
}

function updateBreakevenChart(data) {
  breakevenChart.data.labels = data.customerLabels;
  breakevenChart.data.datasets[0].data = data.revenueData;
  breakevenChart.data.datasets[1].data = data.costData;
  breakevenChart.update();
}

function updatePaybackChart(data) {
  paybackChart.data.datasets[0].data = data.cumulativeProfits;
  paybackChart.data.datasets[1].data = data.investmentLine;
  paybackChart.update();
} 