export interface SubjectScores {
  chinese: number; // 语文 (0-150)
  math: number;    // 数学 (0-150)
  english: number; // 英语 (0-150)
  science: number; // 理综 (0-300)
  pe: number;      // 身体素质 (0-100)
}

export interface PlayerStats {
  scores: SubjectScores;
  stamina: number;        // 精力 (0-100)
  stress: number;         // 心理压力 (0-100)
  funds: number;          // 金钱 (如父母给的零花钱/复习基金)
  pride: number;          // 自豪感 (可负, -100 to 100)
  resilience: number;     // 心理韧性 (0-100)
  sleepQuality: number;   // 睡眠质量 (0-100)
  rebellion: number;      // 叛逆值 (0-100, 用于开启勒令退学等线索)
}

export interface GameState {
  playerName: string;     // 主人公姓名 (默认"良")
  difficulty: 'easy' | 'normal' | 'hard'; // 游戏难度
  selectedBuffId: string | null;          // 选择的Buff
  selectedBuffIds: string[];              // 选择的多个Buff（更丰富定制）
  selectedDebuffIds: string[];            // 选择的Debuffs
  unlockedAchievementIds: string[];       // 已解锁成就ID
  weeklySuddenEvent: SuddenEvent | null;  // 本周发生的突发突变事件 (无选项)
  weeklyFlashback: MemoryFlashback | null;// 本周发生的记忆闪回
  weeklyFlashbackChoiceResolved?: boolean | null; // 本周记忆闪回选项是否已被决策
  weeklyFlashbackChosenOptionIdx?: number | null; // 本周选择的记忆闪回选项索引
  currentWeek: number;    // 当前周数 (1-12，第12周为高考)
  stats: PlayerStats;
  historyLogs: string[];  // 历史遭遇与选择日志
  selectedFocus: string[] | null; // 本周复习重心 (支持多选)
  encounteredEventIds: string[]; // 避免事件重复出现
  examResult: {
    examName: string;
    scores: SubjectScores;
    totalScore: number;
    rank: number;
    evaluation: string;
  } | null;               // 最近一次考试结果
  gameStage: 'intro' | 'character_init' | 'gameplay' | 'exam_view' | 'ending';
  activeEvent: GameEvent | null; // 当前触发的事件
  chosenEndingId: string | null;
  activeAchievementToast: string | null; // 成就弹出Toast
}

export interface SuddenEvent {
  id: string;
  text: string;
  isPositive: boolean;
  deltas: {
    chinese?: number;
    math?: number;
    english?: number;
    science?: number;
    pe?: number;
    stamina?: number;
    stress?: number;
    funds?: number;
    pride?: number;
    resilience?: number;
    sleepQuality?: number;
  };
}

export interface FlashbackChoice {
  text: string;
  effectText: string;
  deltas: {
    chinese?: number;
    math?: number;
    english?: number;
    science?: number;
    pe?: number;
    stamina?: number;
    stress?: number;
    funds?: number;
    pride?: number;
    resilience?: number;
    sleepQuality?: number;
    rebellion?: number;
  };
}

export interface MemoryFlashback {
  id: string;
  text: string;
  isPositive: boolean;
  deltas: {
    chinese?: number;
    math?: number;
    english?: number;
    science?: number;
    pe?: number;
    stamina?: number;
    stress?: number;
    funds?: number;
    pride?: number;
    resilience?: number;
    sleepQuality?: number;
    rebellion?: number;
  };
  choices?: FlashbackChoice[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  conditionText: string;
  category: 'score' | 'attribute' | 'event' | 'ending' | 'special';
  iconName: string; // Dynamic icon rendering name
}

export interface SaveSlot {
  id: string;
  timestamp: string;
  week: number;
  stats: PlayerStats;
  summary: string;
  state: GameState;
}

export interface Choice {
  text: string;
  effectSummary: string; // 显示的选择后果预览
  deltas: {
    chinese?: number;
    math?: number;
    english?: number;
    science?: number;
    pe?: number;
    stamina?: number;
    stress?: number;
    funds?: number;
    pride?: number;
    resilience?: number;
    sleepQuality?: number;
  };
  logText: string; // 回应日志
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  weekTrigger?: number; // 特定周触发，否则为随机
  imageType?: 'programming' | 'math' | 'stress' | 'english' | 'chinese' | 'science' | 'pe' | 'general';
  choices: Choice[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effectSummary: string;
  deltas: {
    stamina?: number;
    stress?: number;
    pride?: number;
    resilience?: number;
    sleepQuality?: number;
  };
}
