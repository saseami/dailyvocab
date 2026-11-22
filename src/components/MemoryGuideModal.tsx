import React from 'react';
import { X, Sparkles, BookOpen, Layers, Headphones, Zap, HelpCircle, Mic, PenTool, Brain, CheckCircle2, ArrowRight } from 'lucide-react';

interface MemoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStep: (mode: 'learn' | 'flashcard' | 'spelling' | 'match' | 'quiz' | 'speaking' | 'writing') => void;
}

export const MemoryGuideModal: React.FC<MemoryGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectStep,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 'Bước 1',
      title: 'Nạp từ & Ngữ cảnh',
      mode: 'learn' as const,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      science: 'Encoding & Comprehension (Nạp dữ liệu)',
      desc: 'Đọc hiểu nghĩa gốc, phiên âm chuẩn IPA, loại từ, các collocations đi kèm và câu ví dụ TOEIC thực tế để não bộ tạo liên kết ngữ nghĩa đầu tiên.',
    },
    {
      step: 'Bước 2',
      title: 'Flashcard 3D & SRS',
      mode: 'flashcard' as const,
      icon: Layers,
      color: 'from-indigo-500 to-purple-500',
      science: 'Active Recall & Spaced Repetition (Gợi nhớ chủ động)',
      desc: 'Tuyệt đối KHÔNG lật thẻ ngay! Hãy nhìn từ tiếng Anh và ép não bộ nhớ lại nghĩa trong 3 giây. Đánh giá độ khó (1-4) để thuật toán SuperMemo SM-2 tự lên lịch ôn ngắt quãng.',
    },
    {
      step: 'Bước 3',
      title: 'Nghe & Viết (Dictation)',
      mode: 'spelling' as const,
      icon: Headphones,
      color: 'from-amber-500 to-orange-500',
      science: 'Phonological Loop & Orthography (Vòng lặp âm thanh & Chính tả)',
      desc: 'Kích hoạt vùng thính giác não bộ: Nghe giọng đọc bản ngữ và gõ chính xác từng ký tự. Xóa bỏ hoàn toàn tình trạng "nhìn thì biết nhưng nghe không kịp hoặc gõ sai chính tả".',
    },
    {
      step: 'Bước 4',
      title: 'Nối từ phản xạ (Speed Match)',
      mode: 'match' as const,
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      science: 'Fast Association (Phản xạ kết nối thần kinh dưới 3s)',
      desc: 'Luyện tập theo từng vòng hoàn chỉnh trọn vẹn chủ đề. Não bộ chuyển từ trạng thái "dịch thầm" sang phản xạ tự động giữa từ tiếng Anh và ý niệm thực tế.',
    },
    {
      step: 'Bước 5',
      title: 'Trắc nghiệm TOEIC',
      mode: 'quiz' as const,
      icon: HelpCircle,
      color: 'from-rose-500 to-pink-500',
      science: 'Retrieval Testing (Kiểm tra truy xuất dữ liệu & Tránh bẫy)',
      desc: 'Thử thách nhận diện 4 phương án ngữ pháp và từ đồng nghĩa/trái nghĩa chuẩn đề thi TOEIC Part 5 & 6 để xóa tan ảo tưởng "tưởng đã thuộc nhưng vào đề thi lại nhầm".',
    },
    {
      step: 'Bước 6',
      title: 'Luyện Nói AI (Speaking Lab)',
      mode: 'speaking' as const,
      icon: Mic,
      color: 'from-violet-500 to-indigo-600',
      science: 'Spoken Output & Prosody (Sản sinh lời nói & Ngữ điệu)',
      desc: 'Đọc to toàn bộ câu văn với ngữ điệu tự nhiên, ngắt cụm ngữ pháp chuẩn TOEIC. AI chấm điểm từng từ trong cả câu để bạn tự tin giao tiếp và đạt điểm cao TOEIC Speaking.',
    },
    {
      step: 'Bước 7',
      title: 'Luyện Viết TOEIC (Writing Studio)',
      mode: 'writing' as const,
      icon: PenTool,
      color: 'from-fuchsia-500 to-rose-600',
      science: 'Productive Written Fluency (Đỉnh cao làm chủ ngôn ngữ)',
      desc: 'Vận dụng từ vựng để viết câu hoàn chỉnh mô tả tranh (Part 1) và phản hồi Email thương mại (Part 2). AI chấm điểm theo chuẩn ETS TOEIC Writing để biến từ vựng thành vốn sống vĩnh viễn.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Phương Pháp Khoa Học Nhận Thức
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Lộ Trình 7 Bước Ghi Nhớ Vĩnh Viễn
            </h2>
          </div>
        </div>

        {/* Ebbinghaus Principle Intro */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 mb-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p className="font-bold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Quy luật đường cong quên lãng Hermann Ebbinghaus:</span>
          </p>
          <p>
            Nếu chỉ đọc lướt qua một từ, não bộ sẽ <strong>quên hơn 70% sau 24 giờ</strong>. Nhưng khi bạn tuân thủ đúng thứ tự <strong>7 bước học này</strong> (từ Nạp kiến thức → Gợi nhớ chủ động → Luyện tai → Phản xạ nhanh → Kiểm tra → Sản sinh Nói & Viết), tỷ lệ lưu giữ trong trí nhớ dài hạn (Long-term memory) đạt <strong>trên 95% sau 30 ngày</strong>!
          </p>
        </div>

        {/* 7 Steps Roadmap List */}
        <div className="space-y-3 mb-6 max-h-[420px] overflow-y-auto pr-1">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                onClick={() => {
                  onSelectStep(st.mode);
                  onClose();
                }}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-start gap-4 shadow-sm hover:shadow-md"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                        {st.step}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {st.title}
                      </h4>
                    </div>
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>Vào học</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    🧠 {st.science}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            Khuyến nghị: Hoàn thành đủ 7 bước mỗi ngày
          </span>
          <button
            onClick={() => {
              onSelectStep('learn');
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Bắt đầu từ Bước 1 (Nạp từ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
