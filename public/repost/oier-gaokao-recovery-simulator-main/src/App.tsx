import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  ChevronRight, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  BookMarked,
  Sparkles,
  Award,
  Terminal,
  Calculator,
  Flame,
  ShieldCheck,
  Moon,
  Coins,
  Compass,
  ShoppingBag,
  Dribbble,
  Atom,
  ShieldAlert,
  TrendingDown,
  CheckSquare,
  CornerUpRight,
  Info
} from 'lucide-react';
import { PlayerStats, GameState, SubjectScores, ShopItem, SuddenEvent, MemoryFlashback, Achievement } from './types';
import fallenButterflyImg from './assets/images/fallen_butterfly_1779980474373.png';
import indieHackerImg from './assets/images/indie_hacker_end_1779980500266.png';
import tsinghuaEndImg from './assets/images/tsinghua_end_1779980528002.png';
import gapYearEndImg from './assets/images/gap_year_end_1779980551379.png';
import { StatsDisplay } from './components/StatsDisplay';
import { ArchivePanel } from './components/ArchivePanel';
import { ScoreReport } from './components/ScoreReport';
import { WEEKLY_EVENTS, RANDOM_EVENTS } from './data/events';
import { calculateDeltas, applyWeeklyMetabolism, clampValue } from './utils/gameMechanics';
import { ACHIEVEMENTS } from './data/achievements';
import { POSITIVE_SUDDEN_EVENTS, NEGATIVE_SUDDEN_EVENTS, TOUCHING_FLASHBACKS, MELANCHOLY_FLASHBACKS } from './data/suddenEvents';
import { 
  CheckCircle,
  HelpCircle,
  AlertCircle,
  HeartCrack,
  Lock,
  User,
  Zap,
  Coffee,
  Activity as ActivityIcon
} from 'lucide-react';

// Audio Synthesizer (Retro 8-bit sound chip, non-intrusive, secure fallback)
class AudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {}

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio is not supported in this browser.', e);
      }
    }
  }

  public playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Fail silently if browser blocks sound
    }
  }

  public click() {
    this.playTone(800, 'square', 0.05, 0.05);
  }

  public chime() {
    this.playTone(523.25, 'triangle', 0.1, 0.08); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.08), 80); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.2, 0.08), 160); // G5
  }

  public error() {
    this.playTone(220, 'sawtooth', 0.15, 0.1);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.2, 0.1), 100);
  }

  public gameover() {
    this.playTone(392, 'square', 0.2, 0.08);
    setTimeout(() => this.playTone(349.23, 'square', 0.2, 0.08), 150);
    setTimeout(() => this.playTone(311.13, 'square', 0.2, 0.08), 300);
    setTimeout(() => this.playTone(261.63, 'square', 0.4, 0.1), 450);
  }
}

const synth = new AudioSynth();

// Store/Canteen item catalog
const CANTEEN_ITEMS: ShopItem[] = [
  {
    id: 'store_oil',
    name: '经典风油精',
    description: '绿莹莹的风油精在太阳穴揉开一圈薄凉。清脑提神。',
    cost: 5,
    effectSummary: '精力+15，压力-5，韧性+2',
    deltas: { stamina: 15, stress: -5, resilience: 2 }
  },
  {
    id: 'store_coffee',
    name: '速溶黑咖啡',
    description: '极浓黑咖啡因狂暴冲洗，支撑高功耗复习，但严重剥夺睡眠。',
    cost: 10,
    effectSummary: '精力+30，压力-10，睡眠质量-15',
    deltas: { stamina: 30, stress: -10, sleepQuality: -15 }
  },
  {
    id: 'store_chocolate',
    name: '德芙巧克力排',
    description: '一口香甜给予大脑最急需的糖分，仿佛找回了昔日A题的快意。',
    cost: 8,
    effectSummary: '精力+20，自豪感+5，睡眠质量+5',
    deltas: { stamina: 20, pride: 5, sleepQuality: 5 }
  },
  {
    id: 'store_book',
    name: '《王后雄高考压轴练》',
    description: '厚重的真题考点整合，提供极度踏实的刷题感与心智保障。',
    cost: 35,
    effectSummary: '心理韧性+15，自豪感+10，压力+5',
    deltas: { resilience: 15, pride: 10, stress: 5 }
  },
  {
    id: 'store_earplug',
    name: '硅胶隔音耳塞',
    description: '隔绝舍友深夜磨牙与查房查寝，让崩紧的敏感神经酣然入睡。',
    cost: 15,
    effectSummary: '睡眠质量+25，压力-10',
    deltas: { sleepQuality: 25, stress: -10 }
  }
];

// Presets representing different OIER fallouts (良 / Liang at his core)
const ORIGINS = [
  {
    id: 'origin_failed',
    name: '【打铁退役生】',
    description: 'NOI决赛中由于大意未取得约定约签。痛哭两日后彻底归零。长达十个月荒芜让文科成绩退化，但韧性仍在。',
    initialStats: {
      scores: { chinese: 78, math: 92, english: 74, science: 165, pe: 64 },
      stamina: 95,
      stress: 20,
      funds: 120,
      pride: 15,
      resilience: 55,
      sleepQuality: 80
    }
  },
  {
    id: 'origin_silver',
    name: '【省选折翼者】',
    description: '省选两日由于越界常数Bug，以微弱1.5分痛失队线资格。极为遗憾，高傲的代码执念时而入侵脑海。',
    initialStats: {
      scores: { chinese: 72, math: 110, english: 70, science: 180, pe: 56 },
      stamina: 80,
      stress: 35,
      funds: 100,
      pride: 45,
      resilience: 30,
      sleepQuality: 65
    }
  },
  {
    id: 'origin_wild',
    name: '【无名刷题狂】',
    description: '没有正式竞赛培训，纯凭热爱刷穿了各大OJ平台两千题。文理失衡严重，但代码魂极度沸腾。',
    initialStats: {
      scores: { chinese: 65, math: 115, english: 60, science: 195, pe: 60 },
      stamina: 85,
      stress: 15,
      funds: 80,
      pride: 55,
      resilience: 35,
      sleepQuality: 70
    }
  },
  {
    id: 'origin_custom',
    name: '【自定义信奥生】',
    description: '自选玩法，自由平衡！配置1个正面极境本能，背负2个心理枷锁在极黑高考里绝地逆袭。',
    initialStats: {
      scores: { chinese: 75, math: 95, english: 70, science: 165, pe: 60 },
      stamina: 90,
      stress: 25,
      funds: 100,
      pride: 25,
      resilience: 45,
      sleepQuality: 75
    }
  }
];

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [changelogOpen, setChangelogOpen] = useState(false);
  
  // Temporary state for the character creation portal
  const [characterName, setCharacterName] = useState('良');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [selectedOriginId, setSelectedOriginId] = useState('origin_failed');
  const [characterBuffs, setCharacterBuffs] = useState<string[]>([]);
  const [characterDebuffs, setCharacterDebuffs] = useState<string[]>([]);

  // Checkbox multi-select states for weekly study focuses
  const [weeklyFocusSelections, setWeeklyFocusSelections] = useState<string[]>([]);
  const [hoveredAchievement, setHoveredAchievement] = useState<any | null>(null);

  // Game primary state matches state tree
  const [gameState, setGameState] = useState<GameState>({
    playerName: '良',
    difficulty: 'normal',
    selectedBuffId: null,
    selectedBuffIds: [],
    selectedDebuffIds: [],
    unlockedAchievementIds: [],
    weeklySuddenEvent: null,
    weeklyFlashback: null,
    currentWeek: 1,
    stats: {
      scores: { chinese: 75, math: 95, english: 75, science: 160, pe: 60 },
      stamina: 100,
      stress: 20,
      funds: 100,
      pride: 30,
      resilience: 40,
      sleepQuality: 75
    },
    historyLogs: [
      '高考复健日记开启。你在这一天，拖着写满题目的退役背包，重新踏回了曾经熟悉而又有些刺眼的高三教室。'
    ],
    selectedFocus: null,
    encounteredEventIds: [],
    examResult: null,
    gameStage: 'intro',
    activeEvent: null,
    chosenEndingId: null,
    activeAchievementToast: null
  });

  // Keep Audio Synth state sync
  useEffect(() => {
    synth.enabled = soundEnabled;
  }, [soundEnabled]);

  // Toast auto-clear
  useEffect(() => {
    if (gameState.activeAchievementToast) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, activeAchievementToast: null }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameState.activeAchievementToast]);

  // 중앙 집중식 업적 검증 함수
  const checkForCompletedAchievements = (state: GameState): string[] => {
    const newlyUnlocked: string[] = [];
    const currentUnlocked = state.unlockedAchievementIds || [];
    const { scores, stress, sleepQuality, funds, pride, resilience } = state.stats;
    const totalScore = scores.chinese + scores.math + scores.english + scores.science;

    const checkAndAdd = (id: string) => {
      if (!currentUnlocked.includes(id)) {
        newlyUnlocked.push(id);
      }
    };

    // Score milestones
    if (scores.chinese >= 135) checkAndAdd('ach_score_1');
    if (scores.math >= 140) checkAndAdd('ach_score_2');
    if (totalScore >= 680) checkAndAdd('ach_score_3');
    if (scores.pe >= 85) checkAndAdd('ach_score_pe');
    if (scores.science >= 280) checkAndAdd('ach_score_science');
    if (scores.english >= 140) checkAndAdd('ach_score_english');

    // Attributes milestones
    if (stress >= 95) checkAndAdd('ach_stress_max');
    if (sleepQuality >= 90) checkAndAdd('ach_sleep_master');
    if (funds >= 150) checkAndAdd('ach_money_boss');
    if (pride <= -25) checkAndAdd('ach_pride_deep');
    if (pride >= 80) checkAndAdd('ach_extreme_pride');
    if (resilience >= 90) checkAndAdd('ach_will_iron');
    if (resilience >= 95) checkAndAdd('ach_extremely_resilient');
    if (funds <= 5) checkAndAdd('ach_ultra_poor');

    // Endings milestones
    if (state.chosenEndingId === 'ending_provincial_top') checkAndAdd('ach_end_tsinghua');
    if (state.chosenEndingId === 'ending_985_ship') checkAndAdd('ach_end_985_ship');
    if (state.chosenEndingId === 'ending_211_elite') checkAndAdd('ach_end_211_elite');
    if (state.chosenEndingId === 'ending_indie_hacker') checkAndAdd('ach_end_hacker');
    if (state.chosenEndingId === 'ending_gap_year') checkAndAdd('ach_end_gap');
    if (state.chosenEndingId === 'ending_stress_breakdown') checkAndAdd('ach_end_suicide');
    if (state.difficulty === 'hard' && state.chosenEndingId && state.chosenEndingId !== 'ending_stress_breakdown') {
      checkAndAdd('ach_difficulty_hard');
    }

    // Special count logs
    const codeCount = state.historyLogs.filter(log => log.includes('摸鱼重构昔日算法内存') || log.includes('CODE')).length;
    if (codeCount >= 3) checkAndAdd('ach_hack_lab');

    const totalCanteenBuys = state.historyLogs.filter(log => log.includes('🛒 购买')).length;
    if (totalCanteenBuys >= 5) checkAndAdd('ach_diet_master');

    const totalFlashbacks = state.historyLogs.filter(log => log.includes('🌀 【时光闪回】')).length;
    if (totalFlashbacks >= 1) checkAndAdd('ach_first_flashback');
    if (totalFlashbacks >= 3) checkAndAdd('ach_anxious_veteran');

    if (scores.chinese >= 115 && scores.math >= 120 && scores.english >= 115 && scores.science >= 220) {
      checkAndAdd('ach_all_subjects_balanced');
    }

    return newlyUnlocked;
  };

  // Safe wrapper for React State with achievement detection hooks
  const updateGameStateWithAchievements = (nextState: GameState) => {
    // 1. Centralized check for stress collapse (suicide ending) to prevent any loopholes
    if (nextState.stats.stress >= 100 && nextState.gameStage !== 'ending') {
      synth.gameover();
      const breakdownState: GameState = {
        ...nextState,
        chosenEndingId: 'ending_stress_breakdown',
        gameStage: 'ending'
      };

      const newAchievements = checkForCompletedAchievements(breakdownState);
      const updatedLogs = [...breakdownState.historyLogs];
      updatedLogs.unshift(`🚨 压力达到上限 100% 崩溃极限！脑神经长夜过载熔毁，彻底断电...`);

      if (newAchievements.length > 0) {
        newAchievements.forEach(achId => {
          const achObj = ACHIEVEMENTS.find(a => a.id === achId);
          if (achObj) {
            updatedLogs.unshift(`🏆 【解锁荣誉】 恭喜你达成了成就：${achObj.title} - ${achObj.description}`);
          }
        });
      }

      const finalState: GameState = {
        ...breakdownState,
        unlockedAchievementIds: [...new Set([...(breakdownState.unlockedAchievementIds || []), ...newAchievements])],
        historyLogs: updatedLogs,
        activeAchievementToast: ACHIEVEMENTS.find(a => a.id === newAchievements[0])?.title || null
      };

      setGameState(finalState);
      triggerAutosave(finalState);
      return;
    }

    const newAchievements = checkForCompletedAchievements(nextState);
    if (newAchievements.length > 0) {
      synth.chime();
      const updatedLogs = [...nextState.historyLogs];
      newAchievements.forEach(achId => {
        const achObj = ACHIEVEMENTS.find(a => a.id === achId);
        if (achObj) {
          updatedLogs.unshift(`🏆 【解锁荣誉】 恭喜你达成了成就：${achObj.title} - ${achObj.description}`);
        }
      });

      const finalState: GameState = {
        ...nextState,
        unlockedAchievementIds: [...(nextState.unlockedAchievementIds || []), ...newAchievements],
        historyLogs: updatedLogs,
        activeAchievementToast: ACHIEVEMENTS.find(a => a.id === newAchievements[0])?.title || null
      };
      setGameState(finalState);
      triggerAutosave(finalState);
    } else {
      setGameState(nextState);
      triggerAutosave(nextState);
    }
  };

  const triggerAutosave = (stateToSave: GameState) => {
    try {
      const total = 
        stateToSave.stats.scores.chinese + 
        stateToSave.stats.scores.math + 
        stateToSave.stats.scores.english + 
        stateToSave.stats.scores.science;

      const summary = `${stateToSave.playerName} | 第 ${stateToSave.currentWeek} 周 | 文化分: ${total} | 零钱: ￥${stateToSave.stats.funds}`;
      const saveObj = {
        id: 'auto_save',
        timestamp: new Date().toLocaleString(),
        week: stateToSave.currentWeek,
        stats: stateToSave.stats,
        summary: summary + ' (Auto)',
        state: stateToSave
      };
      localStorage.setItem('gaokao_oi_save_auto_save', JSON.stringify(saveObj));
    } catch (e) {
      console.warn('Autosave status writing error:', e);
    }
  };

  const handleStartGame = () => {
    synth.click();
    setGameState(prev => ({
      ...prev,
      gameStage: 'character_init'
    }));
  };

  // Starting game with custom stats microtuner
  const handleLaunchCustomCharacter = () => {
    synth.chime();
    
    // Find base stats starting line from template
    const originPreset = ORIGINS.find(o => o.id === selectedOriginId) || ORIGINS[0];
    let customStats = JSON.parse(JSON.stringify(originPreset.initialStats)) as PlayerStats;

    // A. Apply difficulty adjustments
    if (selectedDifficulty === 'easy') {
      customStats.scores.chinese += 15;
      customStats.scores.math += 15;
      customStats.scores.english += 15;
      customStats.scores.science += 25;
      customStats.scores.pe += 10;
      customStats.stamina = 100;
      customStats.funds += 30;
      customStats.sleepQuality = 90;
      customStats.resilience += 15;
    } else if (selectedDifficulty === 'hard') {
      customStats.scores.chinese -= 10;
      customStats.scores.math -= 10;
      customStats.scores.english -= 10;
      customStats.scores.science -= 15;
      customStats.stamina = Math.max(50, customStats.stamina - 15);
      customStats.sleepQuality = Math.max(40, customStats.sleepQuality - 15);
      customStats.funds = Math.max(30, customStats.funds - 20);
      customStats.stress += 15;
    }

    // B. Apply Buff modifications
    if (characterBuffs.includes('buff_will')) {
      customStats.resilience += 20;
    }
    if (characterBuffs.includes('buff_bilingual')) {
      customStats.scores.english += 15;
      customStats.pride += 5;
    }
    if (characterBuffs.includes('buff_frugal')) {
      customStats.funds += 40;
    }
    if (characterBuffs.includes('buff_optimist')) {
      customStats.resilience += 10;
    }
    if (characterBuffs.includes('buff_insomniac_immune')) {
      customStats.sleepQuality = Math.min(100, customStats.sleepQuality + 15);
    }

    // C. Apply Debuff modifications to starting stats
    if (characterDebuffs.includes('debuff_ptsd')) {
      customStats.stress += 10;
    }
    if (characterDebuffs.includes('debuff_insomnia')) {
      customStats.sleepQuality = Math.max(20, customStats.sleepQuality - 15);
    }
    if (characterDebuffs.includes('debuff_inferiority')) {
      customStats.pride = Math.max(-100, customStats.pride - 15);
    }
    if (characterDebuffs.includes('debuff_math_reject')) {
      customStats.scores.math = Math.max(30, customStats.scores.math - 10);
    }
    if (characterDebuffs.includes('debuff_jitter')) {
      customStats.stress += 5;
    }

    const cleanState: GameState = {
      playerName: characterName.trim() || '良',
      difficulty: selectedDifficulty,
      selectedBuffId: characterBuffs[0] || null,
      selectedBuffIds: characterBuffs,
      selectedDebuffIds: characterDebuffs,
      unlockedAchievementIds: gameState.unlockedAchievementIds || [],
      weeklySuddenEvent: null,
      weeklyFlashback: null,
      currentWeek: 1,
      stats: customStats,
      historyLogs: [
        `【复原战线拉开】主人公「${characterName.trim() || '良'}」带着正面特质 ${
          characterBuffs.length > 0 
            ? characterBuffs.map(b => `[${BUFF_OPTIONS.find(bo => bo.id === b)?.name.replace(/^\d+\.\s*/, '')}]`).join('、') 
            : '[无]'
        } 以及宿命枷锁 ${
          characterDebuffs.length > 0 
            ? characterDebuffs.map(d => `[${DEBUFF_OPTIONS.find(dbo => dbo.id === d)?.name.replace(/^\d+\.\s*/, '')}]`).join('、') 
            : '[无]'
        }，于游戏难度【${
          selectedDifficulty === 'easy' ? '凡人坦途' : selectedDifficulty === 'hard' ? '极暗绝境' : '重振之路'
        }】重拾尘封纸笔。开始这轮高三的宿命突围。`
      ],
      selectedFocus: null,
      encounteredEventIds: [],
      examResult: null,
      gameStage: 'gameplay',
      activeEvent: WEEKLY_EVENTS[1], // Start with Week 1 custom decision scene
      chosenEndingId: null,
      activeAchievementToast: null
    };

    setGameState(cleanState);
    triggerAutosave(cleanState);
  };

  // Helper mapping options for select UI
  const BUFF_OPTIONS = [
    { id: 'buff_brain', name: '01. 极境脑力', desc: '复习数学、理综时，增加速度额外提高 25%。', icon: 'Brain' },
    { id: 'buff_code', name: '02. 代码余辉', desc: '机房敲码解压时，额外恢复 +5 精力与 +5 自傲，压力多打消 5 点。', icon: 'Terminal' },
    { id: 'buff_run', name: '03. 操场健将', desc: '体能底盘卓越，体育训练精气神消耗减少 5 点，练习成绩额外 +3 分。', icon: 'Dribbble' },
    { id: 'buff_will', name: '04. 意志如铁', desc: '抗挫心理韧性初始额外 +20。自傲跌为负数时抗崩溃能力加倍。', icon: 'ShieldCheck' },
    { id: 'buff_bilingual', name: '05. 双语极客', desc: '英语攻读速度提升 30%，词汇量理解底气更深，自尊初始 +5 点。', icon: 'Compass' },
    { id: 'buff_insomniac_immune', name: '06. 深度长眠', desc: '每周自发磨损的睡眠质量降低 50%，睡眠自发精力恢复系数上升 10%。', icon: 'Moon' },
    { id: 'buff_frugal', name: '07. 勤俭持家', desc: '获得的生活零钱资助初始额外增加 30%，且在小卖部消费享受九折优惠。', icon: 'Coins' },
    { id: 'buff_optimist', name: '08. 乐观主义', desc: '凡事做最宽广的设想，每次遭遇周末负面突发事件时的心理压力升幅减半。', icon: 'Sparkles' }
  ];

  const DEBUFF_OPTIONS = [
    { id: 'debuff_ptsd', name: '01. 竞赛创伤 (CPTSD)', desc: '在机房敲代码（潜入机房法）时，有 25% 概率发生重压反弹，压力暴增 15 点。', icon: 'AlertTriangle' },
    { id: 'debuff_insomnia', name: '02. 严重失眠', desc: '每周结算时生理自发睡眠衰减速率增加 5 点，且常令白日记诵昏沉粗心。', icon: 'Moon' },
    { id: 'debuff_math_reject', name: '03. 数理排斥反应', desc: '大脑处于对数学大计算的生理恶心期，复习数学、理综的得分效率削弱 15%。', icon: 'Calculator' },
    { id: 'debuff_jitter', name: '04. 笔误综合征', desc: '在正式大考（模考/高考）中，因为低级粗心，数理和理综预测分会扣减 8%。', icon: 'XCircle' },
    { id: 'debuff_introvert', name: '05. 社交焦虑', desc: '小卖部买提神物资时由于社交内耗，售价贵了 25%，且不擅自发与舍友搭腔。', icon: 'Lock' },
    { id: 'debuff_procrastination', name: '06. 重度拖延', desc: '凡事拖延导致周行动力散漫，每次执行周规划方案时，额外多耗损 5 点精神生命。', icon: 'TrendingDown' },
    { id: 'debuff_inferiority', name: '07. 负罪自抗（自卑）', desc: '脑内深藏因落榜而起的自我否定执念，每周自发无端流失 5 点自豪感。', icon: 'HeartCrack' },
    { id: 'debuff_rebel_fever', name: '08. 刻在骨里的逆骨', desc: '所有不遵校规和顶撞行为增加的学校叛逆值翻倍，极难平复，容易被劝退。', icon: 'Flame' }
  ];

  // CENTRAL ROLLING FUNCTION FOR WEEKLY SUDDEN INCIDENTS & FLASHBACKS
  const rollWeeklyEvents = (difficulty: 'easy' | 'normal' | 'hard', encounteredIds: string[] = []) => {
    // Math probability distributions based on difficulty levels
    let posRate = 0.50; 
    if (difficulty === 'easy') posRate = 0.70;
    if (difficulty === 'hard') posRate = 0.25;

    const isPosSudden = Math.random() < posRate;
    const isPosFlashback = Math.random() < posRate;

    // Pick sudden events (1 of 50 positive, or 1 of 50 negative)
    const rawSuddenPool = isPosSudden ? POSITIVE_SUDDEN_EVENTS : NEGATIVE_SUDDEN_EVENTS;
    const suddenPool = rawSuddenPool.filter(ev => !encounteredIds.includes(ev.id));
    const activeSuddenPool = suddenPool.length > 0 ? suddenPool : rawSuddenPool;
    const selSudden = activeSuddenPool[Math.floor(Math.random() * activeSuddenPool.length)];

    // Pick memory flashbacks (1 of 8 good, or 1 of 8 melancholoy)
    const rawFlashbackPool = isPosFlashback ? TOUCHING_FLASHBACKS : MELANCHOLY_FLASHBACKS;
    const flashbackPool = rawFlashbackPool.filter(ev => !encounteredIds.includes(ev.id));
    const activeFlashbackPool = flashbackPool.length > 0 ? flashbackPool : rawFlashbackPool;
    const selFlashback = activeFlashbackPool[Math.floor(Math.random() * activeFlashbackPool.length)];

    return { selSudden, selFlashback };
  };

  const handleSelectStudyStrategy = (strategy: string) => {
    synth.click();
    if (strategy === 'REST') {
      setWeeklyFocusSelections(['REST']);
    } else {
      setWeeklyFocusSelections(prev => {
        const withoutRest = prev.filter(s => s !== 'REST');
        if (withoutRest.includes(strategy)) {
          return withoutRest.filter(s => s !== strategy);
        } else {
          return [...withoutRest, strategy];
        }
      });
    }
  };

  // MULTIPLE CHECKBOX STUDY DECISION RESOLUTION LOOP (平衡攻守策略核心)
  const handleExecuteWeeklyPlan = (selectedStrategies: string[]) => {
    synth.click();
    if (selectedStrategies.length === 0) {
      alert("请至少选择一项攻守规划。过度消极将遭到惩罚。");
      return;
    }

    const { sleepQuality, pride } = gameState.stats;
    const isEasy = gameState.difficulty === 'easy';
    const isHard = gameState.difficulty === 'hard';

    // A. Standard Metabolic Multipliers
    const sleepFactor = sleepQuality >= 75 ? 1.2 : sleepQuality < 45 ? 0.70 : 1.0;
    const prideFactor = pride < 0 ? 0.8 : pride >= 55 ? 1.15 : 1.0;

    let mergedDeltas: any = {
      chinese: 0, math: 0, english: 0, science: 0, pe: 0,
      stamina: 0, stress: 0, sleepQuality: 0, funds: 0, pride: 0, resilience: 0
    };

    let summaries: string[] = [];

    // CPTSD Trait detection check helper
    let cptsdTriggered = false;

    // Parse cumulative changes for each checkbox selection
    selectedStrategies.forEach(key => {
      let d: any = {};
      let name = '';

      switch (key) {
        case 'CHN':
          const baseChn = 9;
          let realChn = Math.round(baseChn * sleepFactor * prideFactor);
          // Apply math rejection
          if (gameState.selectedDebuffIds.includes('debuff_math_reject')) {
            realChn = Math.round(realChn * 1.10); // compensating boost
          }
          d = { chinese: realChn, resilience: 3, stamina: -12, stress: 4, sleepQuality: -8 };
          name = `语文+${realChn}`;
          break;
        case 'MATH':
          const baseMath = 10;
          let realMath = Math.round(baseMath * sleepFactor * prideFactor);
          // Evaluate character traits
          if (gameState.selectedBuffIds?.includes('buff_brain') || gameState.selectedBuffId === 'buff_brain') realMath = Math.round(realMath * 1.25);
          if (gameState.selectedDebuffIds.includes('debuff_math_reject')) realMath = Math.round(realMath * 0.85);
          d = { math: realMath, pride: 4, stamina: -18, stress: 8, sleepQuality: -10 };
          name = `数学+${realMath}`;
          break;
        case 'ENG':
          const baseEng = 10;
          let realEng = Math.round(baseEng * sleepFactor * prideFactor);
          if (gameState.selectedBuffIds?.includes('buff_bilingual')) {
            realEng = Math.round(realEng * 1.30);
          }
          d = { english: realEng, sleepQuality: 6, stamina: -10, stress: 4 };
          name = `英语+${realEng}`;
          break;
        case 'SCI':
          const baseSci = 20;
          let realSci = Math.round(baseSci * sleepFactor * prideFactor);
          if (gameState.selectedBuffIds?.includes('buff_brain') || gameState.selectedBuffId === 'buff_brain') realSci = Math.round(realSci * 1.25);
          if (gameState.selectedDebuffIds.includes('debuff_math_reject')) realSci = Math.round(realSci * 0.85);
          d = { science: realSci, resilience: 2, stamina: -22, stress: 10, sleepQuality: -12 };
          name = `理综+${realSci}`;
          break;
        case 'PE_TRAIN':
          let peGains = 12;
          let peEnergyCost = -20;
          if (gameState.selectedBuffIds?.includes('buff_run') || gameState.selectedBuffId === 'buff_run') {
            peGains = 18;
            peEnergyCost = -15;
          }
          d = { pe: peGains, stamina: peEnergyCost, stress: -16, resilience: 6, sleepQuality: 16 };
          name = `身体素质+${peGains}`;
          break;
        case 'GYM_TRAIN':
          let gymGains = 16;
          let gymStaminaCost = -24;
          if (gameState.selectedBuffIds?.includes('buff_run') || gameState.selectedBuffId === 'buff_run') {
            gymGains = 24;
            gymStaminaCost = -18;
          }
          d = { pe: gymGains, stamina: gymStaminaCost, stress: -10, resilience: 8, sleepQuality: 10 };
          name = `身体素质+${gymGains}`;
          break;
        case 'CODE':
          let codeStressDecay = -25;
          let codeEnergyGains = 15;
          let codePrideGains = 15;
          if (gameState.selectedBuffIds?.includes('buff_code') || gameState.selectedBuffId === 'buff_code') {
            codeStressDecay = -32;
            codeEnergyGains = 22;
            codePrideGains = 22;
          }
          // Evaluation for CPTSD trauma
          if (gameState.selectedDebuffIds.includes('debuff_ptsd') && Math.random() < 0.25) {
            cptsdTriggered = true;
          }
          d = { stress: codeStressDecay, stamina: codeEnergyGains, pride: codePrideGains, sleepQuality: -10, math: 2 };
          name = `敲码解压`;
          break;
        case 'REST':
          d = { stamina: 30, stress: -20, sleepQuality: 25, pride: 4, chinese: 2 };
          name = `休眠`;
          break;
      }

      // Merge values
      Object.keys(d).forEach(k => {
        mergedDeltas[k] = (mergedDeltas[k] || 0) + d[k];
      });
      summaries.push(name);
    });

    // B. APPLY MULTITASKING OVERLOAD DEBUFF PENALTIES (游戏平衡防刷子)
    const actCount = selectedStrategies.length;
    let overloadMsg = '';
    let multitaskStressAdd = 0;
    let multitaskSleepLoss = 0;

    if (actCount === 2) {
      mergedDeltas.stamina = Math.round(mergedDeltas.stamina * 1.30);
      multitaskStressAdd = 5;
      multitaskSleepLoss = -5;
      overloadMsg = '【双管齐下】同时兼顾两次重难，体能消耗乘以130%，增加5点负担和流失5睡眠。';
    } else if (actCount === 3) {
      mergedDeltas.stamina = Math.round(mergedDeltas.stamina * 1.80);
      multitaskStressAdd = 12;
      multitaskSleepLoss = -12;
      overloadMsg = '【急速超载】贪多过度。物理精力消耗暴涨为180%，压力直线上浮12点，睡眠崩毁12%。';
    } else if (actCount >= 4) {
      mergedDeltas.stamina = Math.round(mergedDeltas.stamina * 2.50);
      multitaskStressAdd = 25;
      multitaskSleepLoss = -25;
      // All academic focus benefits are degraded by 25% due to extreme brain fog!
      mergedDeltas.chinese = Math.round(mergedDeltas.chinese * 0.75);
      mergedDeltas.math = Math.round(mergedDeltas.math * 0.75);
      mergedDeltas.english = Math.round(mergedDeltas.english * 0.75);
      mergedDeltas.science = Math.round(mergedDeltas.science * 0.75);
      overloadMsg = '【脑力崩溃！全科极度过载】强行兼顾过多科目！物理体力狂跌2.5倍，增加25点心理重压和急坠25点睡眠，学习功耗效率萎缩25%！';
    }

    mergedDeltas.stress += multitaskStressAdd;
    mergedDeltas.sleepQuality += multitaskSleepLoss;

    // C. Apply Difficulty Modifiers to fatigue and stress
    if (isEasy) {
      if (mergedDeltas.stress > 0) mergedDeltas.stress = Math.round(mergedDeltas.stress * 0.75);
      if (mergedDeltas.stamina < 0) mergedDeltas.stamina = Math.round(mergedDeltas.stamina * 0.75);
    } else if (isHard) {
      if (mergedDeltas.stress > 0) mergedDeltas.stress = Math.round(mergedDeltas.stress * 1.20);
      if (mergedDeltas.stamina < 0 || keyCount() >= 2) mergedDeltas.stamina = Math.round(mergedDeltas.stamina * 1.15);
    }

    // Apply trauma flare-up
    if (cptsdTriggered) {
      mergedDeltas.stress += 15;
    }

    let nextStats = calculateDeltas(gameState.stats, mergedDeltas);

    // Apply procrastination penalty
    if (gameState.selectedDebuffIds.includes('debuff_procrastination')) {
      nextStats.stamina = Math.max(0, nextStats.stamina - 5);
      overloadMsg = overloadMsg ? `${overloadMsg}（重度拖延阻碍额外扣减5点精力）` : '【物理拖延】大脑磨洋工，无端耗损 5 点日常体力值。';
    }

    // Apply self-blame inferiority decay
    if (gameState.selectedDebuffIds.includes('debuff_inferiority')) {
      nextStats.pride = Math.max(-100, nextStats.pride - 5);
    }

    // Apply check for death bounds / expulsion bounds
    if (nextStats.rebellion >= 100) {
      synth.gameover();
      updateGameStateWithAchievements({
        ...gameState,
        stats: nextStats,
        chosenEndingId: 'ending_expelled',
        gameStage: 'ending'
      });
      return;
    }

    if (nextStats.stress >= 100) {
      synth.gameover();
      updateGameStateWithAchievements({
        ...gameState,
        stats: nextStats,
        chosenEndingId: 'ending_stress_breakdown',
        gameStage: 'ending'
      });
      return;
    }

    // D. Progress to next event
    setGameState(prev => {
      const logs = [...prev.historyLogs];
      logs.unshift(`第 ${prev.currentWeek} 周 [复合行动] 各科同步推进：[${summaries.join(', ')}]。`);
      if (overloadMsg) logs.unshift(`⚠️ 规划过载惩罚：${overloadMsg}`);
      if (cptsdTriggered) logs.unshift(`💥 【CPTSD创伤反弹】你在微机大楼后手心狂颤，重忆起省队被判零分的那五秒崩溃。心理压力暴扣15！`);

      // Determine the narrative timeline event for choice
      let nextEvent = null;
      if (WEEKLY_EVENTS[prev.currentWeek]) {
        nextEvent = WEEKLY_EVENTS[prev.currentWeek];
      } else {
        const availablePool = RANDOM_EVENTS.filter(ev => !prev.encounteredEventIds.includes(ev.id));
        const finalPool = availablePool.length > 0 ? availablePool : RANDOM_EVENTS;
        const randIndex = Math.floor(Math.random() * finalPool.length);
        nextEvent = finalPool[randIndex];
      }

      // Reset checkbox multi-selection
      setWeeklyFocusSelections([]);

      return {
        ...prev,
        stats: nextStats,
        historyLogs: logs,
        activeEvent: nextEvent,
        selectedFocus: selectedStrategies,
        encounteredEventIds: nextEvent ? [...prev.encounteredEventIds, nextEvent.id] : prev.encounteredEventIds
      };
    });

    function keyCount() {
      return selectedStrategies.length;
    }
  };

  // Event choice clicked inside Weekly Timeline
  const handleSelectEventChoice = (choiceIndex: number) => {
    const event = gameState.activeEvent;
    if (!event) return;

    synth.chime();
    const choice = event.choices[choiceIndex];
    let nextStats = calculateDeltas(gameState.stats, choice.deltas, gameState.selectedDebuffIds);

    // 1. Apply weekly metabolism rule
    const { stats: afterMetabolismStats, logMessage: metaMessage } = applyWeeklyMetabolism(nextStats);
    nextStats = afterMetabolismStats;

    // Apply severe insomnia debuff multiplier
    if (gameState.selectedDebuffIds.includes('debuff_insomnia')) {
      nextStats.sleepQuality = clampValue(nextStats.sleepQuality - 5, 5, 100);
    }

    // Apply sleep booster buff
    if (gameState.selectedBuffIds?.includes('buff_insomniac_immune')) {
      nextStats.sleepQuality = clampValue(nextStats.sleepQuality + 3, 5, 100);
    }

    // 2. Check for expulsion boundary
    if (nextStats.rebellion >= 100) {
      synth.gameover();
      updateGameStateWithAchievements({
        ...gameState,
        stats: nextStats,
        chosenEndingId: 'ending_expelled',
        gameStage: 'ending'
      });
      return;
    }

    // 2b. Check for Stress-collapse self-destruction boundary
    if (nextStats.stress >= 100) {
      synth.gameover();
      updateGameStateWithAchievements({
        ...gameState,
        stats: nextStats,
        chosenEndingId: 'ending_stress_breakdown',
        gameStage: 'ending'
      });
      return;
    }

    setGameState(prev => {
      const logs = [...prev.historyLogs];
      logs.unshift(`【决断：${event.title}】选择结果：${choice.logText}`);
      if (metaMessage) {
        logs.unshift(metaMessage);
      }

      // 3. Roll next week's morning sudden crash / flashback alerts
      const nextWeek = prev.currentWeek + 1;
      const isExamWeek = prev.currentWeek === 4 || prev.currentWeek === 8 || prev.currentWeek === 11 || prev.currentWeek === 12;
      
      let nextStage = prev.gameStage;
      let scoreBreakdown: SubjectScores | null = null;
      let examNameStr = '';
      
      let rolledSudden: SuddenEvent | null = null;
      let rolledFlashback: MemoryFlashback | null = null;

      if (isExamWeek) {
        nextStage = 'exam_view';
        if (prev.currentWeek === 4) examNameStr = '第一轮全真统一一模考试';
        if (prev.currentWeek === 8) examNameStr = '全省二模抗挫联考';
        if (prev.currentWeek === 11) examNameStr = '高考冲底提分三模考试';
        if (prev.currentWeek === 12) examNameStr = '普通高等学校招生入学考试 (高考官测)';

        // Scale factors: fatigued or extremely anxious
        const fatiguePenalty = nextStats.stamina < 20 ? 0.70 : 1.0;
        const extremeAnxietyPenalty = nextStats.stress >= 75 ? 0.82 : 1.0;

        // Apply exam typos debuff logic
        const typoFactor = prev.selectedDebuffIds.includes('debuff_jitter') ? 0.90 : 1.0;

        scoreBreakdown = {
          chinese: Math.round(clampValue(nextStats.scores.chinese * (0.85 + Math.random() * 0.20) * extremeAnxietyPenalty, 40, 150)),
          math: Math.round(clampValue(nextStats.scores.math * (0.90 + Math.random() * 0.20) * fatiguePenalty * typoFactor, 45, 150)),
          english: Math.round(clampValue(nextStats.scores.english * (0.85 + Math.random() * 0.25) * extremeAnxietyPenalty * (prev.selectedDebuffIds.includes('debuff_jitter') ? 0.93 : 1.0), 35, 150)),
          science: Math.round(clampValue(nextStats.scores.science * (0.90 + Math.random() * 0.15) * fatiguePenalty * typoFactor, 100, 300)),
          pe: nextStats.scores.pe
        };
      } else {
        // Roll random sudden events and memory flashbacks based on current week and difficulty limit
        const rolled = rollWeeklyEvents(prev.difficulty || 'normal', prev.encounteredEventIds);
        rolledSudden = rolled.selSudden;
        rolledFlashback = rolled.selFlashback;

        // Immediately apply event modifiers (with optimist survival support)
        let suddenDeltas = { ...rolledSudden.deltas };
        if (!rolledSudden.isPositive && prev.selectedBuffIds?.includes('buff_optimist') && suddenDeltas.stress) {
          suddenDeltas.stress = Math.round(suddenDeltas.stress * 0.5);
        }

        nextStats = calculateDeltas(nextStats, suddenDeltas, prev.selectedDebuffIds);

        // Flashbacks have a massive impact now (Large Impact rule + Difficulty Awareness)
        const isPos = rolledFlashback.isPositive;
        const fm = prev.difficulty === 'hard'
          ? (isPos ? 1.4 : 2.5)  // Hard: positive memories heal less, negative hits WAY harder (2.5x!)
          : prev.difficulty === 'easy'
          ? (isPos ? 3.0 : 1.0)  // Easy: positive memories heal amazingly (3.0x!), negative hits light
          : (isPos ? 2.0 : 2.0); // Normal: balanced 2.0x impact both ways!

        const scaledFlashbackDeltas: any = {};
        Object.entries(rolledFlashback.deltas).forEach(([k, v]) => {
          scaledFlashbackDeltas[k] = Math.round((v as number) * fm);
        });

        nextStats = calculateDeltas(nextStats, scaledFlashbackDeltas, prev.selectedDebuffIds);

        // Format a detailed message about the effects
        const effectDetailsCustom = Object.entries(scaledFlashbackDeltas)
          .map(([k, v]) => {
            const val = v as number;
            const sign = val >= 0 ? '+' : '';
            let keyCN = k;
            if (k === 'chinese') keyCN = '语文';
            if (k === 'math') keyCN = '数学';
            if (k === 'english') keyCN = '英语';
            if (k === 'science') keyCN = '理综';
            if (k === 'pe') keyCN = '体育';
            if (k === 'stamina') keyCN = '精力';
            if (k === 'stress') keyCN = '压力';
            if (k === 'pride') keyCN = '自尊自傲';
            if (k === 'resilience') keyCN = '心理韧性';
            if (k === 'sleepQuality') keyCN = '睡眠质量';
            return `${keyCN}${sign}${val}`;
          })
          .join(', ');

        // Attach effect details to the custom flashback object for display in UI
        rolledFlashback = {
          ...rolledFlashback,
          text: `${rolledFlashback.text}（时光回响对身心产生巨幅影响：${effectDetailsCustom}）`,
          deltas: scaledFlashbackDeltas
        };

        logs.unshift(`⚡ 【周末风波】 ${rolledSudden.text}`);
        logs.unshift(`🌀 【时光闪回】 ${rolledFlashback.text}`);
      }

      const updatedState: GameState = {
        ...prev,
        currentWeek: nextWeek > 12 ? 12 : nextWeek,
        stats: nextStats,
        historyLogs: logs,
        activeEvent: null,
        selectedFocus: null,
        gameStage: nextStage,
        weeklySuddenEvent: rolledSudden,
        weeklyFlashback: rolledFlashback,
        encounteredEventIds: rolledSudden && rolledFlashback 
          ? [...(prev.encounteredEventIds || []), rolledSudden.id, rolledFlashback.id]
          : (prev.encounteredEventIds || []),
        examResult: scoreBreakdown ? {
          examName: examNameStr,
          scores: scoreBreakdown,
          totalScore: scoreBreakdown.chinese + scoreBreakdown.math + scoreBreakdown.english + scoreBreakdown.science,
          rank: Math.round(600 - (scoreBreakdown.chinese + scoreBreakdown.math + scoreBreakdown.english + scoreBreakdown.science) * 0.70),
          evaluation: ''
        } : null
      };

      if (!isExamWeek) {
        triggerAutosave(updatedState);
      }

      // Check achievements after updating values!
      setTimeout(() => updateGameStateWithAchievements(updatedState), 50);

      return updatedState;
    });
  };

  // Close report card view and prepare next week's loop
  const handleCloseReport = () => {
    synth.click();
    
    // If finished Week 12 exam, trigger final ending
    if (gameState.currentWeek === 12 && gameState.examResult) {
      const finalScore = gameState.examResult.totalScore;
      const math = gameState.stats.scores.math;
      const sci = gameState.stats.scores.science;
      const pride = gameState.stats.pride;

      let endingId = '';

      const english = gameState.examResult ? gameState.examResult.scores.english : 75;
      const funds = gameState.stats.funds;

      // Abroad Selection: reasonable funds (>= 600) + score range (>= 400) + high english score (>= 115)
      if (funds >= 600 && finalScore >= 400 && english >= 115) {
        endingId = 'ending_abroad';
      } else if (math >= 135 && sci >= 270 && pride >= 65 && finalScore < 540) {
        endingId = 'ending_indie_hacker';
      } else if (finalScore >= 665) {
        endingId = 'ending_provincial_top';
      } else if (finalScore >= 610) {
        endingId = 'ending_985_ship';
      } else if (finalScore >= 565) {
        endingId = 'ending_211_elite';
      } else if (finalScore >= 505) {
        endingId = 'ending_tier1_standard';
      } else if (finalScore >= 445) {
        endingId = 'ending_tier2_survive';
      } else {
        endingId = 'ending_gap_year';
      }

      const nextState = {
        ...gameState,
        chosenEndingId: endingId,
        gameStage: 'ending' as const
      };
      
      updateGameStateWithAchievements(nextState);
    } else {
      const nextState = {
        ...gameState,
        gameStage: 'gameplay' as const
      };
      
      updateGameStateWithAchievements(nextState);
    }
  };

  // Canteen Buy Click (With social anxiety extra cost integration!)
  const handleBuyItem = (item: ShopItem) => {
    const isAnxious = gameState.selectedDebuffIds.includes('debuff_introvert');
    const finalCost = isAnxious ? Math.round(item.cost * 1.25) : item.cost;

    const { funds } = gameState.stats;
    if (funds < finalCost) {
      synth.error();
      alert(`家长批拨的零钱（￥${funds}）买不起此物。${isAnxious ? "（社交焦虑特质：物资溢价25%）" : ""}`);
      return;
    }

    synth.chime();
    const purchaseStats = calculateDeltas(gameState.stats, {
      ...item.deltas,
      funds: -finalCost
    });

    const logs = [...gameState.historyLogs];
    logs.unshift(`🛒 购买消耗了 [${item.name}]。${item.description}`);

    const nextState = {
      ...gameState,
      stats: purchaseStats,
      historyLogs: logs
    };

    updateGameStateWithAchievements(nextState);
  };

  // Loaded callback
  const handleLoadStateFromArchive = (loadedState: GameState) => {
    synth.chime();
    setGameState(loadedState);
  };

  // Completely reset
  const handleResetGame = () => {
    synth.click();
    setCharacterName('良');
    setSelectedDifficulty('normal');
    setSelectedOriginId('origin_failed');
    setCharacterBuffs([]);
    setCharacterDebuffs([]);
    setWeeklyFocusSelections([]);

    setGameState({
      playerName: '良',
      difficulty: 'normal',
      selectedBuffId: null,
      selectedDebuffIds: [],
      unlockedAchievementIds: gameState.unlockedAchievementIds || [],         // Keep achievements persistent!
      weeklySuddenEvent: null,
      weeklyFlashback: null,
      currentWeek: 1,
      stats: {
        scores: { chinese: 75, math: 95, english: 75, science: 160, pe: 60 },
        stamina: 100,
        stress: 20,
        funds: 100,
        pride: 30,
        resilience: 40,
        sleepQuality: 75
      },
      historyLogs: [
        '人生的进度已经翻新重来。再次面对退役时的那段冬日阳光，你擦了擦尘土。'
      ],
      selectedFocus: null,
      encounteredEventIds: [],
      examResult: null,
      gameStage: 'intro',
      activeEvent: null,
      chosenEndingId: null,
      activeAchievementToast: null
    });
  };

  // Helper to compute whether the player is anxious based on stats, difficulty, and previous anxious state
  const computeAnxiousState = (stats: PlayerStats, difficulty: 'easy' | 'normal' | 'hard', previousIsAnxious: boolean): boolean => {
    let triggerStressThreshold = 70;
    let triggerStaminaThreshold = 25;

    let exitStressThreshold = 55;
    let exitStaminaThreshold = 40;

    if (difficulty === 'easy') {
      triggerStressThreshold = 80;      // Hard to trigger (high stress / low stamina required)
      triggerStaminaThreshold = 18;     // Hard to trigger
      exitStressThreshold = 65;         // Easy to exit (recover stress < 65)
      exitStaminaThreshold = 30;        // Easy to exit (recover stamina > 30)
    } else if (difficulty === 'normal') {
      triggerStressThreshold = 68;      // Easier to trigger (normally 75, now 68; stamina 20, now 30)
      triggerStaminaThreshold = 30;
      exitStressThreshold = 45;         // Harder to exit (need to drop stress < 45)
      exitStaminaThreshold = 45;        // and raise stamina > 45
    } else if (difficulty === 'hard') {
      triggerStressThreshold = 58;      // Extremely easy to trigger (stress >= 58 or stamina <= 40)
      triggerStaminaThreshold = 40;
      exitStressThreshold = 35;         // Extremely hard to exit (need to drop stress < 35)
      exitStaminaThreshold = 60;        // and raise stamina > 60
    }

    if (previousIsAnxious) {
      // Exiting is harder: requires both stress to be below threshold AND stamina above threshold
      const shouldExit = stats.stress < exitStressThreshold && stats.stamina > exitStaminaThreshold;
      return !shouldExit;
    } else {
      // Triggering is easier: triggers if stress too high OR stamina too low
      const shouldTrigger = stats.stress >= triggerStressThreshold || stats.stamina <= triggerStaminaThreshold;
      return shouldTrigger;
    }
  };

  // Synchronize dynamic anxiety status with hysteresis to the state
  useEffect(() => {
    if (gameState.gameStage === 'ending') return;
    const calculatedAnxious = computeAnxiousState(gameState.stats, gameState.difficulty, !!gameState.isAnxious);
    if (calculatedAnxious !== gameState.isAnxious) {
      setGameState(prev => ({
        ...prev,
        isAnxious: calculatedAnxious
      }));
    }
  }, [gameState.stats, gameState.difficulty, gameState.isAnxious, gameState.gameStage]);

  // Dynamic Anxiety conditions
  const isCurrentlyAnxious = !!gameState.isAnxious;

  const getEndingImage = (endingId: string) => {
    switch (endingId) {
      case 'ending_stress_breakdown':
        return fallenButterflyImg;
      case 'ending_indie_hacker':
        return indieHackerImg;
      case 'ending_abroad':
        return tsinghuaEndImg;
      case 'ending_expelled':
        return gapYearEndImg;
      case 'ending_provincial_top':
      case 'ending_985_ship':
      case 'ending_211_elite':
        return tsinghuaEndImg;
      case 'ending_tier1_standard':
      case 'ending_tier2_survive':
      case 'ending_gap_year':
      default:
        return gapYearEndImg;
    }
  };

  // Render ending metadata
  const getEndingDetails = (endingId: string) => {
    const total = gameState.examResult ? gameState.examResult.totalScore : 420;
    const pe = gameState.stats.scores.pe;
    const pride = gameState.stats.pride;
    const funds = gameState.stats.funds;
    const english = gameState.examResult ? gameState.examResult.scores.english : (gameState.stats.scores.english || 75);

    switch (endingId) {
      case 'ending_abroad':
        return {
          title: '🛫 【大洋彼岸 · 浪潮席卷新世界】',
          badge: '海外特选录取',
          description: `高考投档落幕后的那个盛夏，你并没有和舍友们去挤普通专科、普通一本的志愿。依靠你拼死存下的 ￥${funds} 研学应急储备，以及考卷上高达 ${english} 分的英语单科，海外知名高校的软件项目一等免试录取函不期而至。你提上沉重的黑色行囊，坐上了飞往波士顿的夜航国际班机。飞过黑寂的北冰洋，在一处古朴的红砖常春藤图书馆中，你拉开一盏幽绿色的台灯，在微弱光晕中，重新写下了拯救并链接世界的精彩代码。`,
          metrics: `高考英语分数: ${english}分 | 研学储备资金: ￥${funds} | 独立全球开拓者`
        };
      case 'ending_expelled':
        return {
          title: '⚠️ 【严重违规违纪 · 勒令退学】',
          badge: '逆行终结宣告',
          description: `你那长久积累的信奥坠落落差怒火、高强度的周计划逃课、在机房和宿舍偷摸开黑、以及对教导处枯燥体制的高傲顶撞，让你的学校“叛逆值”不可逆转地爆发到 100 饱满顶峰。周一庄严的高考百日誓师校会上，你的学籍终止公告被广播沙哑地宣读出。班主任垂柳般的重叹，同学刺眼如针扎的视线，你抱着塞满退役线材和纸笔的废纸箱离开校门。高中的复原戛然而止，冰冷而狰狞的社会齿轮提前降临在你肩上。`,
          metrics: `学校叛逆值: 100/100 | 文化课未完成 | 被生活磨平的少年逆骨`
        };
      case 'ending_stress_breakdown':
        return {
          title: '🤕 【系统宕机：心理崩溃】',
          badge: '精神过载断电',
          description: `在倒计时行将结束的某天半夜，面对考卷上那些算不完的数列级数与理综电磁，你最后的一根心理拉簧崩断了。你捂着耳朵，眼前浮现出无限循环和编译退回的错码。你错过了高考……然而，在昏睡了整整两周后，父母默默带回高教辅导的心理顾问，帮你打理了行装去到远郊疗养。你扔掉了数理草稿，开始抚摸山泉温润的石头，或许人生不需要永远完美Accepted，不崩溃就是通往安宁的绿色通道。`,
          metrics: `高考文化分: 0分 | 身体素质: ${pe}/100 | 自豪指数: ${pride}`
        };
      case 'ending_indie_hacker':
        return {
          title: '💻 【极客新生 · 底层系统架构奇迹】',
          badge: '顶级独立开发者',
          description: `因为你执迷于极致的逻辑证明、汇编常数重构和手痒写底层的编译内核，你完美地放弃了枯燥繁重的语文与英语。高考文化总分仅仅只有 ${total} 分。但在考后两星期的GitHub年度开发者大会上，你由于在寝室里写的极简跨平台网络库内核加速器被开源教父大力力荐，直登全球科技第一热榜！某国外名牌大学CS科研所首席特聘教授给你的邮箱发来了直通奖学金，人生并不止有一条高考通档。`,
          metrics: `高考总分: ${total}分 (绝杀数理分) | 身体素质: ${pe}/100 | 极致独立极客`
        };
      case 'ending_provincial_top':
        return {
          title: '🌸 【金秋红榜 · 清华北京巨轮启航】',
          badge: '清华/北京大学特录',
          description: `高考投档大盘揭盖！你获得了总分 ${total} 分的全省神级名次！你用当初在算法赛道里熬夜锤炼出的铁骨、以及高达 ${pe} 点的卓越身体素质，在最严密的高考考场里拉开了无瑕的满弓！放榜不到一小时，招生部专车已围堵在校门口，许诺姚班/强基特派等顶级拔尖科学研究席位项目。代码少年的汗水与青春，在这一刻重新直抵金字塔最顶峰。`,
          metrics: `文化课成绩: ${total}分 | 身体素质: ${pe}/100 | 傲视群雄的心智王者`
        };
      case 'ending_985_ship':
        return {
          title: '🚢 【破浪扬帆 · 顶尖C9华五名家】',
          badge: '名校一等强基班直通',
          description: `文化课预测大获全胜，累加总得分 ${total}！你毫无悬念地迈向了江南顶尖985名学府（如浙大或复旦）的计算机特选班。得益于你出色的奥赛算法积淀，你在大学面试和强基机测中，以完美的自豪姿态写出了考官们前所未见的线段树重叠解决方案。你成功延续了当年在幽冷微机房里那段高深代码少年的生命，书写下一个更耀眼的篇章。`,
          metrics: `高考分数: ${total}分 | 身体素质: ${pe}/100 | 核心代码工程架构骨干`
        };
      case 'ending_211_elite':
        return {
          title: '🎯 【百发百中 · IT行业黄埔211录取】',
          badge: '北京邮电/西安电子/王牌IT',
          description: `分数最终敲定在 ${total} 分。你稳健地勾选了在IT领域被誉为英才摇篮的行业顶尖211大学。在这里，你曾高扬的代码斗志和稳妥的文化底子交汇成了最牢固的基石。在开学第一周的新生选拔中，你高大且极富侵略性的C++调试底蕴让老牌ACM教练当场拉入ICPC校队，在一场久违的键盘敲击声里，你热泪盈眶，重新看到了年少发光的自我。`,
          metrics: `文化高考分: ${total}分 | 身体素质: ${pe}/100 | 地区ICPC校赛金牌先锋`
        };
      case 'ending_tier1_standard':
        return {
          title: '🧱 【红砖白瓦 · 踏在坚实的一本泥土】',
          badge: '省属首批排头一本院校',
          description: `高考稳固落地，收获 ${total} 分。在这个喧闹的志愿夏天，你收下了一本主流高校软件工程系的红纸通知。虽然没有闪亮到宇宙之巅的耀眼，但退役百日后那段在书堆掩映间与单词长跑搏杀的日子，早已彻底锤炼了你的心性。你开始发现生活不止有高精尖的算法，在一张朴实课桌上，细数江海、与生活稳手言和，亦是无上的成就。`,
          metrics: `高考分数: ${total}分 | 身体素质: ${pe}/100 | 务实求真的研发工程师`
        };
      case 'ending_tier2_survive':
        return {
          title: '🌊 【浩荡江湖 · Ordinary but Unbendable】',
          badge: '省属正规公办二本',
          description: `你最终取得了 ${total} 分，报考了省内公立二本大学。虽然课堂讲得很老套，但也赋予了你极大的空闲时间来探索自我。依靠当初精简的奥赛底色，你从寝室自学了前沿人工智能和大语言模型，在各大开发者社区斩获了多块知名技术黑客奖牌。不困守于一时的落败，用长坡厚雪的眼光看待人生，你终将归于广阔的真我江海。`,
          metrics: `高考成绩: ${total}分 | 身体素质: ${pe}/100 | 底气厚重的民间自由奇才`
        };
      default: // ending_gap_year
        return {
          title: '📝 【长风破浪 · 回炉重战高四】',
          badge: '高四全科代码体系重构',
          description: `分数单上惊人的 ${total} 分让你和家人在深夜里陷入了长久的无言，这确实离你的数理智慧距离太远。然而你深吸一气，明白这场短跑虽然在沙砾中滑倒，但代码少年的信念不该低头。你做出了复读的艰难决定。退役重学文化课的这一百天，早已为你铺设了最深沉的防线，高四那场没有代码编译、唯笔作剑的洗礼，你必将真正大获Accepted。`,
          metrics: `高考分数: ${total}分 | 身体素质: ${pe}/100 | 重整铠甲的孤心斗士`
        };
    }
  };

  return (
    <div className={`min-h-screen pb-16 pt-6 px-4 selection:bg-stone-800 selection:text-white antialiased transition-all duration-1000 ${
      isCurrentlyAnxious 
      ? 'bg-stone-950 text-stone-205 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)]' 
      : 'bg-stone-50/70 text-stone-800'
    }`}>
      
      {/* Global Header */}
      <header className={`max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 transition-all duration-1000 ${
        isCurrentlyAnxious ? 'border-stone-800 text-stone-100' : 'border-stone-200 text-stone-900'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className={`w-6 h-6 shrink-0 transition-colors ${isCurrentlyAnxious ? 'text-rose-500' : 'text-stone-800'}`} />
            <h1 className="font-sans font-black text-lg tracking-tight uppercase flex items-center gap-2">
              信奥生的高考复原逆旅 
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                isCurrentlyAnxious ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-stone-900 text-stone-100'
              }`}>
                {isCurrentlyAnxious ? '🚨 STRESS ALERT' : '100 DAYS WORK'}
              </span>
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            重筑高考全科底气，平衡物理精力、自豪感与睡眠质量的多结局真实模拟。
          </p>
        </div>

        {/* Global Sound and Logs Toggle Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              synth.click();
              setChangelogOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold bg-white transition-all cursor-pointer ${
              isCurrentlyAnxious ? 'border-stone-850 bg-stone-900 text-stone-300 hover:bg-stone-800' : 'border-stone-200 text-stone-600 hover:border-stone-350 hover:bg-stone-50'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-600" />
            <span>更新日志</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold bg-white transition-all cursor-pointer ${
              isCurrentlyAnxious ? 'border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-850' : 'border-stone-200 text-stone-600 hover:border-stone-350'
            }`}
            title={soundEnabled ? '禁用音效' : '启用音效'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-500" />}
            <span>{soundEnabled ? '音效开启' : '音效关闭'}</span>
          </button>
          
          <button
            onClick={handleResetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-100 bg-white hover:bg-rose-50/50 rounded-xl text-xs font-bold text-rose-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
            <span>重置</span>
          </button>
        </div>
      </header>

      {/* Primary Layout Engine / Stages Render */}
      <main className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* STAGE 1: THE POIGNANT OPENING STORYBOARD */}
          {gameState.gameStage === 'intro' && (
            <motion.div
              key="intro-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto bg-white border border-stone-200 shadow-xl rounded-2xl p-8 text-center relative overflow-hidden my-12"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-205">
                <Terminal className="w-6 h-6 text-stone-800" />
              </div>

              <span className="text-xs text-stone-400 font-mono tracking-widest block mb-1">PROTAGONIST: LIANG (良)</span>
              <h2 className="font-sans font-black text-stone-900 text-2xl mb-4 tracking-tight leading-tight">
                省选落空后的良（主人公）：
                <br />
                “我的键盘，倒在冬日的斜阳里”
              </h2>
              
              <p className="text-xs text-stone-600 leading-relaxed text-left bg-stone-50 p-5 rounded-2xl border border-stone-200/50 mb-8 font-sans">
                窗外刺眼的阳光倾洒，高三一班的黑板一角，鲜红的<b>“高考倒计时 100 天”</b>刺痛双眼。
                <br /><br />
                “良，回来了啊。把书桌收拾一下，准备英语测验。” 老师的声音温和却像冰冷的潮水。你怀抱着写满C++模板、调试到深夜的纸笔背包，在满布灰尘的座位前坐下。桌上一层白灰，重重叠叠塞满了试卷山。
                <br /><br />
                曾经，你是学校里那个敲击青轴键盘、在代码迷航中一骑绝尘的算法天才良。可是，由于一两行关键Bug的越界崩塌，亦或是NOI考场上的微小失手，你所有的竞赛约定一夜成梦。没有保送、没有绿牌，没有按下回车后亮起的 Accepted。
                你必须在一百天内，夺回在这个凡间考场上的所有文化课尊严，不让青春彻底跌落！
              </p>

              <button
                id="btn-pick-up-the-pen"
                onClick={handleStartGame}
                className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-950 text-white font-sans font-bold px-8 py-3.5 rounded-xl shadow-xs hover:scale-[1.01] transition-all cursor-pointer"
              >
                <span>拭乾残灰，重拾纸笔拼回人生</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STAGE 2: PRESETS */}
          {gameState.gameStage === 'character_init' && (
            <motion.div
              key="preset-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-4xl mx-auto flex flex-col gap-8 pb-12"
            >
              {/* Card Header Title */}
              <div className="text-center">
                <span className="text-xs bg-stone-900 text-stone-100 font-mono px-3.5 py-1.5 rounded-full uppercase tracking-wider font-extrabold shadow-xxs">
                  高三命运重连系统·命格载入
                </span>
                <h2 className="font-sans font-black text-stone-950 text-3xl mt-4 tracking-tight">
                  重塑主人公的身心轮廓
                </h2>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  你的身世背景、起步考分、天赋本能以及长年竞赛留下的精神枷锁，将主导前方 100 天惊涛骇浪的高考突围。
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 border border-dashed border-stone-200/40 rounded-full flex items-center justify-center translate-x-12 -translate-y-12 select-none pointer-events-none">
                  <User className="w-16 h-16 text-stone-100" />
                </div>

                {/* Grid Input Name & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-stone-100">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2 relative">
                    <label className="font-sans font-extrabold text-stone-850 text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <User className="w-4 h-4 text-stone-700" />
                      主人公尊姓大名:
                    </label>
                    <input 
                      type="text"
                      value={characterName}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 8); // Max 8 chars
                        setCharacterName(val);
                      }}
                      placeholder="良"
                      className="bg-stone-50 border border-stone-200 focus:border-stone-800 text-stone-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-0 transition-colors w-full font-sans font-medium"
                    />
                    <span className="text-[10px] text-stone-400 absolute right-3 bottom-3 font-mono">
                      {characterName.length}/8 字
                    </span>
                  </div>

                  {/* Difficulty Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="font-sans font-extrabold text-stone-850 text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-500" />
                      当前挑战难度 (Difficulty Level):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['easy', 'normal', 'hard'] as const).map((diff) => {
                        const labels = {
                          easy: { title: '凡人坦途', desc: '各科初分+15，精力充沛' },
                          normal: { title: '重振之路', desc: '标准数值，平衡考核' },
                          hard: { title: '极暗绝境', desc: '全科扣减，高烧过载' }
                        };
                        const isSel = selectedDifficulty === diff;
                        return (
                          <button
                            key={diff}
                            type="button"
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              isSel
                              ? 'bg-stone-950 border-stone-950 hover:bg-stone-900 text-white shadow-sm scale-[1.01]'
                              : 'bg-stone-50/50 border-stone-200 hover:border-stone-300 text-stone-700'
                            }`}
                          >
                            <span className="font-sans font-extrabold text-xs">
                              {labels[diff].title}
                            </span>
                            <span className={`text-[9px] mt-1 pr-1 leading-normal ${isSel ? 'text-stone-300' : 'text-stone-400'}`}>
                              {labels[diff].desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Starting Origins Presets */}
                <div className="flex flex-col gap-3 pb-6 border-b border-stone-100">
                  <label className="font-sans font-extrabold text-stone-850 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    初始命运背景抉胜 (Starting Background):
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {ORIGINS.map((ori) => {
                      const total = ori.initialStats.scores.chinese + ori.initialStats.scores.math + ori.initialStats.scores.english + ori.initialStats.scores.science;
                      const isSel = selectedOriginId === ori.id;
                      return (
                        <div
                          key={ori.id}
                          onClick={() => {
                            setSelectedOriginId(ori.id);
                            // Avoid carrying custom features unless custom is selected
                            if (ori.id !== 'origin_custom') {
                              setCharacterBuffs([]);
                              setCharacterDebuffs([]);
                            }
                          }}
                          className={`border-2 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 relative group ${
                            isSel 
                            ? 'bg-white border-stone-950 shadow-md ring-1 ring-stone-950' 
                            : 'bg-stone-50/30 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <div className="flex flex-col gap-2">
                            <span className="font-sans font-black text-stone-850 text-xs tracking-tight uppercase">
                              {ori.name}
                            </span>
                            <p className="text-[10px] text-stone-500 leading-normal font-sans">
                              {ori.description}
                            </p>
                          </div>

                          <div className="border-t border-stone-200/40 pt-3 mt-3 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-stone-400">模考基础分:</span>
                              <span className="font-extrabold text-stone-800">{total}分</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-stone-400">抗压底盘:</span>
                              <span className="font-bold text-teal-600">{ori.initialStats.resilience}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Custom Trait Builder Panel */}
                {selectedOriginId === 'origin_custom' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 bg-stone-50 border border-stone-200 p-6 rounded-2xl"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-stone-200/60 pb-3 gap-2">
                      <div>
                        <h4 className="font-sans font-extrabold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          自定义主人公 · 命理均势自选
                        </h4>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          通过因果均势平衡你的属性：选择取舍方案。配比必须满足：1个正面天赋配 2个负面枷锁，或 2个正面天赋配 4个负面枷锁。
                        </p>
                      </div>
                      <div className="flex gap-2 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded-full border ${characterBuffs.length >= 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-200/50 text-stone-500 border-stone-300'}`}>
                          正面天赋: {characterBuffs.length}/2
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${
                          (characterBuffs.length === 1 && characterDebuffs.length === 2) || (characterBuffs.length === 2 && characterDebuffs.length === 4)
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          负面枷锁: {characterDebuffs.length}/{characterBuffs.length * 2 || '2或4'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Positive Traits (BUFF) */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> 正面特质天赋 (选择 1-2 项):
                        </span>
                        <div className="flex flex-col gap-2">
                          {BUFF_OPTIONS.map((buff) => {
                            const isSel = characterBuffs.includes(buff.id);
                            return (
                              <div
                                key={buff.id}
                                onClick={() => {
                                  synth.click();
                                  if (isSel) {
                                    setCharacterBuffs(prev => prev.filter(x => x !== buff.id));
                                  } else {
                                    if (characterBuffs.length >= 2) {
                                      setCharacterBuffs(prev => [prev[1], buff.id]);
                                    } else {
                                      setCharacterBuffs(prev => [...prev, buff.id]);
                                    }
                                  }
                                }}
                                className={`p-3 rounded-xl border flex gap-3 items-start cursor-pointer transition-all select-none ${
                                  isSel
                                  ? 'bg-amber-50/30 border-amber-500 hover:border-amber-600 shadow-xxs'
                                  : 'bg-white border-stone-200/80 hover:border-stone-350 hover:bg-stone-50/40'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0 animate-fade-in">
                                  <input 
                                    type="checkbox" 
                                    checked={isSel}
                                    onChange={() => {}}
                                    className="accent-stone-900 w-3.5 h-3.5 rounded"
                                  />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-sans font-bold text-stone-850 text-xs text-left">
                                    {buff.name}
                                  </span>
                                  <span className="text-[9.5px] text-stone-500 leading-normal font-sans text-left">
                                    {buff.desc}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Negative Shackles (DEBUFF) */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> 命运严酷枷锁 (选择 2 或 4 项):
                        </span>
                        <div className="flex flex-col gap-2">
                          {DEBUFF_OPTIONS.map((db) => {
                            const isSel = characterDebuffs.includes(db.id);
                            return (
                              <div
                                key={db.id}
                                onClick={() => {
                                  synth.click();
                                  if (isSel) {
                                    setCharacterDebuffs(prev => prev.filter(x => x !== db.id));
                                  } else {
                                    if (characterDebuffs.length >= 4) {
                                      setCharacterDebuffs(prev => [...prev.slice(1), db.id]);
                                    } else {
                                      setCharacterDebuffs(prev => [...prev, db.id]);
                                    }
                                  }
                                }}
                                className={`p-3 rounded-xl border flex gap-3 items-start cursor-pointer transition-all select-none ${
                                  isSel
                                  ? 'bg-rose-50/20 border-rose-450 hover:border-rose-550 shadow-xxs'
                                  : 'bg-white border-stone-200/80 hover:border-stone-350 hover:bg-stone-50/40'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  <input 
                                    type="checkbox" 
                                    checked={isSel}
                                    onChange={() => {}} // handled by div click
                                    className="accent-stone-900 rounded-md w-3.5 h-3.5"
                                  />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-sans font-bold text-stone-850 text-xs text-left">
                                    {db.name}
                                  </span>
                                  <span className="text-[9.5px] text-stone-500 leading-normal font-sans text-left">
                                    {db.desc}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Game launch button */}
                {(() => {
                  const isCustom = selectedOriginId === 'origin_custom';
                  const isValid = !isCustom || 
                    (characterBuffs.length === 1 && characterDebuffs.length === 2) || 
                    (characterBuffs.length === 2 && characterDebuffs.length === 4);
                  return (
                    <div className="flex flex-col gap-3 pt-4 border-t border-stone-100 items-center justify-between sm:flex-row">
                      <span className="text-[10px] text-stone-450 font-medium leading-relaxed font-sans max-w-sm text-left">
                        点击下方按钮后，命运之盘将根据所选背景与特性生成独一无二的高三起点属性值，并自动封存。祝你在高考复原路上一往无前！
                      </span>
                      <button
                        type="button"
                        onClick={isValid ? handleLaunchCustomCharacter : undefined}
                        disabled={!isValid}
                        className={`inline-flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-xs ${
                          isValid
                          ? 'bg-stone-950 hover:bg-zinc-900 text-white cursor-pointer active:scale-98'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed border-dashed border border-stone-200/60'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        <span>{isCustom && !isValid ? '配比均势失衡 · 无法开启' : '重塑命运 · 步入高三'}</span>
                      </button>
                    </div>
                  );
                })()}

              </div>
            </motion.div>
          )}

          {/* STAGE 3: RUNNING GAMEPLAY LOOP */}
          {gameState.gameStage === 'gameplay' && (
            <motion.div
              key="gameplay-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8 relative"
            >
              {/* STRESS BLURRING ANXIETY VIGNETTE OVERLAY */}
              {isCurrentlyAnxious && (
                <div className="fixed inset-0 pointer-events-none z-50 pointer-events-none transition-all duration-1000 shadow-[inset_0_0_120px_rgba(239,68,68,0.22)] select-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none"></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-950 text-red-300 font-mono text-[10px] px-3 py-1.5 rounded-full border border-red-850 shadow-lg tracking-wider font-extrabold uppercase animate-pulse flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>视野开始黑暗模糊。你感到了剧烈的窒息与胸腔胀痛...</span>
                  </div>
                </div>
              )}

              {/* Header stats dashboard block with dynamic styling */}
              <div className={`transition-all duration-500 rounded-2xl ${isCurrentlyAnxious ? 'filter blur-[0.8px] bg-stone-900 border border-stone-800' : ''}`}>
                <StatsDisplay stats={gameState.stats} />
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-start transition-all duration-500 ${isCurrentlyAnxious ? 'filter blur-[1px]' : ''}`}>
                
                {/* LEFT: Game narrative action progression */}
                <div id="narrative-action-card" className={`lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 self-stretch flex flex-col justify-between transition-colors ${
                  isCurrentlyAnxious ? 'bg-stone-950 border-stone-850' : ''
                }`}>
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-10s pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-stone-605" />
                        <h3 className="font-sans font-bold text-stone-800 text-lg">
                          第 <span className="text-xl font-mono text-stone-900 font-extrabold">{gameState.currentWeek}</span> / 12 周
                        </h3>
                      </div>
                      <span className="text-xs bg-stone-50 border border-stone-200 text-stone-500 font-sans px-3 py-1 rounded-full uppercase font-semibold">
                        距正式决战高考还有约 <span className="font-mono font-extrabold text-stone-800">{(13 - gameState.currentWeek) * 8}</span> 天
                      </span>
                    </div>

                    {/* EVENT TRIGGERS BLOCK */}
                    {gameState.activeEvent ? (
                      <div id="story-event-block" className={`p-5 rounded-xl border relative overflow-hidden animate-fadeIn ${
                        isCurrentlyAnxious ? 'bg-stone-900 border-red-900/30' : 'bg-stone-50/50 border-stone-200'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono tracking-widest font-extrabold text-stone-400 bg-stone-200/50 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> DIARY INCIDENT
                          </span>
                          <span className="text-[11px] font-sans text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100 flex items-center gap-1 font-semibold">
                            <BookBookmarkedIcon className="w-3.5 h-3.5" /> 纸笔命运抉择
                          </span>
                        </div>

                        <h4 className="font-sans font-extrabold text-stone-900 text-lg tracking-tight mb-3">
                          ⚡ {gameState.activeEvent.title}
                        </h4>
                        
                        <p className="text-xs text-stone-600 leading-relaxed mb-6 whitespace-pre-line border-l-2 pl-3 border-stone-300 font-sans">
                          {gameState.activeEvent.description}
                        </p>

                        <div className="flex flex-col gap-3">
                          {gameState.activeEvent.choices.map((choice, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectEventChoice(idx)}
                              className="w-full flex justify-between items-start text-left p-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-800 transition-all cursor-pointer group shadow-xs"
                            >
                              <div className="flex-1 pr-4">
                                <span className="text-xs font-sans font-bold text-stone-800 group-hover:text-stone-950 transition-colors">
                                  {idx + 1}. {choice.text}
                                </span>
                              </div>
                              <span className="text-[9.5px] font-mono shrink-0 px-2 py-0.5 bg-stone-100 text-stone-505 group-hover:text-stone-700/90 rounded uppercase border border-stone-200/30 font-semibold tracking-wider self-center">
                                {choice.effectSummary}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // CHOOSE ROTIVAL COMPASS复习重心
                      <div id="study-focus-selection-block" className="animate-fadeIn">
                        {/* Weekly weekend transition news (Flashback + Sudden Incident) */}
                        <div className="flex flex-col gap-4 mb-6">
                          {gameState.weeklyFlashback && (
                            <div className={`p-5 rounded-2xl border ${
                              gameState.weeklyFlashback.isPositive 
                                ? 'bg-gradient-to-br from-indigo-50/70 to-blue-50/45 border-indigo-200/90 text-indigo-950' 
                                : 'bg-gradient-to-br from-stone-900 to-rose-950/40 border-stone-850 text-stone-200'
                            } shadow-sm relative overflow-hidden animate-fadeIn`}>
                              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
                              <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-mono tracking-widest font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1.5 border ${
                                  gameState.weeklyFlashback.isPositive 
                                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200/55' 
                                    : 'bg-stone-850 text-stone-300 border-stone-750'
                                }`}>
                                  <Compass className="w-3.5 h-3.5 animate-spin-slow" /> TIME RECALL 时光回溯
                                </span>
                                <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded ${
                                  gameState.weeklyFlashback.isPositive 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' 
                                    : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                }`}>
                                  {gameState.weeklyFlashback.isPositive ? '✨ 灵魂自省：感动' : '🌋 心灵创伤：悉忧'}
                                </span>
                              </div>
                              <h5 className="font-sans font-extrabold text-sm tracking-tight mb-2 flex items-center gap-1.5 opacity-90">
                                🌀 梁儿子，在深夜寂静里的【时光闪回】
                              </h5>
                              <p className="text-xs leading-relaxed opacity-90 whitespace-pre-line font-sans pl-3 border-l-2 border-indigo-300/45">
                                {gameState.weeklyFlashback.text}
                              </p>
                            </div>
                          )}

                          {gameState.weeklySuddenEvent && (
                            <div className={`p-5 rounded-2xl border ${
                              gameState.weeklySuddenEvent.isPositive 
                                ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950' 
                                : 'bg-rose-50/50 border-rose-200/80 text-rose-950'
                            } shadow-sm relative overflow-hidden animate-fadeIn`}>
                              <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-mono tracking-widest font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1.5 border ${
                                  gameState.weeklySuddenEvent.isPositive 
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200/55' 
                                    : 'bg-rose-100 text-rose-800 border-rose-200/55'
                                }`}>
                                  <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> WEEKEND INCIDENT 周末事件
                                </span>
                                <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded ${
                                  gameState.weeklySuddenEvent.isPositive 
                                    ? 'bg-emerald-100/80 text-emerald-800' 
                                    : 'bg-rose-100/80 text-rose-800'
                                }`}>
                                  {gameState.weeklySuddenEvent.isPositive ? '🍀 机缘际遇：有幸' : '💥 现实阻尼：遭遇'}
                                </span>
                              </div>
                              <h5 className="font-sans font-extrabold text-sm tracking-tight mb-2 flex items-center gap-1.5 opacity-90">
                                ⚡ 高三周末生活风波通知
                              </h5>
                              <p className="text-xs leading-relaxed opacity-90 whitespace-pre-line font-sans pl-3 border-l-2 border-amber-300/45">
                                {gameState.weeklySuddenEvent.text}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="bg-amber-50/45 border border-amber-200/70 rounded-xl p-4 mb-6 flex gap-3 text-xs leading-relaxed text-amber-900 shadow-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                          <p className="font-sans">
                            新的一周复健开启！请在下方选择你本周全力以赴的<b>「攻守复习重心（支持多选）」</b>。
                            科学地分配健康，自尊自傲与睡眠质量会在每阶段发挥正负 metabolic 影响。多选将带来精力消耗加倍的 multitasking 超载惩罚！
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Chinese Study Option */}
                          <button
                            onClick={() => handleSelectStudyStrategy('CHN')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer border-2 ${
                              weeklyFocusSelections.includes('CHN')
                              ? 'bg-emerald-50/10 border-emerald-500 ring-1 ring-emerald-500/20'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-bold text-xs text-stone-800 uppercase tracking-wider">
                              <BookOpen className="w-4 h-4 text-emerald-600" />
                              恶补高考大语文
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono leading-normal">
                              精力-12 | 睡眠质量-8 | 压力+4 | 语文大涨其内 (视身心微调)
                            </span>
                          </button>

                          {/* Math Study Option */}
                          <button
                            onClick={() => handleSelectStudyStrategy('MATH')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer border-2 ${
                              weeklyFocusSelections.includes('MATH')
                              ? 'bg-sky-50/10 border-sky-500 ring-1 ring-sky-500/20'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-bold text-xs text-stone-800 uppercase tracking-wider">
                              <Calculator className="w-4 h-4 text-sky-600" />
                              攻坚数学立体解析大题
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono leading-normal">
                              精力-18 | 睡眠质量-10 | 自豪感+4 | 数学爆满突击
                            </span>
                          </button>

                          {/* English Study Option */}
                          <button
                            onClick={() => handleSelectStudyStrategy('ENG')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer border-2 ${
                              weeklyFocusSelections.includes('ENG')
                              ? 'bg-amber-50/10 border-amber-500 ring-1 ring-amber-500/20'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-bold text-xs text-stone-800 uppercase tracking-wider">
                              <BookMarked className="w-4 h-4 text-amber-600" />
                              高频英语核心词汇
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono leading-normal">
                              精力-10 | 睡眠质量+6 | 压力+4 | 英语分常态大步流星
                            </span>
                          </button>

                          {/* Science Study Option */}
                          <button
                            onClick={() => handleSelectStudyStrategy('SCI')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer border-2 ${
                              weeklyFocusSelections.includes('SCI')
                              ? 'bg-indigo-50/10 border-indigo-505 border-indigo-505 border-indigo-500 ring-1 ring-indigo-505/20 ring-1 ring-indigo-500/20'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-bold text-xs text-stone-800 uppercase tracking-wider">
                              <Award className="w-4 h-4 text-indigo-600" />
                              突击高考理综大综合
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono leading-normal">
                              精力-22 | 睡眠质量-12 | 韧性+2 | 物理生化大飞跃
                            </span>
                          </button>

                          {/* Physical Fitness Option 1: Jogging */}
                          <button
                            onClick={() => handleSelectStudyStrategy('PE_TRAIN')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer border-2 ${
                              weeklyFocusSelections.includes('PE_TRAIN')
                              ? 'bg-emerald-50/10 border-emerald-500 ring-1 ring-emerald-500/20'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-bold text-xs text-stone-800 uppercase tracking-wider">
                              <ActivityIcon className="w-4 h-4 text-emerald-600 animate-pulse" />
                              操场有氧夜跑与心肺拉伸 (解压调频)
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono leading-normal">
                              精力-20 | 压力大退-16 | 睡眠+16 | 韧性+6 | 身体素质+12
                            </span>
                          </button>

                          {/* Physical Fitness Option 2: Strength training */}
                          <button
                            onClick={() => handleSelectStudyStrategy('GYM_TRAIN')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer border-2 ${
                              weeklyFocusSelections.includes('GYM_TRAIN')
                              ? 'bg-emerald-50/10 border-emerald-500 ring-1 ring-emerald-500/20'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-bold text-xs text-stone-800 uppercase tracking-wider">
                              <Flame className="w-4 h-4 text-emerald-600 animate-bounce" />
                              核心肌肉力量与阻力器械 (增强体能)
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono leading-normal">
                              精力-24 | 压力-10 | 睡眠+10 | 韧性+8 | 身体素质+16
                            </span>
                          </button>

                          {/* Code machine computer lab relaxation */}
                          <button
                            onClick={() => handleSelectStudyStrategy('CODE')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer border-2 ${
                              weeklyFocusSelections.includes('CODE')
                              ? 'bg-sky-50/10 border-sky-500 ring-1 ring-sky-500/20'
                              : 'bg-sky-50/30 border-sky-100 hover:border-sky-500'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-bold text-xs text-sky-900 uppercase tracking-wider">
                              <Terminal className="w-4 h-4 text-sky-600 animate-pulse" />
                              微机课潜入机房敲代码
                            </span>
                            <span className="text-[10px] text-sky-700 font-mono leading-normal">
                              压力消退-25 | 精力恢复+15 | 自豪感暴涨+15 | 睡眠质量-10
                            </span>
                          </button>

                          {/* Entire rest and relax */}
                          <button
                            onClick={() => handleSelectStudyStrategy('REST')}
                            className={`p-4 rounded-xl text-left hover:shadow-xs transition-all flex flex-col gap-1.5 cursor-pointer sm:col-span-2 text-center items-center justify-center py-5 border-2 ${
                              weeklyFocusSelections.includes('REST')
                              ? 'bg-emerald-50/10 border-emerald-500 ring-1 ring-emerald-500/20'
                              : 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-500'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-extrabold text-xs text-emerald-800 uppercase tracking-widest">
                              <Flame className="w-4 h-4 text-emerald-600" />
                              合上纸笔彻底安歇 (深度洗漱休眠)
                            </span>
                            <span className="text-[10px] text-emerald-600 font-mono mt-1 block leading-normal">
                              精力大涨+30 | 压力大退-20 | 睡眠质量+25 | 辅助巩固语文+2
                            </span>
                          </button>
                        </div>

                        {/* EXECUTING CONTROLLER BAR */}
                        <div className="mt-6 pt-5 border-t border-stone-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <span className="text-[11px] font-sans text-stone-500 leading-normal max-w-md">
                            {weeklyFocusSelections.length > 0
                              ? `当前已计划: [ ${weeklyFocusSelections.map(s => {
                                  if (s === 'CHN') return '补语文';
                                  if (s === 'MATH') return '写数学';
                                  if (s === 'ENG') return '背英语';
                                  if (s === 'SCI') return '卷理综';
                                  if (s === 'PE_TRAIN') return '有氧夜跑';
                                  if (s === 'GYM_TRAIN') return '重核健身';
                                  if (s === 'CODE') return '机房代码';
                                  return '深度安歇';
                                }).join(', ')} ]。多项复习并行时将激发精力加倍的大超载debuff！`
                              : '请至少点击上方任一板块以合理编排本周行动。'}
                          </span>
                          <button
                            onClick={() => handleExecuteWeeklyPlan(weeklyFocusSelections)}
                            disabled={weeklyFocusSelections.length === 0}
                            className={`px-8 py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-xs ${
                              weeklyFocusSelections.length > 0
                              ? 'bg-stone-900 hover:bg-stone-950 text-white cursor-pointer hover:shadow-md scale-100 active:scale-95'
                              : 'bg-stone-50 text-stone-400 border border-dashed border-stone-200 cursor-not-allowed'
                            }`}
                          >
                            确认并推进本周计划
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* High School Core Logs & Typewriters area */}
                  <div className="mt-8 pt-6 border-t border-stone-200">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 flex items-center gap-1 mb-2">
                      <Terminal className="w-3.5 h-3.5" /> High School Core Memory Logs
                    </span>
                    <div className="w-full bg-stone-900 border border-stone-850 text-stone-300 font-mono text-[11px] p-4 rounded-xl max-h-36 overflow-y-auto leading-relaxed flex flex-col gap-2">
                      {gameState.historyLogs.map((log, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="text-stone-500 shrink-0">[{gameState.historyLogs.length - index}]</span>
                          <span className={index === 0 ? 'text-stone-100 font-bold' : 'text-stone-450 text-stone-400'}>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: CANTEEN & SAVE MANAGER LISTINGS */}
                <div className="flex flex-col gap-6">
                  
                  {/* SCHOOL STORE / CANTEEN COMPONENT */}
                  <div id="canteen-store" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 relative">
                    <h3 className="font-sans font-bold text-stone-900 text-base uppercase tracking-tight flex items-center gap-1.5 mb-2">
                      <ShoppingBag className="w-4 h-4 text-stone-800" />
                      常春藤中学 · 小卖部处
                    </h3>
                    <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                      父母每周定时批红拨给的碎银。可用其向收银阿姨兑换提神减压药品道具。
                    </p>

                    <div className="flex flex-col gap-3">
                      {CANTEEN_ITEMS.map((item) => {
                        const canAfford = gameState.stats.funds >= item.cost;
                        return (
                          <div 
                            key={item.id}
                            className={`p-3 rounded-xl border flex flex-col gap-1.5 transition-all ${
                              canAfford 
                              ? 'bg-stone-50/40 border-stone-200 hover:border-stone-450' 
                              : 'border-dashed border-stone-100 bg-stone-50/10 opacity-60'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-sans font-bold text-xs text-stone-800">
                                {item.name}
                              </span>
                              <span className="font-mono text-xs font-black text-stone-700 bg-stone-100 px-2 py-0.5 rounded-lg">
                                ￥{item.cost}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-500 font-sans leading-relaxed">
                              {item.description}
                            </p>
                            <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-stone-200/40">
                              <span className="text-[9.5px] font-mono text-sky-700 font-bold uppercase">
                                效果: {item.effectSummary}
                              </span>
                              <button
                                onClick={() => handleBuyItem(item)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                                  canAfford 
                                  ? 'bg-stone-900 hover:bg-stone-950 text-white' 
                                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                }`}
                              >
                                购买
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACHIEVEMENT PANEL CARD */}
                  <div id="gameplay-achievements-panel" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col gap-3 relative transition-all duration-300">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                      <div className="text-left">
                        <h4 className="font-sans font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          考学历程记念墙 (Milestones)
                        </h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">高三奋斗留下的印记 · 达成极值解锁永久收藏</p>
                      </div>
                      <span className="font-mono text-[10px] font-extrabold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200/60 block shrink-0">
                        {gameState.unlockedAchievementIds.length} / {ACHIEVEMENTS.length}
                      </span>
                    </div>

                    {/* Larger grid for achievements */}
                    <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1 select-none">
                      {ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = gameState.unlockedAchievementIds.includes(ach.id);
                        const isCurrentHovered = hoveredAchievement?.id === ach.id;
                        return (
                          <div
                            key={ach.id}
                            onMouseEnter={() => setHoveredAchievement(ach)}
                            onMouseLeave={() => setHoveredAchievement(null)}
                            onClick={() => setHoveredAchievement(ach)}
                            className={`aspect-square rounded-xl flex items-center justify-center border relative transition-all duration-150 cursor-pointer ${
                              isUnlocked
                              ? isCurrentHovered
                                ? 'bg-amber-100/60 border-amber-400 shadow-sm text-amber-700 scale-105'
                                : 'bg-amber-50/40 border-amber-300 shadow-xxs text-amber-600 scale-100'
                              : isCurrentHovered
                                ? 'bg-stone-100 border-stone-300 text-stone-500 opacity-90 scale-105'
                                : 'bg-stone-50 border-stone-200/40 text-stone-300 opacity-55 hover:opacity-80'
                            }`}
                          >
                            <span className="text-[10px] translate-y-[1px]">
                              {/* Purely imported compliant icons */}
                              {ach.iconName === 'BookOpen' && <BookOpen className="w-4 h-4" />}
                              {ach.iconName === 'Calculator' && <Calculator className="w-4 h-4" />}
                              {ach.iconName === 'Award' && <Award className="w-4 h-4" />}
                              {ach.iconName === 'Dribbble' && <Dribbble className="w-4 h-4" />}
                              {ach.iconName === 'Brain' && <ShieldCheck className="w-4 h-4" />}
                              {ach.iconName === 'Moon' && <Moon className="w-4 h-4" />}
                              {ach.iconName === 'Coins' && <Coins className="w-4 h-4" />}
                              {ach.iconName === 'AlertTriangle' && <AlertTriangle className="w-4 h-4" />}
                              {ach.iconName === 'ShieldCheck' && <ShieldCheck className="w-4 h-4" />}
                              {ach.iconName === 'Terminal' && <Terminal className="w-4 h-4" />}
                              {ach.iconName === 'Sparkles' && <Sparkles className="w-4 h-4" />}
                              {ach.iconName === 'Code' && <Terminal className="w-4 h-4" />}
                              {ach.iconName === 'RefreshCw' && <RefreshCw className="w-4 h-4" />}
                              {ach.iconName === 'HeartCrack' && <HeartCrack className="w-4 h-4" />}
                              {ach.iconName === 'Flame' && <Flame className="w-4 h-4" />}
                              {ach.iconName === 'Atom' && <Atom className="w-4 h-4" />}
                              {ach.iconName === 'Compass' && <Compass className="w-4 h-4" />}
                              {ach.iconName === 'ShieldAlert' && <ShieldAlert className="w-4 h-4" />}
                              {ach.iconName === 'TrendingDown' && <TrendingDown className="w-4 h-4" />}
                              {ach.iconName === 'CheckSquare' && <CheckSquare className="w-4 h-4" />}
                              {ach.iconName === 'ShoppingBag' && <ShoppingBag className="w-4 h-4" />}
                              {ach.iconName === 'Zap' && <Zap className="w-4 h-4 font-black" />}
                              {ach.iconName === 'Dizzy' && <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />}
                              {ach.iconName === 'CornerUpRight' && <CornerUpRight className="w-4 h-4" />}
                            </span>

                            {/* Tiny lock badge if locked */}
                            {!isUnlocked && (
                              <span className="absolute top-0.5 right-0.5 text-[7px] text-stone-350 bg-stone-100 px-0.5 rounded-sm scale-75 font-mono">
                                🔒
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Dedicated explanation viewport - resolves clipping & improves legibility */}
                    <div className="mt-1 p-3.5 bg-stone-50 border border-stone-200/60 rounded-xl min-h-[96px] flex flex-col justify-center transition-all duration-200">
                      {hoveredAchievement ? (
                        <div className="animate-fade-in flex flex-col gap-1.5 text-left">
                          <div className="flex justify-between items-center">
                            <span className="font-sans font-extrabold text-stone-900 text-xs flex items-center gap-1">
                              <span className="text-amber-500 text-sm">🏆</span> 
                              {hoveredAchievement.title}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              gameState.unlockedAchievementIds.includes(hoveredAchievement.id)
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                              : 'bg-stone-200/50 text-stone-500 border border-stone-300/30'
                            }`}>
                              {gameState.unlockedAchievementIds.includes(hoveredAchievement.id) ? '已解锁' : '未达成'}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-stone-650 font-sans leading-relaxed">
                            {hoveredAchievement.description}
                          </p>
                          <div className="text-[9px] font-mono text-stone-450 mt-1.5 pt-1.5 border-t border-stone-200/40 flex items-center gap-1 select-none">
                            <Info className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>达成条件: <span className="font-semibold text-stone-600">{hoveredAchievement.conditionText}</span></span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-stone-400 text-[10px] font-sans flex flex-col items-center gap-1.5 py-2 select-none">
                          <Info className="w-4 h-4 text-stone-300 animate-pulse" />
                          <span>将鼠标悬停在上方纪念徽章上，或点击徽章查阅具体的解锁条件和深层宿命</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ArchivePanel 
                    currentState={gameState} 
                    onLoadState={handleLoadStateFromArchive} 
                    onResetGame={handleResetGame}
                  />

                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 4: EXAM CARD DRAWER */}
          {gameState.gameStage === 'exam_view' && gameState.examResult && (
            <motion.div
              key="exam-view-wrapper"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <ScoreReport 
                examName={gameState.examResult.examName} 
                scores={gameState.examResult.scores} 
                stats={gameState.stats}
                onContinue={handleCloseReport}
              />
            </motion.div>
          )}

          {/* STAGE 5: ENDING DISPLAY SCENARIOS */}
          {gameState.gameStage === 'ending' && gameState.chosenEndingId && (
            <>
              {/* FULL-SCREEN CINEMATIC NOVEL BACKDROP */}
              <div className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden select-none animate-fade-in transition-all">
                <img 
                  src={getEndingImage(gameState.chosenEndingId)} 
                  alt=""
                  className="w-full h-full object-cover brightness-[0.25] scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"></div>
              </div>

              <motion.div
                key="ending-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-2xl mx-auto my-12 relative z-10"
              >
                {(() => {
                  const ending = getEndingDetails(gameState.chosenEndingId!);
                  const isSuicide = gameState.chosenEndingId === 'ending_stress_breakdown';
                  if (isSuicide) {
                    return (
                      <div className="backdrop-blur-xl bg-black/85 border border-stone-900 rounded-3xl p-8 shadow-2xl relative text-center overflow-hidden my-6 min-h-[500px] flex flex-col justify-between text-stone-200">
                        {/* Fallen Butterfly Background */}
                        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none flex items-center justify-center">
                          <img 
                            src={fallenButterflyImg} 
                            alt="Fallen Butterfly"
                            className="w-full h-full object-cover scale-105 filter grayscale-[100%] contrast-125"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-8 leading-relaxed">
                          <span className="text-[10px] bg-red-950/80 text-rose-500 font-mono px-4 py-1.5 rounded-full uppercase tracking-widest border border-red-900/40 font-bold mb-6">
                            {ending.badge}
                          </span>

                          <h2 className="font-sans font-black text-rose-500 text-2xl mb-2 tracking-tight">
                            {ending.title}
                          </h2>

                          <div className="text-[10px] font-mono font-bold border border-stone-800 bg-stone-950/70 py-1.5 px-3 rounded-lg inline-block text-stone-400 mb-8 backdrop-blur-xs">
                            {ending.metrics}
                          </div>

                          {/* Monologue */}
                          <div className="text-stone-300 text-xs sm:text-sm leading-8 text-left bg-stone-950/80 border border-stone-900 p-6 sm:p-8 rounded-2xl max-w-lg mx-auto font-sans shadow-inner select-none tracking-wide whitespace-pre-line backdrop-blur-md bg-stone-950/60">
                            {`「编译器还是吐出了红字……最后一刻，常数Bug还是没有调出来。

风叶扇在耳畔狂乱地转，高三教室里的物理受力图重叠成了一道道冰冷的波线。
父母说没关系，老师说尽力就好。可谁又能读懂代码在脑内崩塌时的海啸？

周围的一切都在变虚，像是没有初始化就被析构垃圾回收的野指针。
我好像变成了一只坠落在泥里的蓝紫色蝴蝶。
不再颤动，不再挣扎，落在这幽暗的樟树根处。

键盘微弱的敲击声，在黑夜的潮水下慢慢沉寂。
也许……我只是想，好好地，在黑暗里睡去。」`}
                          </div>
                        </div>

                        <div className="relative z-10 flex flex-col gap-4 mt-6">
                          <button
                            onClick={handleResetGame}
                            className="w-full flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-sans text-xs font-bold uppercase rounded-xl py-4 shadow-xs hover:shadow-md transition-all cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4 text-rose-600 animate-spin" />
                            <span>再次寻找那一束穿破机房黑夜的Accepted天光</span>
                          </button>
                        </div>
                      </div>
                    );
                  }
                  const endingImage = getEndingImage(gameState.chosenEndingId!);
                  return (
                    <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl relative text-center overflow-hidden my-6 text-stone-900">
                      {/* Visual novel illustration */}
                      <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 border border-stone-300/40 relative shadow-inner">
                        <img 
                          src={endingImage} 
                          alt={ending.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>

                      <div className="absolute -right-12 -bottom-12 w-64 h-64 border-4 border-white/20 rounded-full flex items-center justify-center rotate-45 select-none pointer-events-none">
                        <GraduationCap className="w-32 h-32 text-stone-900/10" />
                      </div>

                      <div className="w-12 h-12 bg-white/90 border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm backdrop-blur-xs">
                        <GraduationCap className="w-6 h-6 text-stone-800" />
                      </div>

                      <span className="text-xs bg-stone-950 text-white font-mono px-4 py-1.5 rounded-full uppercase tracking-wider font-bold shadow-xs">
                        {ending.badge}
                      </span>

                      <h2 className="font-sans font-black text-stone-900 text-2xl mt-4 mb-2 tracking-tight">
                        {ending.title}
                      </h2>

                      <div className="text-[10px] font-mono font-bold text-stone-700 border border-stone-300 bg-white/60 py-1.5 px-3 rounded-lg inline-block mb-6 backdrop-blur-xs shadow-xxs">
                        {ending.metrics}
                      </div>

                      <p className="text-xs leading-relaxed text-stone-800 text-left bg-white/50 border border-white/30 backdrop-blur-sm p-6 rounded-2xl mb-8 font-sans shadow-xxs leading-normal">
                        {ending.description}
                      </p>

                      <div className="flex flex-col gap-4 relative z-10">
                        <button
                          onClick={handleResetGame}
                          className="w-full flex items-center justify-center gap-1.5 bg-stone-950 hover:bg-zinc-900 text-white font-sans text-xs font-bold uppercase rounded-xl py-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>重新开始属于你的高三拼搏逆旅</span>
                        </button>

                        <div className="w-full text-left pt-4 border-t border-stone-300/40">
                          <p className="text-[10px] text-stone-500 text-center uppercase tracking-widest mb-3 font-mono font-semibold">从历史遗留的时光槽位再次跃进分支：</p>
                          <ArchivePanel 
                            currentState={gameState} 
                            onLoadState={handleLoadStateFromArchive} 
                            onResetGame={handleResetGame}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </>
          )}

        </AnimatePresence>
      </main>

      {/* Tasteful global footer with Copyright and thematic disclaimer */}
      <footer className={`max-w-6xl mx-auto mt-12 pt-8 border-t transition-all duration-1000 ${
        isCurrentlyAnxious 
          ? 'border-stone-850 text-stone-500' 
          : 'border-stone-200 text-stone-400'
      }`}>
        <div className="bg-stone-50/50 rounded-2xl border border-stone-200/60 p-5 text-left font-sans text-[11px] leading-relaxed text-stone-500 shadow-xxs">
          <p className="font-bold text-stone-700 text-xs mb-2">
            版权声明：版权所有 © [2026] [LEOOOOOOOOO]
          </p>
          <p className="whitespace-pre-line text-[10px] opacity-90">
            本作品仅开放非商业性二次改编、修改与衍生创作权限，禁止一切商业使用，所有改编行为严禁制作、修改出非法、违规、低俗、不友善及歪曲篡改原作的不良内容；任何二次改编必须通过邮箱的方式知会原作者，并在原作GitHub仓库新建改编报备Issue完成报备，报备后不需原作者明确同意即可进行创作；所有衍生作品需在醒目位置永久标注原作者及原作GitHub链接，不得隐匿、删减出处；所有二次改编行为及衍生作品产生的全部内容、风险与纠纷责任均由改编者自行承担，原作者不承担任何连带责任。
          </p>
        </div>
      </footer>

      {/* Elegant Version Changelog Modal */}
      <AnimatePresence>
        {changelogOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative text-stone-900"
            >
              <button 
                onClick={() => {
                  synth.click();
                  setChangelogOpen(false);
                }}
                className="absolute top-4 right-4 w-7 h-7 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors text-xs font-bold cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
                <BookMarked className="w-5 h-5 text-amber-600" />
                <h3 className="font-sans font-black text-lg text-stone-900 tracking-tight">命运重连·高考复原更新日志</h3>
              </div>

              <div className="flex flex-col gap-6 font-sans">
                {/* Version 1.3.0 */}
                <div className="border-l-2 border-emerald-500 pl-4 py-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-emerald-700">v1.3.0 (当前版本)</span>
                    <span className="text-[10px] text-stone-400 font-mono">2026-06</span>
                  </div>
                  <h4 className="font-sans font-bold text-xs mt-1 text-stone-800">身体素质重构与双向健体更新</h4>
                  <ul className="list-disc list-inside text-[11px] text-stone-600 mt-2 space-y-1.5 leading-relaxed">
                    <li><b>身体素质解耦</b>：将“体育”学科完全重命名为“身体素质”，满分上线扩容至 <b>100</b> 点，且不计入高考投档文化课总分。</li>
                    <li><b>底层心肺代谢</b>：身体素质将作为精力与心理压力抗性的生命引擎，高分能显著减轻每周学习的精力损耗和自卑焦虑，反之孱弱将带来高额的周度代谢疲竭。</li>
                    <li><b>全新精细体力行为</b>：在规划轮盘中加入双路径选择——“操场有氧夜跑 (解压调频)”以及“肌肉力量阻力 (增强体质底盘)”。</li>
                    <li><b>法定版权协议更替</b>：在尾部完整引入了原作者 <b>LEOOOOOOOOO</b> 指定的限制性非商业改编许可权声明。</li>
                  </ul>
                </div>

                {/* Version 1.2.0 */}
                <div className="border-l-2 border-stone-300 pl-4 py-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-stone-700">v1.2.0</span>
                    <span className="text-[10px] text-stone-400 font-mono">2026-05</span>
                  </div>
                  <h4 className="font-sans font-bold text-xs mt-1 text-stone-800">身心机能状态总览系统</h4>
                  <ul className="list-disc list-inside text-[11px] text-stone-600 mt-2 space-y-1.5 leading-relaxed">
                    <li><b>身心预测仪表盘</b>：主屏整合“高三身心状态引擎”以及“全省投档排名”估值计算组件。</li>
                    <li><b>8-bit 网页声效果</b>：添加轻型逆向非侵入声学 chip，提供复古 8-bit 操作音效。</li>
                    <li><b>自动时光归档</b>：新增手自动时光双写，支持回溯往日重连命运。</li>
                  </ul>
                </div>

                {/* Version 1.1.0 */}
                <div className="border-l-2 border-stone-300 pl-4 py-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-stone-700">v1.1.0</span>
                    <span className="text-[10px] text-stone-400 font-mono">2026-04</span>
                  </div>
                  <h4 className="font-sans font-bold text-xs mt-1 text-stone-800">自定义极境命格体系</h4>
                  <ul className="list-disc list-inside text-[11px] text-stone-600 mt-2 space-y-1.5 leading-relaxed">
                    <li><b>多点命格枷锁</b>：玩家可定制正负双向基因，搭载“算法傲执”或负载“创伤余悲”。</li>
                    <li><b>突发周多线剧情</b>：引入数十种概率闪回、悲伤自省以及高考成绩出炉会诊。</li>
                  </ul>
                </div>

                {/* Version 1.0.0 */}
                <div className="border-l-2 border-stone-300 pl-4 py-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-stone-700">v1.0.0</span>
                    <span className="text-[10px] text-stone-400 font-mono">2026-03</span>
                  </div>
                  <h4 className="font-sans font-bold text-xs mt-1 text-stone-800">系统首发正式版</h4>
                  <ul className="list-disc list-inside text-[11px] text-stone-600 mt-2 space-y-1.5 leading-relaxed">
                    <li><b>基本复健机制</b>：退役信奥生核心语数英理综沙盘演变发布。</li>
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => {
                  synth.click();
                  setChangelogOpen(false);
                }}
                className="w-full mt-6 bg-stone-900 hover:bg-stone-950 text-white font-sans text-xs font-bold uppercase rounded-xl py-3 border border-stone-800 transition-all cursor-pointer"
              >
                收起日志
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BookBookmarkedIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
    </svg>
  );
}
