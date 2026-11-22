import React, { useState, useEffect } from 'react';
import { useVocabStore } from './hooks/useVocabStore';
import { Header } from './components/Header';
import { PhaseNavigation } from './components/PhaseNavigation';
import { TopicSelector } from './components/TopicSelector';
import { TopicWorkspace } from './components/TopicWorkspace';
import { ExamSimulator } from './components/ExamSimulator';
import { AddWordModal } from './components/AddWordModal';
import { StatsModal } from './components/StatsModal';
import { TextSelectionLearner } from './components/TextSelectionLearner';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { MobileNotebookTab } from './components/MobileNotebookTab';
import { MobileProfileTab } from './components/MobileProfileTab';
import { ProfileSwitcherModal } from './components/ProfileSwitcherModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ErrorVaultModal } from './components/ErrorVaultModal';
import { SurvivalSpeedMatchModal } from './components/SurvivalSpeedMatchModal';
import { BadgesModal } from './components/BadgesModal';
import { getErrorVault } from './utils/errorVault';
import { getAppNavigationState, saveAppNavigationState } from './utils/sessionPersistence';
import { TOEICPhase } from './data/toeicSkillData';
import { playSound } from './utils/audio';
import { Target, Trophy, Sparkles, Award, ShieldCheck, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const {
    theme,
    setTheme,
    progress,
    activeDay,
    setActiveDay,
    activeTopicId,
    setActiveTopicId,
    topics,
    allWords,
    toggleBookmark,
    reviewWord,
    addCustomWord,
    deleteCustomWord,
    triggerCelebration,
    importProgress,
    profiles,
    activeProfile,
    createProfile,
    switchProfile,
    deleteProfile,
  } = useVocabStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isErrorVaultOpen, setIsErrorVaultOpen] = useState(false);
  const [isSpeedMatchOpen, setIsSpeedMatchOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [errorVaultCount, setErrorVaultCount] = useState<number>(() => getErrorVault().length);
  const savedNav = getAppNavigationState();

  const [mobileTab, setMobileTab] = useState<MobileTab>(savedNav?.mobileTab || 'study');

  useEffect(() => {
    const updateVaultCount = () => {
      setErrorVaultCount(getErrorVault().length);
    };
    window.addEventListener('storage', updateVaultCount);
    window.addEventListener('error-vault-updated', updateVaultCount);
    return () => {
      window.removeEventListener('storage', updateVaultCount);
      window.removeEventListener('error-vault-updated', updateVaultCount);
    };
  }, []);

  // 3-Phase Study Progression State
  const [currentPhase, setCurrentPhase] = useState<TOEICPhase>(() => {
    if (savedNav?.currentPhase && ['foundation', 'acceleration', 'mock_exam'].includes(savedNav.currentPhase)) {
      return savedNav.currentPhase;
    }
    if (typeof window === 'undefined') return 'foundation';
    const saved = localStorage.getItem('toeic_study_phase') as TOEICPhase;
    if (saved && ['foundation', 'acceleration', 'mock_exam'].includes(saved)) {
      return saved;
    }
    return 'foundation';
  });

  useEffect(() => {
    try {
      localStorage.setItem('toeic_study_phase', currentPhase);
    } catch {}
  }, [currentPhase]);

  // Selected Topic (Default to first topic of current phase, or restored topic)
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    if (savedNav?.selectedTopicId) return savedNav.selectedTopicId;
    if (activeTopicId && activeTopicId !== 'all') return activeTopicId;
    return topics[0]?.id || 'day-1-contracts-warranties';
  });

  // Auto-save app navigation state
  useEffect(() => {
    saveAppNavigationState({
      selectedTopicId,
      mobileTab,
      currentPhase,
    });
  }, [selectedTopicId, mobileTab, currentPhase]);

  // Keep topic in sync when switching phases
  const handleSelectPhase = (phase: TOEICPhase) => {
    setCurrentPhase(phase);
    playSound('click');

    if (phase === 'foundation') {
      const topicP1 = topics.find((t) => t.day <= 15);
      if (topicP1) {
        setSelectedTopicId(topicP1.id);
        setActiveTopicId(topicP1.id);
        setActiveDay(topicP1.day);
      }
    } else if (phase === 'acceleration') {
      const topicP2 = topics.find((t) => t.day >= 16);
      if (topicP2) {
        setSelectedTopicId(topicP2.id);
        setActiveTopicId(topicP2.id);
        setActiveDay(topicP2.day);
      }
    }
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTopicId(topicId);
    const foundTopic = topics.find((t) => t.id === topicId);
    if (foundTopic) {
      setActiveDay(foundTopic.day);
    }
    playSound('click');
  };

  // Advance to next topic in current phase (or next phase if at the end)
  const handleNextTopic = () => {
    const phaseTopics = topics.filter((t) =>
      currentPhase === 'foundation' ? t.day <= 15 : t.day >= 16 && t.day <= 30
    );
    const currentIdx = phaseTopics.findIndex((t) => t.id === selectedTopicId);
    if (currentIdx >= 0 && currentIdx < phaseTopics.length - 1) {
      handleSelectTopic(phaseTopics[currentIdx + 1].id);
    } else if (currentIdx === phaseTopics.length - 1) {
      if (currentPhase === 'foundation') {
        handleSelectPhase('acceleration');
      } else if (currentPhase === 'acceleration') {
        handleSelectPhase('mock_exam');
      }
    }
  };

  // Open personal notebook topic
  const handleOpenPersonalNotebook = () => {
    handleSelectTopic('custom-personal-notebook');
    setMobileTab('study');
  };

  // Find active topic object
  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  // Phase Progress Calculations
  const phase1Words = allWords.filter((w) => w.day <= 15);
  const phase1Learned = phase1Words.filter((w) => progress.learnedWords.includes(w.id)).length;

  const phase2Words = allWords.filter((w) => w.day >= 16 && w.day <= 30);
  const phase2Learned = phase2Words.filter((w) => progress.learnedWords.includes(w.id)).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors selection:bg-[#801732]/20">
      {/* Offline Status Pill when connection drops */}
      <OfflineIndicator />

      {/* Top Personalized Header */}
      <Header
        streak={progress.streak}
        learnedCount={progress.learnedWords.length}
        masteredCount={progress.masteredWords.length}
        totalCount={allWords.length}
        theme={theme}
        onThemeChange={setTheme}
        onOpenAddWord={() => setIsAddModalOpen(true)}
        errorVaultCount={errorVaultCount}
        onOpenErrorVault={() => setIsErrorVaultOpen(true)}
        onOpenSpeedMatch={() => setIsSpeedMatchOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenStats={() => {
          if (window.innerWidth < 768) {
            setMobileTab('profile');
          } else {
            setIsStatsModalOpen(true);
          }
        }}
      />

      {/* Main Container with generous bottom padding on mobile for iOS Tab Bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-28 md:pb-8">
        
        {/* DESKTOP VIEW (md:block) */}
        <div className="hidden md:block">
          {/* LEVEL 1: Giai Đoạn (Phase Navigation Bar) */}
          <PhaseNavigation
            currentPhase={currentPhase}
            onSelectPhase={handleSelectPhase}
            phase1CompletedCount={phase1Learned}
            phase1TotalCount={phase1Words.length}
            phase2CompletedCount={phase2Learned}
            phase2TotalCount={phase2Words.length}
          />

          {/* Dynamic Branching: Giai Đoạn 3 (Thực Chiến ETS) vs Giai Đoạn 1 & 2 (Chủ Đề & 4 Kỹ Năng) */}
          {currentPhase === 'mock_exam' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <ExamSimulator />
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              <TopicSelector
                topics={topics}
                activeTopicId={selectedTopicId}
                onSelectTopic={handleSelectTopic}
                currentPhase={currentPhase}
                allWords={allWords}
                learnedWords={progress.learnedWords}
              />

              <TopicWorkspace
                topic={activeTopic}
                allWords={allWords}
                learnedWords={progress.learnedWords}
                masteredWords={progress.masteredWords}
                bookmarkedWords={progress.bookmarkedWords}
                onToggleBookmark={toggleBookmark}
                onReviewWord={reviewWord}
                onDeleteCustomWord={deleteCustomWord}
                triggerCelebration={triggerCelebration}
                currentPhase={currentPhase}
                onNextTopic={handleNextTopic}
              />
            </div>
          )}
        </div>

        {/* MOBILE VIEW (md:hidden) - Tối ưu hóa toàn diện cho iPhone & App PWA */}
        <div className="block md:hidden">
          {mobileTab === 'study' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Compact Phase Switcher */}
              <PhaseNavigation
                currentPhase={currentPhase}
                onSelectPhase={handleSelectPhase}
                phase1CompletedCount={phase1Learned}
                phase1TotalCount={phase1Words.length}
                phase2CompletedCount={phase2Learned}
                phase2TotalCount={phase2Words.length}
              />

              {currentPhase === 'mock_exam' ? (
                <div className="space-y-3">
                  <ExamSimulator />
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Compact Mobile Topic Selector */}
                  <TopicSelector
                    topics={topics}
                    activeTopicId={selectedTopicId}
                    onSelectTopic={handleSelectTopic}
                    currentPhase={currentPhase}
                    allWords={allWords}
                    learnedWords={progress.learnedWords}
                  />

                  {/* 4 Skills Mobile Workspace */}
                  <TopicWorkspace
                    topic={activeTopic}
                    allWords={allWords}
                    learnedWords={progress.learnedWords}
                    masteredWords={progress.masteredWords}
                    bookmarkedWords={progress.bookmarkedWords}
                    onToggleBookmark={toggleBookmark}
                    onReviewWord={reviewWord}
                    onDeleteCustomWord={deleteCustomWord}
                    triggerCelebration={triggerCelebration}
                    currentPhase={currentPhase}
                    onNextTopic={handleNextTopic}
                  />
                </div>
              )}
            </div>
          )}

          {mobileTab === 'notebook' && (
            <MobileNotebookTab
              allWords={allWords}
              bookmarkedWords={progress.bookmarkedWords}
              customWords={progress.customWords}
              learnedWords={progress.learnedWords}
              masteredWords={progress.masteredWords}
              onToggleBookmark={toggleBookmark}
              onDeleteCustomWord={deleteCustomWord}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onPracticePersonalNotebook={handleOpenPersonalNotebook}
            />
          )}

          {mobileTab === 'exam' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <ExamSimulator />
            </div>
          )}

          {mobileTab === 'profile' && (
            <MobileProfileTab
              progress={progress}
              totalWordsCount={allWords.length}
              theme={theme}
              onThemeChange={setTheme}
              onImportProgress={importProgress}
              activeProfile={activeProfile}
              onOpenProfileSwitcher={() => setIsProfileModalOpen(true)}
              errorVaultCount={errorVaultCount}
              onOpenErrorVault={() => setIsErrorVaultOpen(true)}
              onOpenSpeedMatch={() => setIsSpeedMatchOpen(true)}
              onOpenBadges={() => setIsBadgesOpen(true)}
            />
          )}
        </div>
      </main>

      {/* iOS Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={mobileTab}
        onSelectTab={setMobileTab}
        notebookBadgeCount={progress.bookmarkedWords.length + progress.customWords.length}
        streak={progress.streak}
        currentPhaseTag={currentPhase === 'foundation' ? 'GD 1' : currentPhase === 'acceleration' ? 'GD 2' : 'GD 3'}
      />

      {/* Profile Switcher Modal */}
      <ProfileSwitcherModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfile.id}
        onSwitchProfile={switchProfile}
        onCreateProfile={createProfile}
        onDeleteProfile={deleteProfile}
      />

      {/* Floating Add Word & Stats Modals */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWord={addCustomWord}
        topics={topics}
        activeDay={activeTopic.day}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        progress={progress}
        totalWordsCount={allWords.length}
        onImportProgress={importProgress}
        activeProfile={activeProfile}
      />

      {/* Floating Highlighter to Learn Popover */}
      <TextSelectionLearner
        onSaveCustomWord={addCustomWord}
        onOpenPersonalTopic={handleOpenPersonalNotebook}
      />

      {/* Sổ Tay Bẫy & Câu Sai Thông Minh (AI Error Vault) */}
      <ErrorVaultModal
        isOpen={isErrorVaultOpen}
        onClose={() => {
          setIsErrorVaultOpen(false);
          setErrorVaultCount(getErrorVault().length);
        }}
      />

      {/* Mini-Game Sinh Tồn 60 Giây (Survival Speed Match) */}
      <SurvivalSpeedMatchModal
        isOpen={isSpeedMatchOpen}
        onClose={() => setIsSpeedMatchOpen(false)}
        allWords={allWords}
      />

      {/* Bảng Huy Hiệu Vinh Danh ETS (Achievements) */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
      />
    </div>
  );
};
export default App;
