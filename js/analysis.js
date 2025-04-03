// 評価基準の定義
const EVALUATION_CRITERIA = {
  spendPerCustomer: {
    low: 1000,
    medium: 1500,
    high: 5000
  },
  turnover: {
    low: 1.5,
    medium: 2.0,
    high: 3.5
  },
  seatUtilization: {
    low: 50,
    medium: 70,
    high: 95
  },
  laborCostRatio: {
    optimal: {
      min: 15,
      max: 30
    }
  },
  rentRatio: {
    optimal: {
      min: 5,
      max: 10
    }
  },
  costRatio: {
    optimal: {
      min: 60,
      max: 80
    }
  }
};

// 客単価の評価
function evaluateSpendPerCustomer(spend) {
  if (spend < 1000) {
    return {
      text: "客単価が低めです",
      rating: '<span class="rating warning">要改善</span>'
    };
  } else if (spend > 5000) {
    return {
      text: "客単価が高めです",
      rating: '<span class="rating positive">良好</span>'
    };
  } else {
    return {
      text: "客単価は標準的です",
      rating: '<span class="rating neutral">普通</span>'
    };
  }
}

// 回転率の評価
function evaluateTurnover(turnover) {
  if (turnover < 1.5) {
    return {
      text: "回転率が低いです",
      rating: '<span class="rating warning">要改善</span>'
    };
  } else if (turnover > 3) {
    return {
      text: "回転率が高いです",
      rating: '<span class="rating positive">良好</span>'
    };
  } else {
    return {
      text: "回転率は標準的です",
      rating: '<span class="rating neutral">普通</span>'
    };
  }
}

// 座席稼働率の評価
function evaluateSeatUtilization(utilization) {
  if (utilization < 50) {
    return {
      text: `稼働率${utilization.toFixed(1)}%で低めです`,
      rating: '<span class="rating warning">要改善</span>'
    };
  } else if (utilization > 80) {
    return {
      text: `稼働率${utilization.toFixed(1)}%で高めです`,
      rating: '<span class="rating positive">良好</span>'
    };
  } else {
    return {
      text: `稼働率${utilization.toFixed(1)}%で標準的です`,
      rating: '<span class="rating neutral">普通</span>'
    };
  }
}

// 人件費率の評価
function evaluateLaborCost(ratio) {
  if (ratio > 35) {
    return '<span class="rating warning">高い</span>';
  } else if (ratio < 25) {
    return '<span class="rating positive">適正</span>';
  } else {
    return '<span class="rating neutral">普通</span>';
  }
}

// 家賃比率の評価
function evaluateRentRatio(ratio) {
  if (ratio > 15) {
    return '<span class="rating warning">高い</span>';
  } else if (ratio < 8) {
    return '<span class="rating positive">適正</span>';
  } else {
    return '<span class="rating neutral">普通</span>';
  }
}

// コスト比率の評価
function evaluateCostRatio(ratio) {
  if (ratio > 90) {
    return '<span class="rating warning">高い</span>';
  } else if (ratio < 80) {
    return '<span class="rating positive">適正</span>';
  } else {
    return '<span class="rating neutral">普通</span>';
  }
}

// 総合分析の生成
function generateAnalysisSummary(monthlyProfit, profitMargin, paybackPeriod, seatUtilization, laborCostRatio, foodCostRate) {
  let analysis = "";

  if (monthlyProfit <= 0) {
    analysis = `<p class="negative">現在の条件では赤字となります。収入増加または費用削減が必要です。</p>`;
  } else if (profitMargin < 10) {
    analysis = `<p class="warning">利益率が低く（${profitMargin.toFixed(1)}%）、経営が不安定になる可能性があります。</p>`;
  } else if (paybackPeriod !== "計算不可" && parseFloat(paybackPeriod) > 36) {
    analysis = `<p class="warning">投資回収に時間がかかります（${paybackPeriod}ヶ月）。初期投資の見直しもしくは収益性の向上が望ましいです。</p>`;
  } else {
    analysis = `<p class="positive">収益性は良好です。月間${monthlyProfit.toFixed(1)}万円の利益が見込まれ、投資回収は${paybackPeriod}ヶ月で完了する見込みです。</p>`;
  }

  // 追加の分析
  if (seatUtilization < 60) {
    analysis += `<p>座席稼働率が${seatUtilization.toFixed(1)}%と低めです。マーケティング強化や提供時間の工夫で集客を増やすことを検討してください。</p>`;
  }

  if (laborCostRatio > 30) {
    analysis += `<p>人件費率が${laborCostRatio.toFixed(1)}%と高めです。オペレーション効率化やシフト最適化を検討してください。</p>`;
  }

  if (foodCostRate > 40) {
    analysis += `<p>食材費率が${foodCostRate}%と高めです。メニュー構成や仕入れの見直しが有効かもしれません。</p>`;
  }

  return analysis;
} 