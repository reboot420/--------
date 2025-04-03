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
    roi: profit.monthly > 0 ? roi.toFixed(1) : "計算不可",
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
    customerLabels: calculateBreakEvenChartLabels(inputs.customers),
    revenueData: calculateBreakEvenChartData(inputs).revenueData,
    costData: calculateBreakEvenChartData(inputs).costData,
    cumulativeProfits: calculatePaybackChartData(profit.annual, 5),
    investmentLine: Array(5).fill(initialInvestment.total)
  };
  
  updateCharts(chartData);
}

// 表示値の更新
function updateDisplayValues(data) {
  // 数値表示の更新
  document.getElementById('total_investment').textContent = data.totalInvestment.toFixed(1);
  document.getElementById('monthly_revenue').textContent = data.monthlyRevenue.toFixed(1);
  document.getElementById('sales_per_day').textContent = `1日あたり ${data.dailySales.toFixed(1)}万円`;
  
  const monthlyProfitElement = document.getElementById('monthly_profit');
  monthlyProfitElement.textContent = data.monthlyProfit.toFixed(1);
  monthlyProfitElement.className = "metric-value " + (data.monthlyProfit >= 0 ? "positive" : "negative");
  
  document.getElementById('profit_margin').textContent = 
    data.profitMargin > 0 ? `利益率 ${data.profitMargin.toFixed(1)}%` : "赤字";
  
  const paybackElement = document.getElementById('payback_period');
  paybackElement.textContent = data.paybackPeriod;
  paybackElement.className = "metric-value " + 
    (data.monthlyProfit <= 0 ? "negative" : (data.paybackPeriod > 36 ? "warning" : "positive"));
  
  document.getElementById('payback_years').textContent = data.paybackYears;
  
  const roiElement = document.getElementById('roi');
  roiElement.textContent = data.roi;
  roiElement.className = "metric-value " + 
    (data.monthlyProfit <= 0 ? "negative" : (data.roi < 10 ? "warning" : "positive"));
  
  const breakevenElement = document.getElementById('breakeven_point');
  breakevenElement.textContent = isNaN(data.breakEvenPoint) ? "計算不可" : data.breakEvenPoint.toFixed(1);
  
  document.getElementById('breakeven_customers').textContent = 
    isNaN(data.breakEvenCustomers) ? "" : `必要客数: 1日${data.breakEvenCustomers}人`;
  
  // 詳細分析表示の更新
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
  
  document.getElementById('total_monthly_cost').textContent = `${data.totalMonthlyCost.toFixed(1)}万円`;
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
  initCharts();
  setTimeout(updateCalculations, 100); // 少し遅延を入れて確実にDOM要素が準備できてから実行
  
  // 入力フィールドの変更イベントリスナーを設定
  const inputFields = document.querySelectorAll('input[type="number"]');
  inputFields.forEach(field => {
    field.addEventListener('input', updateCalculations);
  });
}); 