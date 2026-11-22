import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { BookOpen, Sparkles, Plus, Check, ExternalLink } from 'lucide-react';
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
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        // Only clear if not clicking our own button
        return;
      }

      const text = selection.toString().trim();
      // Filter out overly long text selections or single characters
      if (text.length > 1 && text.length <= 40 && text.split(/\s+/).length <= 4) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Try to get surrounding sentence context
          const containerText = range.commonAncestorContainer.textContent || '';
          let sentence = text;
          if (containerText.length > text.length) {
            // Find sentence boundaries around the text
            const textIdx = containerText.indexOf(text);
            if (textIdx !== -1) {
              const prevPeriod = containerText.lastIndexOf('.', textIdx);
              const nextPeriod = containerText.indexOf('.', textIdx + text.length);
              const start = prevPeriod !== -1 ? prevPeriod + 1 : 0;
              const end = nextPeriod !== -1 ? nextPeriod + 1 : containerText.length;
              sentence = containerText.substring(start, end).trim();
            }
          }

          setSelectedText(text);
          setContextSentence(sentence);

          // Position tooltip above the selection, clamped to viewport
          const top = Math.max(10, rect.top + window.scrollY - 44);
          const left = Math.min(window.innerWidth - 180, Math.max(10, rect.left + window.scrollX + (rect.width / 2) - 80));
          setButtonPosition({ top, left });
        } catch {
          setButtonPosition(null);
        }
      } else {
        setButtonPosition(null);
      }
    };

    const handleMouseUp = () => {
      // Small timeout to allow selection to settle
      setTimeout(handleSelectionChange, 100);
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        return;
      }
      // Clicked outside, check if selection was cleared
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setButtonPosition(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleDocumentClick);
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

    // Show toast confirmation
    setToastMessage(`Đã thêm "${selectedText}" vào Sổ Từ Cá Nhân!`);
    setButtonPosition(null);

    // Clear window selection
    window.getSelection()?.removeAllRanges();

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <>
      {/* Floating Action Button above highlighted text */}
      {buttonPosition && (
        <div
          ref={containerRef}
          style={{ top: `${buttonPosition.top}px`, left: `${buttonPosition.left}px` }}
          className="fixed z-50 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
        >
          <button
            onClick={handleLearnWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#801732] hover:bg-[#6b132a] text-white text-xs font-black shadow-lg shadow-[#801732]/30 active:scale-95 transition-all ring-2 ring-white/50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>+ Học từ này</span>
          </button>
        </div>
      )}

      {/* Toast Notification when word is saved */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">{toastMessage}</p>
              <p className="text-[11px] text-slate-400">
                Lưu vào <strong>Sổ Từ Cá Nhân</strong> có đầy đủ Flashcard &amp; Kiểm tra.
              </p>
            </div>
            {onOpenPersonalTopic && (
              <button
                onClick={() => {
                  onOpenPersonalTopic();
                  setToastMessage(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#801732] hover:bg-[#6b132a] text-[11px] font-black text-white flex items-center gap-1 ml-2 transition-all"
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
