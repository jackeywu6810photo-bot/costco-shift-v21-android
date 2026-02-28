/**
 * AI 排班建議器 (JavaScript 版本)
 * 轉換自 Python core/ai_scheduler.py
 */

class AIScheduler {
  constructor(db) {
    this.db = db;
  }

  /**
   * 計算疲勞指數 (0-100)
   * @param {Array} workDays - 連續工作天數
   * @param {number} avgHours - 平均工時
   * @returns {number} 疲勞指數
   */
  calculateFatigueScore(workDays, avgHours) {
    let score = 0;
    
    // 連續工作天數影響
    if (workDays >= 7) score += 40;
    else if (workDays >= 5) score += 25;
    else if (workDays >= 3) score += 10;
    
    // 平均工時影響
    if (avgHours >= 10) score += 40;
    else if (avgHours >= 9) score += 30;
    else if (avgHours >= 8) score += 15;
    
    // 加班時數影響
    const overtimeFactor = Math.max(0, avgHours - 8);
    score += overtimeFactor * 5;
    
    return Math.min(100, Math.round(score));
  }

  /**
   * 分析工作模式
   * @param {Object} shifts - 班表資料
   * @returns {Object} 分析結果
   */
  analyzeWorkPattern(shifts) {
    const dates = Object.keys(shifts).sort();
    if (dates.length === 0) {
      return {
        consecutiveWorkDays: 0,
        restDays: 0,
        avgHours: 0,
        fatigueScore: 0
      };
    }

    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let totalHours = 0;
    let workDays = 0;

    dates.forEach((date, index) => {
      const shift = shifts[date];
      if (shift.hours > 0) {
        currentConsecutive++;
        totalHours += shift.hours;
        workDays++;
      } else {
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        currentConsecutive = 0;
      }
    });

    maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    const avgHours = workDays > 0 ? totalHours / workDays : 0;
    const fatigueScore = this.calculateFatigueScore(maxConsecutive, avgHours);

    return {
      consecutiveWorkDays: maxConsecutive,
      totalWorkDays: workDays,
      restDays: dates.length - workDays,
      avgHours: Math.round(avgHours * 10) / 10,
      fatigueScore: fatigueScore
    };
  }

  /**
   * 產生建議
   * @param {Object} pattern - 工作模式分析結果
   * @returns {Array} 建議列表
   */
  generateSuggestions(pattern) {
    const suggestions = [];

    if (pattern.fatigueScore >= 80) {
      suggestions.push({
        level: 'high',
        icon: '⚠️',
        title: '疲勞警報',
        message: '您的疲勞指數過高，建議立即安排休息日！'
      });
    } else if (pattern.fatigueScore >= 60) {
      suggestions.push({
        level: 'medium',
        icon: '💤',
        title: '注意休息',
        message: '建議在未來 3 天內安排至少 1 天休息。'
      });
    }

    if (pattern.consecutiveWorkDays >= 6) {
      suggestions.push({
        level: 'high',
        icon: '📅',
        title: '連續工作過長',
        message: `已連續工作 ${pattern.consecutiveWorkDays} 天，建議安排休假。`
      });
    }

    if (pattern.avgHours > 9) {
      suggestions.push({
        level: 'medium',
        icon: '⏰',
        title: '工時過長',
        message: `平均工時 ${pattern.avgHours} 小時，建議調整班次。`
      });
    }

    if (pattern.restDays < 4 && pattern.totalWorkDays > 20) {
      suggestions.push({
        level: 'low',
        icon: '🌴',
        title: '休假不足',
        message: '本月休息日較少，建議安排更多休息時間。'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        level: 'good',
        icon: '✅',
        title: '狀態良好',
        message: '您的工作安排很健康，請保持！'
      });
    }

    return suggestions;
  }

  /**
   * 取得最佳休息日建議
   * @param {Object} shifts - 班表資料
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @returns {Array} 建議休息日
   */
  suggestRestDays(shifts, year, month) {
    const suggestions = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 找出連續工作後的日子
    let workStreak = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const shift = shifts[dateStr];
      
      if (shift && shift.hours > 0) {
        workStreak++;
      } else {
        // 建議在連續工作 5 天後休息
        if (workStreak >= 5) {
          suggestions.push({
            date: dateStr,
            reason: `連續工作 ${workStreak} 天後建議休息`,
            priority: workStreak >= 7 ? 'high' : 'medium'
          });
        }
        workStreak = 0;
      }
    }

    return suggestions;
  }

  /**
   * 完整的 AI 分析報告
   * @param {Object} shifts - 班表資料
   * @returns {Object} 完整報告
   */
  getFullAnalysis(shifts) {
    const pattern = this.analyzeWorkPattern(shifts);
    const suggestions = this.generateSuggestions(pattern);
    
    return {
      pattern,
      suggestions,
      summary: {
        status: pattern.fatigueScore >= 80 ? 'danger' : 
                pattern.fatigueScore >= 60 ? 'warning' : 'good',
        message: suggestions[0]?.message || '狀態良好'
      }
    };
  }
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIScheduler;
}
