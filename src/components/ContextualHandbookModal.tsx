import React, { useState } from 'react';
import { 
  X, 
  BookMarked, 
  Volume2, 
  Plus, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { 
  CONTEXTUAL_FORUM_GROUPS, 
  CONTEXTUAL_ERROR_TRAPS, 
  CONTEXTUAL_PRACTICE_PASSAGES, 
  ContextualItem 
} from '../data/contextualForumVocab';
import { Word } from '../types';

interface ContextualHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToNotebook?: (word: Omit<Word, 'id'>) => void;
  savedWordIds?: string[];
}

export const ContextualHandbookModal: React.FC<ContextualHandbookModalProps> = ({
  isOpen,
  onClose,
  onSaveToNotebook,
  savedWordIds = [],
}) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'traps' | 'passages'>('groups');
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentGroup = CONTEXTUAL_FORUM_GROUPS.find((g) => g.id === selectedGroupId) || CONTEXTUAL_FORUM_GROUPS[0];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveItem = (item: ContextualItem) => {
    if (onSaveToNotebook) {
      onSaveToNotebook({
        word: item.phrase,
        phonetic: item.phonetic,
        partOfSpeech: item.partOfSpeech,
        meaningVi: item.meaningVi,
        definitionEn: item.definitionEn,
        example: item.exampleEn,
        exampleVi: item.exampleVi,
        collocations: [item.structure],
        cefr: item.cefr,
        topicId: 'contextual-forum-vocab',
        day: 1,
        toeicContext: `Từ vựng theo ngữ cảnh: ${currentGroup.titleVi}. Lưu ý: ${item.nuanceTip || currentGroup.nuanceNotes}`,
      });
      setJustSavedId(item.id);
      setTimeout(() => setJustSavedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#801732] via-[#9f2244] to-[#540b1e] text-white flex items-start justify-between gap-3 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  Tài Liệu Độc Quyền
                </span>
                <span className="text-xs text-rose-200 font-medium">
                  Nguyễn Hoàng Huy • The Forum Center
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black mt-1 text-white leading-tight">
                Cẩm Nang Từ Vựng Tiếng Anh Theo Ngữ Cảnh
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/90 mt-0.5 line-clamp-1">
                10 Chuyên đề Cụm từ thực chiến • Phân biệt sắc thái • 8 Bẫy lỗi sai kinh điển
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex-shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'groups'
                ? 'bg-[#801732] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>10 Nhóm Cụm Từ Ngữ Cảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('traps')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'traps'
                ? 'bg-[#801732] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>8 Bẫy Lỗi Sai Thường Gặp</span>
          </button>

          <button
            onClick={() => setActiveTab('passages')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'passages'
                ? 'bg-[#801732] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Thực Hành Đoạn Văn Mẫu</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: 10 NHÓM NGỮ CẢNH */}
          {activeTab === 'groups' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Group Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {CONTEXTUAL_FORUM_GROUPS.map((g) => {
                  const isSelected = g.id === selectedGroupId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGroupId(g.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#801732] text-white shadow-sm ring-1 ring-[#801732]'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{g.titleVi.split('.')[0]}.</span> {g.titleVi.split('.')[1]}
                    </button>
                  );
                })}
              </div>

              {/* Group Overview & Nuance Notes Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <h3 className="text-sm sm:text-base font-black">
                    {currentGroup.titleVi}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {currentGroup.summary}
                </p>
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-black uppercase tracking-wider block text-[10px]">
                    💡 Ghi Chú Phân Biệt Sắc Thái Cốt Lõi:
                  </span>
                  <p className="leading-relaxed">
                    {currentGroup.nuanceNotes}
                  </p>
                </div>
              </div>

              {/* Items List in Current Group */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Danh Sách Cụm Từ &amp; Cấu Trúc Trọng Tâm ({currentGroup.items.length} cụm)
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {currentGroup.items.map((item) => {
                    const isSaved = savedWordIds.includes(`forum-${item.id}`) || justSavedId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-900 transition-all space-y-3 shadow-2xs"
                      >
                        {/* Title & Actions */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => speakText(item.phrase)}
                              className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-[#801732] dark:text-rose-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                              title="Nghe phát âm cụm từ"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-black text-slate-900 dark:text-white">
                                  {item.phrase}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {item.phonetic}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                                  {item.cefr}
                                </span>
                              </div>
                              <div className="text-xs font-mono text-purple-700 dark:text-purple-300 font-semibold mt-0.5">
                                Cấu trúc: <span className="bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-200/60 dark:border-purple-800/60">{item.structure}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleSaveItem(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                              isSaved
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-white dark:bg-slate-700 hover:bg-rose-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Đã lưu</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Lưu sổ từ</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Meaning & Definition */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700/60">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            🇻🇳 {item.meaningVi}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic">
                            🇬🇧 {item.definitionEn}
                          </p>
                        </div>

                        {/* Example Sentence with Audio */}
                        <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs sm:text-sm text-blue-950 dark:text-blue-100 font-semibold leading-relaxed">
                              "{item.exampleEn}"
                            </p>
                            <button
                              onClick={() => speakText(item.exampleEn)}
                              className="p-1 rounded-lg hover:bg-blue-200/50 text-blue-700 dark:text-blue-300 flex-shrink-0"
                              title="Nghe đọc cả câu ví dụ"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-blue-800/80 dark:text-blue-300/80 italic">
                            ➔ {item.exampleVi}
                          </p>
                        </div>

                        {/* Nuance Tip */}
                        {item.nuanceTip && (
                          <div className="flex items-start gap-1.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-200/40">
                            <span className="font-black flex-shrink-0">Mẹo sắc thái:</span>
                            <span>{item.nuanceTip}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BẢN ĐỒ 8 BẪY LỖI SAI */}
          {activeTab === 'traps' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <h3 className="text-sm sm:text-base font-black text-rose-900 dark:text-rose-200 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>8 Lỗi Sai Ngữ Pháp &amp; Dùng Từ Phổ Biến Nhất (The Forum Center)</span>
                </h3>
                <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                  Những lỗi sai kinh điển người học Việt Nam thường mắc phải trong bài thi TOEIC/IELTS và giao tiếp văn phòng.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {CONTEXTUAL_ERROR_TRAPS.map((trap, idx) => (
                  <div
                    key={trap.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {trap.ruleVi}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Wrong */}
                      <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs">
                        <span className="font-black text-rose-700 dark:text-rose-400 block mb-1">
                          ❌ Lỗi sai thường gặp:
                        </span>
                        <p className="font-mono text-slate-800 dark:text-slate-200 line-through decoration-rose-500">
                          {trap.wrong}
                        </p>
                      </div>

                      {/* Correct */}
                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs">
                        <span className="font-black text-emerald-700 dark:text-emerald-400 block mb-1">
                          ✅ Cách viết chuẩn xác:
                        </span>
                        <p className="font-mono text-emerald-900 dark:text-emerald-200 font-bold">
                          {trap.correct}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Phân tích bản chất: </strong>
                      {trap.explanationVi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THỰC HÀNH ĐOẠN VĂN MẪU */}
          {activeTab === 'passages' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
                <h3 className="text-sm sm:text-base font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span>Cách Dùng Cụm Từ Trong Câu &amp; Đoạn Văn (Real Context Application)</span>
                </h3>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1 leading-relaxed">
                  Xem cách các cụm từ ngữ cảnh được kết nối mạch lạc trong các đoạn văn nghị luận, công sở và quyết định đời sống thực tế.
                </p>
              </div>

              <div className="space-y-5">
                {CONTEXTUAL_PRACTICE_PASSAGES.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {p.title}
                      </h4>
                      <button
                        onClick={() => speakText(p.passageEn)}
                        className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#801732] dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100"
                        title="Nghe đọc cả đoạn văn"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Nghe đoạn văn</span>
                      </button>
                    </div>

                    {/* Dual language cards */}
                    <div className="space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                          Văn bản tiếng Anh:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                          {p.passageEn}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                        <span className="text-[10px] font-black uppercase text-rose-500 block mb-1">
                          Bản dịch tiếng Việt hoàn chỉnh:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                          {p.passageVi}
                        </p>
                      </div>
                    </div>

                    {/* Key Phrases Pills */}
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">
                        Cụm từ then chốt đã vận dụng:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.keyPhrases.map((phrase, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Logic Analysis */}
                    <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                      <strong className="text-amber-950 dark:text-amber-100">Phân tích lập luận logic: </strong>
                      {p.analysisVi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Nguồn tài liệu: <strong>"Từ vựng tiếng Anh theo ngữ cảnh"</strong> - Tác giả Nguyễn Hoàng Huy (The Forum Center)
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#801732] hover:bg-[#6b132a] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#801732]/20 active:scale-95 transition-all ml-auto"
          >
            Đóng Cẩm Nang
          </button>
        </div>

      </div>
    </div>
  );
};
