import React from 'react';
import { PlayerStats } from '../types';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Atom, 
  Activity, 
  Brain, 
  Award,
  ShieldCheck,
  Moon,
  Coins,
  Dribbble
} from 'lucide-react';

interface StatsDisplayProps {
  stats: PlayerStats;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  const { scores, stamina, stress, funds, pride, resilience, sleepQuality } = stats;

  const getSubjectColorClass = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.85) return 'text-emerald-700 bg-emerald-50/50 border-emerald-200';
    if (ratio >= 0.70) return 'text-slate-700 bg-slate-50/50 border-slate-200';
    if (ratio >= 0.55) return 'text-amber-700 bg-amber-50/50 border-amber-200';
    return 'text-rose-700 bg-rose-50/50 border-rose-200';
  };

  const getSubjectProgressColor = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.85) return 'bg-emerald-600';
    if (ratio >= 0.70) return 'bg-slate-500';
    if (ratio >= 0.55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const totalScore = scores.chinese + scores.math + scores.english + scores.science;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      {/* Subject Scores Panel */}
      <div id="subject-scores-panel" className="md:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-stone-900"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-bold text-stone-900 text-lg uppercase tracking-tight">高考复健全科成绩预测</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[10px] text-stone-500 font-sans uppercase font-bold tracking-wider">文化课:</span>
              <span className="font-mono text-xl font-extrabold text-stone-800">{totalScore}</span>
              <span className="text-xs text-stone-400 font-sans">/ 750分</span>
            </div>
            <div className="flex items-baseline gap-1 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[10px] text-stone-500 font-sans uppercase font-bold tracking-wider">身体素质:</span>
              <span className="font-mono text-xl font-extrabold text-stone-900">{scores.pe}</span>
              <span className="text-xs text-stone-400 font-sans">/ 100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Chinese */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${getSubjectColorClass(scores.chinese, 150)} hover:shadow-xs transition-all duration-200`}>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" /> 语文 (Chn)
              </span>
              <span className="font-mono font-extrabold text-sm">{scores.chinese} <span className="opacity-60 text-[10px] text-stone-400 font-normal">/ 150</span></span>
            </div>
            <div className="w-full bg-stone-200/40 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${getSubjectProgressColor(scores.chinese, 150)} transition-all duration-500`} 
                style={{ width: `${(scores.chinese / 150) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-sans opacity-75 leading-relaxed">
              {(() => {
                if (scores.chinese >= 120) {
                  return stress >= 75 
                    ? "【极高过载】人文厚度惊人，古文名言信手拈来。然而，极度焦虑焦虑与胸闷使你在阅读散文现代文时思维重影、极难理解作者真实情感。"
                    : "【笔生风雅】才思敏捷，高难度文言虚词通透，议论文论证格局大开大合。少年的傲气在笔尖游刃有余。";
                } else if (scores.chinese >= 90) {
                  return "【稳定爬坡】古文默写与基础字词正在稳步夯实。但考场作文立意中规中矩，极易在死板的采分点里由于笔误丢分，需要平心静气。";
                } else {
                  return "【基底微薄】人文素养枯燥。文综议论文语言偏科排异严重。由于在机房泡了太久，你的大脑极度抗拒高考长文的死记硬背。";
                }
              })()}
            </p>
          </div>

          {/* Math */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${getSubjectColorClass(scores.math, 150)} hover:shadow-xs transition-all duration-200`}>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" /> 数学 (Math)
              </span>
              <span className="font-mono font-extrabold text-sm">{scores.math} <span className="opacity-60 text-[10px] font-normal">/ 150</span></span>
            </div>
            <div className="w-full bg-stone-200/40 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${getSubjectProgressColor(scores.math, 150)} transition-all duration-500`} 
                style={{ width: `${(scores.math / 150) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-sans opacity-75 leading-relaxed">
              {(() => {
                if (scores.math >= 130) {
                  return stress >= 75 || stamina <= 20
                    ? "【降维但疲劳】数论底蕴深奥，拥有高阶算法脑。然而严重过载的脑力和颤抖的手腕容易在圆锥曲线大计算中眼花算错常数。"
                    : "【算法之剑】行云流水，高考压轴级数与二阶导数在你的奥赛空间向量底子面前脆弱如沙，解题思路比极寒清泉更清澈。";
                } else if (scores.math >= 100) {
                  return "【突破瓶颈】核心题型已彻底融会，能够稳定斩获前排中档题，正攻坚最后两关高难大题。只要避免低级笔误就是极大的凯歌。";
                } else {
                  return "【模型沙化】许多基础通法生涩。一遇繁琐空间几何，总习惯用DFS和哈希寻路拼写，高考的死规定需要更密集的纸笔演练。";
                }
              })()}
            </p>
          </div>

          {/* English */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${getSubjectColorClass(scores.english, 150)} hover:shadow-xs transition-all duration-200`}>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" /> 英语 (Eng)
              </span>
              <span className="font-mono font-extrabold text-sm">{scores.english} <span className="opacity-60 text-[10px] font-normal">/ 150</span></span>
            </div>
            <div className="w-full bg-stone-200/40 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${getSubjectProgressColor(scores.english, 150)} transition-all duration-500`} 
                style={{ width: `${(scores.english / 150) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-sans opacity-75 leading-relaxed">
              {(() => {
                if (scores.english >= 120) {
                  return sleepQuality < 45
                    ? "【低眠脑雾】词汇储备庞大，李华的书信游刃有余。然而缺乏睡眠使你在长难句阅读中时常眼花，极易漏听听力关键句。"
                    : "【母语直觉】语感潇洒自如。3500个高考词汇完全刻入内存底层，非谓语动词完型几乎秒填。你在卷面上正写下无瑕的高精作文。";
                } else if (scores.english >= 95) {
                  return "【单词渐进】记诵正在逐步累积，阅读得分逐渐踏实。但高难倒装句和完形填空的熟语辨析依然是容易失分的高危地段。";
                } else {
                  return "【词海干涸】基础考点漏洞百出，完型填空常如抓阄。缺乏长夜睡眠更进一步剥夺了记诵力，李华的信写得支离破碎。";
                }
              })()}
            </p>
          </div>

          {/* Science */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${getSubjectColorClass(scores.science, 300)} hover:shadow-xs transition-all duration-200`}>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider">
                <Atom className="w-3.5 h-3.5" /> 理综 (Science)
              </span>
              <span className="font-mono font-extrabold text-sm">{scores.science} <span className="opacity-60 text-[10px] font-normal">/ 300</span></span>
            </div>
            <div className="w-full bg-stone-200/40 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${getSubjectProgressColor(scores.science, 300)} transition-all duration-500`} 
                style={{ width: `${(scores.science / 300) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-sans opacity-75 leading-relaxed">
              {(() => {
                if (scores.science >= 240) {
                  return stress >= 75 || stamina <= 20
                    ? "【强解极疲劳】核心受力、无机化学计算模型极其稳固。但极易受焦虑引发幻听影响，在多选题里丢失基本判断力。"
                    : "【重物理集成】毫无妥协的理综王者！竞赛的空间积分直觉令你在做物理大题受力弹道物理分析时手拿把攥，犹如行走的超算。";
                } else if (scores.science >= 180) {
                  return "【核心积聚】理综基本盘大致重连成功，能量守恒、有机推断能斩八成。生化实验大题偶尔卡壳在冷门口诀细节处。";
                } else {
                  return "【大厦未成】失分重灾区。物理受力常遗漏重力/阻力，化学方程式常漏填常数。算法超纲思路在这里无法应对死记。";
                }
              })()}
            </p>
          </div>

          {/* Physical Fitness */}
          <div className={`p-4 rounded-xl border sm:col-span-2 flex flex-col gap-2 ${getSubjectColorClass(scores.pe, 100)} hover:shadow-xs transition-all duration-200`}>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider text-emerald-800">
                <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 身体素质 (Fitness)
              </span>
              <span className="font-mono font-extrabold text-sm">{scores.pe} <span className="opacity-60 text-[10px] font-normal">/ 100</span></span>
            </div>
            <div className="w-full bg-stone-200/40 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${getSubjectProgressColor(scores.pe, 100)} transition-all duration-500`} 
                style={{ width: `${(scores.pe / 100) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-sans opacity-75 leading-relaxed">
              {(() => {
                if (scores.pe >= 80) {
                  return "【钢铁钢骨】体质极佳。1050米长跑有条不紊，心肺抗压储备极其饱满。过人的健康体能底座是支撑长时间持久用脑、平定身心焦虑的最强压舱石。";
                } else if (scores.pe >= 55) {
                  return "【凡躯稳健】身体状态处于平均水准，连续用脑易显疲累。建议每周适时进行一些耐力加练，支撑身心高负荷备考。";
                } else {
                  return "【身体告警】长期缺乏运动与熬夜导致的体能虚弱。稍微运动就心慌、注意力衰退，严重制约高强度复习吸收率。";
                }
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Mental / Physical Status Panel */}
      <div id="character-status-panel" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
        <h3 className="font-sans font-bold text-stone-900 text-lg mb-6 uppercase tracking-tight flex items-center gap-2">
          高三身心状态引擎
        </h3>

        <div className="flex flex-col gap-5">
          {/* Stamina */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold text-xs text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 物理精力 (Stamina)
              </span>
              <span className="font-mono font-extrabold text-xs text-stone-800">{stamina} / 100</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 border border-stone-200/50">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${stamina > 40 ? 'bg-emerald-500' : stamina > 15 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'}`}
                style={{ width: `${stamina}%` }}
              ></div>
            </div>
          </div>

          {/* Stress */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold text-xs text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Brain className="w-3.5 h-3.5 text-rose-500" /> 心理压力 (Stress)
              </span>
              <span className="font-mono font-extrabold text-xs text-stone-800">{stress} / 100</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 border border-stone-200/50">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${stress < 50 ? 'bg-blue-500' : stress < 75 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'}`}
                style={{ width: `${stress}%` }}
              ></div>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold text-xs text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Moon className="w-3.5 h-3.5 text-indigo-500" /> 睡眠质量 (Sleep)
              </span>
              <span className="font-mono font-extrabold text-xs text-stone-800">{sleepQuality} / 100</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 border border-stone-200/50">
              <div 
                className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${sleepQuality}%` }}
              ></div>
            </div>
          </div>

          {/* Pride with customized full-spectrum rendering */}
          {(() => {
            const clampedPride = Math.max(-100, Math.min(100, pride));
            const pridePercent = ((clampedPride + 100) / 200) * 100;
            
            // Determine friendly label & badge class
            let prideLabel = "自信平衡";
            let badgeClass = "text-stone-700 bg-stone-100 border-stone-200";
            if (clampedPride >= 55) {
              prideLabel = "算法傲执 (高精复习加成)";
              badgeClass = "text-amber-700 bg-amber-50 border-amber-300 animate-pulse font-bold";
            } else if (clampedPride > 15) {
              prideLabel = "积极昂扬";
              badgeClass = "text-yellow-700 bg-yellow-50 border-yellow-250 font-semibold";
            } else if (clampedPride < -50) {
              prideLabel = "退役余悲 (重度自卑)";
              badgeClass = "text-rose-700 bg-rose-50 border-rose-300 font-bold";
            } else if (clampedPride < 0) {
              prideLabel = "自我怀疑 (低效率惩罚)";
              badgeClass = "text-orange-700 bg-orange-50 border-orange-250 font-semibold";
            }

            return (
              <div className="flex flex-col gap-1.5 font-sans">
                <div className="flex justify-between items-center sm:gap-2">
                  <span className="font-sans font-semibold text-xs text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <Award className="w-3.5 h-3.5 text-yellow-600" /> OI 自傲与执念 (Pride)
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded border leading-none shrink-0 transition-colors duration-300 ${badgeClass}`}>
                    {clampedPride >= 0 ? `+${clampedPride}` : clampedPride} ({prideLabel})
                  </span>
                </div>
                <div className="w-full mt-1.5 relative">
                  {/* Slider background gradient bar */}
                  <div className="h-2 bg-gradient-to-r from-rose-500 via-stone-200 to-amber-500 rounded-full relative shadow-inner border border-stone-100">
                    {/* Midpoint line at 50% */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-stone-400 opacity-60 z-10"></div>
                    {/* Sliding marker indicator */}
                    <div 
                      className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-stone-900 shadow-md transform -translate-x-1/2 transition-all duration-500 z-20 flex items-center justify-center"
                      style={{ left: `${pridePercent}%` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900"></div>
                    </div>
                  </div>
                  {/* Min / Central / Max indicators */}
                  <div className="flex justify-between text-[9px] font-mono text-stone-400 mt-1">
                    <span>自卑/执念 (-100)</span>
                    <span className="translate-x-1.5">平衡 (0)</span>
                    <span>傲视全省 (+100)</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Resilience */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold text-xs text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> 心理韧性 (Resilience)
              </span>
              <span className="font-mono font-extrabold text-xs text-stone-800">{resilience} / 100</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 border border-stone-200/50">
              <div 
                className="h-1.5 rounded-full bg-teal-500 transition-all duration-500"
                style={{ width: `${resilience}%` }}
              ></div>
            </div>
          </div>

          {/* Dynamic Money display */}
          <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between shadow-xs">
            <span className="text-xs font-sans font-semibold text-stone-600 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              零散生活基金
            </span>
            <span className="font-mono text-sm font-extrabold text-stone-800">
              {funds} 元
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
