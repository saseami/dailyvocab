import React, { useRef, useMemo, useState, useEffect } from 'react';
import { UserProgress, UserProfile } from '../types';
import { 
  User, Flame, Trophy, Award, Moon, Sun, Download, Upload, 
  RotateCcw, Sparkles, Smartphone, CheckCircle2, ShieldCheck, 
  BookOpen, Heart, ArrowUpRight, BarChart3, HelpCircle, AlertCircle,
  Headphones, Layers, Mic, CheckCircle, ChevronRight, Users, ShieldAlert, Zap
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { getTopicSkillsProgressMap } from '../utils/topicProgress';
import { RadarSkillsChart } from './RadarSkillsChart';
import { TOEICScorePredictor } from './TOEICScorePredictor';
import { TOEICAccent, ETS_ACCENTS, getPreferredAccent, setPreferredAccent } from '../utils/audioAccents';

interface MobileProfileTabProps {
  progress: UserProgress;
  totalWordsCount: number;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onImportProgress: (data: UserProgress) => void;
  activeProfile?: UserProfile;
  onOpenProfileSwitcher?: () => void;
  errorVaultCount?: number;
  onOpenErrorVault?: () => void;
  onOpenSpeedMatch?: () => void;
  onOpenBadges?: () => void;
}

export const MobileProfileTab: React.FC<MobileProfileTabProps> = ({
  progress,
  totalWordsCount,
  theme,
  onThemeChange,
  onImportProgress,
  activeProfile,
  onOpenProfileSwitcher,
  errorVaultCount = 0,
  onOpenErrorVault,
  onOpenSpeedMatch,
  onOpenBadges,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userAccent, setUserAccent] = useState<TOEICAccent>(() => getPreferredAccent());

  useEffect(() => {
    const handleAccent = (e: any) => {
      if (e.detail?.accent) setUserAccent(e.detail.accent);
    };
    window.addEventListener('accent-changed', handleAccent);
    return () => window.removeEventListener('accent-changed', handleAccent);
  }, []);

  const selectedAccentDesc = ETS_ACCENTS.find(a => a.id === userAccent)?.label || 'Ngẫu nhiên ETS';

  const learnedCount = progress.learnedWords.length;
  const masteredCount = progress.masteredWords.length;
  const bookmarkedCount = progress.bookmarkedWords.length;

  // Lấy dữ liệu 4 kỹ năng thực tế từ bộ nhớ (Khách quan, không hardcode)
  const skillsProgressMap = useMemo(() => {
    return getTopicSkillsProgressMap();
  }, []);

  const skillCounts = useMemo(() => {
    const topicKeys = Object.keys(skillsProgressMap);
    let vocab = 0;
    let listening = 0;
    let reading = 0;
    let sw = 0;
    let fullyCompletedTopics = 0;

    topicKeys.forEach((key) => {
      const t = skillsProgressMap[key];
      if (t.vocab) vocab++;
      if (t.listening) listening++;
      if (t.reading) reading++;
      if (t.speaking_writing) sw++;
      if (t.vocab && t.listening && t.reading && t.speaking_writing) {
        fullyCompletedTopics++;
      }
    });

    return { vocab, listening, reading, sw, fullyCompletedTopics, startedTopics: topicKeys.length };
  }, [skillsProgressMap]);

  // ĐÁNH GIÁ NĂNG LỰC KHÁCH QUAN DỰA TRÊN DỮ LIỆU THỰC TẾ
  // Tránh việc đưa ra điểm số ảo khi người dùng mới học 0-1 chủ đề
  const competencyAssessment = useMemo(() => {
    if (masteredCount === 0 && skillCounts.startedTopics <= 1) {
      return {
        status: 'Đang Tích Lũy Dữ Liệu',
        statusColor: 'text-amber-300',
        scoreRangeLR: '50 - 200',
        scoreRangeSW: '40 - 100',
        cefrLevel: 'A1 (Sơ Cấp)',
        isEstimated: true,
        summary: `Bạn mới hoàn thành ${skillCounts.startedTopics}/30 chủ đề và đang tích lũy từ vựng ban đầu. Hệ thống cần tối thiểu 3 chủ đề (75 từ thuộc) hoặc 1 bài thi thử ETS để có điểm quy đổi chuẩn xác.`,
        nextMilestone: 'Hoàn thành 3 chủ đề Giai đoạn 1 để mở khóa mốc 350 - 450 TOEIC.',
      };
    } else if (masteredCount < 50) {
      return {
        status: 'Khởi Động Nền Tảng',
        statusColor: 'text-amber-300',
        scoreRangeLR: '150 - 300',
        scoreRangeSW: '80 - 120',
        cefrLevel: 'A1+ (Tiền cơ bản)',
        isEstimated: true,
        summary: `Đã nạp ${learnedCount} từ (${masteredCount} từ đã thuộc lòng SRS). Trình độ tương đương mức sơ cấp, cần luyện thêm kỹ năng Nghe và Đọc Part 5.`,
        nextMilestone: 'Đạt mốc 50 từ thuộc để chạm ngưỡng 350+ TOEIC.',
      };
    } else if (masteredCount < 150) {
      return {
        status: 'Nền Tảng Vững Chắc',
        statusColor: 'text-blue-300',
        scoreRangeLR: '350 - 500',
        scoreRangeSW: '120 - 160',
        cefrLevel: 'A2 (Cơ Bản)',
        isEstimated: false,
        summary: `Nắm vững 150 từ vựng công sở thiết yếu. Đủ khả năng bắt bẫy Part 1-2 và làm tốt câu từ loại Part 5.`,
        nextMilestone: 'Hoàn thành Giai đoạn 1 (15 chủ đề) để chạm mốc 600+ TOEIC.',
      };
    } else if (masteredCount < 350) {
      return {
        status: 'Bứt Phá Trung Cấp',
        statusColor: 'text-emerald-300',
        scoreRangeLR: '550 - 700',
        scoreRangeSW: '160 - 220',
        cefrLevel: 'B1 (Trung Cấp)',
        isEstimated: false,
        summary: `Làm chủ từ vựng Giai đoạn 1 & một phần Giai đoạn 2. Đọc hiểu tốt email, hợp đồng Part 7 và phản xạ nghe Part 3.`,
        nextMilestone: 'Học tiếp 15 chủ đề nâng cao Giai đoạn 2 để chạm mốc 750+ TOEIC.',
      };
    } else if (masteredCount < 550) {
      return {
        status: 'Tăng Tốc Nâng Cao',
        statusColor: 'text-purple-300',
        scoreRangeLR: '750 - 850',
        scoreRangeSW: '240 - 300',
        cefrLevel: 'B2 (Trung Cao Cấp)',
        isEstimated: false,
        summary: `Vốn từ sâu rộng, làm chủ hầu hết các bẫy đồng nghĩa (paraphrasing) và cấu trúc câu phức tạp trong đề thi ETS.`,
        nextMilestone: 'Làm đề thi Full Test trong Tab Thi Thử để chạm mốc 900+ TOEIC.',
      };
    } else {
      return {
        status: 'Bậc Thầy TOEIC',
        statusColor: 'text-rose-300',
        scoreRangeLR: '850 - 990',
        scoreRangeSW: '300 - 400',
        cefrLevel: 'C1 (Cao Cấp)',
        isEstimated: false,
        summary: `Thuộc lòng toàn bộ 600+ từ vựng cốt lõi của 30 chủ đề. Sẵn sàng chinh phục điểm tuyệt đối trong kỳ thi thật.`,
        nextMilestone: 'Duy trì chuỗi ôn tập SRS để giữ vững phản xạ!',
      };
    }
  }, [masteredCount, learnedCount, skillCounts]);

  // Radar chart data for 4 TOEIC skills
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

  // Export JSON
  const handleExport = () => {
    playSound('click');
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
          playSound('correct');
          alert('Khôi phục dữ liệu tiến độ thành công!');
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
    <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full overflow-hidden">
      {/* KHỐI 1: BÁO CÁO NĂNG LỰC KHÁCH QUAN DỰA TRÊN DỮ LIỆU THỰC TẾ */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#801732] via-[#681026] to-[#420716] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* Thanh Chọn & Chuyển Đổi Hồ Sơ Người Học */}
        <div className="flex items-center justify-between mb-3.5 bg-black/25 p-2 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
              {activeProfile?.avatar || '🦁'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white truncate">
                  {activeProfile?.name || 'Saseami'}
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 flex-shrink-0">
                  🎯 {activeProfile?.targetScore || 850}+
                </span>
              </div>
              <span className="text-[10px] text-rose-200/90 block truncate">
                Đang dùng hồ sơ này
              </span>
            </div>
          </div>

          <button
            onClick={onOpenProfileSwitcher}
            className="px-2.5 py-1.5 rounded-xl bg-white text-[#801732] hover:bg-rose-50 text-xs font-black flex items-center gap-1 shadow-xs active:scale-95 transition-all flex-shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Đổi Hồ Sơ</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-200/80">
                Thống Kê Khảo Thí Khách Quan
              </span>
              <h2 className="text-base font-black leading-tight">
                Đánh Giá Năng Lực TOEIC
              </h2>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/15 border border-white/20 text-rose-100 flex-shrink-0">
            {competencyAssessment.cefrLevel}
          </span>
        </div>

        {/* Khối Điểm Dự Đoán Theo Dải Thực Tế (Không Hardcode Số Ảo) */}
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 grid grid-cols-2 gap-2.5 mb-3">
          <div className="text-center border-r border-white/10 pr-2">
            <span className="text-[10px] uppercase font-bold text-rose-200 block">
              Dự Đoán Listening &amp; Reading
            </span>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              {competencyAssessment.scoreRangeLR}
              <span className="text-[10px] font-normal text-rose-200/80 ml-1">/990</span>
            </div>
            <span className={`text-[10px] font-black ${competencyAssessment.statusColor}`}>
              {competencyAssessment.status}
            </span>
          </div>

          <div className="text-center pl-2">
            <span className="text-[10px] uppercase font-bold text-rose-200 block">
              Dự Đoán Speaking &amp; Writing
            </span>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              {competencyAssessment.scoreRangeSW}
              <span className="text-[10px] font-normal text-rose-200/80 ml-1">/400</span>
            </div>
            <span className="text-[10px] text-rose-200 font-bold">
              Phản Xạ &amp; Viết Email
            </span>
          </div>
        </div>

        {/* Lời giải thích minh bạch về dữ liệu */}
        <div className="p-2.5 rounded-xl bg-black/20 text-xs text-rose-100/95 leading-relaxed space-y-1">
          <p className="font-medium">
            💡 <strong>Căn cứ đánh giá:</strong> {competencyAssessment.summary}
          </p>
          <p className="text-[11px] text-amber-200/90 font-bold">
            🎯 <strong>Cần làm tiếp theo:</strong> {competencyAssessment.nextMilestone}
          </p>
        </div>
      </div>

      {/* KHỐI 2 (MỚI): BIỂU ĐỒ RADAR 4 KỸ NĂNG ETS */}
      <RadarSkillsChart data={radarData} />

      {/* KHỐI 3 (MỚI): DỰ ĐOÁN ĐIỂM THẬT THANG ETS 990 & PHÂN TÍCH THẾ MẠNH / LỖ HỔNG */}
      <TOEICScorePredictor 
        progress={progress}
        activeProfile={activeProfile}
        totalWordsCount={totalWordsCount}
      />

      {/* KHỐI 4: THỐNG KÊ CHI TIẾT 4 KỸ NĂNG THỰC TẾ (CÓ SỐ LIỆU ĐO ĐẠC) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#801732] dark:text-rose-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Tiến Độ 4 Kỹ Năng Đo Được
            </h3>
          </div>
          <span className="text-[10px] font-extrabold text-slate-400">
            {skillCounts.startedTopics}/30 chủ đề đã bắt đầu
          </span>
        </div>

        {/* 4 Skill Rows with progress bars */}
        <div className="space-y-2.5">
          {/* Skill 1: Vocab */}
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                <span>1. Từ Vựng &amp; Phản Xạ</span>
              </span>
              <span className="text-[11px] font-black text-[#801732] dark:text-rose-400">
                {masteredCount} thuộc / {learnedCount} đã học ({Math.round((masteredCount / Math.max(1, totalWordsCount)) * 100)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#801732] dark:bg-rose-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.round((masteredCount / Math.max(1, totalWordsCount)) * 100))}%` }} 
              />
            </div>
          </div>

          {/* Skill 2: Listening */}
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Headphones className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Luyện Nghe Audio (Part 1-4)</span>
              </span>
              <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                {skillCounts.listening}/30 chủ đề ({Math.round((skillCounts.listening / 30) * 100)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.round((skillCounts.listening / 30) * 100))}%` }} 
              />
            </div>
          </div>

          {/* Skill 3: Reading */}
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Luyện Đọc Tài Liệu (Part 5-7)</span>
              </span>
              <span className="text-[11px] font-black text-purple-600 dark:text-purple-400">
                {skillCounts.reading}/30 chủ đề ({Math.round((skillCounts.reading / 30) * 100)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.round((skillCounts.reading / 30) * 100))}%` }} 
              />
            </div>
          </div>

          {/* Skill 4: SW */}
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Mic className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. Nói &amp; Viết (Speaking &amp; Writing)</span>
              </span>
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                {skillCounts.sw}/30 chủ đề ({Math.round((skillCounts.sw / 30) * 100)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.round((skillCounts.sw / 30) * 100))}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 3: THÔNG TIN TỔNG QUÁT (CHUYÊN CẦN & SỐ LƯỢNG) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs">
          <div className="flex items-center justify-center text-amber-500 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {progress.streak} ngày
          </div>
          <span className="text-[10px] font-semibold text-slate-400 block">Chuỗi học tập</span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs">
          <div className="flex items-center justify-center text-blue-500 mb-1">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {learnedCount}/{totalWordsCount}
          </div>
          <span className="text-[10px] font-semibold text-slate-400 block">Từ đã nạp</span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs">
          <div className="flex items-center justify-center text-emerald-500 mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {masteredCount}
          </div>
          <span className="text-[10px] font-semibold text-slate-400 block">Thuộc lòng SRS</span>
        </div>
      </div>

      {/* KHỐI TIỆN ÍCH ĐỘT PHÁ ETS & LUYỆN ĐỀ */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Công Cụ Đột Phá &amp; Rèn Luyện ETS
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
            Mới 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Card 1: Sổ Tay Bẫy & Câu Sai */}
          <button
            onClick={() => {
              onOpenErrorVault?.();
              playSound('click');
            }}
            className="p-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-left transition-all hover:border-rose-400 active:scale-98 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                  Sổ Tay Bẫy &amp; Câu Sai
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Chế độ Phục Thù thông minh
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-xs">
                {errorVaultCount} câu
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* Card 2: Sinh Tồn 60 Giây */}
          <button
            onClick={() => {
              onOpenSpeedMatch?.();
              playSound('click');
            }}
            className="p-3 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-left transition-all hover:border-amber-400 active:scale-98 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                  Sinh Tồn 60 Giây
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Phản xạ nối từ cấp tốc • Combo x3
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>

          {/* Card 3: Huy Hiệu ETS */}
          <button
            onClick={() => {
              onOpenBadges?.();
              playSound('click');
            }}
            className="p-3 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-left transition-all hover:border-indigo-400 active:scale-98 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                  Bộ Sưu Tập Huy Hiệu
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  8 Danh hiệu chinh phục ETS 990
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>

          {/* Card 4: Giọng Đọc ETS Yêu Thích */}
          <div className="p-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  Giọng Đọc ETS Bản Ngữ
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {selectedAccentDesc}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {ETS_ACCENTS.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setPreferredAccent(acc.id);
                    setUserAccent(acc.id);
                    playSound('click');
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
                    userAccent === acc.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{acc.flag}</span>
                  <span className="text-[10px]">{acc.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 4: GIAO DIỆN & MÀU SẮC */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#801732] dark:text-rose-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Giao Diện Ứng Dụng
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onThemeChange('light');
              playSound('click');
            }}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              theme === 'light'
                ? 'border-[#801732] bg-rose-50/50 dark:bg-slate-800 ring-2 ring-[#801732]/20 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sun className="w-4 h-4 text-[#801732]" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Sáng (Wine Red)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Đỏ rượu vang sang trọng &amp; xám trắng dịu mắt
            </p>
          </button>

          <button
            onClick={() => {
              onThemeChange('dark');
              playSound('click');
            }}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-slate-800 ring-2 ring-indigo-500/20 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Tối (Dark Tech)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Tối ưu cho ban đêm &amp; tiết kiệm pin màn OLED
            </p>
          </button>
        </div>
      </div>

      {/* KHỐI 5: SAO LƯU TIẾN ĐỘ & BẢO TOÀN DỮ LIỆU */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-black uppercase tracking-wider">
            Bảo Mật &amp; Sao Lưu Tiến Độ
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Dữ liệu học tập được lưu trực tiếp trên iPhone. Hãy tải file dự phòng định kỳ để không lo mất khi đổi máy hoặc xóa cache.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-200/80 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất sao lưu</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-200/80 dark:border-slate-700"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Khôi phục dữ liệu</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
