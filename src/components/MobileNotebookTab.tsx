import React, { useState, useMemo } from 'react';
import { Word } from '../types';
import { 
  BookmarkCheck, Star, Search, Plus, Play, Sparkles, Volume2, 
  Trash2, BookOpen, AlertCircle, ArrowRight, Lightbulb 
} from 'lucide-react';
import { playSound, speakWord } from '../utils/audio';

interface MobileNotebookTabProps {
  allWords: Word[];
  bookmarkedWords: string[];
  customWords: Word[];
  learnedWords: string[];
  masteredWords: string[];
  onToggleBookmark: (wordId: string) => void;
  onDeleteCustomWord: (wordId: string) => void;
  onOpenAddModal: () => void;
  onPracticePersonalNotebook: () => void;
}

export const MobileNotebookTab: React.FC<MobileNotebookTabProps> = ({
  allWords,
  bookmarkedWords,
  customWords,
  learnedWords,
  masteredWords,
  onToggleBookmark,
  onDeleteCustomWord,
  onOpenAddModal,
  onPracticePersonalNotebook,
}) => {
  const [filter, setFilter] = useState<'all' | 'bookmarked' | 'custom' | 'unlearned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect words belonging to the notebook
  const notebookWords = useMemo(() => {
    // Collect all words that are either custom added or bookmarked
    const wordMap = new Map<string, Word>();

    // Add all custom words
    customWords.forEach((w) => wordMap.set(w.id, w));

    // Add all bookmarked words
    bookmarkedWords.forEach((id) => {
      const found = allWords.find((w) => w.id === id);
      if (found) wordMap.set(found.id, found);
    });

    return Array.from(wordMap.values());
  }, [allWords, customWords, bookmarkedWords]);

  // Apply filters
  const filteredWords = useMemo(() => {
    return notebookWords.filter((w) => {
      // Filter category
      if (filter === 'bookmarked' && !bookmarkedWords.includes(w.id)) return false;
      if (filter === 'custom' && !customWords.some((c) => c.id === w.id)) return false;
      if (filter === 'unlearned' && masteredWords.includes(w.id)) return false;

      // Filter search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          w.word.toLowerCase().includes(q) ||
          w.meaningVi.toLowerCase().includes(q) ||
          w.definitionEn?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [notebookWords, filter, searchQuery, bookmarkedWords, customWords, masteredWords]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#801732] to-[#540b1e] text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md">
              <BookmarkCheck className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-200/80">
                Sổ Tay Từ Vựng Cá Nhân
              </span>
              <h2 className="text-lg font-black leading-tight">
                Kho Từ Của Bạn ({notebookWords.length})
              </h2>
            </div>
          </div>

          <button
            onClick={onOpenAddModal}
            className="p-2.5 rounded-2xl bg-white text-[#801732] hover:bg-rose-50 font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
            title="Thêm từ vựng mới"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Thêm từ</span>
          </button>
        </div>

        <p className="text-xs text-rose-100/90 leading-relaxed mb-3">
          Lưu trữ các từ bạn yêu thích, các từ tô đen khi làm bài đọc, và các từ tự thêm để cá nhân hóa việc học.
        </p>

        {/* Action Button: Start Practice */}
        {notebookWords.length > 0 && (
          <button
            onClick={onPracticePersonalNotebook}
            className="w-full py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-white/20"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Luyện Tập Sổ Từ Này (4 Kỹ Năng &amp; Thẻ 3D)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trong sổ từ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#801732]/30 transition-all shadow-xs"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `Tất cả (${notebookWords.length})` },
            { id: 'bookmarked', label: `⭐ Yêu thích (${bookmarkedWords.length})` },
            { id: 'custom', label: `🖊️ Tự thêm / Tô đen (${customWords.length})` },
            { id: 'unlearned', label: '⚠️ Cần ôn luyện' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id as any);
                playSound('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                filter === tab.id
                  ? 'bg-[#801732] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Word Cards List */}
      {filteredWords.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#801732] dark:text-rose-400 flex items-center justify-center mx-auto">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            {searchQuery ? 'Không tìm thấy từ phù hợp' : 'Chưa có từ vựng nào trong mục này'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Mẹo: Khi làm bài đọc hiểu hoặc nghe, bạn chỉ cần <strong>tô đen (bôi đen)</strong> bất kỳ từ nào, bấm nút <strong>"Học từ này"</strong> để lưu ngay vào đây!
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#801732] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm từ đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredWords.map((word) => {
            const isBookmarked = bookmarkedWords.includes(word.id);
            const isCustom = customWords.some((c) => c.id === word.id);
            const isMastered = masteredWords.includes(word.id);

            return (
              <div
                key={word.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 transition-all hover:border-[#801732]/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {word.word}
                    </span>
                    <span className="text-xs font-serif text-slate-500 dark:text-slate-400">
                      /{word.phonetic}/
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {word.partOfSpeech}
                    </span>
                    {isCustom && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        Cá nhân
                      </span>
                    )}
                    {isMastered && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        ✓ Đã thuộc
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                    {word.meaningVi}
                  </p>

                  {word.example && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                      "{word.example}"
                    </p>
                  )}
                </div>

                {/* Word Action Controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Speak Audio */}
                  <button
                    onClick={() => {
                      speakWord(word.word);
                      playSound('click');
                    }}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Phát âm từ"
                  >
                    <Volume2 className="w-4 h-4 text-[#801732] dark:text-rose-400" />
                  </button>

                  {/* Bookmark Star */}
                  <button
                    onClick={() => onToggleBookmark(word.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      isBookmarked
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-400 hover:text-amber-500'
                    }`}
                    title={isBookmarked ? 'Bỏ lưu' : 'Lưu từ'}
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>

                  {/* Delete if custom */}
                  {isCustom && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc muốn xóa từ "${word.word}" khỏi sổ tay?`)) {
                          onDeleteCustomWord(word.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                      title="Xóa từ cá nhân"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
