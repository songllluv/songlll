import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // 1-6 Score Category
  {
    id: 'ach_score_1',
    title: '语文大文豪',
    description: '高考预测语文成绩达到 135 分以上。',
    conditionText: '语文分数 >= 135分',
    category: 'score',
    iconName: 'BookOpen'
  },
  {
    id: 'ach_score_2',
    title: '数神附体',
    description: '高考预测数学成绩达到 140 分以上。',
    conditionText: '数学分数 >= 140分',
    category: 'score',
    iconName: 'Calculator'
  },
  {
    id: 'ach_score_3',
    title: '全科制霸',
    description: '高考模考文化课预测总分突破 680 分。',
    conditionText: '文化课总预测分数 >= 680分',
    category: 'score',
    iconName: 'Award'
  },
  {
    id: 'ach_score_pe',
    title: '操场长跑怪杰',
    description: '体育预测成绩达到 45 分及以上。',
    conditionText: '体育分数 >= 45分',
    category: 'special',
    iconName: 'Dribbble'
  },
  {
    id: 'ach_score_science',
    title: '理科省一之巅',
    description: '理科综合预测高考成绩突破 280 分以上。',
    conditionText: '理科综合分数 >= 280分',
    category: 'score',
    iconName: 'Atom'
  },
  {
    id: 'ach_score_english',
    title: '英伦风笛手',
    description: '高考预测英语成绩达到 140 分及以上。',
    conditionText: '英语分数 >= 140分',
    category: 'score',
    iconName: 'Compass'
  },

  // 7-12 Attribute Extrema (Rebellion, Pressure, Stamina, Pride, Iron Resilience)
  {
    id: 'ach_extreme_pride',
    title: '傲视全省队的轻狂',
    description: 'OI 自豪感与自负度攀升至 80 及以上。你几乎视高考题如草芥。',
    conditionText: 'OI自豪感 >= 80',
    category: 'attribute',
    iconName: 'Sparkles'
  },
  {
    id: 'ach_extremely_resilient',
    title: '不坏之重压金刚',
    description: '心理抗挫韧性达到 95 及以上。历经高考磨练而灵魂愈发牢不可破。',
    conditionText: '心理抗挫韧性 >= 95',
    category: 'attribute',
    iconName: 'ShieldAlert'
  },
  {
    id: 'ach_ultra_poor',
    title: '口袋空空的寒窗苦生',
    description: '身上家长拨付的零用钱余额降至 5 元或以下。',
    conditionText: '手头资金 <= 5 元',
    category: 'attribute',
    iconName: 'TrendingDown'
  },
  {
    id: 'ach_stress_max',
    title: '视野边缘的黑雾',
    description: '心理压力达到过 95% 及以上。你开始感到剧烈的胸闷和眩晕。',
    conditionText: '心理压力 >= 95%',
    category: 'attribute',
    iconName: 'Brain'
  },
  {
    id: 'ach_sleep_master',
    title: '梦境特级主宰',
    description: '睡眠质量恢复到 90% 及以上。精力极其充沛。',
    conditionText: '睡眠质量 >= 90%',
    category: 'attribute',
    iconName: 'Moon'
  },
  {
    id: 'ach_money_boss',
    title: '小卖部至尊大户',
    description: '随身资金储备超过 ￥150 元。阿姨见你都带笑。',
    conditionText: '零用资金 >= 150元',
    category: 'attribute',
    iconName: 'Coins'
  },

  // 13-18 Attributes Extended
  {
    id: 'ach_pride_deep',
    title: '自尊落入无底洞',
    description: '竞赛落榜带来的自毁倾向爆发，OI自豪感降到负分 -25 以下。',
    conditionText: '自豪感 <= -25',
    category: 'attribute',
    iconName: 'AlertTriangle'
  },
  {
    id: 'ach_will_iron',
    title: '钢铁之锚',
    description: '心理抗挫韧性达到 90% 及以上。任何打击也无法使你倾覆。',
    conditionText: '心理抗挫韧性 >= 90%',
    category: 'attribute',
    iconName: 'ShieldCheck'
  },
  {
    id: 'ach_rebel_high',
    title: '德育处红色警戒',
    description: '高三的条条框框根本无法束缚你，你的学校叛逆值达到 80 以上。',
    conditionText: '叛逆值 >= 80',
    category: 'attribute',
    iconName: 'Flame'
  },
  {
    id: 'ach_rebel_low',
    title: '温驯的做题流水线',
    description: '你像一台精准的齿轮，顺从学校的所有安排，叛逆值降至 5 以下。',
    conditionText: '叛逆值 <= 5',
    category: 'attribute',
    iconName: 'UserCheck'
  },
  {
    id: 'ach_rebel_zero',
    title: '绝对秩序拥护者',
    description: '内心绝对静谧，顺应所有规则，叛逆值保持为零。',
    conditionText: '叛逆值 === 0',
    category: 'attribute',
    iconName: 'Lock'
  },
  {
    id: 'ach_stamina_drain',
    title: '眼冒金星的幽灵',
    description: '复习拼命到极限，精力濒临衰竭，降至 5 以下。',
    conditionText: '精力 <= 5',
    category: 'attribute',
    iconName: 'BatteryLow'
  },

  // 19-24 Core Achievements
  {
    id: 'ach_all_subjects_balanced',
    title: '木桶无短板大师',
    description: '四门高考核心预测科目全部达到中上等水准。',
    conditionText: '语文115+ / 数学120+ / 英语115+ / 理综220+',
    category: 'special',
    iconName: 'CheckSquare'
  },
  {
    id: 'ach_diet_master',
    title: '常春藤小卖部饕餮客',
    description: '累计从小卖部购买减压提神食品或冲刺药物达到 5 次以上。',
    conditionText: '小卖部累计购买次数 >= 5',
    category: 'special',
    iconName: 'ShoppingBag'
  },
  {
    id: 'ach_first_flashback',
    title: '时光长河的轻低语',
    description: '在深夜睡梦中被触发了第一次属于初中或省选记忆的时光闪回。',
    conditionText: '触发过 1 次记忆闪回',
    category: 'special',
    iconName: 'Zap'
  },
  {
    id: 'ach_anxious_veteran',
    title: '在梦魇时光深处痛苦起舞',
    description: '本轮洗炼中累计经历并咬牙承受了 3 次及以上的时光闪回冲击。',
    conditionText: '本轮时光闪回次数 >= 3',
    category: 'special',
    iconName: 'AlertCircle'
  },
  {
    id: 'ach_hack_lab',
    title: '重连机房圣殿',
    description: '累计选择“潜入微机房重写C++代码”放松方式达到3次。',
    conditionText: '进入机房复习过3次以上',
    category: 'special',
    iconName: 'Terminal'
  },
  {
    id: 'ach_insomnia_heal',
    title: '梦魇过后的安宁熟睡',
    description: '背负严重失眠负面精神枷锁的情况下，强行恢复睡眠质量达到 85 以上。',
    conditionText: '背负失眠Debuff 且 睡眠质量 >= 85',
    category: 'special',
    iconName: 'Moon'
  },

  // 25-30 Endings Category
  {
    id: 'ach_end_tsinghua',
    title: '紫荆重开冠全省',
    description: '解锁【全省文化课冠冕：清北强基录用】顶级结局。',
    conditionText: '达成清北强基结局',
    category: 'ending',
    iconName: 'Sparkles'
  },
  {
    id: 'ach_end_211_elite',
    title: '重返一本象牙之巅',
    description: '解锁【老牌重本：211精英强省院校录用】结局。',
    conditionText: '达成省属211录科结局',
    category: 'ending',
    iconName: 'CornerUpRight'
  },
  {
    id: 'ach_end_985_ship',
    title: '乘风破浪重度名校',
    description: '解锁【双一流高校：至高985学府破浪启航】结局。',
    conditionText: '达成全国985录取结局',
    category: 'ending',
    iconName: 'Compass'
  },
  {
    id: 'ach_end_hacker',
    title: '车库极客归隐处',
    description: '解锁【车库极客：自由开源黑客】极具个性色彩结局。',
    conditionText: '达成车库开源黑客结局',
    category: 'ending',
    iconName: 'Code'
  },
  {
    id: 'ach_end_gap',
    title: '复读烈火重炼',
    description: '解锁【高四重来：背水复读生】不屈结局。',
    conditionText: '达成复读生结局',
    category: 'ending',
    iconName: 'RefreshCw'
  },
  {
    id: 'ach_end_suicide',
    title: '折落泥泞的蝶',
    description: '由于压力彻底暴死击穿，进入了隐秘黑屏、蝶折尘土的自毁余音。',
    conditionText: '达成隐秘压力自毁结局',
    category: 'ending',
    iconName: 'HeartCrack'
  },

  // 31-35 New Endings & Custom Stats
  {
    id: 'ach_end_expelled',
    title: '被格式化的高三记忆',
    description: '因叛逆值溢出底线，解锁【校德育处无情析构：勒令退学】处分。',
    conditionText: '达成被退学结局',
    category: 'ending',
    iconName: 'Activity'
  },
  {
    id: 'ach_end_abroad',
    title: '飞越大洋的秋叶学子',
    description: '利用雄厚的手头资金及卓越的英伦言语通过，解锁【外洋CS半奖录取】结局。',
    conditionText: '达成出国留学结局',
    category: 'ending',
    iconName: 'Globe'
  },
  {
    id: 'ach_stamina_beast',
    title: '活力澎湃的永动机',
    description: '精力拉满达到 100，完全没有任何高三生的困顿之感。',
    conditionText: '精力 == 100',
    category: 'attribute',
    iconName: 'Zap'
  },
  {
    id: 'ach_money_beggar',
    title: '身无分文的修道者',
    description: '随身资金精确扣减为 0，连一包咸菜也买不起。',
    conditionText: '零散生活金 == 0',
    category: 'attribute',
    iconName: 'TrendingDown'
  },
  {
    id: 'ach_resilience_glass',
    title: '玻璃般易碎的退役魂',
    description: '在一连串的高压打击后，你的心理韧性暴跌至 12 以下，处于极度易碎状态。',
    conditionText: '心理韧性 <= 12',
    category: 'attribute',
    iconName: 'HeartCrack'
  },

  // 36-42 Special Achievements
  {
    id: 'ach_pe_champion',
    title: '风雨中不跑停下的狼',
    description: '体育模考成绩拿满，达到上限 50 分！高三生里的野马。',
    conditionText: '体育预测成绩 == 50分',
    category: 'special',
    iconName: 'Dribbble'
  },
  {
    id: 'ach_canteen_rich',
    title: '小卖部核心赞助伙伴',
    description: '本轮修仙中累计在小卖部下单买过 8 次及以上的提神物资。',
    conditionText: '小卖部购买次数 >= 8',
    category: 'special',
    iconName: 'ShoppingBag'
  },
  {
    id: 'ach_english_dyslexia',
    title: '失落在二十六字母迷宫',
    description: '英语成绩惨遭击穿，预测成绩降至 50 分以下。',
    conditionText: '英语分数 <= 50分',
    category: 'score',
    iconName: 'Compass'
  },
  {
    id: 'ach_oier_reunion',
    title: '重逢微机旧日的幽灵',
    description: '累计偷溜进微机房重刷代码放松或重写段表树大5次以上。',
    conditionText: '机房摸鱼次数 >= 5',
    category: 'special',
    iconName: 'Terminal'
  },
  {
    id: 'ach_rebel_revolt',
    title: '德育处主任的深情凝视',
    description: '因各种叛逆行为惊动校领导或触发过扣除大量点数的违规警告。',
    conditionText: '单次叛逆增加过大并受到警告',
    category: 'special',
    iconName: 'ShieldAlert'
  },
  {
    id: 'ach_stress_minimal',
    title: '心如止水极乐境',
    description: '完全解脱，心里压力降到 5% 以下。在倒计时的修罗场里静如止水。',
    conditionText: '心理压力 <= 5%',
    category: 'attribute',
    iconName: 'Sun'
  },
  {
    id: 'ach_no_purchase_run',
    title: '清廉贫寒的修行僧',
    description: '从头到尾一次也没造访小卖部买过咖啡或抗抑郁补品通过全通。',
    conditionText: '全程零在小卖部购买消费',
    category: 'special',
    iconName: 'Coins'
  },

  // 43-50 Mastery & Challenges
  {
    id: 'ach_pride_god',
    title: '不屑与高考为伍的傲',
    description: '你的自傲心彻底满溢至 95 以上。你眼里的题目已经失去了逻辑挑战。',
    conditionText: '自豪感 >= 95',
    category: 'attribute',
    iconName: 'Sparkles'
  },
  {
    id: 'ach_flashback_seeker',
    title: '深渊之语的反刍者',
    description: '时光闪回惊人累积达到 4 次以上，仿佛将高一省队的遗憾嚼烂碎。',
    conditionText: '累积记忆闪回 >= 4次',
    category: 'special',
    iconName: 'Zap'
  },
  {
    id: 'ach_silver_recovery',
    title: '省选折翼的涅槃',
    description: '选择“省选折翼者”开局底牌，成功逆风翻盘达成 985 或更高等学府结局。',
    conditionText: '【省选折翼】开局且高考录取 >= 985学府',
    category: 'special',
    iconName: 'CheckSquare'
  },
  {
    id: 'ach_easy_tourist',
    title: '阳光温室里的休假客',
    description: '在轻松难度下完成了一轮高考平稳过渡。',
    conditionText: '在【轻松过渡】难度下通关',
    category: 'special',
    iconName: 'Sun'
  },
  {
    id: 'ach_abroad_millionaire',
    title: '大富大贵的避风湾',
    description: '手头上的复习资金充裕到 240 元以上。',
    conditionText: '手头零散金 >= 240元',
    category: 'attribute',
    iconName: 'Coins'
  },
  {
    id: 'ach_resilience_unbreakable',
    title: '金刚琉璃防线',
    description: '心里抗挫韧性达到上限 100%！雷霆之势也不能动摇你灵魂分毫。',
    conditionText: '心理韧性 == 100%',
    category: 'attribute',
    iconName: 'ShieldCheck'
  },
  {
    id: 'ach_math_perfect',
    title: '纯粹高精度计算芯片',
    description: '数学预测成绩拿到令人窒息的 150 绝对满分成绩！',
    conditionText: '数学预测成绩 == 150分',
    category: 'score',
    iconName: 'Calculator'
  },
  {
    id: 'ach_difficulty_hard',
    title: '极暗绝境逆行者',
    description: '在困难难度（极暗绝境）下，成功通关并完成高考复健。',
    conditionText: '困难难度通关',
    category: 'special',
    iconName: 'Flame'
  }
];
