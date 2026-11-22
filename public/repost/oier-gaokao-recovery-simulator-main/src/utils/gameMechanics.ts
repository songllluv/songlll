import { PlayerStats, GameState } from '../types';

/**
 * Calculates simple anti-tamper signature for game records
 */
export function generateSaveString(state: GameState): string {
  const jsonStr = JSON.stringify(state);
  // Simple cipher signature to avoid direct JSON tinkering
  const b64 = btoa(encodeURIComponent(jsonStr));
  let hash = 0;
  for (let i = 0; i < b64.length; i++) {
    hash = (hash * 31 + b64.charCodeAt(i)) & 0xFFFFFFF;
  }
  return `${b64}_sig_${hash.toString(16)}`;
}

/**
 * Decodes save string and validates signature
 */
export function decodeSaveString(saveString: string): GameState | null {
  try {
    const parts = saveString.trim().split('_sig_');
    if (parts.length !== 2) return null;
    
    const [b64, expectedHash] = parts;
    
    // Verify hash integrity
    let calculatedHash = 0;
    for (let i = 0; i < b64.length; i++) {
      calculatedHash = (calculatedHash * 31 + b64.charCodeAt(i)) & 0xFFFFFFF;
    }
    
    if (calculatedHash.toString(16) !== expectedHash) {
      console.warn("Save string checksum mismatch - tampering detected.");
      return null;
    }
    
    const decodedJson = decodeURIComponent(atob(b64));
    return JSON.parse(decodedJson) as GameState;
  } catch (e) {
    console.error("Failed to parse save string", e);
    return null;
  }
}

/**
 * Clamps stats attributes nicely inside their legal scopes
 */
export function clampValue(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Updates player attributes incorporating state multipliers
 * (Pride, Resilience, Sleep quality and stamina rules)
 */
export function calculateDeltas(stats: PlayerStats, deltas: any, debuffIds: string[] = []): PlayerStats {
  const updated = JSON.parse(JSON.stringify(stats)) as PlayerStats;
  
  // 1. Resilience calculations: reduces negative impacts
  const resFactor = clampValue(1 - (stats.resilience / 150), 0.3, 1.0);

  // 1.5. Fitness coefficient (身体素质): high physical fitness preserves stamina and counters stress
  const fitStaminaFactor = clampValue(1 - ((stats.scores?.pe || 50) / 300), 0.65, 1.0);
  const fitStressFactor = clampValue(1 - ((stats.scores?.pe || 50) / 400), 0.75, 1.0);

  // Apply scores with standard range safeguards
  if (deltas.chinese) updated.scores.chinese = clampValue(updated.scores.chinese + deltas.chinese, 0, 150);
  if (deltas.math) updated.scores.math = clampValue(updated.scores.math + deltas.math, 0, 150);
  if (deltas.english) updated.scores.english = clampValue(updated.scores.english + deltas.english, 0, 150);
  if (deltas.science) updated.scores.science = clampValue(updated.scores.science + deltas.science, 0, 300);
  if (deltas.pe) updated.scores.pe = clampValue(updated.scores.pe + deltas.pe, 0, 100);

  // Apply core stats
  if (deltas.stamina) {
    const change = deltas.stamina;
    // If losing stamina, resilience and fitness factor reduces loss
    const realChange = change < 0 ? Math.round(change * resFactor * fitStaminaFactor) : change;
    updated.stamina = clampValue(updated.stamina + realChange, 0, 100);
  }

  if (deltas.stress) {
    const change = deltas.stress;
    // If increasing stress, resilience and fitness factor reduces gain
    const realChange = change > 0 ? Math.round(change * resFactor * fitStressFactor) : change;
    updated.stress = clampValue(updated.stress + realChange, 0, 100);
  }

  if (deltas.funds) {
    updated.funds = clampValue(updated.funds + deltas.funds, 0, 9999);
  }

  if (deltas.pride) {
    updated.pride = clampValue(updated.pride + deltas.pride, -100, 100);
  }

  if (deltas.resilience) {
    updated.resilience = clampValue(updated.resilience + deltas.resilience, 0, 100);
  }

  if (deltas.sleepQuality) {
    updated.sleepQuality = clampValue(updated.sleepQuality + deltas.sleepQuality, 0, 100);
  }

  if (deltas.rebellion) {
    let change = deltas.rebellion;
    if (change > 0 && debuffIds.includes('debuff_rebel_fever')) {
      change *= 2;
    }
    updated.rebellion = clampValue(updated.rebellion + change, 0, 100);
  }

  return updated;
}

/**
 * End-of-week natural metabolic changes based on:
 * Pride (affecting stamina/stress multipliers), sleepQuality, and resilience
 */
export function applyWeeklyMetabolism(stats: PlayerStats): { stats: PlayerStats, logMessage: string } {
  let updated = JSON.parse(JSON.stringify(stats)) as PlayerStats;
  const messages: string[] = [];

  // Sleep Quality influence
  if (stats.sleepQuality < 35) {
    updated.stamina = clampValue(updated.stamina - 15, 0, 100);
    updated.stress = clampValue(updated.stress + 12, 0, 100);
    messages.push("🚨 上周睡眠质量差（低于35%），你感到头脑昏沉，白白损耗了15点精力和增加了12点压力。");
  } else if (stats.sleepQuality >= 80) {
    updated.stamina = clampValue(updated.stamina + 25, 0, 100);
    updated.stress = clampValue(updated.stress - 15, 0, 100);
    messages.push("🌙 睡眠质量极佳！清新的睡眠极速补充了25点精力并抚平了15点心理压力。");
  } else {
    updated.stamina = clampValue(updated.stamina + 10, 0, 100);
    updated.stress = clampValue(updated.stress - 5, 0, 100);
    messages.push("💤 休息还算得当。恢复了10点日常精力，消解了5点压力。");
  }

  // Pride impact (it can be negative!)
  if (stats.pride < 0) {
    updated.stress = clampValue(updated.stress + 10, 0, 100);
    updated.stamina = clampValue(updated.stamina - 8, 0, 100);
    messages.push("😔 自豪感跌为负数（感到自卑）。你在班里默默低头，自卑感凭空为你增加了10点心理压力。");
  } else if (stats.pride >= 50) {
    updated.stamina = clampValue(updated.stamina + 10, 0, 100);
    updated.stress = clampValue(updated.stress - 10, 0, 100);
    messages.push("✨ 强大的主观自豪感在心中激荡。你感到斗志昂扬，额外减少了10点心理压力。");
  }

  // Physical fitness natural metabolic influence (身体素质)
  const peVal = stats.scores?.pe || 60;
  if (peVal >= 75) {
    updated.stamina = clampValue(updated.stamina + 12, 0, 100);
    updated.stress = clampValue(updated.stress - 8, 0, 100);
    messages.push(`🏋️‍♂️ 强健的身体素质（当前 ${peVal} 点）提供了过人活力，周代谢额外恢复 12 点精力、消解 8 点压力。`);
  } else if (peVal < 40) {
    updated.stamina = clampValue(updated.stamina - 10, 0, 100);
    messages.push(`⚠️ 孱弱的身体素质（当前 ${peVal} 点）拖累了日常，备考周代谢导致你额外流失了 10 点精力。`);
  }

  // Natural rebellion relaxation over time
  if (updated.rebellion > 10) {
    const dec = Math.min(updated.rebellion - 10, 3);
    updated.rebellion = clampValue(updated.rebellion - dec, 0, 100);
    messages.push(`📉 经过一周的日常文化课洗礼，你的叛逆怒气渐渐平复了 ${dec} 点。`);
  }

  // Slightly decay stats toward baseline over time
  updated.sleepQuality = clampValue(updated.sleepQuality - 5, 10, 100); // dynamic decay
  
  return {
    stats: updated,
    logMessage: messages.join(" ")
  };
}
