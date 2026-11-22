/* provinces.js - 统一省份特质模块
 * 整合：省份基础属性、气候关联、初始经费、强弱属性、
 *       初始设施（预留）、省份加成（预留）
 * 
 * 依赖：climate.js（提供 CLIMATE_TABLE 用于气候数据查询）
 * 加载顺序：应在 constants.js 之前加载（PROVINCES 曾被定义在 constants.js 中）
 */
const PROVINCES = {
  /* ==================== 强省（10个） ==================== */
  1: {
    id: 1, name: '北京', type: '强省', isNorth: true,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '北京',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  2: {
    id: 2, name: '重庆', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '重庆',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  3: {
    id: 3, name: '湖南', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '湖南',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  4: {
    id: 4, name: '广东', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '广东',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  5: {
    id: 5, name: '四川', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '四川',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  6: {
    id: 6, name: '浙江', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '浙江',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  7: {
    id: 7, name: '上海', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '上海',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  8: {
    id: 8, name: '福建', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '福建',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  9: {
    id: 9, name: '江苏', type: '强省', isNorth: false,
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '江苏',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  10: {
    id: 10, name: '山东', type: '强省', isNorth: true, 
    baseBudget: 200000, trainingQuality: 1.3, climateKey: '山东',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },

  /* ==================== 普通省（14个） ==================== */
  11: {
    id: 11, name: '湖北', type: '普通省', isNorth: false,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '湖北',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  12: {
    id: 12, name: '江西', type: '普通省', isNorth: false,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '江西',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  13: {
    id: 13, name: '河北', type: '普通省', isNorth: true,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '河北',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  14: {
    id: 14, name: '香港', type: '普通省', isNorth: false,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '广东',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  15: {
    id: 15, name: '陕西', type: '普通省', isNorth: true,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '陕西',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  16: {
    id: 16, name: '河南', type: '普通省', isNorth: false,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '河南',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  17: {
    id: 17, name: '安徽', type: '普通省', isNorth: false,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '安徽',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  18: {
    id: 18, name: '黑龙江', type: '普通省', isNorth: true,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '黑龙江',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  19: {
    id: 19, name: '广西', type: '普通省', isNorth: false,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '广西',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  20: {
    id: 20, name: '辽宁', type: '普通省', isNorth: true,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '辽宁',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  21: {
    id: 21, name: '吉林', type: '普通省', isNorth: true,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '吉林',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  22: {
    id: 22, name: '天津', type: '普通省', isNorth: true,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '天津',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  23: {
    id: 23, name: '山西', type: '普通省', isNorth: true,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '山西',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  24: {
    id: 24, name: '贵州', type: '普通省', isNorth: false,
    baseBudget: 100000, trainingQuality: 0.8, climateKey: '贵州',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },

  /* ==================== 弱省（9个） ==================== */
  25: {
    id: 25, name: '澳门', type: '弱省', isNorth: false,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '广东',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  26: {
    id: 26, name: '新疆', type: '弱省', isNorth: true,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '新疆',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  27: {
    id: 27, name: '海南', type: '弱省', isNorth: false,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '海南',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  28: {
    id: 28, name: '内蒙古', type: '弱省', isNorth: true,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '内蒙古',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  29: {
    id: 29, name: '云南', type: '弱省', isNorth: false,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '云南',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  30: {
    id: 30, name: '宁夏', type: '弱省', isNorth: true,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '宁夏',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  31: {
    id: 31, name: '甘肃', type: '弱省', isNorth: true,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '甘肃',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  32: {
    id: 32, name: '青海', type: '弱省', isNorth: true,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '青海',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  },
  33: {
    id: 33, name: '西藏', type: '弱省', isNorth: true,
    baseBudget: 40000, trainingQuality: 0.3, climateKey: '西藏',
    initialFacilities: { computer: 0, network: 0, fan: 0, ac: 0, library: 0 },
    description: ''
  }
};

/* =========== 省份基础常量） =========== */
const STRONG_PROVINCE_BUDGET   = 200000;
const NORMAL_PROVINCE_BUDGET   = 100000;
const WEAK_PROVINCE_BUDGET     = 40000;
const STRONG_PROVINCE_TRAINING_QUALITY  = 1.3;
const NORMAL_PROVINCE_TRAINING_QUALITY  = 0.8;
const WEAK_PROVINCE_TRAINING_QUALITY    = 0.3;

/* =========== 省份气候辅助函数 =========== */

/**
 * 获取省份的气候数据行（从 climate.js 的 CLIMATE_TABLE 查询）
 * @param {number|object} province - 省份ID或省份对象
 * @param {string} season - 季节: 'spring'|'summer'|'autumn'|'winter'
 * @returns {object|null} 气候数据行，或 null
 */
function getProvinceClimateRow(province, season) {
  const p = (typeof province === 'number') ? PROVINCES[province] : province;
  if (!p || !p.climateKey) return null;
  if (typeof getClimateRow === 'function') {
    return getClimateRow(p.climateKey, season);
  }
  // fallback: 直接查 CLIMATE_TABLE
  try {
    if (typeof CLIMATE_TABLE !== 'undefined') {
      const seasonData = CLIMATE_TABLE[p.climateKey];
      return seasonData ? (seasonData[season] || null) : null;
    }
  } catch(e) {}
  return null;
}

/**
 * 获取省份的气候摘要信息（用于省份选择页面的悬停/详情展示）
 * @param {number|object} province - 省份ID或省份对象
 * @returns {object|null} 气候摘要，或 null
 */
function getProvinceClimateSummaryById(province) {
  const p = (typeof province === 'number') ? PROVINCES[province] : province;
  if (!p || !p.climateKey) return null;
  if (typeof getProvinceClimateSummary === 'function') {
    return getProvinceClimateSummary(p.climateKey);
  }
  return null;
}

/**
 * 判断某个天气事件是否应在指定省份本周触发
 * @param {number|object} province - 省份ID或省份对象
 * @param {number} week - 游戏周数
 * @param {string} eventType - 事件类型: 'typhoon'|'severe_convective'|'hail'|'sandstorm'
 * @returns {boolean}
 */
function shouldTriggerWeatherEventForProvince(province, week, eventType) {
  const p = (typeof province === 'number') ? PROVINCES[province] : province;
  if (!p || !p.climateKey) return false;
  if (typeof shouldTriggerWeatherEvent === 'function') {
    return shouldTriggerWeatherEvent(p.climateKey, week, eventType);
  }
  return false;
}

/**
 * 获取省份 comfort 基础值（基于南北）
 * 北方：BASE_COMFORT_NORTH (45)，南方：BASE_COMFORT_SOUTH (55)
 */
function getProvinceBaseComfort(provinceId) {
  const p = PROVINCES[provinceId];
  if (!p) return 50; // default
  return p.isNorth ? 45 : 55;
}

/* =========== 省份查询/工具函数 =========== */

/**
 * 根据ID获取省份对象
 */
function getProvinceById(id) {
  return PROVINCES[id] || null;
}

/**
 * 根据名称获取省份对象
 */
function getProvinceByName(name) {
  if (!name) return null;
  const normalized = String(name).replace(/(省|市|自治区|特别行政区)/g, '').trim();
  for (const key in PROVINCES) {
    if (PROVINCES[key].name === normalized) return PROVINCES[key];
  }
  // 宽松匹配
  for (const key in PROVINCES) {
    if (PROVINCES[key].name.includes(normalized) || normalized.includes(PROVINCES[key].name)) {
      return PROVINCES[key];
    }
  }
  return null;
}

/**
 * 获取省份类型（'强省'|'普通省'|'弱省'）
 */
function getProvinceType(provinceId) {
  const p = PROVINCES[provinceId];
  return p ? p.type : '普通省';
}

/**
 * 获取省份的训练质量系数
 */
function getProvinceTrainingQuality(provinceId) {
  const p = PROVINCES[provinceId];
  return p ? p.trainingQuality : 0.8;
}

/**
 * 获取经难度修正后的初始经费
 */
function getAdjustedBudgetForProvince(provinceId, difficulty) {
  const p = PROVINCES[provinceId];
  if (!p) return 100000;
  let budget = p.baseBudget;
  if (difficulty === 1) return Math.floor(budget * 1.5);  // 简单：+50%
  if (difficulty === 3) return Math.floor(budget * 0.5);  // 困难：-50%
  return budget;
}

/**
 * 获取省份的学生初始能力范围
 * 返回 { min, max }
 */
function getProvinceAbilityRange(provinceId, difficulty) {
  const p = PROVINCES[provinceId];
  if (!p) return { min: 30, max: 55 };

  let min_val, max_val;
  if (p.type === '强省')   { min_val = 50.0; max_val = 70.0; }
  else if (p.type === '弱省') { min_val = 20.0; max_val = 45.0; }
  else                      { min_val = 30.0; max_val = 55.0; }

  if (difficulty === 1) { min_val += 20.0; max_val += 20.0; }
  else if (difficulty === 3) { min_val -= 20.0; max_val -= 20.0; }

  return { min: min_val, max: max_val };
}

/**
 * 获取省份的晋级线系数（用于比赛晋级判定）
 * 返回该省类型的名称（'强省'|'普通省'|'弱省'），供 COMPETITION_BASE_CUTOFF 查询
 */
function getProvinceCutoffKey(provinceId) {
  const p = PROVINCES[provinceId];
  if (!p) return '普通省';
  return p.type;
}

/* ---------- 预留接口：省份加成 ---------- */

/**
 * 获取省份加成对象（预留）
 * @param {number} provinceId
 * @returns {object} 加成配置 { trainingEfficiency, contestBonus, ... } 或空对象
 */
function getProvinceBonuses(provinceId) {
  const p = PROVINCES[provinceId];
  return (p && p.bonuses) ? p.bonuses : {};
}

/**
 * 设置省份加成（预留，供未来扩展使用）
 * @param {number} provinceId
 * @param {object} bonuses
 */
function setProvinceBonuses(provinceId, bonuses) {
  const p = PROVINCES[provinceId];
  if (p) p.bonuses = Object.assign({}, bonuses);
}

/* ---------- 预留接口：省份初始设施 ---------- */

/**
 * 获取省份初始设施配置（预留）
 * @param {number} provinceId
 * @returns {object} 初始设施 { facilityName: level, ... } 或空对象
 */
function getProvinceInitialFacilities(provinceId) {
  const p = PROVINCES[provinceId];
  return (p && p.initialFacilities) ? p.initialFacilities : {};
}

/**
 * 设置省份初始设施（预留，供未来扩展使用）
 * @param {number} provinceId
 * @param {object} facilities 如 { fan: 1, ac: 0, library: 2 }
 */
function setProvinceInitialFacilities(provinceId, facilities) {
  const p = PROVINCES[provinceId];
  if (p) p.initialFacilities = Object.assign({}, facilities);
}

/**
 * 将省份初始设施应用到 GameState（预留，供初始化阶段调用）
 * @param {GameState} gameState
 * @param {number} provinceId
 */
function applyProvinceInitialFacilities(gameState, provinceId) {
  if (!gameState || !gameState.facilities) return;
  const facilities = getProvinceInitialFacilities(provinceId);
  for (const key in facilities) {
    if (typeof gameState.facilities.upgrade === 'function') {
      for (let i = 0; i < facilities[key]; i++) {
        gameState.facilities.upgrade(key);
      }
    }
  }
}

/* =========== 导出到全局 =========== */
if (typeof window !== 'undefined') {
  window.PROVINCES = PROVINCES;
  window.STRONG_PROVINCE_BUDGET = STRONG_PROVINCE_BUDGET;
  window.NORMAL_PROVINCE_BUDGET = NORMAL_PROVINCE_BUDGET;
  window.WEAK_PROVINCE_BUDGET = WEAK_PROVINCE_BUDGET;
  window.STRONG_PROVINCE_TRAINING_QUALITY = STRONG_PROVINCE_TRAINING_QUALITY;
  window.NORMAL_PROVINCE_TRAINING_QUALITY = NORMAL_PROVINCE_TRAINING_QUALITY;
  window.WEAK_PROVINCE_TRAINING_QUALITY = WEAK_PROVINCE_TRAINING_QUALITY;
  window.getProvinceClimateRow = getProvinceClimateRow;
  window.getProvinceClimateSummaryById = getProvinceClimateSummaryById;
  window.shouldTriggerWeatherEventForProvince = shouldTriggerWeatherEventForProvince;
  window.getProvinceBaseComfort = getProvinceBaseComfort;
  window.getProvinceById = getProvinceById;
  window.getProvinceByName = getProvinceByName;
  window.getProvinceType = getProvinceType;
  window.getProvinceTrainingQuality = getProvinceTrainingQuality;
  window.getAdjustedBudgetForProvince = getAdjustedBudgetForProvince;
  window.getProvinceAbilityRange = getProvinceAbilityRange;
  window.getProvinceCutoffKey = getProvinceCutoffKey;
  window.getProvinceBonuses = getProvinceBonuses;
  window.setProvinceBonuses = setProvinceBonuses;
  window.getProvinceInitialFacilities = getProvinceInitialFacilities;
  window.setProvinceInitialFacilities = setProvinceInitialFacilities;
  window.applyProvinceInitialFacilities = applyProvinceInitialFacilities;
}
