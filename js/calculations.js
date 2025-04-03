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
  return (annualProfit / initialInvestment) * 100;
}

// 損益分岐点の計算
function calculateBreakEven(fixedCosts, variableCosts, revenue) {
  if (revenue.monthly <= 0) return { revenue: 0, customers: 0 };
  
  const variableCostRatio = variableCosts.total / revenue.monthly;
  const breakEvenRevenue = fixedCosts.total / (1 - variableCostRatio);
  
  // revenueオブジェクトから1日あたりの顧客単価を計算
  const dailyRevenue = revenue.daily;
  const dailyCustomers = dailyRevenue > 0 ? revenue.daily / (revenue.monthly / (dailyRevenue * 26)) : 0;
  const breakEvenCustomers = Math.ceil(breakEvenRevenue / (dailyRevenue / dailyCustomers));
  
  return {
    revenue: breakEvenRevenue,
    customers: breakEvenCustomers
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