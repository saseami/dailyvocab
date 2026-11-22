import React, { useState, useMemo } from 'react';
import { Word } from '../types';
import { Volume2, Star, Search, CheckCircle2, Bookmark, Trash2, Lightbulb, BookOpen } from 'lucide-react';
import { speakWord } from '../utils/audio';

interface WordListModeProps {
  words: Word[];
  bookmarkedWords: string[];
  learnedWords: string[];
  masteredWords: string[];
  onToggleBookmark: (wordId: string) => void;
  onDeleteCustomWord?: (wordId: string) => void;
}

export const WordListMode: React.FC<WordListModeProps> = ({
  words,
  bookmarkedWords,
  learnedWords,
  masteredWords,
  onToggleBookmark,
  onDeleteCustomWord,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'bookmarked' | 'mastered' | 'learning'>('all');
  const [localSearch, setLocalSearch] = useState('');

  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchesSearch =
        localSearch.trim() === '' ||
        w.word.toLowerCase().includes(localSearch.toLowerCase()) ||
        w.meaningVi.toLowerCase().includes(localSearch.toLowerCase()) ||
        w.definitionEn.toLowerCase().includes(localSearch.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === 'bookmarked') return bookmarkedWords.includes(w.id);
      if (filterType === 'mastered') return masteredWords.includes(w.id);
      if (filterType === 'learning') return learnedWords.includes(w.id) && !masteredWords.includes(w.id);

      return true;
    });
  }, [words, filterType, localSearch, bookmarkedWords, masteredWords, learnedWords]);

  return (
    <div className="py-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm kiếm từ vựng, phiên âm, nghĩa tiếng Việt..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Tất cả ({words.length})
          </button>
          <button
            onClick={() => setFilterType('bookmarked')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'bookmarked'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Star className="w-3.5 h-3.5" /> Yêu thích
          </button>
          <button
            onClick={() => setFilterType('mastered')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'mastered'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã thuộc
          </button>
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500">
            Không tìm thấy từ vựng phù hợp với bộ lọc.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((word) => {
            const isBookmarked = bookmarkedWords.includes(word.id);
            const isMastered = masteredWords.includes(word.id);
            const isCustom = word.id.startsWith('custom-');

            return (
              <div
                key={word.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Word, phonetics, audio, badges, star */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          {word.word}
                        </h4>
                        <button
                          onClick={() => speakWord(word.word)}
                          className="p-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-slate-800 text-brand-600 dark:text-brand-400 transition-colors"
                          title="Phát âm từ"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                        {word.phonetic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {word.partOfSpeech}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                        {word.cefr}
                      </span>
                      <button
                        onClick={() => onToggleBookmark(word.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Yêu thích"
                      >
                        <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                      {isCustom && onDeleteCustomWord && (
                        <button
                          onClick={() => onDeleteCustomWord(word.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                          title="Xóa từ tự tạo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vietnamese Meaning */}
                  {word.toeicContext && (
                    <div className="mb-1.5">
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                        🎯 {word.toeicContext}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-1">
                    {word.meaningVi}
                  </p>

                  {/* English Definition */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-3 leading-relaxed">
                    "{word.definitionEn}"
                  </p>

                  {/* Example Sentence */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {word.example}
                      </p>
                      <button
                        onClick={() => speakWord(word.example, 0.9)}
                        className="text-slate-400 hover:text-brand-600 flex-shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      👉 {word.exampleVi}
                    </p>
                  </div>

                  {/* Collocations */}
                  {word.collocations && word.collocations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[11px] font-semibold text-slate-400">Cụm từ:</span>
                      {word.collocations.map((col, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mnemonic */}
                  {word.mnemonic && (
                    <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/20 p-2 rounded-lg">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{word.mnemonic}</span>
                    </div>
                  )}
                </div>

                {/* Card footer indicator */}
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ngày {word.day}</span>
                  {isMastered && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã thuộc lòng
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
