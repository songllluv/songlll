/*
  lib/facilities.js: 设施系统 (GSG树形结构)
  机房为根节点（自带），所有设施mk1依赖机房，mkn依赖mkn-1。
  包含设施类、效果常量、升级逻辑和UI交互。
*/

/* ===== 设施树定义常量 ===== */
// { id: { name, desc, icon, maxLevel } }
// 机房为根节点，始终拥有；其他设施初始0级（未建造），升级后获得对应mk等级
const FACILITY_DEFS = {
  computer_room: { name: '机房', desc: '核心设施，所有其他设施的前置条件', icon: '', maxLevel: 1 },
  computer:      { name: '计算机', desc: '训练效果提升乘区', icon: '', maxLevel: 4 },
  network:       { name: '网络', desc: '模拟赛效果提升', icon: '', maxLevel: 3 },
  fan:           { name: '电扇', desc: '提升舒适度', icon: '', maxLevel: 1 },
  ac:            { name: '空调', desc: '提升舒适度，缓解极端天气影响', icon: '', maxLevel: 2 },
  library:       { name: '资料库', desc: '提供额外备选题目 + 训练效果提升', icon: '', maxLevel: 4 }
};

/* ===== 设施效果常量（临时数值，后续可调整） ===== */

/* 计算机：训练效果（思维/代码）乘区增量。index=等级, mk1=0%加成, mk4=+30% */
const COMPUTER_EFFECT = [0, 0.00, 0.10, 0.20, 0.30];

/* 网络：模拟赛收益乘区增量。index=等级, mk1=+8%, mk3=+25% */
const NETWORK_MOCK_EFFECT = [0, 0.08, 0.16, 0.25];

/* 电扇：舒适度加成。index=等级, mk1=+6 */
const FAN_COMFORT = [0, 6.0];

/* 空调：舒适度加成。index=等级, mk1=+8, mk2=+14 */
const AC_COMFORT = [0, 8.0, 14.0];

/* 资料库：额外备选题目数量。index=等级, mk1=+1题, mk4=+4题 */
const LIBRARY_EXTRA_TASKS = [0, 1, 2, 3, 4];

/* 资料库：训练效果（知识）乘区增量。index=等级, mk1=+0%, mk4=+20% */
const LIBRARY_EFFECT = [0, 0.00, 0.08, 0.14, 0.20];

/* 极端天气舒适度惩罚（分级，取决于制冷设施等级） */
const WEATHER_PENALTY_NONE   = 22.0;  /* 无电扇无空调 */
const WEATHER_PENALTY_FAN    = 16.0;  /* 仅有电扇 */
const WEATHER_PENALTY_AC_MK1 = 10.0;  /* 空调mk1 */
const WEATHER_PENALTY_AC_MK2 = 4.0;   /* 空调mk2 */

/* 极端天气训练压力因子（分级） */
const WEATHER_FACTOR_NONE   = 1.50;  /* 无电扇无空调 */
const WEATHER_FACTOR_FAN    = 1.35;  /* 仅有电扇 */
const WEATHER_FACTOR_AC_MK1 = 1.20;  /* 空调mk1 */
const WEATHER_FACTOR_AC_MK2 = 1.00;  /* 空调mk2完全抵消 */

/* ===== 维护费用常量（临时数值） ===== */
// 基础维护费：除空调外，总维护费 = sum(level × base)；空调特殊见下方
const MAINTENANCE_BASE = {
  computer_room: 50,   /* 机房固定维护费 */
  computer: 120,       /* 计算机每级 +120 */
  network: 150,        /* 网络每级 +150 */
  fan: 40,             /* 电扇固定维护费 */
  ac: 200,             /* 空调基础维护费（但等级越高越低，见 AC_MAINTENANCE_DECAY） */
  library: 80          /* 资料库每级 +80 */
};

/* 空调维护费递减系数：维护费 = MAINTENANCE_BASE.ac * (AC_MAINTENANCE_DECAY ^ (level-1)) */
/* mk1 = 200, mk2 = 200 * 0.65 = 130 */
const AC_MAINTENANCE_DECAY = 0.65;

/* ===== 升级费用常量（临时数值） ===== */
// 升级到下一级的费用 = base * (growth ^ currentLevel)
// currentLevel=0 时费用为 base（即从无到mk1）
const UPGRADE_COST_BASE = {
  computer: 20000,
  network: 25000,
  fan: 5000,
  ac: 15000,
  library: 15000
};
const UPGRADE_COST_GROWTH = {
  computer: 1.6,
  network: 1.7,
  fan: 1.0,     /* 电扇仅1级，growth无实际作用 */
  ac: 1.4,
  library: 1.5
};

/* ===== 向后兼容别名（旧存档/代码可能引用旧常量名） ===== */
const MAX_COMPUTER_LEVEL = FACILITY_DEFS.computer.maxLevel;
const MAX_LIBRARY_LEVEL = FACILITY_DEFS.library.maxLevel;
const MAX_OTHER_FACILITY_LEVEL = Math.max(
  FACILITY_DEFS.network.maxLevel,
  FACILITY_DEFS.fan.maxLevel,
  FACILITY_DEFS.ac.maxLevel
);
/* 旧常量（保留以兼容 models.js 中的引用） */
const WEATHER_PENALTY_NO_AC = WEATHER_PENALTY_NONE;
const WEATHER_PENALTY_WITH_AC = WEATHER_PENALTY_AC_MK1;
/* 旧方法名别名（在类中定义） */


/* ===== Facilities 类 ===== */
class Facilities {
  constructor() {
    /* 机房始终为1（自带，不可拆除） */
    this.computer_room = 1;
    /* 其余设施初始为0（未建造）；升级后依次对应 mk1, mk2, ... */
    this.computer = 0;
    this.network = 0;
    this.fan = 0;
    this.ac = 0;
    this.library = 0;
  }

  /* ---- 等级获取 ---- */
  getLevel(fac) {
    const map = {
      computer_room: this.computer_room,
      computer: this.computer,
      network: this.network,
      fan: this.fan,
      ac: this.ac,
      library: this.library
    };
    return (fac in map) ? map[fac] : 0;
  }

  getMaxLevel(fac) {
    const def = FACILITY_DEFS[fac];
    return def ? def.maxLevel : 0;
  }

  getCurrentLevel(fac) { return this.getLevel(fac); }  /* 向后兼容 */

  /* ---- 效果计算 ---- */

  /** 计算机：训练效果乘数（思维/代码加成） */
  getComputerMultiplier() {
    return 1.0 + (COMPUTER_EFFECT[this.computer] || 0);
  }

  /** 网络：模拟赛收益乘数 */
  getNetworkMockMultiplier() {
    return 1.0 + (NETWORK_MOCK_EFFECT[this.network] || 0);
  }

  /** 资料库：训练效果乘数（知识加成） */
  getLibraryMultiplier() {
    return 1.0 + (LIBRARY_EFFECT[this.library] || 0);
  }

  /** 资料库：额外备选题目数 */
  getLibraryExtraTasks() {
    return LIBRARY_EXTRA_TASKS[this.library] || 0;
  }

  /** 总舒适度加成（电扇 + 空调） */
  getComfortBonus() {
    return (FAN_COMFORT[this.fan] || 0) + (AC_COMFORT[this.ac] || 0);
  }

  /** 极端天气舒适度惩罚值 */
  getWeatherPenalty() {
    if (this.ac >= 2) return WEATHER_PENALTY_AC_MK2;
    if (this.ac >= 1) return WEATHER_PENALTY_AC_MK1;
    if (this.fan >= 1) return WEATHER_PENALTY_FAN;
    return WEATHER_PENALTY_NONE;
  }

  /** 极端天气训练压力因子（用于乘到 base_pressure 上） */
  getWeatherFactor() {
    if (this.ac >= 2) return WEATHER_FACTOR_AC_MK2;
    if (this.ac >= 1) return WEATHER_FACTOR_AC_MK1;
    if (this.fan >= 1) return WEATHER_FACTOR_FAN;
    return WEATHER_FACTOR_NONE;
  }

  /* ---- 维护费用 ---- */

  getMaintenanceCost() {
    let total = 0;
    total += MAINTENANCE_BASE.computer_room * this.computer_room;
    total += MAINTENANCE_BASE.computer * this.computer;
    total += MAINTENANCE_BASE.network * this.network;
    total += MAINTENANCE_BASE.fan * this.fan;
    total += MAINTENANCE_BASE.library * this.library;
    /* 空调特殊：等级越高维护越低 */
    if (this.ac >= 1) {
      total += Math.floor(MAINTENANCE_BASE.ac * Math.pow(AC_MAINTENANCE_DECAY, this.ac - 1));
    }
    return total;
  }

  /* ---- 升级逻辑 ---- */

  canUpgrade(fac) {
    if (fac === 'computer_room') return false;
    const current = this.getLevel(fac);
    const max = this.getMaxLevel(fac);
    return current < max;
  }

  getUpgradeCost(fac) {
    if (fac === 'computer_room') return 0;
    const base = UPGRADE_COST_BASE[fac] || 0;
    const growth = UPGRADE_COST_GROWTH[fac] || 1.5;
    const level = this.getLevel(fac);
    return Math.floor(base * Math.pow(growth, level));
  }

  upgrade(fac) {
    if (!this.canUpgrade(fac)) return false;
    if (fac === 'computer') this.computer++;
    else if (fac === 'network') this.network++;
    else if (fac === 'fan') this.fan++;
    else if (fac === 'ac') this.ac++;
    else if (fac === 'library') this.library++;
    else return false;
    return true;
  }

  /* ---- 向后兼容方法 ---- */
  getComputerEfficiency() { return this.getComputerMultiplier(); }
  getLibraryEfficiency() { return this.getLibraryMultiplier(); }
  /* 旧 getCanteenPressureReduction / getDormComfortBonus 不再存在，返回中性值 */
  getCanteenPressureReduction() { return 1.0; }
  getDormComfortBonus() { return 0; }
}

/* ===== 设施升级UI ===== */

/* 设施名称映射 */
const FACILITY_NAMES = {
  computer_room: '机房',
  computer: '计算机',
  network: '网络',
  fan: '电扇',
  ac: '空调',
  library: '资料库'
};

function upgradeFacility(f) {
  let current = game.facilities.getLevel(f);
  let max = game.facilities.getMaxLevel(f);
  if (current >= max) { alert('已达最高等级'); return; }
  let cost = game.facilities.getUpgradeCost(f);
  const mult = (game.getExpenseMultiplier ? game.getExpenseMultiplier() : 1);
  const costAdj = Math.round(cost * mult);
  const name = FACILITY_NAMES[f] || f;

  const modalHtml = `
    <h3>升级设施：${name}</h3>
    <div class="small" style="margin-top:6px">升级到 mk${current + 1} 将扣款 <strong>¥${costAdj}</strong></div>
    <div class="modal-actions" style="margin-top:8px">
      <button class="btn btn-ghost" id="upgrade-cancel">取消</button>
      <button class="btn" id="upgrade-confirm">确认升级</button>
    </div>`;

  showModal(modalHtml);

  const cancelBtn = document.getElementById('upgrade-cancel');
  const confirmBtn = document.getElementById('upgrade-confirm');
  if (cancelBtn) cancelBtn.onclick = () => { try { closeModal(); } catch (e) {} };
  if (confirmBtn) confirmBtn.onclick = () => {
    try {
      if (game.budget < costAdj) { alert('经费不足'); closeModal(); return; }
      game.recordExpense(costAdj, '设施升级：' + name);
      game.facilities.upgrade(f);
      log('设施升级：' + name + ' 到 mk' + (current + 1) + '（基础 ¥' + cost + '，调整后 ¥' + costAdj + '）');
      closeModal();
      renderAll();
    } catch (e) { console.error('upgrade confirm handler error', e); }
  };
}

function showFacilityUpgradeModal() {
  const maintCost = game.facilities.getMaintenanceCost();
  const budget = game.budget;
  const mult = (game.getExpenseMultiplier ? game.getExpenseMultiplier() : 1);

  /* ===== 平铺卡片：每个设施一张卡片 ===== */
  const facilityList = [
    { id: 'computer', mks: [1, 2, 3, 4] },
    { id: 'network',  mks: [1, 2, 3] },
    { id: 'fan',      mks: [1] },
    { id: 'ac',       mks: [1, 2] },
    { id: 'library',  mks: [1, 2, 3, 4] }
  ];

  let cardsHtml = '';

  // 机房卡片（根节点，始终已建造）
  const rootDef = FACILITY_DEFS.computer_room;
  cardsHtml += `
    <div class="facility-flat-card root-node status-built" data-fac="computer_room" data-mk="0" data-status="built">
      <div class="facility-flat-card-header">
        <span class="facility-flat-card-icon">${rootDef.icon}</span>
        <span class="facility-flat-card-name">${rootDef.name}</span>
        <span class="facility-flat-card-badge built">已建造</span>
      </div>
      <div class="facility-flat-card-level">Lv.1</div>
      <div class="facility-flat-card-desc">${rootDef.desc}</div>
    </div>`;

  for (const fac of facilityList) {
    const currentLevel = game.facilities.getLevel(fac.id);
    const maxLevel = game.facilities.getMaxLevel(fac.id);
    const def = FACILITY_DEFS[fac.id];
    const name = def ? def.name : fac.id;
    const isMaxed = currentLevel >= maxLevel;

    let statusClass, badgeText, badgeClass;
    if (isMaxed) {
      statusClass = 'status-built';
      badgeText = '已满级';
      badgeClass = 'built';
    } else if (currentLevel > 0) {
      statusClass = 'status-available';
      badgeText = '可升级';
      badgeClass = 'available';
    } else {
      statusClass = 'status-available';
      badgeText = '可建造';
      badgeClass = 'available';
    }

    const nextCost = isMaxed ? 0 : Math.round(game.facilities.getUpgradeCost(fac.id) * mult);
    const nextMk = currentLevel + 1;
    const canAfford = budget >= nextCost;

    cardsHtml += `
      <div class="facility-flat-card ${statusClass}" data-fac="${fac.id}" data-mk="${nextMk}" data-status="${isMaxed ? 'built' : 'available'}" data-cost="${nextCost}">
        <div class="facility-flat-card-header">
          <span class="facility-flat-card-icon">${def.icon}</span>
          <span class="facility-flat-card-name">${name}</span>
          <span class="facility-flat-card-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="facility-flat-card-level">当前 mk${currentLevel} / 最高 mk${maxLevel}</div>
        <div class="facility-flat-card-desc">${def.desc}</div>
        <div class="facility-flat-card-mk-bar">
          ${fac.mks.map(mk => {
            const cls = mk <= currentLevel ? 'mk-dot built' : (mk === currentLevel + 1 ? 'mk-dot next' : 'mk-dot locked');
            return '<span class="' + cls + '">mk' + mk + '</span>';
          }).join('')}
        </div>
        ${isMaxed
          ? '<div class="facility-flat-card-cost built">已达最高等级</div>'
          : '<div class="facility-flat-card-cost' + (canAfford ? '' : ' cant-afford') + '">升级到 mk' + nextMk + '：¥' + nextCost.toLocaleString() + '</div>'}
      </div>`;
  }

  /* ===== 完整弹窗 HTML ===== */
  const modalHtml = `
    <h3 style="margin:0 0 4px 0; font-size:20px; color:#1f2937;">设施升级</h3>
    <div class="small" style="margin-bottom:10px; padding:8px 12px; background:#f9fafb; border-radius:6px; border:1px solid #e5e7eb; display:flex; gap:20px; flex-wrap:wrap;">
      <span style="color:#4a5568;">当前经费: <strong>¥${budget.toLocaleString()}</strong></span>
      <span style="color:#4a5568;">每周维护费: <strong>¥${maintCost.toLocaleString()}</strong></span>
    </div>
    <div class="facility-flat-grid" id="facility-flat-grid">
      ${cardsHtml}
    </div>
    <div class="modal-actions" style="margin-top:12px; text-align:right;">
      <button class="btn" id="facility-modal-close" style="padding:8px 20px;">关闭</button>
    </div>
  `;

  showModal(modalHtml);

  /* ===== 交互逻辑 ===== */
  const closeBtn = document.getElementById('facility-modal-close');
  if (closeBtn) {
    closeBtn.onclick = () => { closeModal(); };
  }

  const allCards = document.querySelectorAll('.facility-flat-card');
  allCards.forEach(card => {
    card.addEventListener('click', function(e) {
      const status = this.dataset.status;
      const facId = this.dataset.fac;
      if (facId === 'computer_room') return; // 机房不可升级
      if (status === 'built') return; // 已满级

      const cost = parseInt(this.dataset.cost) || 0;
      if (game.budget < cost) { alert('经费不足！'); return; }

      closeModal();
      setTimeout(() => upgradeFacility(facId), 100);
    });
  });
}

/* 旧版兼容UI（保留以兼容 game.js 等旧引用） */
function upgradeFacilitiesUI() {
  showFacilityUpgradeModal();
}

/* 暴露到全局作用域 */
window.showFacilityUpgradeModal = showFacilityUpgradeModal;
window.upgradeFacility = upgradeFacility;
window.upgradeFacilitiesUI = upgradeFacilitiesUI;
