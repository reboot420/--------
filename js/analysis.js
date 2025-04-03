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
  if (spend < EVALUATION_CRITERIA.spendPerCustomer.low) {
    return {
      text: "客単価が低すぎる可能性があります",
      rating: "<span class='negative'>要改善</span>"
    };
  } else if (spend < EVALUATION_CRITERIA.spendPerCustomer.medium) {
    return {
      text: "客単価がやや低めです",
      rating: "<span class='warning'>注意</span>"
    };
  } else if (spend > EVALUATION_CRITERIA.spendPerCustomer.high) {
    return {
      text: "客単価が高めです（業態による）",
      rating: "<span class='positive'>良好</span>"
    };
  } else {
    return {
      text: "客単価は標準的な範囲内です",
      rating: "<span class='positive'>良好</span>"
    };
  }
}

// 座席回転率の評価
function evaluateTurnover(turnover) {
  if (turnover < EVALUATION_CRITERIA.turnover.low) {
    return {
      text: `${turnover}回転（改善の余地あり）`,
      rating: "<span class='negative'>要改善</span>"
    };
  } else if (turnover < EVALUATION_CRITERIA.turnover.medium) {
    return {
      text: `${turnover}回転（一般的）`,
      rating: "<span class='warning'>普通</span>"
    };
  } else if (turnover > EVALUATION_CRITERIA.turnover.high) {
    return {
      text: `${turnover}回転（非常に高い）`,
      rating: "<span class='positive'>非常に良好</span>"
    };
  } else {
    return {
      text: `${turnover}回転（良好）`,
      rating: "<span class='positive'>良好</span>"
    };
  }
}

// 座席稼働率の評価
function evaluateSeatUtilization(utilization) {
  if (utilization < EVALUATION_CRITERIA.seatUtilization.low) {
    return {
      text: `${utilization.toFixed(1)}%（稼働率低）`,
      rating: "<span class='negative'>要改善</span>"
    };
  } else if (utilization < EVALUATION_CRITERIA.seatUtilization.medium) {
    return {
      text: `${utilization.toFixed(1)}%（一般的）`,
      rating: "<span class='warning'>普通</span>"
    };
  } else if (utilization > EVALUATION_CRITERIA.seatUtilization.high) {
    return {
      text: `${utilization.toFixed(1)}%（最大稼働）`,
      rating: "<span class='positive'>非常に良好</span>"
    };
  } else {
    return {
      text: `${utilization.toFixed(1)}%（良好）`,
      rating: "<span class='positive'>良好</span>"
    };
  }
}

// 人件費率の評価
function evaluateLaborCost(ratio) {
  if (ratio > 35) {
    return "<span class='negative'>高すぎる</span>";
  } else if (ratio > 30) {
    return "<span class='warning'>やや高い</span>";
  } else if (ratio < 15) {
    return "<span class='warning'>要確認</span>";
  } else {
    return "<span class='positive'>適正</span>";
  }
}

// 家賃負担率の評価
function evaluateRentRatio(ratio) {
  if (ratio > 15) {
    return "<span class='negative'>高すぎる</span>";
  } else if (ratio > 10) {
    return "<span class='warning'>やや高い</span>";
  } else if (ratio < 5) {
    return "<span class='positive'>低め</span>";
  } else {
    return "<span class='positive'>適正</span>";
  }
}

// 総コスト率の評価
function evaluateCostRatio(ratio) {
  if (ratio > 90) {
    return "<span class='negative'>非常に高い</span>";
  } else if (ratio > 80) {
    return "<span class='warning'>やや高い</span>";
  } else if (ratio < 60) {
    return "<span class='positive'>低め</span>";
  } else {
    return "<span class='positive'>適正</span>";
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