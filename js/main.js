// メインの更新関数
function updateCalculations() {
  // 入力値を取得
  const inputs = getInputValues();
  
  // 各種計算を実行
  const initialInvestment = calculateInitialInvestment(inputs);
  const fixedCosts = calculateFixedCosts(inputs);
  const revenue = calculateRevenue(inputs);
  const variableCosts = calculateVariableCosts(revenue, inputs);
  const profit = calculateProfit(revenue, fixedCosts, variableCosts);
  const payback = calculatePaybackPeriod(initialInvestment.total, profit.monthly);
  const roi = calculateROI(profit.annual, initialInvestment.total);
  const seatUtilization = calculateSeatUtilization(inputs);
  const ratios = calculateRatios(inputs, revenue);
  
  // 損益分岐点の計算
  const breakEven = calculateBreakEven(fixedCosts, variableCosts, revenue);
  
  // 評価結果の取得
  const spendEvaluation = evaluateSpendPerCustomer(inputs.spend);
  const turnoverEvaluation = evaluateTurnover(inputs.turnover);
  const utilizationEvaluation = evaluateSeatUtilization(seatUtilization);
  const laborCostEvaluation = evaluateLaborCost(ratios.laborCost);
  const rentRatioEvaluation = evaluateRentRatio(ratios.rent);
  const costRatioEvaluation = evaluateCostRatio((fixedCosts.total + variableCosts.total) / revenue.monthly * 100);
  
  // 分析結果の生成
  const analysisSummary = generateAnalysisSummary(
    profit.monthly,
    profit.margin,
    payback ? payback.months.toFixed(1) : "計算不可",
    seatUtilization,
    ratios.laborCost,
    ratios.foodCost
  );
  
  // 表示を更新
  updateDisplayValues({
    totalInvestment: initialInvestment.total,
    monthlyRevenue: revenue.monthly,
    dailySales: revenue.daily,
    monthlyProfit: profit.monthly,
    profitMargin: profit.margin,
    paybackPeriod: payback ? payback.months.toFixed(1) : "計算不可",
    paybackYears: payback ? `約${payback.years.toFixed(1)}年` : "",
    roi: roi,
    breakEvenPoint: breakEven.revenue,
    breakEvenCustomers: breakEven.customers,
    spendAdequacy: spendEvaluation,
    seatTurnover: turnoverEvaluation,
    customerFulfillment: utilizationEvaluation,
    laborCostRatio: ratios.laborCost,
    laborRating: laborCostEvaluation,
    rentRatio: ratios.rent,
    rentRating: rentRatioEvaluation,
    totalMonthlyCost: fixedCosts.total + variableCosts.total,
    costRating: costRatioEvaluation,
    analysisSummary: analysisSummary
  });
  
  // グラフを更新
  const chartData = {
    foodCost: variableCosts.breakdown.foodCost,
    rent: fixedCosts.breakdown.rent,
    utilities: fixedCosts.breakdown.utilities,
    salaries: fixedCosts.breakdown.salaries,
    otherFixed: fixedCosts.breakdown.otherFixed,
    profit: Math.max(0, profit.monthly),
    renovation: initialInvestment.breakdown.renovation,
    equipment: initialInvestment.breakdown.equipment,
    furniture: initialInvestment.breakdown.furniture,
    deposit: initialInvestment.breakdown.deposit,
    otherInitial: initialInvestment.breakdown.otherInitial,
    cumulativeProfits: calculatePaybackChartData(profit.annual, 10),
    investmentLine: Array(11).fill(initialInvestment.total)
  };
  
  updateCharts(chartData);
}

// 表示値の更新
function updateDisplayValues(data) {
  // メインメトリクスの更新
  const monthlyProfitElement = document.getElementById('monthly_profit');
  monthlyProfitElement.textContent = Math.round(data.monthlyProfit);
  monthlyProfitElement.className = `metric-value ${data.monthlyProfit >= 0 ? 'positive' : 'negative'}`;

  document.getElementById('total_investment').textContent = Math.round(data.totalInvestment);
  document.getElementById('monthly_revenue').textContent = Math.round(data.monthlyRevenue);
  document.getElementById('sales_per_day').textContent = `1日あたり${Math.round(data.dailySales)}万円`;
  document.getElementById('profit_margin').textContent = `利益率${data.profitMargin.toFixed(1)}%`;
  
  const paybackElement = document.getElementById('payback_period');
  paybackElement.textContent = data.paybackPeriod;
  paybackElement.className = `metric-value ${data.monthlyProfit <= 0 ? 'negative' : (parseFloat(data.paybackPeriod) > 36 ? 'warning' : 'positive')}`;
  
  document.getElementById('payback_years').textContent = data.paybackYears;
  document.getElementById('roi').textContent = data.roi;
  
  // 詳細分析の更新
  document.getElementById('spend_adequacy').textContent = data.spendAdequacy.text;
  document.getElementById('spend_rating').innerHTML = data.spendAdequacy.rating;
  
  document.getElementById('seat_turnover').textContent = data.seatTurnover.text;
  document.getElementById('turnover_rating').innerHTML = data.seatTurnover.rating;
  
  document.getElementById('customer_fullfillment').textContent = data.customerFulfillment.text;
  document.getElementById('customer_rating').innerHTML = data.customerFulfillment.rating;
  
  document.getElementById('labor_cost_ratio').textContent = `${data.laborCostRatio.toFixed(1)}%`;
  document.getElementById('labor_rating').innerHTML = data.laborRating;
  
  document.getElementById('rent_ratio').textContent = `${data.rentRatio.toFixed(1)}%`;
  document.getElementById('rent_rating').innerHTML = data.rentRating;
  
  document.getElementById('total_monthly_cost').textContent = `${Math.round(data.totalMonthlyCost)}万円`;
  document.getElementById('cost_rating').innerHTML = data.costRating;
  
  document.getElementById('analysis_result').innerHTML = data.analysisSummary;
}

// 損益分岐点グラフのラベル計算
function calculateBreakEvenChartLabels(customers) {
  const customerIncrement = Math.ceil(customers * 1.4 / 8);
  return Array.from({length: 9}, (_, i) => (i * customerIncrement).toString());
}

// 損益分岐点グラフのデータ計算
function calculateBreakEvenChartData(inputs) {
  const customerIncrement = Math.ceil(inputs.customers * 1.4 / 8);
  const revenueData = [];
  const costData = [];
  const dailySpend = inputs.spend / 10000; // 万円に変換
  
  for (let i = 0; i <= 8; i++) {
    const currentCustomers = i * customerIncrement;
    const currentRevenue = currentCustomers * dailySpend * inputs.days;
    const variableCost = currentRevenue * (inputs.foodCostRate / 100);
    const totalCost = calculateFixedCosts(inputs).total + variableCost;
    
    revenueData.push(parseFloat(currentRevenue.toFixed(1)));
    costData.push(parseFloat(totalCost.toFixed(1)));
  }
  
  return { revenueData, costData };
}

// 投資回収グラフのデータ計算
function calculatePaybackChartData(annualProfit, years) {
  return Array.from({length: years}, (_, i) => parseFloat((annualProfit * (i + 1)).toFixed(1)));
}

// 入力値の保存
function saveInputValues() {
  const inputs = {
    renovation: document.getElementById('renovation').value,
    equipment: document.getElementById('equipment').value,
    furniture: document.getElementById('furniture').value,
    deposit: document.getElementById('deposit').value,
    other_initial: document.getElementById('other_initial').value,
    rent: document.getElementById('rent').value,
    utilities: document.getElementById('utilities').value,
    salaries: document.getElementById('salaries').value,
    other_fixed: document.getElementById('other_fixed').value,
    customers: document.getElementById('customers').value,
    spend: document.getElementById('spend').value,
    days: document.getElementById('days').value,
    food_cost: document.getElementById('food_cost').value,
    seats: document.getElementById('seats').value,
    turnover: document.getElementById('turnover').value
  };
  
  localStorage.setItem('restaurantPlannerInputs', JSON.stringify(inputs));
}

// 保存された入力値の読み込み
function loadInputValues() {
  const savedInputs = localStorage.getItem('restaurantPlannerInputs');
  if (savedInputs) {
    const inputs = JSON.parse(savedInputs);
    Object.keys(inputs).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.value = inputs[id];
      }
    });
    // 読み込み後に計算を実行
    updateCalculations();
  }
}

// データのリセット
function resetData() {
  if (confirm('入力データをリセットしてもよろしいですか？')) {
    // デフォルト値の設定
    const defaultValues = {
      renovation: 500,
      equipment: 300,
      furniture: 200,
      deposit: 100,
      other_initial: 100,
      rent: 20,
      utilities: 8,
      salaries: 80,
      other_fixed: 12,
      customers: 40,
      spend: 2000,
      days: 26,
      food_cost: 35,
      seats: 30,
      turnover: 2.5
    };

    // 各入力フィールドにデフォルト値を設定
    Object.keys(defaultValues).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.value = defaultValues[id];
      }
    });

    // ローカルストレージから保存データを削除
    localStorage.removeItem('restaurantPlannerInputs');

    // 計算を更新
    updateCalculations();
  }
}

// 履歴管理機能
const historyManager = {
  // 履歴の保存
  saveSnapshot: function(name, memo) {
    const inputs = {
      renovation: document.getElementById('renovation').value,
      equipment: document.getElementById('equipment').value,
      furniture: document.getElementById('furniture').value,
      deposit: document.getElementById('deposit').value,
      other_initial: document.getElementById('other_initial').value,
      rent: document.getElementById('rent').value,
      utilities: document.getElementById('utilities').value,
      salaries: document.getElementById('salaries').value,
      other_fixed: document.getElementById('other_fixed').value,
      customers: document.getElementById('customers').value,
      spend: document.getElementById('spend').value,
      days: document.getElementById('days').value,
      food_cost: document.getElementById('food_cost').value,
      seats: document.getElementById('seats').value,
      turnover: document.getElementById('turnover').value
    };

    const snapshot = {
      name: name,
      memo: memo,
      date: new Date().toLocaleString(),
      data: inputs
    };

    let history = JSON.parse(localStorage.getItem('restaurantPlannerHistory') || '[]');
    history.push(snapshot);
    localStorage.setItem('restaurantPlannerHistory', JSON.stringify(history));
  },

  // 履歴の読み込み
  loadSnapshot: function(index) {
    const history = JSON.parse(localStorage.getItem('restaurantPlannerHistory') || '[]');
    const snapshot = history[index];
    if (snapshot) {
      Object.keys(snapshot.data).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.value = snapshot.data[id];
        }
      });
      updateCalculations();
    }
  },

  // 履歴の削除
  deleteSnapshot: function(index) {
    let history = JSON.parse(localStorage.getItem('restaurantPlannerHistory') || '[]');
    history.splice(index, 1);
    localStorage.setItem('restaurantPlannerHistory', JSON.stringify(history));
    this.displayHistory();
  },

  // 履歴一覧の表示
  displayHistory: function() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('restaurantPlannerHistory') || '[]');
    
    if (history.length === 0) {
      historyList.innerHTML = '<p>保存された履歴はありません。</p>';
      return;
    }

    historyList.innerHTML = history.map((snapshot, index) => `
      <div class="history-item">
        <div class="history-info">
          <div class="history-name">${snapshot.name}</div>
          <div class="history-date">${snapshot.date}</div>
          ${snapshot.memo ? `<div class="history-memo">${snapshot.memo}</div>` : ''}
        </div>
        <div class="history-actions">
          <button class="btn btn-primary" onclick="historyManager.loadSnapshot(${index})">読み込む</button>
          <button class="btn btn-danger" onclick="historyManager.deleteSnapshot(${index})">削除</button>
        </div>
      </div>
    `).join('');
  }
};

// モーダル管理
function initializeModals() {
  const historyModal = document.getElementById('historyModal');
  const saveModal = document.getElementById('saveModal');
  const dataManageBtn = document.getElementById('dataManageBtn');
  const saveSnapshotBtn = document.getElementById('saveSnapshot');
  const showHistoryBtn = document.getElementById('showHistory');
  const saveSnapshotConfirmBtn = document.getElementById('saveSnapshotConfirm');
  const closeBtns = document.getElementsByClassName('close-btn');
  const modalCloseBtns = document.getElementsByClassName('modal-close');

  // ドロップダウンメニューのイベント
  document.addEventListener('click', function(event) {
    if (!event.target.matches('#dataManageBtn') && !event.target.closest('.dropdown-content')) {
      const dropdowns = document.getElementsByClassName('dropdown-content');
      Array.from(dropdowns).forEach(dropdown => {
        if (dropdown.style.display === 'block') {
          dropdown.style.display = 'none';
        }
      });
    }
  });

  // 履歴表示
  showHistoryBtn.addEventListener('click', function(e) {
    e.preventDefault();
    historyModal.style.display = 'block';
    historyManager.displayHistory();
  });

  // 保存モーダル表示
  saveSnapshotBtn.addEventListener('click', function(e) {
    e.preventDefault();
    saveModal.style.display = 'block';
    document.getElementById('snapshotName').focus();
  });

  // 保存実行
  saveSnapshotConfirmBtn.addEventListener('click', function() {
    const name = document.getElementById('snapshotName').value.trim();
    const memo = document.getElementById('snapshotMemo').value.trim();
    
    if (!name) {
      const nameInput = document.getElementById('snapshotName');
      nameInput.classList.add('error');
      nameInput.focus();
      return;
    }
    
    historyManager.saveSnapshot(name, memo);
    saveModal.style.display = 'none';
    document.getElementById('snapshotName').value = '';
    document.getElementById('snapshotMemo').value = '';
  });

  // モーダルを閉じる
  Array.from(closeBtns).forEach(btn => {
    btn.addEventListener('click', function() {
      historyModal.style.display = 'none';
      saveModal.style.display = 'none';
    });
  });

  Array.from(modalCloseBtns).forEach(btn => {
    btn.addEventListener('click', function() {
      historyModal.style.display = 'none';
      saveModal.style.display = 'none';
    });
  });

  // モーダル外クリックで閉じる
  window.addEventListener('click', function(event) {
    if (event.target === historyModal || event.target === saveModal) {
      historyModal.style.display = 'none';
      saveModal.style.display = 'none';
    }
  });

  // Enterキーでの保存
  document.getElementById('snapshotName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveSnapshotConfirmBtn.click();
    }
  });

  // エラー表示の解除
  document.getElementById('snapshotName').addEventListener('input', function() {
    this.classList.remove('error');
  });
}

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
  try {
    console.log('初期化開始');
    
    // モーダルの初期化
    initializeModals();
    
    // リセットボタンのイベントリスナーを設定
    const resetButton = document.getElementById('resetData');
    if (resetButton) {
      resetButton.addEventListener('click', resetData);
    }
    
    // 保存された値を読み込む
    loadInputValues();
    
    // チャートの初期化を待つ
    setTimeout(() => {
      initCharts();
      console.log('チャート初期化完了');
      
      // 初期計算の実行
      updateCalculations();
      console.log('初期計算完了');
      
      // 入力フィールドの変更イベントリスナーを設定
      const inputFields = document.querySelectorAll('input[type="number"]');
      inputFields.forEach(field => {
        field.addEventListener('input', function() {
          try {
            updateCalculations();
            // 入力値を保存
            saveInputValues();
          } catch (error) {
            console.error('計算更新エラー:', error);
          }
        });
      });
    }, 100);
  } catch (error) {
    console.error('初期化エラー:', error);
  }
});

// トースト通知を表示する関数
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon"></span>
      <span class="toast-message">${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  
  // アニメーションのためにタイミングをずらす
  setTimeout(() => toast.classList.add('show'), 10);
  
  // 3秒後に非表示
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 現在の入力データを取得
function getCurrentInputData() {
  const inputs = {};
  const inputFields = document.querySelectorAll('input[type="number"]');
  inputFields.forEach(input => {
    inputs[input.id] = parseFloat(input.value) || 0;
  });
  return inputs;
}

// 保存ボタンのクリックハンドラ
document.getElementById('savePlan').addEventListener('click', () => {
  const currentData = getCurrentInputData();
  const totalInvestment = calculateTotalInvestment();
  const monthlyRevenue = calculateMonthlyRevenue();
  const monthlyProfit = calculateMonthlyProfit();
  
  // 保存モーダルを表示
  const saveModal = document.getElementById('saveModal');
  const summaryElement = document.querySelector('.save-summary');
  summaryElement.innerHTML = `
    <div class="summary-item">
      <div class="summary-label">初期投資合計</div>
      <div class="summary-value">${totalInvestment.toLocaleString()}万円</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">月間売上</div>
      <div class="summary-value">${monthlyRevenue.toLocaleString()}万円</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">月間利益</div>
      <div class="summary-value">${monthlyProfit.toLocaleString()}万円</div>
    </div>
  `;
  saveModal.style.display = 'block';
});

// 保存の確認
document.getElementById('saveConfirm').addEventListener('click', () => {
  const planName = document.getElementById('planName').value.trim();
  if (!planName) {
    showToast('事業計画名を入力してください', 'error');
    return;
  }
  
  const currentData = getCurrentInputData();
  const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
  const newPlan = {
    id: Date.now(),
    name: planName,
    memo: document.getElementById('planMemo').value.trim(),
    data: currentData,
    date: new Date().toISOString()
  };
  
  savedPlans.push(newPlan);
  localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
  
  document.getElementById('saveModal').style.display = 'none';
  document.getElementById('planName').value = '';
  document.getElementById('planMemo').value = '';
  
  showToast('事業計画を保存しました');
});

// 編集ボタンのクリックハンドラ
document.getElementById('editPlans').addEventListener('click', () => {
  const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
  const historyList = document.getElementById('historyList');
  const editModal = document.getElementById('editModal');
  
  if (savedPlans.length === 0) {
    historyList.innerHTML = '<div class="empty-history-message">保存された事業計画はありません</div>';
  } else {
    historyList.innerHTML = savedPlans.map(plan => `
      <div class="history-item" data-id="${plan.id}">
        <div class="history-header">
          <div class="history-title">
            <div class="history-name">${plan.name}</div>
            <div class="history-date">${new Date(plan.date).toLocaleString()}</div>
          </div>
        </div>
        <div class="history-summary">
          <div class="history-summary-item">
            <div class="history-summary-label">初期投資合計</div>
            <div class="history-summary-value">${calculateTotalInvestment(plan.data).toLocaleString()}万円</div>
          </div>
          <div class="history-summary-item">
            <div class="history-summary-label">月間売上</div>
            <div class="history-summary-value">${calculateMonthlyRevenue(plan.data).toLocaleString()}万円</div>
          </div>
          <div class="history-summary-item">
            <div class="history-summary-label">月間利益</div>
            <div class="history-summary-value">${calculateMonthlyProfit(plan.data).toLocaleString()}万円</div>
          </div>
        </div>
        ${plan.memo ? `<div class="history-memo">${plan.memo}</div>` : ''}
        <div class="history-actions">
          <button class="btn btn-primary load-plan" data-id="${plan.id}">読み込む</button>
          <button class="btn btn-danger delete-plan" data-id="${plan.id}">削除</button>
        </div>
      </div>
    `).join('');
  }
  
  editModal.style.display = 'block';
});

// 保存プランの読み込み
document.addEventListener('click', e => {
  if (e.target.classList.contains('load-plan')) {
    const planId = parseInt(e.target.dataset.id);
    const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
    const plan = savedPlans.find(p => p.id === planId);
    
    if (plan) {
      Object.entries(plan.data).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (input) input.value = value;
      });
      
      document.getElementById('editModal').style.display = 'none';
      updateCalculations();
      showToast('事業計画を読み込みました');
    }
  }
});

// 保存プランの削除
document.addEventListener('click', e => {
  if (e.target.classList.contains('delete-plan')) {
    if (confirm('この事業計画を削除してもよろしいですか？')) {
      const planId = parseInt(e.target.dataset.id);
      const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
      const updatedPlans = savedPlans.filter(p => p.id !== planId);
      
      localStorage.setItem('savedPlans', JSON.stringify(updatedPlans));
      e.target.closest('.history-item').remove();
      
      if (updatedPlans.length === 0) {
        document.getElementById('historyList').innerHTML = 
          '<div class="empty-history-message">保存された事業計画はありません</div>';
      }
      
      showToast('事業計画を削除しました');
    }
  }
});

// モーダルを閉じる
document.querySelectorAll('.modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeBtn.closest('.modal').style.display = 'none';
  });
});

// モーダル外クリックで閉じる
window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
}); 