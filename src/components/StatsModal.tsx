import React, { useRef, useMemo, useState } from 'react';
import { UserProgress, UserProfile } from '../types';
import { X, Flame, BookOpen, CheckCircle2, Download, Upload, BarChart2, Sparkles, Trophy } from 'lucide-react';
import { RadarSkillsChart } from './RadarSkillsChart';
import { TOEICScorePredictor } from './TOEICScorePredictor';
import { getTopicSkillsProgressMap } from '../utils/topicProgress';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  totalWordsCount: number;
  onImportProgress: (data: UserProgress) => void;
  activeProfile?: UserProfile;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  progress,
  totalWordsCount,
  onImportProgress,
  activeProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'score'>('overview');

  const learnedCount = progress.learnedWords.length;
  const masteredCount = progress.masteredWords.length;
  const bookmarkedCount = progress.bookmarkedWords.length;

  const skillsProgressMap = useMemo(() => {
    return getTopicSkillsProgressMap();
  }, []);

  const skillCounts = useMemo(() => {
    const topicKeys = Object.keys(skillsProgressMap);
    let vocab = 0;
    let listening = 0;
    let reading = 0;
    let sw = 0;

    topicKeys.forEach((key) => {
      const t = skillsProgressMap[key];
      if (t.vocab) vocab++;
      if (t.listening) listening++;
      if (t.reading) reading++;
      if (t.speaking_writing) sw++;
    });

    return { vocab, listening, reading, sw, startedTopics: topicKeys.length };
  }, [skillsProgressMap]);

  const radarData = useMemo(() => {
    const vocabPercent = Math.min(100, Math.round((masteredCount / Math.max(1, totalWordsCount)) * 100));
    const listeningPercent = Math.min(100, Math.round((skillCounts.listening / 30) * 100));
    const readingPercent = Math.min(100, Math.round((skillCounts.reading / 30) * 100));
    const swPercent = Math.min(100, Math.round((skillCounts.sw / 30) * 100));

    return {
      vocab: Math.max(12, vocabPercent),
      listening: Math.max(12, listeningPercent),
      reading: Math.max(12, readingPercent),
      speakingWriting: Math.max(12, swPercent),
      targetScore: activeProfile?.targetScore || 850,
    };
  }, [masteredCount, totalWordsCount, skillCounts, activeProfile?.targetScore]);

  if (!isOpen) return null;

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `daily_vocab_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed.streak === 'number') {
          onImportProgress(parsed);
          alert('Khôi phục dữ liệu tiến độ thành công!');
          onClose();
        } else {
          alert('Tệp dữ liệu không hợp lệ!');
        }
      } catch {
        alert('Lỗi đọc tệp JSON!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#801732] text-white">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Thống Kê Khảo Thí &amp; Dự Đoán Điểm ETS
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hồ sơ: <strong>{activeProfile?.name || 'Saseami'}</strong> (Mục tiêu: {activeProfile?.targetScore || 850}+)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tổng Quan
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-white dark:bg-slate-900 text-[#801732] dark:text-rose-400 shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Radar 4 Kỹ Năng</span>
          </button>
          <button
            onClick={() => setActiveTab('score')}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'score'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Thang Điểm ETS 990</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold mb-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Chuỗi</span>
                </div>
                <div className="text-xl font-black text-amber-900 dark:text-amber-200">
                  {progress.streak} ngày
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold mb-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Đã học</span>
                </div>
                <div className="text-xl font-black text-blue-900 dark:text-blue-200">
                  {learnedCount}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thuộc lòng</span>
                </div>
                <div className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                  {masteredCount}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 text-xs font-bold mb-0.5">
                  <span>⭐ Đã lưu</span>
                </div>
                <div className="text-xl font-black text-purple-900 dark:text-purple-200">
                  {bookmarkedCount}
                </div>
              </div>
            </div>

            {/* Quick Skills Count */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                Tiến độ 30 Chủ đề TOEIC:
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>🎧 Đã xong Nghe: <strong>{skillCounts.listening} / 30 chủ đề</strong></div>
                <div>📚 Đã xong Đọc: <strong>{skillCounts.reading} / 30 chủ đề</strong></div>
                <div>🎤 Đã xong Viết &amp; Nói: <strong>{skillCounts.sw} / 30 chủ đề</strong></div>
                <div>🎯 Chủ đề đã mở: <strong>{skillCounts.startedTopics} / 30 chủ đề</strong></div>
              </div>
            </div>

            {/* Data Backup & Restore */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sao lưu &amp; Khôi phục dữ liệu
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#801732] dark:text-rose-400" />
                  <span>Xuất JSON</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-500" />
                  <span>Nhập JSON</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Radar Skills */}
        {activeTab === 'radar' && (
          <div className="animate-in fade-in duration-150">
            <RadarSkillsChart data={radarData} />
          </div>
        )}

        {/* Tab 3: Score Predictor */}
        {activeTab === 'score' && (
          <div className="animate-in fade-in duration-150">
            <TOEICScorePredictor
              progress={progress}
              activeProfile={activeProfile}
              totalWordsCount={totalWordsCount}
            />
          </div>
        )}
      </div>
    </div>
  );
};
