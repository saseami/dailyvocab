import React from 'react';
import { Topic, Word } from '../types';
import { 
  Trophy, CheckCircle2, Award, Zap, ArrowRight, X, Sparkles, 
  BookOpen, Headphones, Layers, Mic, Star, Target, TrendingUp 
} from 'lucide-react';
import { playSound } from '../utils/audio';

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
  if (!isOpen) return null;

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
            {topic.title} • Hoàn thành toàn diện 4 Kỹ năng ETS
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overall Rating & Score Projection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                Xếp Loại Năng Lực
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                Grade A+
              </span>
              <span className="text-[11px] text-amber-800/80 dark:text-amber-200/80 font-semibold mt-0.5">
                Đạt chuẩn mục tiêu ETS
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                Tiến Độ 4 Kỹ Năng
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                4 / 4 (100%)
              </span>
              <span className="text-[11px] text-emerald-800/80 dark:text-emerald-200/80 font-semibold mt-0.5">
                Toàn diện từ vựng & thực hành
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                Dự Kiến Điểm TOEIC
              </span>
              <span className="text-2xl font-black text-[#801732] dark:text-rose-400 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                +35 ~ 50
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
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      1. Từ Vựng & Phản Xạ Trí Nhớ (Vocabulary)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Đã nạp {topicWords.length} từ • Vượt qua 2 cấp độ kiểm tra trí nhớ độc lập (không gợi ý âm thanh)
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                  100% Hoàn Thành
                </span>
              </div>

              {/* Skill 2: Listening */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      2. Kỹ Năng Nghe Audio (Listening Comprehension)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Part 1 Tranh ảnh & Part 2 Phản xạ hỏi đáp • Nhận diện bẫy thì động từ và bẫy âm lặp lại
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                  100% Hoàn Thành
                </span>
              </div>

              {/* Skill 3: Reading */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      3. Kỹ Năng Đọc Hiểu Tài Liệu (Reading Comprehension)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Part 5 Ngữ pháp từ loại & Part 7 Đọc thư tín thương mại • Bản đồ từ đồng nghĩa Paraphrase
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                  100% Hoàn Thành
                </span>
              </div>

              {/* Skill 4: Speaking & Writing */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      4. Luyện Nói & Viết Thực Chiến (Speaking & Writing)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Chấm phát âm AI chuẩn IPA từng từ & Soạn thảo email công sở mạch lạc theo văn phong ETS
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                  100% Hoàn Thành
                </span>
              </div>
            </div>
          </div>

          {/* AI Qualitative Feedback */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 dark:from-slate-800 dark:via-slate-850 dark:to-blue-950/30 border border-blue-200/70 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1 text-blue-900 dark:text-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black uppercase tracking-wider">
                Nhận Xét & Lời Khuyên Cá Nhân Hóa Của AI
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Bạn đã thể hiện phản xạ xuất sắc khi liên kết toàn bộ từ vựng chủ đề "{topic.titleVi}" vào ngữ cảnh bài thi nghe, đọc và diễn đạt. Khả năng ghi nhớ từ sâu qua 2 tầng kiểm tra sẽ giúp bạn không bị quên sau 30 ngày. Hãy tiếp tục duy trì đà học này ở chủ đề tiếp theo!
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
            Xem lại chủ đề này
          </button>

          {onNextTopic && (
            <button
              onClick={() => {
                onClose();
                onNextTopic();
                playSound('correct');
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#801732] to-rose-700 hover:from-[#6b132a] hover:to-rose-800 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Tiến lên Chủ Đề Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
