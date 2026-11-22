import React, { useState, useMemo, useEffect } from 'react';
import { Topic, Word } from '../types';
import { TOEICPhase } from '../data/toeicSkillData';
import { FlashcardMode } from './FlashcardMode';
import { WordListMode } from './WordListMode';
import { MatchMode } from './MatchMode';
import { QuizMode } from './QuizMode';
import { SpellingMode } from './SpellingMode';
import { VocabMasteryTester } from './VocabMasteryTester';
import { SpeakingLab } from './SpeakingLab';
import { WritingStudio } from './WritingStudio';
import { ListeningHub } from './ListeningHub';
import { ReadingHub } from './ReadingHub';
import { TopicEvaluationModal } from './TopicEvaluationModal';
import { calculateTopicOverallProgress, saveTopicSkillCompleted } from '../utils/topicProgress';
import { 
  BookOpen, Headphones, Layers, Mic, PenTool, Sparkles, 
  RotateCcw, CheckCircle2, ChevronRight, ArrowRight, Trophy, Zap, 
  Check, Eye, Compass, Flame, Clock, Award, ArrowLeft, ShieldAlert, AlertTriangle
} from 'lucide-react';
import { playSound } from '../utils/audio';

export type TopicSkillTab = 'vocab' | 'listening' | 'reading' | 'speaking_writing';
export type VocabStudyStep = 'flashcard' | 'match' | 'quiz' | 'spelling' | 'list';

interface TopicWorkspaceProps {
  topic: Topic;
  allWords: Word[];
  learnedWords: string[];
  masteredWords: string[];
  bookmarkedWords: string[];
  onToggleBookmark: (wordId: string) => void;
  onReviewWord: (wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onDeleteCustomWord: (wordId: string) => void;
  triggerCelebration: () => void;
  currentPhase: TOEICPhase;
  onNextTopic?: () => void;
}

export const TopicWorkspace: React.FC<TopicWorkspaceProps> = ({
  topic,
  allWords,
  learnedWords,
  masteredWords,
  bookmarkedWords,
  onToggleBookmark,
  onReviewWord,
  onDeleteCustomWord,
  triggerCelebration,
  currentPhase,
  onNextTopic,
}) => {
  // 4 Core Skills of the Topic
  const [activeSkillTab, setActiveSkillTab] = useState<TopicSkillTab>('vocab');

  // 4 Tiered Mastery Sessions in Vocabulary:
  // 1: Phiên 1 - Nạp Từ Mới (Learn & Explore)
  // 2: Phiên 2 - Kiểm Tra Lần 1 (Mức Dễ • Gợi ý 3 chữ, không phát âm)
  // 3: Phiên 3 - Kiểm Tra Lần 2 (Mức Khó • 0 gợi ý sẵn, tối đa 2 lần gợi ý, sai 3 lần là Chưa thuộc)
  // 4: Phiên 4 - Học Lại Các Từ Chưa Thuộc (Weak Words Recovery)
  const [activeSession, setActiveSession] = useState<number>(1);

  // Sub-steps in Phiên 1 (Nạp từ mới)
  const [vocabStep, setVocabStep] = useState<VocabStudyStep>('flashcard');

  // Sub-steps in Skill 4 (Writing first, then Speaking)
  const [swSubMode, setSwSubMode] = useState<'speaking' | 'writing'>('writing');
  const [customSentenceForSpeaking, setCustomSentenceForSpeaking] = useState<{
    text: string;
    translationVi?: string;
    source?: 'writing_polished' | 'writing_corrected';
  } | null>(null);

  // Topic Evaluation Modal state & dynamic refresh trigger
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter words strictly belonging to this topic
  const topicWords = useMemo(() => {
    return allWords.filter((w) => w.topicId === topic.id || w.day === topic.day);
  }, [allWords, topic]);

  // Overall 4-Skill completion progress for this topic
  const topicProgress = useMemo(() => {
    return calculateTopicOverallProgress(topic.id);
  }, [topic.id, refreshTrigger]);

  // Persistent Unlearned Words for this topic (Phiên 4)
  const unlearnedStorageKey = `unlearned_words_topic_${topic.id}`;
  const [unlearnedWordIds, setUnlearnedWordIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(unlearnedStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(unlearnedStorageKey, JSON.stringify(unlearnedWordIds));
    } catch {}
  }, [unlearnedWordIds, unlearnedStorageKey]);

  const unlearnedWords = useMemo(() => {
    return topicWords.filter((w) => unlearnedWordIds.includes(w.id));
  }, [topicWords, unlearnedWordIds]);

  const handleWordFailed = (word: Word) => {
    setUnlearnedWordIds((prev) => (prev.includes(word.id) ? prev : [...prev, word.id]));
  };

  const handleWordPassed = (word: Word) => {
    setUnlearnedWordIds((prev) => prev.filter((id) => id !== word.id));
  };

  const learnedInTopic = topicWords.filter((w) => learnedWords.includes(w.id)).length;

  // 4 Kỹ Năng chính của chủ đề với icon & nhãn gọn gàng
  const skillTabs: {
    id: TopicSkillTab;
    label: string;
    shortLabel: string;
    sub: string;
    icon: React.FC<{ className?: string }>;
    isCompleted?: boolean;
  }[] = [
    { 
      id: 'vocab', 
      label: '1. Từ Vựng & Phản Xạ',
      shortLabel: '1. Từ Vựng',
      sub: `${topicWords.length} từ • 4 phiên`, 
      icon: BookOpen,
      isCompleted: topicProgress.skills.vocab,
    },
    { 
      id: 'listening', 
      label: '2. Luyện Nghe Audio',
      shortLabel: '2. Luyện Nghe',
      sub: 'Part 1, 2, 3 ETS', 
      icon: Headphones,
      isCompleted: topicProgress.skills.listening,
    },
    { 
      id: 'reading', 
      label: '3. Luyện Đọc Tài Liệu',
      shortLabel: '3. Luyện Đọc',
      sub: 'Part 5 & 7 Docs', 
      icon: Layers,
      isCompleted: topicProgress.skills.reading,
    },
    { 
      id: 'speaking_writing', 
      label: '4. Viết & Nói (WS)',
      shortLabel: '4. Viết & Nói',
      sub: 'Viết AI ➔ Luyện phát âm', 
      icon: PenTool,
      isCompleted: topicProgress.skills.speaking_writing,
    },
  ];

  // 4 Phiên Học & Kiểm Tra Đánh Giá Mức Độ Thuộc Từ
  const sessionTabs = [
    { 
      id: 1, 
      label: 'Phiên 1: Nạp Từ Mới', 
      shortLabel: 'Nạp Từ Mới',
      sub: `${topicWords.length} từ`, 
      icon: BookOpen,
    },
    { 
      id: 2, 
      label: 'Phiên 2: Kiểm Tra Lần 1', 
      shortLabel: 'Kiểm Tra Dễ',
      sub: 'Gợi ý 3 chữ', 
      icon: Zap,
    },
    { 
      id: 3, 
      label: 'Phiên 3: Kiểm Tra Lần 2', 
      shortLabel: 'Thử Thách Khó',
      sub: '0 gợi ý', 
      icon: ShieldAlert,
    },
    { 
      id: 4, 
      label: `Phiên 4: Học Lại (${unlearnedWords.length})`, 
      shortLabel: unlearnedWords.length > 0 ? `Ôn Lại (${unlearnedWords.length})` : 'Đã Thuộc 100%',
      sub: unlearnedWords.length > 0 ? 'Từ chưa thuộc' : 'Hoàn thành', 
      icon: unlearnedWords.length > 0 ? AlertTriangle : Award,
    },
  ];

  // 4 Bước rèn luyện trong Phiên 1
  const vocabStepsList: {
    id: VocabStudyStep;
    stepNumber: number;
    title: string;
    shortTitle: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'flashcard', stepNumber: 1, title: 'Thẻ 3D & Phát Âm', shortTitle: 'Thẻ 3D', icon: BookOpen },
    { id: 'match', stepNumber: 2, title: 'Nối Từ Phản Xạ', shortTitle: 'Nối từ', icon: Zap },
    { id: 'quiz', stepNumber: 3, title: 'Trắc Nghiệm TOEIC', shortTitle: 'Trắc nghiệm', icon: CheckCircle2 },
    { id: 'spelling', stepNumber: 4, title: 'Nghe & Chính Tả', shortTitle: 'Chính tả', icon: Headphones },
  ];

  // =========================================================================
  // GUIDED FLOW: "TIẾP THEO" DẪN DẮT CÁC BƯỚC VÀ PHIÊN TRONG KỸ NĂNG
  // =========================================================================
  const handleNextInSkill = () => {
    window.scrollTo({ top: 140, behavior: 'smooth' });
    playSound('correct');

    if (activeSkillTab === 'vocab') {
      if (activeSession === 1) {
        if (vocabStep === 'flashcard') setVocabStep('match');
        else if (vocabStep === 'match') setVocabStep('quiz');
        else if (vocabStep === 'quiz') setVocabStep('spelling');
        else if (vocabStep === 'spelling') {
          setActiveSession(2);
        } else if (vocabStep === 'list') {
          setVocabStep('flashcard');
        }
      } else if (activeSession === 2) {
        setActiveSession(3);
      } else if (activeSession === 3) {
        if (unlearnedWords.length > 0) {
          setActiveSession(4);
        } else {
          saveTopicSkillCompleted(topic.id, 'vocab');
          setRefreshTrigger(prev => prev + 1);
          triggerCelebration();
          setActiveSkillTab('listening');
        }
      } else if (activeSession === 4) {
        saveTopicSkillCompleted(topic.id, 'vocab');
        setRefreshTrigger(prev => prev + 1);
        triggerCelebration();
        setActiveSkillTab('listening');
      }
    } else if (activeSkillTab === 'listening') {
      saveTopicSkillCompleted(topic.id, 'listening');
      setRefreshTrigger(prev => prev + 1);
      triggerCelebration();
      setActiveSkillTab('reading');
    } else if (activeSkillTab === 'reading') {
      saveTopicSkillCompleted(topic.id, 'reading');
      setRefreshTrigger(prev => prev + 1);
      triggerCelebration();
      setActiveSkillTab('speaking_writing');
      setSwSubMode('writing');
    } else if (activeSkillTab === 'speaking_writing') {
      if (swSubMode === 'writing') {
        setSwSubMode('speaking');
      } else {
        saveTopicSkillCompleted(topic.id, 'speaking_writing');
        setRefreshTrigger(prev => prev + 1);
        triggerCelebration();
        setIsEvaluationModalOpen(true);
      }
    }
  };

  const handlePrevInSkill = () => {
    window.scrollTo({ top: 140, behavior: 'smooth' });
    playSound('click');

    if (activeSkillTab === 'vocab') {
      if (activeSession === 1) {
        if (vocabStep === 'spelling') setVocabStep('quiz');
        else if (vocabStep === 'quiz') setVocabStep('match');
        else if (vocabStep === 'match') setVocabStep('flashcard');
        else if (vocabStep === 'list') setVocabStep('flashcard');
      } else if (activeSession === 2) {
        setActiveSession(1);
        setVocabStep('spelling');
      } else if (activeSession === 3) {
        setActiveSession(2);
      } else if (activeSession === 4) {
        setActiveSession(3);
      }
    } else if (activeSkillTab === 'listening') {
      setActiveSkillTab('vocab');
      setActiveSession(unlearnedWords.length > 0 ? 4 : 3);
    } else if (activeSkillTab === 'reading') {
      setActiveSkillTab('listening');
    } else if (activeSkillTab === 'speaking_writing') {
      if (swSubMode === 'speaking') {
        setSwSubMode('writing');
      } else {
        setActiveSkillTab('reading');
      }
    }
  };

  return (
    <div className="space-y-3.5">
      
      {/* ========================================================================= */}
      {/* THANH 1 (MỚI): 4 KỸ NĂNG TRỌNG TÂM - THIẾT KẾ DẠNG SEGMENTED BAR SIÊU GỌN */}
      {/* ========================================================================= */}
      <div className="p-1.5 sm:p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* 4 Skill Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 flex-1">
          {skillTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSkillTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSkillTab(tab.id);
                  playSound('click');
                }}
                className={`px-3 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-between gap-2 text-left relative ${
                  isActive
                    ? 'bg-[#801732] text-white shadow-sm font-extrabold ring-1 ring-[#801732]'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black truncate block leading-tight">
                      {tab.shortLabel}
                    </span>
                    <span className={`text-[10px] truncate block ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      {tab.sub}
                    </span>
                  </div>
                </div>

                {tab.isCompleted && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black flex-shrink-0 ${
                    isActive ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Nút Đánh Giá & Tiến Độ 4 Kỹ Năng */}
        <div className="flex items-center justify-between md:justify-end gap-2 px-1 md:px-0 flex-shrink-0 border-t md:border-t-0 pt-1.5 md:pt-0 border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              setIsEvaluationModalOpen(true);
              playSound('click');
            }}
            className="w-full md:w-auto px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/80 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs"
            title="Xem báo cáo đánh giá toàn diện chủ đề"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>Đánh Giá Năng Lực Chủ Đề</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KỸ NĂNG 1: TỪ VỰNG & PHẢN XẠ */}
      {/* ========================================================================= */}
      {activeSkillTab === 'vocab' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          
          {/* THANH 2 (MỚI): LỘ TRÌNH 4 PHIÊN HỌC & KIỂM TRA - DẠNG INTERACTIVE STEPPER GỌN GÀNG */}
          <div className="p-1.5 sm:p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            
            {/* Horizontal Step Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1 pr-1 hidden lg:inline">
                Lộ trình:
              </span>

              {sessionTabs.map((s, idx) => {
                const isCurrent = activeSession === s.id;
                const isPassed = activeSession > s.id;

                return (
                  <React.Fragment key={s.id}>
                    <button
                      onClick={() => {
                        setActiveSession(s.id);
                        playSound('click');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-2 flex-shrink-0 ${
                        isCurrent
                          ? 'bg-[#801732] text-white shadow-xs font-black ring-1 ring-[#801732]'
                          : isPassed
                          ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isCurrent ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}>
                        {s.id}
                      </span>
                      <span>{s.shortLabel}</span>

                      {s.id === 4 && unlearnedWords.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                          {unlearnedWords.length}
                        </span>
                      )}
                    </button>

                    {idx < sessionTabs.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0 hidden md:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Tra cứu Sổ Từ Pill */}
            <button
              onClick={() => {
                setVocabStep('list');
                setActiveSession(1);
                playSound('click');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
              title="Tra cứu danh sách từ vựng của chủ đề"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Sổ từ ({topicWords.length})</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* PHIÊN 1: NẠP TỪ MỚI */}
          {/* ========================================================================= */}
          {activeSession === 1 && (
            <div className="space-y-3">
              {/* THANH 3 (MỚI): CHẾ ĐỘ LUYỆN TẬP GỌN GÀNG - CHỈ HIỆN KHI Ở PHIÊN 1 */}
              <div className="flex items-center justify-between gap-2 flex-wrap px-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Chế độ luyện tập:
                  </span>
                  
                  {/* Segmented capsule pills */}
                  <div className="p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-0.5 overflow-x-auto max-w-full scrollbar-none">
                    {vocabStepsList.map((st) => {
                      const Icon = st.icon;
                      const isCurrent = vocabStep === st.id;

                      return (
                        <button
                          key={st.id}
                          onClick={() => {
                            setVocabStep(st.id);
                            playSound('click');
                          }}
                          className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ${
                            isCurrent
                              ? 'bg-white dark:bg-slate-900 text-[#801732] dark:text-rose-400 shadow-xs font-black'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="inline sm:hidden">{st.shortTitle}</span>
                          <span className="hidden sm:inline">{st.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                  Bước {vocabStepsList.findIndex(b => b.id === vocabStep) + 1} / 4
                </span>
              </div>

              {/* NỘI DUNG BƯỚC HIỆN TẠI TRONG PHIÊN 1 */}
              <div className="animate-in fade-in duration-150 min-h-[460px]">
                {vocabStep === 'flashcard' && (
                  <FlashcardMode
                    key={`fc-${topic.id}`}
                    words={topicWords}
                    bookmarkedWords={bookmarkedWords}
                    learnedWords={learnedWords}
                    masteredWords={masteredWords}
                    onToggleBookmark={onToggleBookmark}
                    onReviewWord={onReviewWord}
                    onCompleteDay={() => {
                      triggerCelebration();
                      setVocabStep('match');
                    }}
                  />
                )}

                {vocabStep === 'match' && (
                  <MatchMode
                    key={`match-${topic.id}`}
                    words={topicWords}
                    onComplete={() => {
                      triggerCelebration();
                      setVocabStep('quiz');
                    }}
                  />
                )}

                {vocabStep === 'quiz' && (
                  <QuizMode
                    key={`quiz-${topic.id}`}
                    words={topicWords}
                    allWords={allWords}
                    onCompleteQuiz={(_score, _total) => {
                      triggerCelebration();
                      setVocabStep('spelling');
                    }}
                  />
                )}

                {vocabStep === 'spelling' && (
                  <SpellingMode
                    key={`spelling-${topic.id}`}
                    words={topicWords}
                    onComplete={() => {
                      triggerCelebration();
                      setActiveSession(2);
                    }}
                  />
                )}

                {vocabStep === 'list' && (
                  <WordListMode
                    words={topicWords}
                    learnedWords={learnedWords}
                    masteredWords={masteredWords}
                    bookmarkedWords={bookmarkedWords}
                    onToggleBookmark={onToggleBookmark}
                    onDeleteCustomWord={onDeleteCustomWord}
                  />
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PHIÊN 2: KIỂM TRA LẦN 1 (MỨC DỄ • GỢI Ý 3 CHỮ • TẮT ÂM THANH TỰ NHỚ) */}
          {/* ========================================================================= */}
          {activeSession === 2 && (
            <div className="animate-in fade-in duration-150 min-h-[460px]">
              <VocabMasteryTester
                key={`tester-easy-${topic.id}`}
                words={topicWords}
                mode="easy"
                onWordPassed={handleWordPassed}
                onWordFailed={handleWordFailed}
                onComplete={() => {
                  triggerCelebration();
                  setActiveSession(3);
                }}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* PHIÊN 3: KIỂM TRA LẦN 2 (MỨC KHÓ • 0 GỢI Ý • SAI 3 LẦN LÀ CHƯA THUỘC) */}
          {/* ========================================================================= */}
          {activeSession === 3 && (
            <div className="animate-in fade-in duration-150 min-h-[460px]">
              <VocabMasteryTester
                key={`tester-hard-${topic.id}`}
                words={topicWords}
                mode="hard"
                onWordPassed={handleWordPassed}
                onWordFailed={handleWordFailed}
                onComplete={() => {
                  triggerCelebration();
                  if (unlearnedWords.length > 0) {
                    setActiveSession(4);
                  } else {
                    saveTopicSkillCompleted(topic.id, 'vocab');
                    setRefreshTrigger(prev => prev + 1);
                    setActiveSkillTab('listening');
                  }
                }}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* PHIÊN 4: HỌC LẠI CÁC TỪ CHƯA THUỘC (WEAK WORDS RECOVERY) */}
          {/* ========================================================================= */}
          {activeSession === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150 min-h-[460px]">
              {unlearnedWords.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                      Tuyệt Vời! Bạn Đã Thuộc 100% Từ Vựng!
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      Không có từ nào bị trượt trong bài kiểm tra. Bạn đã sẵn sàng để chuyển sang Luyện Nghe Audio &amp; Luyện Đọc!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      saveTopicSkillCompleted(topic.id, 'vocab');
                      setRefreshTrigger(prev => prev + 1);
                      setActiveSkillTab('listening');
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    Sang Kỹ Năng 2: Luyện Nghe Audio ➔
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-rose-900 dark:text-rose-100">
                          Danh sách {unlearnedWords.length} từ bạn chưa nhớ ở bài kiểm tra
                        </h4>
                        <p className="text-[11px] text-rose-700 dark:text-rose-300">
                          Hãy lật thẻ ôn lại và làm lại bài kiểm tra để xóa các từ này khỏi danh sách yếu!
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveSession(3)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs whitespace-nowrap transition-all shadow-xs"
                    >
                      Kiểm tra lại ngay
                    </button>
                  </div>

                  <FlashcardMode
                    key={`fc-unlearned-${topic.id}-${unlearnedWords.length}`}
                    words={unlearnedWords}
                    bookmarkedWords={bookmarkedWords}
                    learnedWords={learnedWords}
                    masteredWords={masteredWords}
                    onToggleBookmark={onToggleBookmark}
                    onReviewWord={onReviewWord}
                    onCompleteDay={triggerCelebration}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* NỘI DUNG KỸ NĂNG 2: LUYỆN NGHE AUDIO (LIÊN KẾT TRỰC TIẾP TỪ VỰNG CHỦ ĐỀ) */}
      {/* ========================================================================= */}
      {activeSkillTab === 'listening' && (
        <div className="animate-in fade-in duration-150">
          <ListeningHub 
            currentPhase={currentPhase} 
            topic={topic}
            topicWords={topicWords}
            onCompleteListening={() => {
              saveTopicSkillCompleted(topic.id, 'listening');
              setRefreshTrigger(prev => prev + 1);
              triggerCelebration();
              setActiveSkillTab('reading');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* NỘI DUNG KỸ NĂNG 3: LUYỆN ĐỌC TÀI LIỆU (LIÊN KẾT TRỰC TIẾP TỪ VỰNG CHỦ ĐỀ) */}
      {/* ========================================================================= */}
      {activeSkillTab === 'reading' && (
        <div className="animate-in fade-in duration-150">
          <ReadingHub 
            currentPhase={currentPhase} 
            topic={topic}
            topicWords={topicWords}
            onCompleteReading={() => {
              saveTopicSkillCompleted(topic.id, 'reading');
              setRefreshTrigger(prev => prev + 1);
              triggerCelebration();
              setActiveSkillTab('speaking_writing');
              setSwSubMode('writing');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* NỘI DUNG KỸ NĂNG 4: VIẾT & NÓI (WRITING FIRST ➔ SPEAKING SECOND) */}
      {/* ========================================================================= */}
      {activeSkillTab === 'speaking_writing' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md mx-auto shadow-xs">
            <button
              onClick={() => {
                setSwSubMode('writing');
                playSound('click');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                swSubMode === 'writing'
                  ? 'bg-[#801732] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Phần 1: Luyện Viết (Writing)</span>
            </button>

            <button
              onClick={() => {
                setSwSubMode('speaking');
                playSound('click');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                swSubMode === 'speaking'
                  ? 'bg-[#801732] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Phần 2: Luyện Nói (Speaking)</span>
            </button>
          </div>

          {swSubMode === 'writing' ? (
            <WritingStudio
              day={topic.day}
              dayWords={topicWords}
              onCompleteWriting={(_score) => {
                // Topic writing scored
              }}
              onTransferToSpeaking={(sentence, translation, source) => {
                setCustomSentenceForSpeaking({ text: sentence, translationVi: translation, source });
                setSwSubMode('speaking');
                window.scrollTo({ top: 140, behavior: 'smooth' });
                playSound('click');
              }}
            />
          ) : (
            <SpeakingLab
              day={topic.day}
              dayWords={topicWords}
              customSentenceToSpeak={customSentenceForSpeaking}
              onClearCustomSentence={() => setCustomSentenceForSpeaking(null)}
              onCompleteTask={(_score) => {
                saveTopicSkillCompleted(topic.id, 'speaking_writing');
                setRefreshTrigger(prev => prev + 1);
                triggerCelebration();
                setIsEvaluationModalOpen(true);
              }}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GUIDED ACTION FOOTER BAR: "TIẾP THEO ➔" THEO ĐÚNG CÁC PHIÊN VÀ BƯỚC */}
      {/* ========================================================================= */}
      <div className="mt-6 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <button
            onClick={handlePrevInSkill}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Bước trước</span>
          </button>

          {/* Status Label */}
          <span>
            {activeSkillTab === 'vocab' && (
              <>
                Kỹ năng Từ vựng • Đang ở:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {activeSession === 1 && `Phiên 1: Nạp từ (${vocabStep})`}
                  {activeSession === 2 && 'Phiên 2: Kiểm tra Lần 1 (Dễ)'}
                  {activeSession === 3 && 'Phiên 3: Kiểm tra Lần 2 (Khó)'}
                  {activeSession === 4 && `Phiên 4: Học lại (${unlearnedWords.length} từ)`}
                </strong>
              </>
            )}
            {activeSkillTab === 'listening' && (
              <>
                Kỹ năng:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  2. Luyện Nghe Audio (Part 1 &amp; Part 3)
                </strong>
              </>
            )}
            {activeSkillTab === 'reading' && (
              <>
                Kỹ năng:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  3. Luyện Đọc Tài Liệu (Part 5 &amp; Part 7)
                </strong>
              </>
            )}
            {activeSkillTab === 'speaking_writing' && (
              <>
                Kỹ năng 4: Viết &amp; Nói • Đang ở:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {swSubMode === 'writing' ? 'Phần 1: Luyện Viết Theo Ý Bạn' : 'Phần 2: Luyện Nói Câu Vừa Viết'}
                </strong>
              </>
            )}
          </span>
        </div>

        {/* Nút Tiếp Theo Dẫn Dắt Từng Bước Cụ Thể */}
        <button
          onClick={handleNextInSkill}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#801732] to-[#a32847] hover:from-[#6b132a] hover:to-[#8c223c] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#801732]/25 active:scale-95 transition-all"
        >
          {activeSkillTab === 'vocab' && (
            <>
              {activeSession === 1 && (
                <>
                  {vocabStep === 'flashcard' && <span>Sang Bước 2: Nối Từ Phản Xạ</span>}
                  {vocabStep === 'match' && <span>Sang Bước 3: Trắc Nghiệm TOEIC</span>}
                  {vocabStep === 'quiz' && <span>Sang Bước 4: Nghe &amp; Gõ Chính Tả</span>}
                  {vocabStep === 'spelling' && <span>Hoàn Thành Nạp Từ ➔ Sang Phiên 2: Kiểm Tra Dễ</span>}
                  {vocabStep === 'list' && <span>Bắt Đầu Học Thẻ 3D</span>}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
              {activeSession === 2 && (
                <>
                  <span>Sang Phiên 3: Kiểm Tra Lần 2 (Thử Thách Khó)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
              {activeSession === 3 && (
                <>
                  {unlearnedWords.length > 0 ? (
                    <span>Sang Phiên 4: Ôn Lại {unlearnedWords.length} Từ Chưa Thuộc</span>
                  ) : (
                    <span>🎉 Đã Thuộc 100% ➔ Sang Kỹ Năng 2: Luyện Nghe Audio</span>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
              {activeSession === 4 && (
                <>
                  <span>Hoàn Thành Từ Vựng ➔ Sang Kỹ Năng 2: Luyện Nghe Audio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </>
          )}

          {activeSkillTab === 'listening' && (
            <>
              <span>Hoàn Thành Luyện Nghe ➔ Sang Kỹ Năng 3: Luyện Đọc</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}

          {activeSkillTab === 'reading' && (
            <>
              <span>Hoàn Thành Luyện Đọc ➔ Sang Kỹ Năng 4: Viết &amp; Nói</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}

          {activeSkillTab === 'speaking_writing' && (
            <>
              {swSubMode === 'writing' ? (
                <>
                  <span>Sang Phần 2: Luyện Nói Câu Vừa Viết</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>🎉 Xem Đánh Giá Năng Lực 4 Kỹ Năng Chủ Đề</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </>
          )}
        </button>
      </div>

      {/* Comprehensive Topic Evaluation Modal */}
      <TopicEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        topic={topic}
        topicWords={topicWords}
        onNextTopic={onNextTopic}
      />
    </div>
  );
};
