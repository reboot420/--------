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
  // 数値を表示する関数
  const formatNumber = (num) => {
    return Number(num).toLocaleString('ja-JP', { maximumFractionDigits: 1 });
  };

  // メインメトリクスの更新
  const monthlyProfitElement = document.getElementById('monthly_profit');
  const profitValue = formatNumber(data.monthlyProfit);
  monthlyProfitElement.innerHTML = `${profitValue}<span class="unit">万円</span>`;
  monthlyProfitElement.className = `metric-value ${data.monthlyProfit >= 0 ? 'positive' : 'negative'}`;

  // 初期投資合計
  document.getElementById('total_investment').innerHTML = 
    `${formatNumber(data.totalInvestment)}<span class="unit">万円</span>`;

  // 月間売上
  document.getElementById('monthly_revenue').innerHTML = 
    `${formatNumber(data.monthlyRevenue)}<span class="unit">万円</span>`;
  document.getElementById('sales_per_day').textContent = 
    `1日あたり${formatNumber(data.dailySales)}万円`;

  // 月間利益と利益率
  document.getElementById('profit_margin').textContent = 
    `利益率${formatNumber(data.profitMargin)}%`;

  // 投資回収期間
  const paybackElement = document.getElementById('payback_period');
  paybackElement.innerHTML = 
    `${formatNumber(data.paybackPeriod)}<span class="unit">ヶ月</span>`;
  paybackElement.className = 
    `metric-value ${data.monthlyProfit <= 0 ? 'negative' : (parseFloat(data.paybackPeriod) > 36 ? 'warning' : 'positive')}`;

  // 投資回収期間（年）
  const years = data.paybackPeriod / 12;
  document.getElementById('payback_years').textContent = 
    `約${years.toFixed(1)}年`;

  // 投資利益率
  document.getElementById('roi').innerHTML = 
    `${formatNumber(data.roi)}<span class="unit">%</span>`;

  // 詳細分析の更新
  document.getElementById('spend_adequacy').textContent = data.spendAdequacy.text;
  document.getElementById('spend_rating').innerHTML = data.spendAdequacy.rating;
  
  document.getElementById('seat_turnover').textContent = data.seatTurnover.text;
  document.getElementById('turnover_rating').innerHTML = data.seatTurnover.rating;
  
  document.getElementById('customer_fullfillment').textContent = data.customerFulfillment.text;
  document.getElementById('customer_rating').innerHTML = data.customerFulfillment.rating;
  
  document.getElementById('labor_cost_ratio').textContent = 
    `${formatNumber(data.laborCostRatio)}%`;
  document.getElementById('labor_rating').innerHTML = data.laborRating;
  
  document.getElementById('rent_ratio').textContent = 
    `${formatNumber(data.rentRatio)}%`;
  document.getElementById('rent_rating').innerHTML = data.rentRating;
  
  document.getElementById('total_monthly_cost').textContent = 
    `${formatNumber(data.totalMonthlyCost)}万円`;
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

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
  // 初期化時に一度計算を実行
  try {
    console.log('初期化開始');
    initCharts();
    console.log('チャート初期化完了');
    updateCalculations();
    console.log('初期計算完了');
  } catch (error) {
    console.error('初期化エラー:', error);
  }
  
  // 入力フィールドの変更イベントリスナーを設定
  const inputFields = document.querySelectorAll('input[type="number"]');
  inputFields.forEach(field => {
    field.addEventListener('input', function() {
      try {
        updateCalculations();
      } catch (error) {
        console.error('計算更新エラー:', error);
      }
    });
  });
}); 