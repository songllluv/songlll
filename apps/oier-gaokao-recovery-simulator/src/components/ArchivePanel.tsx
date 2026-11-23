import React, { useState, useEffect } from 'react';
import { GameState, SaveSlot } from '../types';
import { Save, FolderOpen, Trash2, Calendar, Award, RotateCcw, Copy, Clipboard } from 'lucide-react';
import { generateSaveString, decodeSaveString } from '../utils/gameMechanics';

interface ArchivePanelProps {
  currentState: GameState;
  onLoadState: (state: GameState, slotSummary: string) => void;
  onResetGame: () => void;
}

export const ArchivePanel: React.FC<ArchivePanelProps> = ({ 
  currentState, 
  onLoadState,
  onResetGame 
}) => {
  const [slots, setSlots] = useState<{ [key: string]: SaveSlot | null }>({
    'slot_1': null,
    'slot_2': null,
    'slot_3': null,
    'auto_save': null
  });

  const [message, setMessage] = useState<string | null>(null);
  const [importString, setImportString] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate current state's sync string dynamically
  const exportString = generateSaveString(currentState);

  // Load slots metadata on mount
  useEffect(() => {
    loadSlotsMetadata();
  }, [currentState]);

  const loadSlotsMetadata = () => {
    const loadedSlots: { [key: string]: SaveSlot | null } = {
      'slot_1': null,
      'slot_2': null,
      'slot_3': null,
      'auto_save': null
    };

    Object.keys(loadedSlots).forEach(slotId => {
      const data = localStorage.getItem(`gaokao_oi_save_${slotId}`);
      if (data) {
        try {
          loadedSlots[slotId] = JSON.parse(data);
        } catch (e) {
          console.error(`Error loading slot ${slotId}`, e);
        }
      }
    });

    setSlots(loadedSlots);
  };

  const handleSave = (slotId: string) => {
    if (slotId === 'auto_save') return;

    const total = 
      currentState.stats.scores.chinese + 
      currentState.stats.scores.math + 
      currentState.stats.scores.english + 
      currentState.stats.scores.science;

    const summary = `第 ${currentState.currentWeek} 周 | 预测文化分: ${total} | 精力: ${currentState.stats.stamina}`;

    const newSave: SaveSlot = {
      id: slotId,
      timestamp: new Date().toLocaleString(),
      week: currentState.currentWeek,
      stats: currentState.stats,
      summary: summary,
      state: {
        ...currentState,
        activeEvent: null 
      }
    };

    localStorage.setItem(`gaokao_oi_save_${slotId}`, JSON.stringify(newSave));
    setMessage(`✅ [ 存档槽位 0${slotId.replace('slot_', '')} ] 已写入内存`);
    loadSlotsMetadata();

    setTimeout(() => setMessage(null), 3000);
  };

  const handleLoad = (slotId: string) => {
    const slot = slots[slotId];
    if (!slot) return;

    onLoadState(slot.state, slot.summary);
    setMessage(`🔮 时光重置。当前进度：${slot.summary}`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除此存档 [槽位 0${slotId.replace('slot_', '')}] 吗？`)) {
      localStorage.removeItem(`gaokao_oi_save_${slotId}`);
      setMessage(`🗑️ 槽位 ${slotId.replace('slot_', '')} 已清空`);
      loadSlotsMetadata();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportString);
    setCopied(true);
    setMessage('📋 存档加密字符串已成功复制到剪纸板！');
    setTimeout(() => {
      setCopied(false);
      setMessage(null);
    }, 3000);
  };

  const handleImportCode = () => {
    if (!importString.trim()) {
      alert("请输入有效的加密存档代码！");
      return;
    }

    const decodedState = decodeSaveString(importString);
    if (!decodedState) {
      alert("🛑 存档验证失败！检测到代码曾被恶意篡改或格式错误。");
      return;
    }

    onLoadState(decodedState, `导入存档第 ${decodedState.currentWeek} 周`);
    setMessage('✨ 存档秘钥成功解密载入！');
    setImportString('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div id="archive-panel" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 relative flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-sans font-bold text-stone-900 text-lg uppercase tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-stone-700 font-bold" />
            时光机器与存档导入导出
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            支持防修改本地多槽位备份，同时提供具备完整防篡改特质的【存档秘钥代码】进行物理分享。
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("确定要放弃当前的奋斗记录，重返省队选拔结束的那天重试复健吗？")) {
              onResetGame();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg text-xs font-semibold bg-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          返归原点(重置)
        </button>
      </div>

      {message && (
        <div className="text-xs bg-stone-900 text-stone-100 font-sans px-3 py-2.5 rounded-xl border border-stone-800 animate-fadeIn flex justify-between items-center shadow-xs">
          <span>{message}</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Manual slots */}
        {['slot_1', 'slot_2', 'slot_3'].map((slotId, index) => {
          const slot = slots[slotId];
          return (
            <div 
              key={slotId}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border transition-all duration-300 ${
                slot 
                ? 'border-stone-200 bg-stone-50/20 hover:bg-stone-50/50' 
                : 'border-dashed border-stone-200 bg-transparent opacity-75'
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-sans font-bold text-xs text-stone-900 uppercase">
                    槽位 0{index + 1}
                  </span>
                  {slot ? (
                    <span className="text-[10px] font-mono text-stone-400">
                      更新：{slot.timestamp}
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400 font-sans italic">
                      无记录
                    </span>
                  )}
                </div>

                {slot && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" /> {slot.summary}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                {slot ? (
                  <button
                    onClick={() => handleLoad(slotId)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-950 text-white rounded-lg px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors cursor-pointer"
                  >
                    读档
                  </button>
                ) : null}
                
                <button
                  onClick={() => handleSave(slotId)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors cursor-pointer ${
                    slot 
                    ? 'border-stone-300 text-stone-600 hover:bg-stone-100' 
                    : 'border-stone-300 text-stone-700 bg-white hover:bg-stone-50'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  {slot ? '覆写' : '储存'}
                </button>

                {slot && (
                  <button
                    onClick={(e) => handleDelete(slotId, e)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg border border-transparent hover:border-stone-200 transition-colors cursor-pointer"
                    title="删除存档"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="border-t border-stone-200"></div>

        {/* Dynamic raw sync base64 transfer string panel */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
          <div>
            <h4 className="font-sans font-bold text-xs text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
              <Clipboard className="w-3.5 h-3.5 text-stone-500" />
              导出当前加密存档
            </h4>
            <p className="text-[10px] text-stone-400 leading-relaxed mt-1">
              可以复制下方的一串防修改 Base64 字符进行留存，未来直接输入还原进度：
            </p>
          </div>

          <div className="flex items-center gap-2 w-full">
            <input 
              readOnly 
              type="text" 
              value={exportString} 
              className="flex-1 font-mono text-[10px] bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 truncate text-stone-500 focus:outline-none"
            />
            <button 
              onClick={handleCopyCode}
              className="shrink-0 flex items-center gap-1 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? '已复制' : '复制'}</span>
            </button>
          </div>

          <div className="border-t border-stone-200/50 my-1"></div>

          <div>
            <h4 className="font-sans font-bold text-xs text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-stone-500" />
              密写提取载入 (输入加密字符)
            </h4>
          </div>

          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              placeholder="请在此粘贴您的加密存档秘钥..." 
              value={importString}
              onChange={(e) => setImportString(e.target.value)}
              className="flex-1 font-mono text-[11px] bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-stone-800"
            />
            <button 
              onClick={handleImportCode}
              className="bg-stone-900 hover:bg-stone-950 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              解密校验
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArchivePanel;
