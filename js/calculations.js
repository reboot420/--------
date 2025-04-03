// 計算に関する定数
const DAYS_PER_YEAR = 365;
const MONTHS_PER_YEAR = 12;

// 入力値の取得
function getInputValues() {
  return {
    // 初期投資
    renovation: parseFloat(document.getElementById('renovation').value) || 0,
    equipment: parseFloat(document.getElementById('equipment').value) || 0,
    furniture: parseFloat(document.getElementById('furniture').value) || 0,
    deposit: parseFloat(document.getElementById('deposit').value) || 0,
    otherInitial: parseFloat(document.getElementById('other_initial').value) || 0,

    // 固定費
    rent: parseFloat(document.getElementById('rent').value) || 0,
    utilities: parseFloat(document.getElementById('utilities').value) || 0,
    salaries: parseFloat(document.getElementById('salaries').value) || 0,
    otherFixed: parseFloat(document.getElementById('other_fixed').value) || 0,

    // 売上予測
    customers: parseFloat(document.getElementById('customers').value) || 0,
    spend: parseFloat(document.getElementById('spend').value) || 0,
    days: parseFloat(document.getElementById('days').value) || 0,
    foodCostRate: parseFloat(document.getElementById('food_cost').value) || 0,
    seats: parseFloat(document.getElementById('seats').value) || 0,
    turnover: parseFloat(document.getElementById('turnover').value) || 0
  };
}

// 初期投資の計算
function calculateInitialInvestment(inputs) {
  return {
    total: inputs.renovation + inputs.equipment + inputs.furniture + inputs.deposit + inputs.otherInitial,
    breakdown: {
      renovation: inputs.renovation,
      equipment: inputs.equipment,
      furniture: inputs.furniture,
      deposit: inputs.deposit,
      otherInitial: inputs.otherInitial
    }
  };
}

// 固定費の計算
function calculateFixedCosts(inputs) {
  return {
    total: inputs.rent + inputs.utilities + inputs.salaries + inputs.otherFixed,
    breakdown: {
      rent: inputs.rent,
      utilities: inputs.utilities,
      salaries: inputs.salaries,
      otherFixed: inputs.otherFixed
    }
  };
}

// 売上の計算
function calculateRevenue(inputs) {
  const dailyRevenue = (inputs.customers * inputs.spend) / 10000; // 万円に変換
  const monthlyRevenue = dailyRevenue * inputs.days;
  return {
    daily: dailyRevenue,
    monthly: monthlyRevenue,
    annual: monthlyRevenue * MONTHS_PER_YEAR
  };
}

// 変動費の計算
function calculateVariableCosts(revenue, inputs) {
  const foodCost = revenue.monthly * (inputs.foodCostRate / 100);
  return {
    total: foodCost,
    breakdown: {
      foodCost: foodCost
    }
  };
}

// 利益の計算
function calculateProfit(revenue, fixedCosts, variableCosts) {
  const monthlyProfit = revenue.monthly - fixedCosts.total - variableCosts.total;
  return {
    monthly: monthlyProfit,
    annual: monthlyProfit * MONTHS_PER_YEAR,
    margin: (monthlyProfit / revenue.monthly) * 100
  };
}

// 投資回収期間の計算
function calculatePaybackPeriod(initialInvestment, monthlyProfit) {
  if (monthlyProfit <= 0) return null;
  const months = initialInvestment / monthlyProfit;
  return {
    months: months,
    years: months / MONTHS_PER_YEAR
  };
}

// ROIの計算
function calculateROI(annualProfit, initialInvestment) {
  if (initialInvestment <= 0 || annualProfit <= 0) return "計算不可";
  return ((annualProfit / initialInvestment) * 100).toFixed(1);
}

// 損益分岐点の計算
function calculateBreakEven(fixedCosts, variableCosts, revenue) {
  if (revenue.monthly <= 0) return { revenue: 0, customers: 0 };
  
  const variableCostRatio = variableCosts.total / revenue.monthly;
  const breakEvenRevenue = fixedCosts.total / (1 - variableCostRatio);
  
  // 1日あたりの売上から客数を逆算
  const dailyBreakEvenRevenue = breakEvenRevenue / 26; // 営業日数で割る
  const breakEvenCustomers = Math.ceil(dailyBreakEvenRevenue * 10000 / revenue.daily);
  
  return {
    revenue: breakEvenRevenue,
    customers: breakEvenCustomers,
    variableCostRatio: variableCostRatio
  };
}

// 損益分岐点グラフのラベル計算
function calculateBreakEvenChartLabels(customers) {
  const maxCustomers = Math.max(customers * 1.5, 80); // 現在の客数の1.5倍か80のどちらか大きい方
  const step = Math.ceil(maxCustomers / 8);
  return Array.from({length: 9}, (_, i) => (i * step).toString());
}

// 損益分岐点グラフのデータ計算
function calculateBreakEvenChartData(inputs) {
  const customerLabels = calculateBreakEvenChartLabels(inputs.customers);
  const maxCustomers = parseInt(customerLabels[customerLabels.length - 1]);
  const revenueData = [];
  const fixedCostData = [];
  const variableCostData = [];
  const breakevenLine = [];
  
  // 固定費の計算
  const monthlyFixedCosts = calculateFixedCosts(inputs).total;
  const dailyFixedCosts = monthlyFixedCosts / inputs.days;
  
  // 変動費率の計算
  const variableCostRate = inputs.foodCostRate / 100;
  
  // 損益分岐点の計算
  const breakEvenPoint = monthlyFixedCosts / (1 - variableCostRate);
  const dailyBreakEven = breakEvenPoint / inputs.days;
  
  customerLabels.forEach(label => {
    const customers = parseInt(label);
    const dailyRevenue = (customers * inputs.spend) / 10000; // 万円に変換
    const dailyVariableCost = dailyRevenue * variableCostRate;
    
    revenueData.push(parseFloat(dailyRevenue.toFixed(1)));
    fixedCostData.push(parseFloat(dailyFixedCosts.toFixed(1)));
    variableCostData.push(parseFloat(dailyVariableCost.toFixed(1)));
    breakevenLine.push(parseFloat(dailyBreakEven.toFixed(1)));
  });
  
  return {
    customerLabels,
    revenueData,
    fixedCostData,
    variableCostData,
    breakevenLine
  };
}

// 座席稼働率の計算
function calculateSeatUtilization(inputs) {
  const maxPossibleCustomers = inputs.seats * inputs.turnover * inputs.days;
  return (inputs.customers * inputs.days) / maxPossibleCustomers * 100;
}

// 各種比率の計算
function calculateRatios(inputs, revenue) {
  return {
    laborCost: (inputs.salaries / revenue.monthly) * 100,
    rent: (inputs.rent / revenue.monthly) * 100,
    foodCost: inputs.foodCostRate
  };
} 