import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { 
  Sparkles, Plus, Check, ExternalLink, X, Edit3, Volume2, Save, 
  Maximize2, ChevronUp, ChevronDown, BookOpen, Lightbulb, Layers, Bookmark, ArrowUpRight 
} from 'lucide-react';
import { playSound, speakWord } from '../utils/audio';
import { lookupWordLocal, translateWordOnline, TranslatedWordResult, cleanSelectedWord } from '../utils/translator';

interface TextSelectionLearnerProps {
  onSaveCustomWord: (word: Omit<Word, 'id'>) => void;
  onOpenPersonalTopic?: () => void;
}

export const TextSelectionLearner: React.FC<TextSelectionLearnerProps> = ({
  onSaveCustomWord,
  onOpenPersonalTopic,
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [contextSentence, setContextSentence] = useState<string>('');
  const [translatedResult, setTranslatedResult] = useState<TranslatedWordResult | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isExpandedOpen, setIsExpandedOpen] = useState<boolean>(false);

  // Form states for Edit Modal
  const [editWord, setEditWord] = useState('');
  const [editPhonetic, setEditPhonetic] = useState('');
  const [editMeaningVi, setEditMeaningVi] = useState('');
  const [editExample, setEditExample] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any = null;

    const handleSelection = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        // If edit modal is currently open, don't capture new selections
        if (isEditModalOpen) return;

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        const rawText = selection.toString().trim();
        const clean = cleanSelectedWord(rawText);

        // Target: single words or short idioms (2 to 35 chars, max 3 words)
        if (clean.length >= 2 && clean.length <= 35 && clean.split(/\s+/).length <= 4) {
          setSelectedText(clean);

          // Extract surrounding sentence
          let sentence = clean;
          try {
            const range = selection.getRangeAt(0);
            const containerText = range.commonAncestorContainer.textContent || '';
            if (containerText.length > clean.length) {
              const textIdx = containerText.toLowerCase().indexOf(clean.toLowerCase());
              if (textIdx !== -1) {
                const prevPeriod = containerText.lastIndexOf('.', textIdx);
                const nextPeriod = containerText.indexOf('.', textIdx + clean.length);
                const start = prevPeriod !== -1 ? prevPeriod + 1 : 0;
                const end = nextPeriod !== -1 ? nextPeriod + 1 : containerText.length;
                sentence = containerText.substring(start, end).trim();
              }
            }
          } catch {}
          setContextSentence(sentence);

          // 1. Instant local lookup for 0ms preview
          const localMatch = lookupWordLocal(clean, sentence);
          if (localMatch) {
            setTranslatedResult(localMatch);
            setEditWord(localMatch.word);
            setEditPhonetic(localMatch.phonetic);
            setEditMeaningVi(localMatch.meaningVi);
            setEditExample(localMatch.example);
            setIsTranslating(false);
          } else {
            // Initial placeholder while fetching translation
            setTranslatedResult({
              word: clean,
              phonetic: `/${clean}/`,
              partOfSpeech: 'noun',
              meaningVi: 'Đang dịch nghĩa...',
              definitionEn: `Saved from context: "${sentence}"`,
              example: sentence,
            });
            setIsTranslating(true);

            // 2. Fetch high-quality online translation
            translateWordOnline(clean, sentence).then((res) => {
              setTranslatedResult(res);
              setEditWord(res.word);
              setEditPhonetic(res.phonetic);
              setEditMeaningVi(res.meaningVi);
              setEditExample(res.example);
              setIsTranslating(false);
            }).catch(() => {
              setIsTranslating(false);
            });
          }
        }
      }, 150);
    };

    // Support both Desktop (mouseup) and Mobile Safari/iOS (touchend & selectionchange)
    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, [isEditModalOpen]);

  // Quick save with current translated info
  const handleQuickSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedText) return;

    const data = translatedResult || lookupWordLocal(selectedText, contextSentence) || {
      word: selectedText,
      phonetic: `/${selectedText}/`,
      partOfSpeech: 'noun',
      meaningVi: selectedText,
      definitionEn: `Vocabulary saved in context: "${contextSentence}"`,
      example: contextSentence || selectedText,
    };

    const newWordData: Omit<Word, 'id'> = {
      word: data.word || selectedText,
      phonetic: data.phonetic || `/${selectedText}/`,
      partOfSpeech: (data.partOfSpeech as any) || 'noun',
      meaningVi: data.meaningVi && data.meaningVi !== 'Đang dịch nghĩa...' ? data.meaningVi : selectedText,
      definitionEn: data.definitionEn || `Saved in context: "${contextSentence || selectedText}"`,
      example: contextSentence || selectedText,
      exampleVi: data.exampleVi || '',
      cefr: 'B2',
      topicId: 'custom-personal-notebook',
      day: 99,
      toeicContext: 'Từ vựng cá nhân hóa thu thập trong quá trình đọc tài liệu & làm đề',
    };

    onSaveCustomWord(newWordData);
    playSound('correct');

    const savedWordName = data.word || selectedText;
    const savedMeaning = newWordData.meaningVi;
    setSelectedText('');
    setTranslatedResult(null);
    setIsExpandedOpen(false);
    setToastMessage(`Đã thêm "${savedWordName}" (${savedMeaning}) vào Sổ Từ Cá Nhân!`);

    try {
      window.getSelection()?.removeAllRanges();
    } catch {}

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Open Edit / Review Modal before saving
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  // Save from Edit Modal
  const handleSaveFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editWord.trim()) return;

    const newWordData: Omit<Word, 'id'> = {
      word: editWord.trim(),
      phonetic: editPhonetic.trim() || `/${editWord.trim().toLowerCase()}/`,
      partOfSpeech: (translatedResult?.partOfSpeech as any) || 'noun',
      meaningVi: editMeaningVi.trim() || editWord.trim(),
      definitionEn: translatedResult?.definitionEn || `Saved in context: "${editExample.trim()}"`,
      example: editExample.trim() || editWord.trim(),
      exampleVi: '',
      cefr: 'B2',
      topicId: 'custom-personal-notebook',
      day: 99,
      toeicContext: 'Từ vựng cá nhân hóa thu thập trong quá trình đọc tài liệu & làm đề',
    };

    onSaveCustomWord(newWordData);
    playSound('correct');

    const savedWordName = newWordData.word;
    const savedMeaning = newWordData.meaningVi;
    setIsEditModalOpen(false);
    setSelectedText('');
    setTranslatedResult(null);
    setIsExpandedOpen(false);
    setToastMessage(`Đã thêm "${savedWordName}" (${savedMeaning}) vào Sổ Từ Cá Nhân!`);

    try {
      window.getSelection()?.removeAllRanges();
    } catch {}

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleDismiss = () => {
    setSelectedText('');
    setTranslatedResult(null);
    setIsExpandedOpen(false);
    try {
      window.getSelection()?.removeAllRanges();
    } catch {}
  };

  return (
    <>
      {/* Floating Action Pill docked above bottom navigation on Mobile & Desktop */}
      {selectedText && !isEditModalOpen && (
        <div
          ref={containerRef}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto max-w-[94vw] w-auto animate-in fade-in slide-in-from-bottom-3 duration-150"
        >
          <div className="flex items-center gap-2 p-1.5 pl-3 pr-1.5 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white border-2 border-rose-500/80 shadow-2xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
            
            <div 
              onClick={() => setIsExpandedOpen(true)}
              className="min-w-0 pr-1 text-left max-w-[125px] sm:max-w-[185px] cursor-pointer hover:opacity-90"
              title="Bấm để mở rộng xem chi tiết và gợi ý câu ví dụ"
            >
              <span className="text-xs font-black text-rose-300 truncate block">
                "{selectedText}"
              </span>
              <span className="text-[11px] text-emerald-300 font-bold block truncate">
                {isTranslating ? (
                  <span className="text-amber-300/80 italic">Đang tra nghĩa...</span>
                ) : (
                  translatedResult?.meaningVi || 'Sẵn sàng lưu từ'
                )}
              </span>
            </div>

            {/* Expand Details Button */}
            <button
              onClick={() => setIsExpandedOpen(true)}
              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-all border border-slate-700"
              title="Bấm mở rộng để xem chi tiết, nghe phát âm và xem gợi ý câu ví dụ"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Mở rộng</span>
            </button>

            {/* Quick 1-Click Save */}
            <button
              onClick={handleQuickSave}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#801732] to-rose-600 hover:from-[#6b132a] hover:to-rose-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-all"
              title="Lưu ngay với nghĩa này"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lưu</span>
            </button>

            {/* Edit / Review Button */}
            <button
              onClick={handleOpenEdit}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 flex-shrink-0 transition-all border border-slate-700"
              title="Chỉnh sửa nghĩa hoặc phiên âm trước khi lưu"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white text-xs ml-0.5 flex-shrink-0"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Expanded Word Details & Suggested Context Modal */}
      {isExpandedOpen && selectedText && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto scrollbar-thin">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2.5 min-w-0">
                <button
                  onClick={() => speakWord(translatedResult?.word || selectedText)}
                  className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-[#801732] dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-xs"
                  title="Nghe phát âm bản xứ"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white capitalize">
                      {translatedResult?.word || selectedText}
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#801732] dark:text-rose-300">
                      {translatedResult?.partOfSpeech || 'noun / phrase'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {translatedResult?.phonetic || `/${selectedText}/`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExpandedOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-shrink-0"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meaning & Vietnamese Translation */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                Dịch Nghĩa Tiếng Việt:
              </span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {translatedResult?.meaningVi || selectedText}
              </p>
              {translatedResult?.definitionEn && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic leading-relaxed">
                  {translatedResult.definitionEn}
                </p>
              )}
            </div>

            {/* Context Sentence where word was selected */}
            {contextSentence && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#801732] dark:text-rose-400" />
                    <span>Ngữ Cảnh Trong Câu Bạn Vừa Đọc:</span>
                  </span>
                  <button
                    onClick={() => speakWord(contextSentence)}
                    className="text-[11px] font-bold text-slate-500 hover:text-[#801732] flex items-center gap-1"
                    title="Nghe đọc cả câu ngữ cảnh"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Nghe câu</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  "{contextSentence}"
                </p>
              </div>
            )}

            {/* Suggested Example Sentences */}
            {translatedResult?.suggestedExamples && translatedResult.suggestedExamples.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gợi Ý Câu Ví Dụ Thực Tế Chuẩn ETS ({translatedResult.suggestedExamples.length} câu):</span>
                </span>
                
                <div className="space-y-2">
                  {translatedResult.suggestedExamples.map((ex, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200/80 dark:border-slate-700/80 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          • {ex.en}
                        </p>
                        <button
                          onClick={() => speakWord(ex.en)}
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-600 flex-shrink-0"
                          title="Nghe câu ví dụ"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-2">
                        {ex.vi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Collocations / Phrases */}
            {translatedResult?.collocations && translatedResult.collocations.length > 0 && (
              <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Cụm Từ Ghép (Collocations) Thường Đi Cùng:</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {translatedResult.collocations.map((col, cIdx) => (
                    <span 
                      key={cIdx}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 shadow-2xs"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsExpandedOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Thu gọn
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenEdit}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Tùy chỉnh</span>
                </button>

                <button
                  onClick={handleQuickSave}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#801732] to-rose-600 hover:from-[#6b132a] hover:to-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#801732]/30 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Lưu vào Sổ Từ</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit / Review Modal before saving to notebook */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#801732] text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Lưu từ vựng vào Sổ Từ Cá Nhân
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kiểm tra và tùy chỉnh nghĩa tiếng Việt chuẩn xác
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFromModal} className="space-y-3.5">
              {/* Word & IPA */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Từ tiếng Anh:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editWord}
                      onChange={(e) => setEditWord(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#801732]"
                    />
                    <button
                      type="button"
                      onClick={() => speakWord(editWord)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#801732]"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Phiên âm (IPA):
                  </label>
                  <input
                    type="text"
                    value={editPhonetic}
                    onChange={(e) => setEditPhonetic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#801732]"
                  />
                </div>
              </div>

              {/* Meaning VI */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Nghĩa tiếng Việt chuẩn: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editMeaningVi}
                  onChange={(e) => setEditMeaningVi(e.target.value)}
                  placeholder="Ví dụ: hướng dẫn, nguyên tắc chỉ đạo"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#801732]"
                />
              </div>

              {/* Context Sentence */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Câu ví dụ / Ngữ cảnh thực tế:
                </label>
                <textarea
                  value={editExample}
                  onChange={(e) => setEditExample(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#801732] resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#801732] to-rose-600 hover:from-[#6b132a] hover:to-rose-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#801732]/30 active:scale-95 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu vào Sổ Từ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification when word is saved */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] max-w-sm animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">{toastMessage}</p>
              <p className="text-[11px] text-slate-400">
                Đã đồng bộ vào <strong>Sổ Từ Cá Nhân</strong>.
              </p>
            </div>
            {onOpenPersonalTopic && (
              <button
                onClick={() => {
                  onOpenPersonalTopic();
                  setToastMessage(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#801732] hover:bg-[#6b132a] text-[11px] font-black text-white flex items-center gap-1 ml-2 transition-all flex-shrink-0"
              >
                <span>Học ngay</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
