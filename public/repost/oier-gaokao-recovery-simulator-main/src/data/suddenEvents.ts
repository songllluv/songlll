import { SuddenEvent, MemoryFlashback } from '../types';

// 50 Positive Humorous Events
export const POSITIVE_SUDDEN_EVENTS: SuddenEvent[] = [
  {
    id: 'pos_sudden_1',
    text: '因为你在课桌下用手把一个卡死的圆珠笔笔头“除Bug”，刚好班主任悄悄探头，被你指尖转笔的高速常数吓到了，以为你脑速过载，塞给你一盒高档薄荷糖。',
    isPositive: true,
    deltas: { stamina: 12, stress: -5, pride: 5 }
  },
  {
    id: 'pos_sudden_2',
    text: '食堂大妈今天手不抖了。不仅如此，看见你校服上被红墨水染脏的“OI”标志，悄悄多给了你两个黄金脆皮鸡腿，拍拍你说：“小伙，吃饱了去给国家造卫星！”',
    isPositive: true,
    deltas: { stamina: 20, stress: -8, funds: 5 }
  },
  {
    id: 'pos_sudden_3',
    text: '体育课摸鱼爬杆，你居然在看台缝隙里捡到一张面额拾元的旧钞。虽然边缘泛黄，但他完全能全款购买店里两瓶经典风油精！',
    isPositive: true,
    deltas: { funds: 10, stress: -4 }
  },
  {
    id: 'pos_sudden_4',
    text: '英语自习课，你用写C++逻辑递推算法的思维解析了全真高考阅读理解，竟然惊人地全对。英语老师拍了拍脑门：“看来搞信奥的手脑协调就是行，快去教教后排写作文。”',
    isPositive: true,
    deltas: { english: 12, pride: 8, stress: -5 }
  },
  {
    id: 'pos_sudden_5',
    text: '同桌的小胖在数学草稿纸上算出的体积常数惊人地和地球质量差不多。你用奥赛的空间积分推倒一眼看出他错在圆周率，他当场惊为天人，把他的午后美式咖啡分了你一半。',
    isPositive: true,
    deltas: { math: 6, stamina: 15, stress: -6 }
  },
  {
    id: 'pos_sudden_6',
    text: '暗中调试了走廊自动售货机的投币延时重连，没有投钱却意外掉出了两听冰可乐。你怀着极客的自豪感在死角悄悄喝完了，二氧化碳在胸腔疯狂咆哮。',
    isPositive: true,
    deltas: { stamina: 18, stress: -10, pride: 10 }
  },
  {
    id: 'pos_sudden_7',
    text: '语文课默写《阿房宫赋》，你用缩进两个空格的代码排版缩进了古文，“覆压三百余里，隔离天日”，老师无言以对，甚至在全班表扬了这种富有科技感的“对齐艺术”。',
    isPositive: true,
    deltas: { chinese: 8, pride: 5, stress: -3 }
  },
  {
    id: 'pos_sudden_8',
    text: '走在路上偶遇学校保卫处抓越墙野猫。野猫走位极其妖娆，你凭借当初高精度距离估算法，一个斜向假动作将猫封锁。保卫处大叔感激递来一瓶可口可乐，爽快！',
    isPositive: true,
    deltas: { stamina: 12, stress: -6, pe: 3 }
  },
  {
    id: 'pos_sudden_9',
    text: '物理课考透镜焦距。你发现这不就是信奥的线段树分治插值？直接在脑内套用模板两秒写完填空。物理老师看完答案，默默把这节自习课免了，奖励你去机房吹空调。',
    isPositive: true,
    deltas: { science: 12, stamina: 15, stress: -5 }
  },
  {
    id: 'pos_sudden_10',
    text: '你发现学校超市正在进行“积攒五个风油精盖兑换红外静音眼罩”的漏洞活动。你果断在同桌的垃圾桶里翻齐了盖子，当晚安睡十个点。',
    isPositive: true,
    deltas: { sleepQuality: 18, stress: -8 }
  },
  {
    id: 'pos_sudden_11',
    text: '午睡醒来，一滴冰凉的晨露从窗前樟树上恰好砸入你的后颈。凉意刺骨，你顺口背出了昨天死活记不住的20个长难英语单词。',
    isPositive: true,
    deltas: { english: 8, stamina: 10 }
  },
  {
    id: 'pos_sudden_12',
    text: '今天大扫除。你自告奋勇负责帮教室重连投影仪坏掉的VGA线，并熟练运用奥赛重组硬件的手艺，顺便把后台的屏保换成了“Accepted - Liang Go!”，全班哄堂大笑，气氛极其欢快。',
    isPositive: true,
    deltas: { pride: 12, stress: -10 }
  },
  {
    id: 'pos_sudden_13',
    text: '课间十分钟，你靠着敏锐的脑力和极高精度的概率论，在小卖部抽盲盒当场抽中特等奖：一把金属红轴指尖解压摆件。',
    isPositive: true,
    deltas: { funds: 15, stress: -12, pride: 8 }
  },
  {
    id: 'pos_sudden_14',
    text: '你买的三包速溶黑咖啡破天荒地在包装内里印着字，“恭喜获得再来一包！”。你捏着四包咖啡，感觉自己今晚就是全高三最猛的逻辑狂魔。',
    isPositive: true,
    deltas: { stamina: 15, funds: 3 }
  },
  {
    id: 'pos_sudden_15',
    text: '数学老师出的压轴题，答案刚好是你背得滚瓜烂熟的信奥大素数“998244353”的简写。你落笔生风，老师大赞你有着“对数字最尊贵的知觉”。',
    isPositive: true,
    deltas: { math: 10, pride: 10, stress: -5 }
  },
  {
    id: 'pos_sudden_16',
    text: '下晚自习，妈妈破例在车篮里给你塞了热腾腾的烤脑花。油脂和花椒大面积麻痹舌头，吃完感觉数理化大题的压抑感瞬间被烤脑花化成了飞灰。',
    isPositive: true,
    deltas: { stamina: 22, stress: -12, sleepQuality: 10 }
  },
  {
    id: 'pos_sudden_17',
    text: '今天跑1000米，你前面有同学大喊“OJ评测机倒了，快跑啊！”，全班疯狂向前冲，你的长跑成绩居然硬生生提高了十五秒。信奥玄学护体！',
    isPositive: true,
    deltas: { pe: 5, stamina: -5, stress: -8 }
  },
  {
    id: 'pos_sudden_18',
    text: '今天偶然在抽屉翻出了曾经写的信奥纪念卡纸。上面有你和曾经的保送学哥的签名，顿时心中重新涌起代码之魂，高三文理折中又如何？干就是了！',
    isPositive: true,
    deltas: { resilience: 12, pride: 8, stress: -6 }
  },
  {
    id: 'pos_sudden_19',
    text: '在走廊遇到了数学组大考出题人。他看你低头演算数论公式，惊呼你用的是高深离散数学拓扑法，直接拉你探讨，顺便把一模里容易手滑的巨坑透露了少许。',
    isPositive: true,
    deltas: { math: 12, pride: 5 }
  },
  {
    id: 'pos_sudden_20',
    text: '做英语阅读，讲的是硅谷黑客在车库组装微机的传奇一生。这简直是你的精神图腾！你几乎不需要翻译字典就把所有主旨大题写完了，感觉无比澎湃。',
    isPositive: true,
    deltas: { english: 10, pride: 8, stress: -5 }
  },
  {
    id: 'pos_sudden_21',
    text: '食堂排队时，你不小心被前面保送班的高冷女神踩了一脚。她惊慌道歉，并塞给你一块包装精致的瑞士薄荷巧克力。甜丝丝的，零花都省了！',
    isPositive: true,
    deltas: { stamina: 15, stress: -10, funds: 5 }
  },
  {
    id: 'pos_sudden_22',
    text: '理综生物课，老师问什么可以解释基因链重组中的冗余跳跃。全班缄默。你引用了写代码时冗余垃圾数据清理的“剪枝算法”模型，老师连连叫好，掌声雷动！',
    isPositive: true,
    deltas: { science: 8, pride: 12 }
  },
  {
    id: 'pos_sudden_23',
    text: '今天大雨，英语早自习直接变成了补觉课。你在雨声里深沉地呼吸，趴在暖烘烘的课桌上，像是睡在了一千层无Bug的软件内存里一样温暖。',
    isPositive: true,
    deltas: { sleepQuality: 22, stamina: 15, stress: -10 }
  },
  {
    id: 'pos_sudden_24',
    text: '在操场踢球，一脚飞踢本要砸中班主任的眼镜，关键时刻你预判了弹道差，侧铲将球解围。班主任冷汗直流，握着你的手说这周物理作业你全免了。',
    isPositive: true,
    deltas: { pe: 4, stress: -15, stamina: 10 }
  },
  {
    id: 'pos_sudden_25',
    text: '收到已经提前签约清华的信奥前舍友发来的搞怪调试截图，并吐槽他大学高数居然也要重修。看见大神也有今天，你忍不住幸灾乐祸地笑出了猪叫。',
    isPositive: true,
    deltas: { stress: -20, pride: 5 }
  },
  {
    id: 'pos_sudden_26',
    text: '下课洗手，你碰巧发现水龙头的共振周期竟然可以被一个正弦公式完美刻画。你用食指打节奏控水，感觉自己成了控制论的宗师。',
    isPositive: true,
    deltas: { science: 6, stress: -5 }
  },
  {
    id: 'pos_sudden_27',
    text: '语文大作文题目是“代码与生命”，这简直是为你量身定制的赛道。你挥毫泼墨，将二叉树、图论与生命演化写得气贯长虹，拿下了极其罕见的58分特高分。',
    isPositive: true,
    deltas: { chinese: 15, pride: 15, stress: -5 }
  },
  {
    id: 'pos_sudden_28',
    text: '大扫除拆洗纱窗，你找到了上学期落下的信奥纪念保温杯，里面居然还有五个钢镚！简直是天降巨款。',
    isPositive: true,
    deltas: { funds: 5, stress: -3 }
  },
  {
    id: 'pos_sudden_29',
    text: '昨晚做梦，梦里你在写一个几千行的树状数组，并在终点大红字里获得了“Accepted”大彩牌。早上醒来感到头脑轻盈，充满着神圣的笃信感。',
    isPositive: true,
    deltas: { resilience: 15, sleepQuality: 12 }
  },
  {
    id: 'pos_sudden_30',
    text: '同桌今天过生日，大手笔地在教室内散发高档大排蛋糕和进口椰汁。你狠狠塞了自己三块，糖分瞬间顶满，逻辑高能运作。',
    isPositive: true,
    deltas: { stamina: 25, stress: -8 }
  },
  {
    id: 'pos_sudden_31',
    text: '今天大风突降，气温暴跌。你刚好穿着那件厚重、保暖的深蓝色信奥冬季省队服。在一群冻得瑟瑟发抖的高中生里，只有你巍峨如山、温暖似火。',
    isPositive: true,
    deltas: { pride: 10, stamina: 12 }
  },
  {
    id: 'pos_sudden_32',
    text: '英语默写漏掉了三个词。你灵机一动用“/* */”多行注释掉了，英语老师看到被你逗乐了，默默画了个红圈，不仅原谅了你，还奖励了你两块薄荷糖。',
    isPositive: true,
    deltas: { english: 4, stress: -4 }
  },
  {
    id: 'pos_sudden_33',
    text: '理综选择题极其艰深。你发现可以用当初排查Bug的“折半查找（二分法）”，根据已知量正负极大值迅速排除两个，命中率拉满！',
    isPositive: true,
    deltas: { science: 10, pride: 6 }
  },
  {
    id: 'pos_sudden_34',
    text: '体育老师今天生病了，然而没被数学老师占课！体育委员从柜子里深挖出了两个饱满的真皮足球，大家狂奔放肆，你快乐得像个狂奔在多维数组里的指针。',
    isPositive: true,
    deltas: { pe: 6, stamina: -12, stress: -18 }
  },
  {
    id: 'pos_sudden_35',
    text: '你发现昨晚写满英语单词的本子被昨晚暴食的同桌当成了零食包装袋。为了赔偿，他不仅帮你手洗了外套，还被迫承担了你今天的一半试卷整理。',
    isPositive: true,
    deltas: { stamina: 10, stress: -5 }
  },
  {
    id: 'pos_sudden_36',
    text: '今天数学周测。最后一道圆锥曲线大题卡住了所有人。只有你用笛卡尔斜率积分、配合奥赛快速逼近，把极其恶心的方程给硬拆了。数学老师当场在黑板上把你的草稿定格展示。',
    isPositive: true,
    deltas: { math: 12, pride: 12, stress: -5 }
  },
  {
    id: 'pos_sudden_37',
    text: '你走在回校林荫路上，一只罕见的松鼠居然从树枝落到了你怀中，并顺手叼走了你的半片面包。在学校贴吧里，你被冠上了“高三一班松鼠使者”的名号，十分拉风。',
    isPositive: true,
    deltas: { stress: -12, pride: 6 }
  },
  {
    id: 'pos_sudden_38',
    text: '偶然在废纸堆里找到一本旧版信奥图册。一页页翻过去，那是你曾经写下第一个Hello World、第一个深搜的纪念。突然觉得，写代码的人是不可能被打败的。',
    isPositive: true,
    deltas: { resilience: 15, pride: 10 }
  },
  {
    id: 'pos_sudden_39',
    text: '由于同桌弄翻了豆奶，你的文综错题本瞬间充满了浓郁香酽的豆奶味。不仅没有毁掉，看书复习时反而香气逼人，看半小时也不犯困了。',
    isPositive: true,
    deltas: { chinese: 4, stamina: 10 }
  },
  {
    id: 'pos_sudden_40',
    text: '你发现学校操场的大卡片考勤系统代码竟然有越界循环。你找老师反映，并指出了修复路径，学校信息组大惊，发给你一面“网络红客卫士”的大红锦旗和五十元代金券！',
    isPositive: true,
    deltas: { funds: 50, pride: 20, stress: -10 }
  },
  {
    id: 'pos_sudden_41',
    text: '暗恋的高三六班女生在擦肩而过时，轻轻帮你捡起了书包拉链上脱落的信奥定制挂件。她笑着对你说：“加油，听说搞算法的人脑回路跟太阳一样亮。”',
    isPositive: true,
    deltas: { stamina: 25, stress: -15, pride: 15 }
  },
  {
    id: 'pos_sudden_42',
    text: '在极其压抑的化学课上。由于老师今天声音格外像变压器的低沉蜂鸣。全班陷入了安详而深沉的集体睡眠，你感到从未有过的踏实和安稳。',
    isPositive: true,
    deltas: { sleepQuality: 15, stress: -8 }
  },
  {
    id: 'pos_sudden_43',
    text: '由于你在文综和理科中的逻辑太过于严谨对称。历史老师把你的错题分册夸作了“高三一班非物质文化遗产”，并强迫全组传阅。小傲娇一下。',
    isPositive: true,
    deltas: { chinese: 6, pride: 10 }
  },
  {
    id: 'pos_sudden_44',
    text: '早自习全校统一广播播音设备网络卡顿。你自告奋勇跑上去轻轻敲了敲路由器，并精简了转发路由，设备瞬间大声复活，全校免受刺耳电子破音之苦。',
    isPositive: true,
    deltas: { pride: 8, stress: -5 }
  },
  {
    id: 'pos_sudden_45',
    text: '今天大扫除。你在讲台隔板死角，翻出来一大盒未开封的进口清脑风油精，绿晶莹、香喷喷！这简直是复原之战的神级资源。',
    isPositive: true,
    deltas: { stamina: 15, stress: -4, funds: 5 }
  },
  {
    id: 'pos_sudden_46',
    text: '看见走廊黑板报上英语单词拼错了，你作为极客顺手把“constantly”后面的错误字母改了，恰好被教导主任撞个正着，大加赞赏说你有敏锐的审阅细节。',
    isPositive: true,
    deltas: { english: 8, pride: 5 }
  },
  {
    id: 'pos_sudden_47',
    text: '今天数学周测居然没有圆锥曲线大计算。满篇都是三角函数与立体纯几何算极值，正好撞在你的奥赛空间向量底子上，一通猛砍，舒畅无比。',
    isPositive: true,
    deltas: { math: 10, stress: -8 }
  },
  {
    id: 'pos_sudden_48',
    text: '学校食堂推出了复健学生专属的“Accepted 能量汤”（其实就是紫菜蛋花汤加了几块排骨），拿着你的信奥队卡可以打半折。饱餐之余感觉自己战意回归。',
    isPositive: true,
    deltas: { stamina: 18, funds: 8, stress: -4 }
  },
  {
    id: 'pos_sudden_49',
    text: '在一堂平淡无奇的体育操场课上。你凭借奥赛时手速极快的鼠标定位，一把在草丛里抓住了逃逸的年级主任的兔子。大叔不仅没骂你，还塞给你一排AD钙奶。',
    isPositive: true,
    deltas: { pe: 4, stamina: 12, funds: 5 }
  },
  {
    id: 'pos_sudden_50',
    text: '你发现昨晚卡死的一道理综压轴力学方程，今天早自习脑中神光一闪，不知不觉在牙膏盒反面写了出来。那层窗户纸突然破裂的快意，让你狂笑不停。',
    isPositive: true,
    deltas: { science: 15, pride: 12, stress: -10 }
  }
];

// 50 Negative Pessimistic Events
export const NEGATIVE_SUDDEN_EVENTS: SuddenEvent[] = [
  {
    id: 'neg_sudden_1',
    text: '夜深人静，当你疲惫地合上数学试卷，隔壁保送班寝室突然传来吉他欢呼和高声的“Accepted！”。那一刹那，你喉头酸楚，想起自己桌子上一文不值的代码草稿本。',
    isPositive: false,
    deltas: { stress: 15, pride: -10, sleepQuality: -8 }
  },
  {
    id: 'neg_sudden_2',
    text: '今天二模成绩公示板前。几个保送名家路过，正在轻声调侃高一入队的学弟卡在省选的Bug，笑声有些刺耳，你默默退入人群深处，校服袖子把脸蹭得一团灰。',
    isPositive: false,
    deltas: { pride: -12, stress: 12 }
  },
  {
    id: 'neg_sudden_3',
    text: '下雨了。你踩了一脚烂泥，刚买的五年高考必刷题落入泥坑，字迹洇湿成深黑的污泥。那散开的圆珠笔黑印，像极了你断裂在竞赛征途上的未竟梦想，黑且冰凉。',
    isPositive: false,
    deltas: { resilience: -5, stress: 10 }
  },
  {
    id: 'neg_sudden_4',
    text: '班会课上播放往届杰出保送生的寄语。你看着视频里曾经一起在机房刷夜的熟人，正神采飞扬地介绍大学生活，而你却要在接下来的周测里为两分常数而死磕。那种极大的割裂感刺痛了你。',
    isPositive: false,
    deltas: { pride: -12, stress: 10 }
  },
  {
    id: 'neg_sudden_5',
    text: '今天的模拟大考，你下意识在答题卡上套用竞赛常用的离散优化模板，却被年轻的代阅老师判为‘莫名其妙的一团乱码’，直接给物理第二大题批了个刺眼的零分。',
    isPositive: false,
    deltas: { science: -10, stress: 12 }
  },
  {
    id: 'neg_sudden_6',
    text: '因为熬夜背诵李华的英语求职信范文，你今天第一节早读课极度神游。教导主任巡堂，正好用教鞭重重敲击你的课桌，大声训斥你：‘竞赛已经废了，上课还打瞌睡，你这样高考只能去搬砖！’',
    isPositive: false,
    deltas: { pride: -15, stress: 15, stamina: -10 }
  },
  {
    id: 'neg_sudden_7',
    text: '你的旧写码本在收拾课桌时不小心掉入走廊垃圾桶，里面的那段全省NOI金牌解题思路的硬拷贝被湿漉漉的剩菜汤浸得面目全非。你站在垃圾桶旁手足无措，眼角泛起温热。',
    isPositive: false,
    deltas: { pride: -10, stress: 8 }
  },
  {
    id: 'neg_sudden_8',
    text: '理综周测中，复杂的有机化学推理题让你突然梦回NOI最后两小时卡死段错误的崩溃时刻。你头疼欲裂，呼吸开始局幸，手抖得无法在白纸上算出一摩尔的常数。',
    isPositive: false,
    deltas: { science: -8, stress: 15 }
  },
  {
    id: 'neg_sudden_9',
    text: '高三班主任在谈话中对你说：‘梁，别整那些冷门计算机了。现在你理科除了数学都不算顶尖，安心把英语语法背好。我们这没有保送指标，你底子本来就薄。’你默不作声，握紧拳头。',
    isPositive: false,
    deltas: { pride: -12, resilience: -8, stress: 10 }
  },
  {
    id: 'neg_sudden_10',
    text: '因为高考高压，你的偏头痛在午后大作。你咬牙含了一颗清风丸，但是看着那些交织在微积分与电磁感应中的重叠符号，你脑中嗡嗡作响，一行也看不懂。',
    isPositive: false,
    deltas: { stamina: -15, stress: 12, sleepQuality: -10 }
  },
  {
    id: 'neg_sudden_11',
    text: '以前常找你修电脑和帮连局域网的后排大肚汉，今天在班级群里冷不防嘲笑道：‘写得再溜编译器，理综大题不还是拿十几分？现在还得和我们一样老老实实背文史。’全班寂静无声，你感到无上的刺痛。',
    isPositive: false,
    deltas: { pride: -15, stress: 10 }
  },
  {
    id: 'neg_sudden_12',
    text: '高三周考在做英语阅读理解时，有一道短文居然通篇在讲你最热爱的汇编底层优化原理。你兴奋地用汇编寄存器常识去做推测，却华丽地掉进了高考标准语法设置的巨坑中，白白丢了八分。',
    isPositive: false,
    deltas: { english: -10, pride: -5, stress: 8 }
  },
  {
    id: 'neg_sudden_13',
    text: '今天学校林荫道的自动售货机吞了你唯一的十块钱，却喷出了一个坏掉的、无法通电的小风扇。你拿着那个塑料玩具，站在滚烫的太阳光下，感到命运对自己的嘲弄。',
    isPositive: false,
    deltas: { funds: -10, stress: 8 }
  },
  {
    id: 'neg_sudden_14',
    text: '一贯理解并支持你的竞赛老教练，今天在校道遇见时，竟然叫错了你的名字，并一脸疲累地告诉你，学校明年的竞赛班资金正式被锁闭用作高考提分班。你看着他落寞离去，心中最后一束光也熄灭了。',
    isPositive: false,
    deltas: { resilience: -15, pride: -10 }
  },
  {
    id: 'neg_sudden_15',
    text: '因为一上午的疯狂背书，你的嗓子突然彻底红肿倒哑。语文默写古诗词时由于满脑嗡嗡和脑供血不足，连续写错了三个通假字，被班长叫到黑板前当众写了三遍‘大字报’。',
    isPositive: false,
    deltas: { chinese: -6, stamina: -12 }
  },
  {
    id: 'neg_sudden_16',
    text: '今天中午，你隔壁寝室由于插线板老化导致整层楼大断电。你那份仅存的高考数理极限推导文档由于系统意外崩溃，在备用路由器和内存里成了未格式化的断裂字节。你三天的深夜心血化为虚无。',
    isPositive: false,
    deltas: { math: -6, science: -6, stress: 15 }
  },
  {
    id: 'neg_sudden_17',
    text: '食堂今天最便宜的米沙饭涨了一块五。你摸着只剩三元的口袋，破天荒地在食堂边缘只咬了一个冷馒头和一叠有些齁咸的腌黄瓜。晚上九点，胃中的胃酸疯狂泛滥，疼得你在解题时直冒冷汗。',
    isPositive: false,
    deltas: { funds: -5, stamina: -12, stress: 8 }
  },
  {
    id: 'neg_sudden_18',
    text: '你原本打算在体育课的长跑上出一口恶气，但是因为常年待在机房，你的肺活量和耐力早已不复当年。长跑快到折返点时你双腿酸麻，直接累倒在灌木丛旁，被体育委员狠狠嘲笑了一顿。',
    isPositive: false,
    deltas: { pe: -6, stamina: -15, stress: 10 }
  },
  {
    id: 'neg_sudden_19',
    text: '你以前在信奥圈中随手写的科普回答，今天被某自媒体原封不动抄袭，还用夸张浮躁的标题宣扬‘某省一神童跌落 Gaokao 底层’。你用生锈的诺基亚默默看着那些冷酷对你的网络评论，眼圈红了。',
    isPositive: false,
    deltas: { pride: -18, stress: 15 }
  },
  {
    id: 'neg_sudden_20',
    text: '暗恋的女孩在午休时，和同学们在后排热火朝天地聊着未来的清华美院和名都梦想。你听到后默默将草稿纸下遮掩的‘清华大学’四个小字用碳素笔狠狠抹黑直到看不见。在今天的高考泥地里，你不知道自己还有没有资格和她去同一个城市。',
    isPositive: false,
    deltas: { resilience: -12, stress: 12 }
  },
  {
    id: 'neg_sudden_21',
    text: '你在自修时因为精力过耗手滑把满满一整杯热豆浆泼到了自己唯一的数理错题集上，所有精心书写的递推几何线全部模糊成了一汪白花花。那一瞬间，巨大的无力感如海潮般将你淹没。',
    isPositive: false,
    deltas: { math: -8, stress: 15 }
  },
  {
    id: 'neg_sudden_22',
    text: '由于长时间坐姿僵硬，你的腰椎在今天大考倒计时课上突然发出一声酸疼的哀鸣。你几乎无法在塑料椅上靠稳完成那张难缠的物理大磁场试纸。你疼得浑身颤栗。',
    isPositive: false,
    deltas: { stamina: -15, science: -6 }
  },
  {
    id: 'neg_sudden_23',
    text: '不小心从校服袋子的漏洞漏了出去。也许在操场，也许在喧闹的走廊。你摸着空荡荡的校服，感到无力，晚上只啃了凉透的白馒头。',
    isPositive: false,
    deltas: { funds: -20, stamina: -10, stress: 12 }
  },
  {
    id: 'neg_sudden_24',
    text: '深夜里胸闷窒息惊醒。眼前仿佛浮现出二模考卷上漫无边际的红叉、爸妈看你模考失常的分数单时眼神深处那抹长长的、默默的叹息。夜风好冷，你蜷缩成一团。',
    isPositive: false,
    deltas: { sleepQuality: -20, stress: 15 }
  },
  {
    id: 'neg_sudden_25',
    text: '数学大题太恶劣了，你死心塌地推导了40分钟，最后却发现第二步一处常数多乘了0.1。意味着40分钟的心血成了无意义的废话。巨大的时间沉没成本让你几乎想把卷子撕碎。',
    isPositive: false,
    deltas: { math: -8, stress: 18 }
  },
  {
    id: 'neg_sudden_26',
    text: '在走廊看见高一年级的信奥新人，在他们竞赛教练的带领下，高高兴兴地抱着全新的RGB键盘去往机房，有说有笑。那个机房，去年这时候是你的天下。现在你站在楼道阴影里，像一缕不舍离去的幽灵。',
    isPositive: false,
    deltas: { pride: -15, stress: 15 }
  },
  {
    id: 'neg_sudden_27',
    text: '今天大扫除。你原本干净的草稿纸堆被保洁人员顺手当成废纸乱糟糟打包收走了，里面有着你磨了三天三夜的高考理综压轴力学推导。你蹲在垃圾桶旁边找了半小时无果，心里空荡荡的。',
    isPositive: false,
    deltas: { science: -8, stress: 12 }
  },
  {
    id: 'neg_sudden_28',
    text: '你发现，你以前引以为豪的计算力随着复建强度的增加竟然在退化。也许是高负荷脑力让部分算法皮层钝化，以前看一眼能想通的常数，现在演算五度依然是死路。你在变蠢。',
    isPositive: false,
    deltas: { resilience: -15, math: -5, stress: 15 }
  },
  {
    id: 'neg_sudden_29',
    text: '家里打来电话，爸爸由于公司裁员不战自退，原本答应的高考提分补习班基金彻底成了泡影。妈妈在电话里沙哑且小声地跟你道歉，极度窒息的重力，让你靠在宿舍斑驳的绿漆大门后低喊出声。',
    isPositive: false,
    deltas: { funds: -25, stress: 20 }
  },
  {
    id: 'neg_sudden_30',
    text: '你在日记里写了当年对机房某同桌代码女孩的隐秘暗恋，不小心从书页掉落。走廊里隐约有碎言碎语和捂嘴的恶意嬉笑。在高考的泥地里，连干净的暗恋都成了他们廉价的谈资。',
    isPositive: false,
    deltas: { pride: -18, stress: 15, sleepQuality: -10 }
  },
  {
    id: 'neg_sudden_31',
    text: '理综试商，物理最后一拆多项电磁题。那一刻，你脑内竟然不自觉产生重演NOI终盘落败那天的幻觉，呼吸停顿，考场警钟长鸣。你在幻觉中浪费了十分钟，手脚彻底发凉。',
    isPositive: false,
    deltas: { science: -12, stress: 18 }
  },
  {
    id: 'neg_sudden_32',
    text: '上体育长跑，由于被后面的同学无意绊倒，你结结实实摔在了煤渣跑道上。膝盖蹭开了一大块红肉，煤渣钻进皮肤，血水沾湿了校裤。体育委员跑过来，冷漠地叫你退到一边，别挡重测的时间。',
    isPositive: false,
    deltas: { pe: -5, stamina: -15, stress: 12 }
  },
  {
    id: 'neg_sudden_33',
    text: '你偷偷买的便宜黑咖啡，因为在书包里口不紧，直接漏了出来，把你的高考准考证复印本和仅有的几十元零钱糊得稀烂。一书包甜腻恶臭的焦糊咖啡渣。你在洗手池默默洗刷。',
    isPositive: false,
    deltas: { funds: -10, stress: 10 }
  },
  {
    id: 'neg_sudden_34',
    text: '突然的沙尘天气，让高三教室里每个人桌头落满白色浮灰。你看着窗外被风沙蹂躏的枯叶，心想：我们也就是这浮灰里的白沙。一阵狂风，我们就吹落在荒凉的地上，毫无意义。',
    isPositive: false,
    deltas: { resilience: -12, stress: 10 }
  },
  {
    id: 'neg_sudden_35',
    text: '你发现你以前的信奥自豪群，大家陆陆续续改成了“清北直达班”、“985保送群”，那些以前卡你Bug被你指导的中下层学弟，现在都开始发通知书。只有你在这里重算高中二次根式。',
    isPositive: false,
    deltas: { pride: -20, stress: 15 }
  },
  {
    id: 'neg_sudden_36',
    text: '深夜里蚊虫围攻。因为手头紧没买蚊香。你在狭促、潮霉的热床上狂拍，几乎通宵没合眼，手臂上咬了一排红疙瘩，看着天光泛出病态的惨白。',
    isPositive: false,
    deltas: { sleepQuality: -25, stamina: -15 }
  },
  {
    id: 'neg_sudden_37',
    text: '一向对你温和有加的班级尖子，今天在办公室被保送名师当场指正：不要去指导那个竞赛落伍的退役生，他底子薄弱，跟在他旁边，你会连普通考场都出Bug。你在门缝听得一清二楚。',
    isPositive: false,
    deltas: { pride: -15, stress: 15 }
  },
  {
    id: 'neg_sudden_38',
    text: '你想在文综上博一把，硬生生背诵了几万字文史条目。可是今天周测考下来的主观题，格式完全错位，全是红叉。在标准答案格式面前，你那些自以为聪明的概括完全成了废话。你哭了。',
    isPositive: false,
    deltas: { chinese: -10, stress: 15 }
  },
  {
    id: 'neg_sudden_39',
    text: '下课铃响。隔壁桌扔垃圾，不偏不倚把用过的脏擦脸巾落在了你书包正中心。他看都不看你，头也不回地笑着跑出教室。高三的底层人，连尊严都是透明的。',
    isPositive: false,
    deltas: { pride: -12, stress: 10 }
  },
  {
    id: 'neg_sudden_40',
    text: '你习惯的蓝色中性笔芯因为大降价，质量低劣，在写数学大计算时突然当场大爆墨，把几乎解答完毕的完美卷面喷得一片漆黑。你盯着那一滩不断洇湿的黑墨，感觉它流进你肺腑里。',
    isPositive: false,
    deltas: { math: -8, stress: 15 }
  },
  {
    id: 'neg_sudden_41',
    text: '宿管老师查寝，没收了你在桌底用过的唯一能连到信奥旧服务器的微型路由器，并严厉上报、扣除综合素质大分。你站在宿舍冷冰冰的天井前，看着零星星空，感到了极度荒凉。',
    isPositive: false,
    deltas: { pride: -15, stress: 15 }
  },
  {
    id: 'neg_sudden_42',
    text: '今天大考。考场后面的家伙一直在不间断地用圆珠笔发出“咔嗒咔嗒”的低频噪音，且节奏极快。你忍无可忍想要吼叫，但巨大的监考机制逼迫你咽下了愤怒。你的整堂听力全毁。',
    isPositive: false,
    deltas: { english: -10, stress: 15 }
  },
  {
    id: 'neg_sudden_43',
    text: '理综试纸，由于太累你手抖看错正负号，致使后面整张大综合的全部连锁计算全部归零。你无知觉地看着那一大把白红相间的圈叉，觉得自己就像一段在废弃线路里无谓循环的冗余死代码。',
    isPositive: false,
    deltas: { science: -12, stress: 15 }
  },
  {
    id: 'neg_sudden_44',
    text: '由于劳累，你大腿肌肉突发撕裂般抽筋。体育课上你只能在一边默默坐着，看大家打球大笑，冰凉的一百分体育预测大受伤害。甚至连日常端饭都疼。',
    isPositive: false,
    deltas: { pe: -5, stamina: -12 }
  },
  {
    id: 'neg_sudden_45',
    text: '走在外边。突然一只不知名的野鸟在天际抛下一团泥白。恰好命中了你的信奥荣誉队标。你擦拭着那滩冰凉的腥臭，觉得这荒唐的生活简直就是对你所有的昔日梦境无情的冷嘲热讽。',
    isPositive: false,
    deltas: { pride: -10, stress: 10 }
  },
  {
    id: 'neg_sudden_46',
    text: '数学大测试。考卷发下来几乎全是被卡断的数论变种，没有压轴，全是恶心繁琐的高频计算基础。这对你而言像极了用极高级的超算去磨一根生锈的细钢针，既大才小用，又痛得要命。',
    isPositive: false,
    deltas: { math: -6, stamina: -10, stress: 10 }
  },
  {
    id: 'neg_sudden_47',
    text: '你看错日期，把三天的生活费全在一顿食堂贵饭里消费干净了。剩下的两天里你只能忍着用温白开水泡冷硬的隔日旧饼干充饥，胃痛到在深夜里缩着身子。',
    isPositive: false,
    deltas: { funds: -15, stamina: -15, sleepQuality: -10 }
  },
  {
    id: 'neg_sudden_48',
    text: '你在一张旧信奥光盘里，甚至看到当年和同桌一起设计的游戏演示。现在你盯着那个死气沉沉的、因多年没有更新而彻底报错的代码，觉得自己就是那个被世人丢弃在代码荒漠里的未定义指针。',
    isPositive: false,
    deltas: { pride: -15, resilience: -15 }
  },
  {
    id: 'neg_sudden_49',
    text: '学校广播里突然开始循环播放高中优秀保送生的致谢演说，声音大到在每间教室回响。你用粗糙的白卫生纸揉成两团死塞住耳朵，却还是有一阵阵“名校、国家队、Accepted”的声音钻进来，让你眼泪顺着草稿纸滑落。',
    isPositive: false,
    deltas: { stress: 15, pride: -10 }
  },
  {
    id: 'neg_sudden_50',
    text: '一模的卷子公示了。你发现在最后两道大题里，你写出的极其精巧的奥赛递推解法不仅由于不合主流高考标准被判零分，卷子边缘甚至被当做“反面教材”用黑色马克笔画了一个大大的、醒目的骷髅。你的血像死水一样停滞了。',
    isPositive: false,
    deltas: { math: -12, science: -10, pride: -15, stress: 18 }
  }
];

// Memory Flashbacks (16 total - 8 Touching, 8 Melancholy, all with choices)
export const TOUCHING_FLASHBACKS: MemoryFlashback[] = [
  {
    id: 'flash_good_1',
    text: '你想起高二那年冬天，机房的暖气坏了。你和几个竞赛队友挤在一个旧电油汀旁边，搓着有些红肿的手。突然运行成功的红字“All Accepted”占满了十七台陈旧的显示屏，那一刻，大家在满屋的风扇声里大声跺脚和欢呼，眼睛亮得像深夜里的星汉。那一晚的暖意，至今能捂热你冰冷的笔头。',
    isPositive: true,
    deltas: { resilience: 15, pride: 10, stress: -10 },
    choices: [
      {
        text: '在数学压轴题边缘写满快速傅里叶变换的公式，企图找到相通的算法之美',
        effectText: '高考数学 +12, 自尊自负 +10, 精力 -10',
        deltas: { math: 12, pride: 10, stamina: -10 }
      },
      {
        text: '闭上眼握紧笔杆，依靠当年的胜战热意，战胜眼前的枯草模拟卷',
        effectText: '心理抗挫韧性 +15, 心理压力 -10',
        deltas: { resilience: 15, stress: -10 }
      }
    ]
  },
  {
    id: 'flash_good_2',
    text: '你记起背着塞满C++草稿和泡面叉的重书包，深夜十一点从微机大楼推门而出。夜空里正刮着冰冷的大雪，漫天皆白，而你刚刚写完了那个极其恶心的树图覆盖，浑身每个细胞都热血燃烧。你说，要是以后能一辈子写代码，该有多幸福啊。那片大雪是如此高亢而纯净，它现在飘进了你有些窒息的教室窗前。',
    isPositive: true,
    deltas: { resilience: 18, pride: 12, stamina: 10 },
    choices: [
      {
        text: '将大雪中的冷气吸入肺里，精神抖擞，对今天棘手的物理大合集进行全面突破',
        effectText: '理科综合 +12, 精力 +15, 压力 +5',
        deltas: { science: 12, stamina: 15, stress: 5 }
      },
      {
        text: '坚信终有一天，自己会用代码写出改变实体产业的高阶核心软件',
        effectText: '自尊价值感 +18, 叛逆值 +10',
        deltas: { pride: 18, rebellion: 10 }
      }
    ]
  },
  {
    id: 'flash_good_3',
    text: '你记起NOI出发前的那个下午，妈妈虽然对你说的树状数组一窍不通，但她默默在大箱子里给你塞进了一整盒洗切妥当的红苹果，并小心地用保鲜膜封了三层。她说：“小良，妈不懂那些，但妈知道我梁儿子是最聪明的，去吧，妈等你在大桌上打出名来。”，那股红富士的香气，依然在大脑中飘香，提醒你，依然有人在桌后等你回家。',
    isPositive: true,
    deltas: { stress: -20, sleepQuality: 15, stamina: 10 },
    choices: [
      {
        text: '为了不辜负母亲，将咬碎的苹果香气化作专注力，今天多刷三十个英语长难句',
        effectText: '外文英语 +12, 心理压力 -8',
        deltas: { english: 12, stress: -8 }
      },
      {
        text: '将这股温暖转化为沉沉的睡意，卸下所有的包袱，今晚好好犒劳一下疲软的大脑',
        effectText: '睡眠质量 +20, 心理抗挫韧性 +10',
        deltas: { sleepQuality: 20, resilience: 10 }
      }
    ]
  },
  {
    id: 'flash_good_4',
    text: '你记起你写出第一个“Hello World”并成功将一排大心形彩绘在黑底命令窗时，那个曾经同桌、同样搞信奥的隔壁寝女孩，凑过来，眼睛弯弯地看着对你说：“小良，你写代码的手，好像在键盘上跳舞一样。”，那是最初，有人告诉你的那份热忱：我们的指尖，是能改变数字世界的笔墨。',
    isPositive: true,
    deltas: { pride: 12, resilience: 10, stress: -5 },
    choices: [
      {
        text: '‘笔尖起舞！’，在作文字里行间注入更有张力、有结构美的哲科比喻',
        effectText: '高考语文 +10, 自学表现 +10, 压力 -5',
        deltas: { chinese: 10, pride: 10, stress: -5 }
      },
      {
        text: '暗下决心，一定要和她考到同一座城市，哪怕是顺从繁重的模拟考也绝不退让',
        effectText: '心理抗挫韧性 +18, 叛逆值 +5',
        deltas: { resilience: 18, rebellion: 5 }
      }
    ]
  },
  {
    id: 'flash_good_5',
    text: '你想起曾经在机房里一关灯，所有的机位散发出宁静神秘的淡蓝色荧光。你把头枕在键盘托上，听着无数行代码在服务器里安静穿流的声音，那是只属于极客之夜般最温厚的共振。在这个喧杂粗鄙的高三，闭上眼，你依然能重新沉回到那一汪宁静深海的怀抱。',
    isPositive: true,
    deltas: { sleepQuality: 20, stress: -12 },
    choices: [
      {
        text: '闭上眼重享当年深蓝色的荧光，今夜把急躁彻底安放，迎接无梦的好眠',
        effectText: '睡眠质量 +25, 心理压力 -15',
        deltas: { sleepQuality: 25, stress: -15 }
      },
      {
        text: '任由思维在深蓝逻辑海中自由浮动，在物理几何推导的大综合中挥洒天马行空的灵性',
        effectText: '理科综合 +10, 数学 +10',
        deltas: { science: 10, math: 10 }
      }
    ]
  },
  {
    id: 'flash_good_6',
    text: '你记起你初中第一次由于粗心大意导致竞赛爆零。竞赛教练拍着你的脊背，大呼：“大器晚成梁！搞算法的哪一个没经历过系统SegmentError！越是死红得发病，重写出来的内核越是牢不可破！”，老头的白胡子在日光下发光。你的脊背，在今晚的高三桌前，重新挺立起当年的傲骨。',
    isPositive: true,
    deltas: { resilience: 20, pride: 10 },
    choices: [
      {
        text: '“SegmentError 算个P！” 带着强烈的绝地反击决心，去重构自己的理综倒数第二道压轴大题',
        effectText: '理科综合 +15, 心理抗挫韧性 +15, 精力 -10',
        deltas: { science: 15, resilience: 15, stamina: -10 }
      },
      {
        text: '傲视模拟考的错题，认为他们都只是一些微小的Bug，改正即是满血复活',
        effectText: '自豪感 +15, 心理抗挫韧性 +10',
        deltas: { pride: 15, resilience: 10 }
      }
    ]
  },
  {
    id: 'flash_good_7',
    text: '你记起某天深夜，和你并肩备战的退役好友在漆黑的操场草地上躺着，看着夏夜细碎星光。他说：“梁啊，等咱们以后保送了，去北京买个大车库，咱们也整开源，把咱们自己的操作系统写满全世界的代码。”，虽然现在你们各奔东西挣扎，但在那一刻，理想的存在是真切的，它不是虚妄。',
    isPositive: true,
    deltas: { resilience: 12, pride: 8, stress: -5 },
    choices: [
      {
        text: '热血沸腾，在英语草稿本页眉偷写下一行理想的代码定义',
        effectText: '自豪感 +15, 英语词汇记忆 +8',
        deltas: { pride: 15, english: 8 }
      },
      {
        text: '深吸雨后空气，相信机房旧友也在各自的高三战场血战',
        effectText: '心理抗挫韧性 +15, 睡眠质量 +10',
        deltas: { resilience: 15, sleepQuality: 10 }
      }
    ]
  },
  {
    id: 'flash_good_8',
    text: '你记起当时从市图书馆回来，在天桥下，看那些斑驳繁复的立交桥行车轨迹。你当场在面包纸上把它们模拟成高阶拓扑流，那一刹那，你突然感到整个实体世界竟然都是可以被你用逻辑代码拆解并重建的。那种全知全能的极客之狂，今晚化作了你解出理综大电磁大考的无上战意。',
    isPositive: true,
    deltas: { science: 10, math: 10, pride: 5 },
    choices: [
      {
        text: '模仿拓扑规则，对本周高复习时间线做精细化规划',
        effectText: '数学 +8, 物理理综 +10, 精力 -8',
        deltas: { math: 8, science: 10, stamina: -8 }
      },
      {
        text: '傲视天桥行车，坚信书本上的理科只是简单树状逻辑',
        effectText: 'OI自豪自负 +18, 心理压力 -10',
        deltas: { pride: 18, stress: -10 }
      }
    ]
  }
];

export const MELANCHOLY_FLASHBACKS: MemoryFlashback[] = [
  {
    id: 'flash_bad_1',
    text: '省选大决战。第二试第三题，那个由于笔误将一处数组大小少写两个零的灾难性段错误，在宣布成绩的那一刻像狂风过境一样在大盘上揭晓。看着那个孤零零的、在全省红字里的“0”，你当时甚至忘掉了呼吸，只听到大脑深处仿佛有一个坚硬的水晶片，在深夜里“喀嚓”一声碎掉了。那一刻，你回不去了。',
    isPositive: false,
    deltas: { stress: 20, pride: -15, sleepQuality: -10 },
    choices: [
      {
        text: '拼死挣扎！在草稿本里红红火火怒敲三遍 Dijkstra 证明',
        effectText: '自傲自尊 +15, 精力 -12, 压力 +5',
        deltas: { pride: 15, stamina: -12, stress: 5 }
      },
      {
        text: '自我消化，默默合拢双眼，把脸深埋进有些霉味的臂弯里',
        effectText: '自尊自傲 -5, 睡眠质量 +15, 压力 -10',
        deltas: { pride: -5, sleepQuality: 15, stress: -10 }
      }
    ]
  },
  {
    id: 'flash_bad_2',
    text: '你记起收拾竞赛行李从微机大楼离开的那天。以前一向对你点击关注、把你当做高三一班活广告的班主任，默默在走廊里和年级组长说：“梁这孩子，算是彻底废了。玩竞赛耽误了理科基础，高考也就是个省二本的命，可惜了咱们学校的清北指标。”，那把有些生锈的锁扣，在日光里冰冷刺红。',
    isPositive: false,
    deltas: { pride: -20, stress: 15, resilience: -10 },
    choices: [
      {
        text: '在模考理科大题答卷里写满极其锐利复杂的竞赛判分写法',
        effectText: '理科综合 +15, 精力 -10, 自尊 +10',
        deltas: { science: 15, stamina: -10, pride: 10 }
      },
      {
        text: '蔑视评价：相信世界的开源和极客道路远比班主任一句话宽阔',
        effectText: '自豪自满 +12, 叛逆值 +15, 心理压力 -10',
        deltas: { pride: 12, rebellion: 15, stress: -10 }
      }
    ]
  },
  {
    id: 'flash_bad_3',
    text: '你记起保送名单尘埃落定的那个下午，班里以前总在屁股后面求你指导C++的家伙在桌子底下悄悄炫耀他的“清华特招确认”。全班挤在一旁给他疯狂庆祝，甚至把香槟洒到了你的旧省队蓝色套头上。你低着头用橡皮擦桌角那些老印，感觉自己像一颗在泥泞垃圾桶里慢慢发霉的废弃螺丝。',
    isPositive: false,
    deltas: { pride: -18, stress: 15, sleepQuality: -8 },
    choices: [
      {
        text: '内心默想：老子搞底层算法的野狼，不屑与精致利己者为伍',
        effectText: '自尊感 +15, 叛逆值 +10, 心理压力 +5',
        deltas: { pride: 15, rebellion: 10, stress: 5 }
      },
      {
        text: '深吸一口气，平复酸楚投入最实处的低阶英语词汇狂背中',
        effectText: '外文英语 +12, 心理抗挫韧性 +10, 压力 -5',
        deltas: { english: 12, resilience: 10, stress: -5 }
      }
    ]
  },
  {
    id: 'flash_bad_4',
    text: '你想起退役誓师大会上，大家高呼“竞赛虽残，高考必Accepted！”可是会后，在一楼厕所在转弯处，被老师们称为竞赛大腕的前学哥，在冷风里默默擦掉写废的代码本并自嘲：“信奥？一个手滑在高考里连几百字作文本都写不好的残废赛道罢了。我们都只是一场大型算法狂飙里的边角燃料，燃尽了，只配给高三的尖子铺路。”，悲凉，像青树在风里死掉。',
    isPositive: false,
    deltas: { resilience: -15, stress: 12, pride: -10 },
    choices: [
      {
        text: '‘老子在作文课上偏要多用哲科比喻！’，死磕文章气势',
        effectText: '高考语文 +10, 叛逆值 +8, 精力 -10',
        deltas: { chinese: 10, rebellion: 8, stamina: -10 }
      },
      {
        text: '向往平静。默默对自己说：我是一朵拼死突围的蝶。',
        effectText: '心理抗挫韧性 +15, 心理压力 -8',
        deltas: { resilience: 15, stress: -8 }
      }
    ]
  },
  {
    id: 'flash_bad_5',
    text: '你被大考压迫到深夜三点胸闷惊死，惊醒的刹那，脑内突然不可名状地不断滚动着那些你无法编译成功的代码句柄、高三试卷上一堆交叠红黑、像绞肉机一样重叠的公式。你在被单里死死捂住喉咙，大汗浸透，真切地感到自己的健康和青春，正在一堂堂试卷的长跑里，被无情地碾碎成沙。',
    isPositive: false,
    deltas: { sleepQuality: -25, stamina: -15, stress: 15 },
    choices: [
      {
        text: '连夜爬起，在黑暗中用凉水洗脸，死命默念数学习题公式',
        effectText: '数学分数 +8, 心理压力 +18, 精力 -15',
        deltas: { math: 8, stress: 18, stamina: -15 }
      },
      {
        text: '放弃挣扎，播放一段低保真纯音乐抚平抽动的大脑皮层',
        effectText: '睡眠质量 +18, 心理压力 -15, 自负 -5',
        deltas: { sleepQuality: 18, stress: -15, pride: -5 }
      }
    ]
  },
  {
    id: 'flash_bad_6',
    text: '你记起NOI大挫败的当晚，你一个人坐在长江大桥冰冷的石凳上。滔滔江水在黑夜里像深不见底的巨魔。你把所有的奥赛材料、那些陪了你六百个写Bug深夜的日记，一片片撕碎扬进滚滚黑水里。风很大，碎纸片像一群死掉在冬夜里的苍白蝴蝶。那时候大哭到吐过的酸液，至今在舌头边缘发苦。',
    isPositive: false,
    deltas: { resilience: -15, pride: -12, stress: 18 },
    choices: [
      {
        text: '‘碎纸可以扔，但心中的常数逻辑永远不可能被长江洗白！’',
        effectText: '自尊自傲 +15, 心理抗挫韧性 +8, 精力 -5',
        deltas: { pride: 15, resilience: 8, stamina: -5 }
      },
      {
        text: '面对伤疤自我告慰：我只不过将算法内镶成了今日的逻辑灵魂',
        effectText: '心理抗挫韧性 +18, 睡眠质量 +10, 压力 -12',
        deltas: { resilience: 18, sleepQuality: 10, stress: -12 }
      }
    ]
  },
  {
    id: 'flash_bad_7',
    text: '你记起当年因为痴迷于调试底层的内核编译器，连理综的基础熔点计算都没学。你在台上被化学老太用教鞭指着脑门大肆训斥：“梁！你整天写那些不知道哪来的废乱代码，能在今天的高考答卷里多给你换来一个钢镚的分嘛！玩物丧志，简直是家里的耻辱！”，那一板砖厚的讲台，至今沉沉地砸在你今晚的高三头顶。',
    isPositive: false,
    deltas: { science: -8, stress: 15, pride: -10 },
    choices: [
      {
        text: '‘我就在化学压轴上利用我的二分逻辑精准狙击解出！’（斗志）',
        effectText: '理科综合 +15, 自我价值自负 +10, 精力 -8',
        deltas: { science: 15, pride: 10, stamina: -8 }
      },
      {
        text: '不屑与短浅成见争辩。暗自保留一份傲骨',
        effectText: '叛逆值 +12, 心理压力 -10',
        deltas: { rebellion: 12, stress: -10 }
      }
    ]
  },
  {
    id: 'flash_bad_8',
    text: '你记起上高一时，你对代码未来满腔赤城，在黑板角写下：“以代码改变实体，以此度人生”。现在，你提着生锈的中性笔，在一张张一模二模的红圈判决上，被迫默写着万能粗鄙的高考英语“李华求职信”，你看到那个三年前在黑板前闪闪发光的少年，现在满眼死气地看着你哭泣。',
    isPositive: false,
    deltas: { resilience: -20, pride: -15, stress: 12 },
    choices: [
      {
        text: '李华算个P！我偏要用我最宏大最地道的IT翻译手法狂写求职作文',
        effectText: '英语外文 +15, 叛逆值 +12, 精力 -10',
        deltas: { english: 15, rebellion: 12, stamina: -10 }
      },
      {
        text: '闭上眼睛，低声给三年前的自己说声抱歉，顺从做完眼前的规范写本',
        effectText: '外文英语 +8, 心理抗挫韧性 +15, 压力 -8',
        deltas: { english: 8, resilience: 15, stress: -8 }
      }
    ]
  }
];
