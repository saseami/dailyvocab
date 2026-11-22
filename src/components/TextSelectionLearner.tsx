import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { BookOpen, Sparkles, Plus, Check, ExternalLink, X } from 'lucide-react';
import { getContextualWordInfo } from '../utils/contextualDictionary';
import { playSound } from '../utils/audio';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any = null;

    const handleSelection = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        const rawText = selection.toString().trim();
        // Clean off non-alphabetical punctuation at edges
        const text = rawText.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim();

        // Target: single words or short idioms (2 to 35 chars, max 3 words)
        if (text.length >= 2 && text.length <= 35 && text.split(/\s+/).length <= 3) {
          setSelectedText(text);

          try {
            const range = selection.getRangeAt(0);
            const containerText = range.commonAncestorContainer.textContent || '';
            let sentence = text;
            if (containerText.length > text.length) {
              const textIdx = containerText.indexOf(text);
              if (textIdx !== -1) {
                const prevPeriod = containerText.lastIndexOf('.', textIdx);
                const nextPeriod = containerText.indexOf('.', textIdx + text.length);
                const start = prevPeriod !== -1 ? prevPeriod + 1 : 0;
                const end = nextPeriod !== -1 ? nextPeriod + 1 : containerText.length;
                sentence = containerText.substring(start, end).trim();
              }
            }
            setContextSentence(sentence);
          } catch {
            setContextSentence(text);
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
  }, []);

  const handleLearnWord = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedText) return;

    // Resolve word details from contextual dictionary
    const info = getContextualWordInfo(selectedText, contextSentence);

    const newWordData: Omit<Word, 'id'> = {
      word: info.word || selectedText,
      phonetic: info.ipa || `/${selectedText.toLowerCase()}/`,
      partOfSpeech: (info.partOfSpeech as any) || 'noun',
      meaningVi: info.meaningVi || 'Từ vựng lưu từ bài học',
      definitionEn: info.collocation?.explanation || `Saved in context: "${contextSentence || selectedText}"`,
      example: contextSentence || selectedText,
      exampleVi: info.collocation?.meaningVi || '',
      cefr: 'B2',
      topicId: 'custom-personal-notebook',
      day: 99,
      toeicContext: 'Từ vựng cá nhân hóa thu thập trong quá trình đọc tài liệu & làm đề',
    };

    onSaveCustomWord(newWordData);
    playSound('correct');

    const savedWordName = selectedText;
    setSelectedText('');
    setToastMessage(`Đã thêm "${savedWordName}" (${info.meaningVi}) vào Sổ Từ Cá Nhân!`);

    try {
      window.getSelection()?.removeAllRanges();
    } catch {}

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleDismiss = () => {
    setSelectedText('');
    try {
      window.getSelection()?.removeAllRanges();
    } catch {}
  };

  return (
    <>
      {/* Floating Action Pill docked above bottom navigation on Mobile & Desktop */}
      {selectedText && (
        <div
          ref={containerRef}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto max-w-[92vw] animate-in fade-in slide-in-from-bottom-3 duration-150"
        >
          <div className="flex items-center gap-2 p-1.5 pl-3.5 pr-2 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white border-2 border-rose-500/80 shadow-2xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
            
            <div className="min-w-0 pr-1 text-left">
              <span className="text-xs font-black text-rose-300 truncate block">
                "{selectedText}"
              </span>
              <span className="text-[10px] text-slate-300 block truncate">
                Tô đen để học từ mới
              </span>
            </div>

            <button
              onClick={handleLearnWord}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#801732] to-rose-600 hover:from-[#6b132a] hover:to-rose-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lưu vào Sổ Từ</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white text-xs ml-0.5"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
