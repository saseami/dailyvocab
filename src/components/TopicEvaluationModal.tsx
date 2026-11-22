import React from 'react';
import { Topic, Word } from '../types';
import { 
  Trophy, CheckCircle2, Award, Zap, ArrowRight, X, Sparkles, 
  BookOpen, Headphones, Layers, Mic, Star, Target, TrendingUp, Clock, AlertCircle
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { calculateTopicOverallProgress } from '../utils/topicProgress';
import { useVocabStore } from '../hooks/useVocabStore';

interface TopicEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic;
  topicWords: Word[];
  onNextTopic?: () => void;
}

export const TopicEvaluationModal: React.FC<TopicEvaluationModalProps> = ({
  isOpen,
  onClose,
  topic,
  topicWords,
  onNextTopic,
}) => {
  const { progress } = useVocabStore();

  if (!isOpen) return null;

  // Real progress measurement from storage
  const topicProgress = calculateTopicOverallProgress(topic.id);
  const skills = topicProgress.skills;

  const topicWordIds = new Set(topicWords.map(w => w.id));
  const learnedCount = (progress?.learnedWords || []).filter(id => topicWordIds.has(id)).length;
  const masteredCount = (progress?.masteredWords || []).filter(id => topicWordIds.has(id)).length;

  const isVocabCompleted = Boolean(skills.vocab || (topicWords.length > 0 && learnedCount === topicWords.length));
  const isListeningCompleted = Boolean(skills.listening);
  const isReadingCompleted = Boolean(skills.reading);
  const isSWCompleted = Boolean(skills.speaking_writing);

  const completedCount = [
    isVocabCompleted,
    isListeningCompleted,
    isReadingCompleted,
    isSWCompleted,
  ].filter(Boolean).length;

  const percent = Math.round((completedCount / 4) * 100);

  // Dynamic Grade & Score Calculations based on REAL user activity
  let gradeText = 'Chưa Đạt (0/4)';
  let gradeSub = 'Chưa hoàn thành kỹ năng nào';
  let scoreText = '0 điểm';
  let gradeBadgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700';

  if (completedCount === 4) {
    gradeText = 'Grade A+';
    gradeSub = 'Đạt chuẩn toàn diện mục tiêu ETS';
    scoreText = '+35 ~ 50';
    gradeBadgeColor = 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400';
  } else if (completedCount === 3) {
    gradeText = 'Grade A';
    gradeSub = 'Đã nắm 3/4 kỹ năng trọng tâm';
    scoreText = '+25 ~ 35';
    gradeBadgeColor = 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400';
  } else if (completedCount === 2) {
    gradeText = 'Grade B+';
    gradeSub = 'Đã hoàn thành 50% nội dung';
    scoreText = '+15 ~ 25';
    gradeBadgeColor = 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400';
  } else if (completedCount === 1) {
    gradeText = 'Grade B-';
    gradeSub = 'Bước đầu khởi động chủ đề';
    scoreText = '+5 ~ 10';
    gradeBadgeColor = 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#801732]/30 dark:border-rose-900/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with celebration banner */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-r from-[#801732] via-[#9e1d3f] to-rose-700 text-white overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-20 -bottom-10 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

          <button
            onClick={() => {
              onClose();
              playSound('click');
            }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-300" />
              Đánh Giá Năng Lực Trọng Tâm Chủ Đề
            </span>
            <span className="text-xs text-white/80 font-semibold">
              Chủ đề #{topic.day}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {topic.titleVi}
          </h2>
          <p className="text-xs text-rose-100/90 font-medium mt-0.5">
            {topic.title} • {completedCount === 4 ? 'Đã hoàn thành toàn diện 4 Kỹ năng' : `Tiến độ thực tế: ${completedCount}/4 kỹ năng (${percent}%)`}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overall Rating & Score Projection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${gradeBadgeColor}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Xếp Loại Năng Lực
              </span>
              <span className="text-2xl font-black mt-0.5">
                {gradeText}
              </span>
              <span className="text-[11px] font-semibold mt-0.5 opacity-85">
                {gradeSub}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                Tiến Độ 4 Kỹ Năng
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {completedCount} / 4 ({percent}%)
              </span>
              <span className="text-[11px] text-emerald-800/80 dark:text-emerald-200/80 font-semibold mt-0.5">
                {completedCount === 4 ? 'Hoàn thành toàn diện' : 'Đang học tập thực tế'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                Dự Kiến Điểm TOEIC
              </span>
              <span className="text-2xl font-black text-[#801732] dark:text-rose-400 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                {scoreText}
              </span>
              <span className="text-[11px] text-rose-800/80 dark:text-rose-200/80 font-semibold mt-0.5">
                Điểm bài thi thật ETS
              </span>
            </div>
          </div>

          {/* 4-Skill Detailed Mastery Breakdown */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#801732] dark:text-rose-400" />
              Chi Tiết Đánh Giá 4 Kỹ Năng Của Chủ Đề
            </h4>

            <div className="space-y-2.5">
              {/* Skill 1: Vocab */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isVocabCompleted ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      1. Từ Vựng & Phản Xạ Trí Nhớ (Vocabulary)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isVocabCompleted 
                        ? `Đã nạp ${learnedCount}/${topicWords.length} từ • Vượt qua kiểm tra trí nhớ độc lập`
                        : `Đã nạp ${learnedCount}/${topicWords.length} từ (${Math.round((learnedCount / Math.max(1, topicWords.length)) * 100)}%). Cần học thêm Thẻ 3D & Nối từ.`}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex-shrink-0 ${
                  isVocabCompleted 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {isVocabCompleted ? '✓ Hoàn Thành' : '⏳ Chưa xong'}
                </span>
              </div>

              {/* Skill 2: Listening */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isListeningCompleted ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      2. Kỹ Năng Nghe Audio (Listening Comprehension)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isListeningCompleted 
                        ? 'Đã hoàn thành bài nghe Part 1 Tranh ảnh & Part 2 Phản xạ hỏi đáp'
                        : 'Chưa làm bài nghe. Hãy vào tab "2. Luyện Nghe" để hoàn tất.'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex-shrink-0 ${
                  isListeningCompleted 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {isListeningCompleted ? '✓ Hoàn Thành' : '⏳ Chưa làm'}
                </span>
              </div>

              {/* Skill 3: Reading */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isReadingCompleted ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      3. Kỹ Năng Đọc Hiểu Tài Liệu (Reading Comprehension)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isReadingCompleted 
                        ? 'Đã hoàn thành Part 5 Ngữ pháp từ loại & Part 7 Đọc thư tín thương mại'
                        : 'Chưa làm bài đọc. Hãy vào tab "3. Luyện Đọc" để hoàn tất.'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex-shrink-0 ${
                  isReadingCompleted 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {isReadingCompleted ? '✓ Hoàn Thành' : '⏳ Chưa làm'}
                </span>
              </div>

              {/* Skill 4: Speaking & Writing */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isSWCompleted ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      4. Luyện Nói & Viết Thực Chiến (Speaking & Writing)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isSWCompleted 
                        ? 'Đã hoàn thành chấm phát âm AI chuẩn IPA và soạn thảo email ETS'
                        : 'Chưa làm bài nói & viết. Hãy vào tab "4. Viết & Nói" để hoàn tất.'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex-shrink-0 ${
                  isSWCompleted 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {isSWCompleted ? '✓ Hoàn Thành' : '⏳ Chưa làm'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Qualitative Feedback */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 dark:from-slate-800 dark:via-slate-850 dark:to-blue-950/30 border border-blue-200/70 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1 text-blue-900 dark:text-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black uppercase tracking-wider">
                Nhận Xét & Lời Khuyên Đo Lường Thực Tế
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {completedCount === 0 && (
                `Bạn mới mở chủ đề "${topic.titleVi}" và chưa thực hiện các bước học tập. Hãy bắt đầu từ Bước 1: Học Từ Vựng (Thẻ 3D & Nối từ) để hệ thống ghi nhận tiến độ thực tế của bạn!`
              )}
              {completedCount > 0 && completedCount < 4 && (
                `Bạn đã hoàn thành ${completedCount}/4 kỹ năng của chủ đề này. Để đạt chuẩn toàn diện Grade A+, hãy tiếp tục hoàn thành các phần còn lại (${[
                  !isVocabCompleted && '1. Từ Vựng',
                  !isListeningCompleted && '2. Luyện Nghe',
                  !isReadingCompleted && '3. Luyện Đọc',
                  !isSWCompleted && '4. Viết & Nói'
                ].filter(Boolean).join(', ')}) nhé!`
              )}
              {completedCount === 4 && (
                `Xuất sắc! Bạn đã hoàn thành toàn diện cả 4 kỹ năng của chủ đề "${topic.titleVi}". Bạn đã sẵn sàng để tiến lên chủ đề tiếp theo!`
              )}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              playSound('click');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold transition-all"
          >
            {completedCount === 4 ? 'Xem lại chủ đề này' : 'Tiếp tục học chủ đề này'}
          </button>

          {onNextTopic && (
            <button
              onClick={() => {
                onClose();
                onNextTopic();
                playSound('correct');
              }}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                completedCount === 4
                  ? 'bg-gradient-to-r from-[#801732] to-rose-700 hover:from-[#6b132a] hover:to-rose-800 text-white shadow-lg shadow-rose-900/20'
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{completedCount === 4 ? 'Tiến lên Chủ Đề Tiếp Theo' : 'Bỏ qua & Xem Chủ Đề Tiếp'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
