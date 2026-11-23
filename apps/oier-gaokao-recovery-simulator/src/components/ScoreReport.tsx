import React from 'react';
import { SubjectScores, PlayerStats } from '../types';
import { Award, ShieldAlert, GraduationCap, ArrowRight, Activity, Moon } from 'lucide-react';

interface ScoreReportProps {
  examName: string;
  scores: SubjectScores;
  stats: PlayerStats;
  onContinue: () => void;
}

export const ScoreReport: React.FC<ScoreReportProps> = ({
  examName,
  scores,
  stats,
  onContinue
}) => {
  const culturalScore = scores.chinese + scores.math + scores.english + scores.science;

  // Let's implement a realistic provincial Gaokao rank projection algorithm out of 750 cultural
  const getProjectedRank = (score: number) => {
    if (score >= 710) return Math.round(1 + (750 - score) * 3);
    if (score >= 670) return Math.round(15 + (710 - score) * 15);
    if (score >= 630) return Math.round(620 + (675 - score) * 100);
    if (score >= 580) return Math.round(4100 + (630 - score) * 480);
    if (score >= 510) return Math.round(31000 + (580 - score) * 1300);
    return Math.round(115000 + (510 - score) * 2100);
  };

  const rank = getProjectedRank(culturalScore);

  // Determine standard admission tier prediction
  const getAdmissionTier = (score: number) => {
    if (score >= 675) return { tier: '清北顶级招生范围 (Tsinghua / Peking University)', class: 'bg-red-50 text-red-800 border-red-200 shadow-xs' };
    if (score >= 615) return { tier: '顶尖985名校联盟 (C9 / Elite 985 Group)', class: 'bg-amber-50 text-amber-800 border-amber-200 shadow-xs' };
    if (score >= 580) return { tier: '优质211/国家双一流计划 (National 211 Elite)', class: 'bg-sky-50 text-sky-800 border-sky-200' };
    if (score >= 510) return { tier: '省属重点第一批一本 (Tier-1 Mainstream)', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (score >= 450) return { tier: '普通公立本科高校 (Tier-2 Public Service)', class: 'bg-stone-50 text-stone-800 border-stone-200' };
    return { tier: '职业高职技能方向 (Vocational Pathway)', class: 'bg-stone-100 text-stone-500 border-stone-250' };
  };

  const adTier = getAdmissionTier(culturalScore);

  // Teacher advice reports based on new stats during exam
  const getTeacherAdvice = () => {
    const advice: string[] = [];

    if (stats.pride >= 50) {
      advice.push(
            '【教务处评估】该生展现出强大而正向的信念自豪。面对高难度考题未有轻浮自责倾向，答卷从容流畅，信心充足。'
      );
    } else if (stats.pride < 0) {
      advice.push(
            '【心理老师提示】检测到明显的习得性自卑负指数。该生答卷上有极多由于自卑导致的无端涂改和犹豫犹豫。必须及时舒压、重建信心风骨。'
      );
    }

    if (stats.resilience >= 60) {
      advice.push(
            '【心理热枕核定】心理韧性高强，逆境适应速度出类拔萃，能够高效自我纠错，避免考试时的二次烦躁消耗。'
      );
    }

    if (scores.math >= 135) {
      advice.push(
        '【数理教研组红字】理科特长极佳！解答压轴题逻辑极其完美干净。其强悍的降维打击能力将是拉高文化课整体身位的决定性筹码。'
      );
    }

    if (stats.stress >= 80) {
      advice.push(
        '【考场紧急预警】该生由于压力极度濒临红线，听力做题中出现由于脑涨导致的幻觉和注意力滑丝。部分解答题没写完，急需静心休战！'
      );
    } else if (stats.stamina <= 20) {
      advice.push(
        '【医务室健康通告】身体极度疲惫透支！其在理综后段推演中由于精神恍忽出现了严重的写错常数失误。请务必优先保证八小时高质量睡眠。'
      );
    }

    if (advice.length === 0) {
      advice.push('【专家组综判】学科熟练度平稳，心理抗挫机能符合稳态。请保持日常节奏，坚定匀速复习。');
    }

    return advice;
  };

  const advices = getTeacherAdvice();

  return (
    <div id="score-report-view" className="bg-[#fdfbf7] p-8 rounded-2xl border-2 border-stone-350 shadow-lg relative max-w-2xl mx-auto my-6 overflow-hidden">
      {/* Dynamic Red Seal */}
      <div className="absolute top-12 right-12 w-28 h-28 rounded-full border-4 border-rose-500/25 flex items-center justify-center -rotate-12 select-none pointer-events-none">
        <div className="text-center text-[10px] text-rose-500/35 font-bold leading-tight font-sans">
          常青藤中学<br />
          教研管理一处<br />
          ★ 诊断专用印 ★
        </div>
      </div>

      <div className="border-b pl-2 pb-4 mb-6 border-stone-300">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-stone-700" />
          <span className="font-sans text-xs tracking-wider text-stone-500 uppercase font-semibold">2026届联合大模考联席评审</span>
        </div>
        <h2 className="font-sans font-bold text-stone-900 text-xl tracking-tight leading-none">
          【{examName}】综合复健诊断报告纸
        </h2>
      </div>

      {/* Main Scoreboard block */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
        <div className="bg-white p-2.5 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-400 font-sans mb-1 uppercase font-bold">语文</div>
          <div className="font-mono text-base font-extrabold text-stone-850">{scores.chinese}</div>
          <div className="text-[10px] text-stone-400">满 150</div>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-400 font-sans mb-1 uppercase font-bold">数学</div>
          <div className="font-mono text-base font-extrabold text-stone-850">{scores.math}</div>
          <div className="text-[10px] text-stone-400">满 150</div>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-400 font-sans mb-1 uppercase font-bold">英语</div>
          <div className="font-mono text-base font-extrabold text-stone-850">{scores.english}</div>
          <div className="text-[10px] text-stone-400">满 150</div>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-400 font-sans mb-1 uppercase font-bold">理综</div>
          <div className="font-mono text-base font-extrabold text-stone-850">{scores.science}</div>
          <div className="text-[10px] text-stone-400">满 300</div>
        </div>
      </div>

      {/* Ranks and Lines summary */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 mb-6 flex flex-col sm:flex-row justify-between gap-6 items-stretch shadow-xs">
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-xs text-stone-400 font-sans">诊断估分 (文化课总得):</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-mono text-4xl font-extrabold text-stone-900">{culturalScore}</span>
            <span className="text-stone-400 text-xs font-sans">/ 750分</span>
          </div>
        </div>
        <div className="w-px bg-stone-200 h-auto hidden sm:block"></div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-xs text-stone-400 font-sans">全省排名预测：</span>
          <div className="flex items-baseline gap-1 mt-1 text-stone-900 font-mono">
            <span className="text-2xl font-extrabold">第 {rank.toLocaleString()}</span>
            <span className="text-stone-400 text-xs font-sans">名</span>
          </div>
        </div>
      </div>

      {/* Admission level prediction banner */}
      <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${adTier.class}`}>
        <Award className="w-5 h-5 shrink-0 mt-0.5 text-stone-700" />
        <div>
          <h4 className="font-sans font-bold text-xs tracking-tight text-stone-900 uppercase">当前全省预计投档线：</h4>
          <p className="text-[11px] mt-1 leading-snug">{adTier.tier}</p>
          <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50/50 px-2.5 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-sans font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 身心素质系数保障支撑值: <b>{scores.pe} / 100</b> (已解耦高考，作为底盘影响消耗与恢复)
          </div>
        </div>
      </div>

      {/* Customized notes */}
      <div className="mb-6 animate-fadeIn">
        <h4 className="font-sans font-bold text-xs text-stone-500 uppercase tracking-wider mb-2">教研委员会专家会诊评价：</h4>
        <div className="flex flex-col gap-2">
          {advices.map((adv, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl text-xs leading-relaxed text-stone-600 border border-stone-200/60 flex gap-2 shadow-xs">
              <span className="text-stone-400 font-bold shrink-0">#0{idx+1}</span>
              <p>{adv}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button proceed */}
      <button
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-950 text-white font-sans text-xs font-bold uppercase rounded-xl py-4 shadow-xs hover:shadow-md transition-all cursor-pointer"
      >
        <span>收拢报告，重返百日攻守线</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
export default ScoreReport;
