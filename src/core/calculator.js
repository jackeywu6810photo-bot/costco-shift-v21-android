/**
 * Costco 班表計算器 (JavaScript 版本)
 * 轉換自 Python core/calculator.py
 */

// 預設薪資表
const DEFAULT_SALARY_TABLE = [253, 260, 269, 278, 286, 291, 302, 309, 358];

// 加班費率
const OVERTIME_RATES = {
  regular: { first2: 1.34, after: 1.67 },
  rest: 1.67,
  holiday: 2.0
};

/**
 * 計算加班費
 * @param {number} baseRate - 基本時薪
 * @param {number} overtimeHours - 加班時數
 * @param {string} dayType - 'regular' | 'rest' | 'holiday'
 * @returns {number} 加班費總額
 */
function calculateOvertimePay(baseRate, overtimeHours, dayType = 'regular') {
  if (dayType === 'regular') {
    // 平日加班
    const first2Hours = Math.min(overtimeHours, 2);
    const remainingHours = Math.max(0, overtimeHours - 2);
    return (first2Hours * baseRate * OVERTIME_RATES.regular.first2) +
           (remainingHours * baseRate * OVERTIME_RATES.regular.after);
  } else if (dayType === 'rest') {
    // 休息日加班
    return overtimeHours * baseRate * OVERTIME_RATES.rest;
  } else {
    // 國定假日加班
    return overtimeHours * baseRate * OVERTIME_RATES.holiday;
  }
}

/**
 * 使用自定義倍率計算（Costco 手冊版本）
 * @param {number} rate - 基本時薪（預設 358）
 * @param {number} baseHours - 基本時數
 * @param {number} overtimeHours - 加班時數
 * @param {number} baseMultiplier - 基本倍率（預設 1.667）
 * @param {number} otMultiplier - 加班倍率（預設 2.667）
 * @returns {Object} 計算結果
 */
function calculateWithCustomRates(rate = 358, baseHours = 8, overtimeHours = 0, 
                                   baseMultiplier = 1.667, otMultiplier = 2.667) {
  const basePay = baseHours * rate * baseMultiplier;
  const otPay = overtimeHours * rate * otMultiplier;
  
  return {
    basePay: Math.round(basePay),
    overtimePay: Math.round(otPay),
    totalPay: Math.round(basePay + otPay),
    details: {
      base: `${baseHours}h × ${rate} × ${baseMultiplier}`,
      overtime: `${overtimeHours}h × ${rate} × ${otMultiplier}`
    }
  };
}

/**
 * 取得職級資訊
 * @param {number} totalHours - 總累積時數
 * @param {number} currentStep - 當前職級（0-8）
 * @returns {Object} 職級資訊
 */
function getLevelInfo(totalHours, currentStep = 0) {
  const HOURS_PER_LEVEL = 1040; // 每級所需時數
  const nextLevelHours = (currentStep + 1) * HOURS_PER_LEVEL;
  const currentLevelHours = currentStep * HOURS_PER_LEVEL;
  
  const progress = totalHours - currentLevelHours;
  const remaining = nextLevelHours - totalHours;
  const progressPercent = Math.min(100, (progress / HOURS_PER_LEVEL) * 100);
  
  return {
    currentLevel: currentStep,
    nextLevel: currentStep + 1,
    progress: Math.max(0, progress),
    remaining: Math.max(0, remaining),
    progressPercent: progressPercent,
    isMaxLevel: currentStep >= 8
  };
}

/**
 * 計算月薪
 * @param {Object} shifts - 班表資料
 * @param {number} hourlyRate - 時薪
 * @returns {Object} 薪資計算結果
 */
function calculateMonthlySalary(shifts, hourlyRate = 358) {
  let totalHours = 0;
  let totalOvertime = 0;
  let basePay = 0;
  let overtimePay = 0;
  
  Object.values(shifts).forEach(shift => {
    const hours = shift.hours || 0;
    const overtime = shift.overtime || 0;
    
    totalHours += hours;
    totalOvertime += overtime;
    
    // 基本薪資（8小時 × 時薪 × 1.667）
    basePay += Math.min(hours, 8) * hourlyRate * 1.667;
    
    // 加班費（加班時數 × 時薪 × 2.667）
    overtimePay += overtime * hourlyRate * 2.667;
  });
  
  return {
    totalHours: Math.round(totalHours * 10) / 10,
    totalOvertime: Math.round(totalOvertime * 10) / 10,
    basePay: Math.round(basePay),
    overtimePay: Math.round(overtimePay),
    totalPay: Math.round(basePay + overtimePay)
  };
}

/**
 * 計算假日薪資
 * @param {boolean} isNationalHoliday - 是否為國定假日
 * @param {number} hours - 工作時數
 * @param {number} rate - 時薪
 * @returns {number} 假日薪資
 */
function calculateHolidayPay(isNationalHoliday, hours, rate = 358) {
  if (isNationalHoliday) {
    // 國定假日：2倍薪
    return hours * rate * 2;
  }
  return hours * rate;
}

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateOvertimePay,
    calculateWithCustomRates,
    getLevelInfo,
    calculateMonthlySalary,
    calculateHolidayPay,
    DEFAULT_SALARY_TABLE,
    OVERTIME_RATES
  };
}
