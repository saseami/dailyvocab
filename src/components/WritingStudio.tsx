import React, { useState } from 'react';
import { Word } from '../types';
import { WritingTask, WRITING_TASKS } from '../data/speakingWritingTasks';
import { evaluateTOEICWriting, WritingEvaluation } from '../utils/writingEvaluator';
import { PenTool, CheckCircle2, AlertCircle, Sparkles, BookOpen, Send, Lightbulb, Trophy, Mic, Check, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { playSound } from '../utils/audio';

interface WritingStudioProps {
  day: number;
  dayWords: Word[];
  onCompleteWriting: (score: number) => void;
  onTransferToSpeaking?: (sentenceToSpeak: string, translationVi?: string, source?: 'writing_polished' | 'writing_corrected') => void;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({
  day,
  dayWords,
  onCompleteWriting,
  onTransferToSpeaking
}) => {
  const [studentInput, setStudentInput] = useState('');
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [selectedSpeakingChoice, setSelectedSpeakingChoice] = useState<'polished' | 'corrected'>('polished');

  const fallbackRequired = dayWords.slice(0, 3).map(w => w.word);
  const task: WritingTask = WRITING_TASKS[day] || {
    day,
    type: 'sentence_builder',
    title: `Luyện viết câu công sở Ngày ${day}`,
    scenario: `Sử dụng các từ vựng trọng tâm của Ngày ${day} (${fallbackRequired.join(', ')}) để viết một câu báo cáo tiến độ công việc hoặc hồi đáp đối tác theo ý bạn.`,
    requiredWords: fallbackRequired,
    minWords: 15,
    hints: [
      'Bắt đầu câu bằng cụm trạng từ thời gian hoặc liên từ chỉ mục đích.',
      'Sử dụng các từ khóa mục tiêu theo đúng dạng ngữ pháp phù hợp.'
    ],
    modelAnswer: `The department manager reviewed the ${fallbackRequired[0] || 'proposal'} and decided to approve the schedule to ensure all deadlines are met.`,
    modelExplanation: 'Câu văn mẫu đạt chuẩn TOEIC Writing với liên từ chỉ mục đích "to ensure" và cấu trúc câu ghép hoàn chỉnh.'
  };

  const wordsInText = studentInput.toLowerCase();
  const currentWordCount = studentInput.trim().split(/\s+/).filter(Boolean).length;

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim()) return;

    const evalResult = evaluateTOEICWriting(
      studentInput,
      task.requiredWords,
      task.modelAnswer,
      task.minWords
    );

    setEvaluation(evalResult);
    if (evalResult.score >= 60) {
      playSound('correct');
      onCompleteWriting(evalResult.score);
    } else {
      playSound('wrong');
    }
  };

  const handleTransferClick = () => {
    if (!evaluation || !onTransferToSpeaking) return;
    playSound('click');
    if (selectedSpeakingChoice === 'polished') {
      onTransferToSpeaking(
        evaluation.polishedSentence,
        evaluation.polishedSentenceVi,
        'writing_polished'
      );
    } else {
      onTransferToSpeaking(
        evaluation.correctedSentence,
        'Câu của bạn sau khi sửa sạch lỗi ngữ pháp.',
        'writing_corrected'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-3 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PenTool className="w-6 h-6 text-[#801732] dark:text-rose-400" />
            <span>Phần 1: Luyện Viết Theo Ý Bạn &amp; Sửa Lỗi AI (Writing Studio)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Viết câu tự do theo ý bạn ➔ AI chỉ ra lỗi sai ngữ pháp ➔ Nâng cấp thành câu hay chuẩn bản xứ ➔ Chuyển sang đọc phát âm (Speaking)
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-50 dark:bg-rose-950/60 text-[#801732] dark:text-rose-400 border border-rose-200 dark:border-rose-800 self-start sm:self-auto">
          {task.type === 'email_response' ? 'Trả lời Email (Q6-7)' : 'Viết câu theo ý bạn (Q1-5)'}
        </span>
      </div>

      {/* Task & Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-md">
        
        {/* Scenario Header */}
        <div className="mb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#801732] dark:text-rose-400 block mb-1">
            Đề bài: {task.title}
          </span>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
            {task.scenario}
          </p>
        </div>

        {/* Required Keywords Checklist */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
            Từ vựng gợi ý của chủ đề (Khuyên khích dùng trong câu):
          </span>
          <div className="flex flex-wrap gap-2">
            {task.requiredWords.map((kw, idx) => {
              const isUsed = wordsInText.includes(kw.toLowerCase().trim());
              return (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isUsed
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isUsed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                  <span>{kw}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Writing Input Form */}
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              placeholder="Nhập câu tiếng Anh theo ý của bạn tại đây (ví dụ: the manager review contract and sign yesterday...)"
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-[#801732] focus:outline-none resize-none leading-relaxed"
            />
            
            {/* Word count badge */}
            <div className="absolute right-3 bottom-3 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              {currentWordCount} từ {task.minWords > 0 && `(khuyến nghị: ${task.minWords}+)`}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowModelAnswer(prev => !prev)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#801732] transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{showModelAnswer ? 'Ẩn câu tham khảo ETS' : 'Xem câu tham khảo ETS 800+'}</span>
            </button>

            <button
              type="submit"
              disabled={!studentInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#801732] to-[#a32847] hover:from-[#6b132a] hover:to-[#8c223c] disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md shadow-[#801732]/25 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Phân Tích Lỗi Sai &amp; Nâng Cấp Câu AI</span>
            </button>
          </div>
        </form>

        {/* Model Answer Preview */}
        {showModelAnswer && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-1">
              ⭐ Câu mẫu ETS tham khảo (Band C1 - 180-200 điểm):
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white italic mb-1">
              "{task.modelAnswer}"
            </p>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
              👉 {task.modelExplanation}
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PHẦN KẾT QUẢ ĐÁNH GIÁ: CHỈ RA SAI Ở ĐÂU & CÁCH TẠO CÂU HAY */}
      {/* ========================================================================= */}
      {evaluation && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Card Điểm & Band */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Điểm Đánh Giá TOEIC Writing:
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#801732] dark:text-rose-400">
                  {evaluation.toeicWritingScaled} / 200 điểm
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950 text-[#801732] dark:text-rose-300">
                  CEFR Band {evaluation.band}
                </span>
              </div>
            </div>

            {/* Quick Feedback Pills */}
            <div className="flex flex-wrap gap-2">
              {evaluation.feedback.map((fb, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{fb}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 1: CHỈ RA LỖI SAI Ở ĐÂU & CÂU ĐÃ SỬA LỖI NGỮ PHÁP */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-rose-200 dark:border-rose-900/60 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  1. Chỉ Ra Lỗi Sai Ngữ Pháp Cụ Thể (Chẩn Đoán Tối Ưu)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hệ thống phân tích các lỗi về chia động từ (S-V Agreement), mạo từ, giới từ và chính tả
                </p>
              </div>
            </div>

            {/* Danh sách lỗi phát hiện */}
            {evaluation.grammarDiagnostics.length > 0 ? (
              <div className="space-y-3 mb-5">
                {evaluation.grammarDiagnostics.map((diag, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-[11px] font-black uppercase">
                        {diag.issue}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="line-through text-rose-600 dark:text-rose-400 font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                          ❌ {diag.originalSnippet}
                        </span>
                        <span>➔</span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-black bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          ✅ {diag.correctedSnippet}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                      💡 <strong>Quy tắc ngữ pháp:</strong> {diag.ruleExplanation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Xuất sắc! Câu của bạn không có bất kỳ lỗi ngữ pháp, chính tả hay dùng sai giới từ nào.</span>
              </div>
            )}

            {/* Câu của bạn sau khi sửa sạch lỗi ngữ pháp */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                📝 Câu của bạn sau khi sửa sạch toàn bộ lỗi ngữ pháp:
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                "{evaluation.correctedSentence}"
              </p>
            </div>
          </div>

          {/* CARD 2: CÁCH TẠO CÂU HAY ĐÚNG NGỮ PHÁP (NÂNG CẤP CHUẨN BẢN XỨ) */}
          <div className="bg-gradient-to-br from-[#801732] via-[#6d132a] to-[#450b1a] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-rose-900/40">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  2. Cách Tạo Câu Hay &amp; Chuẩn Văn Phong Công Sở Bản Xứ
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                Chuẩn Band C1 (TOEIC 180-200)
              </span>
            </div>

            {/* Câu nâng cấp chuẩn bản xứ */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 mb-5 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 block">
                ⭐ Câu nâng cấp chuẩn bản xứ dựa trên ý tưởng của bạn:
              </span>
              <p className="text-lg sm:text-xl font-black text-white leading-relaxed">
                "{evaluation.polishedSentence}"
              </p>
              <p className="text-xs sm:text-sm text-rose-100/90 italic pt-1 border-t border-white/10">
                👉 Dịch nghĩa: {evaluation.polishedSentenceVi}
              </p>
            </div>

            {/* 3 Mẹo vàng nâng cấp câu */}
            <div className="space-y-2.5 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
                💡 3 Mẹo Nâng Cấp Câu Hay (Chỉ Cách Tạo Câu Đúng Ngữ Pháp):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {evaluation.polishingTips.map((tip, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-black/20 border border-white/10 text-xs space-y-1">
                    <strong className="text-amber-200 block font-bold">{tip.title}</strong>
                    <p className="text-rose-100/80 leading-relaxed">{tip.explanation}</p>
                    <p className="text-[11px] text-white/90 font-mono bg-black/30 p-1.5 rounded mt-1">
                      vd: "{tip.example}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3: NÚT CHUYỂN TIẾP SANG LUYỆN NÓI CÂU ĐÃ CHUẨN HÓA (SPEAKING LAB) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#801732] dark:text-rose-400 block mb-1">
                  Bước tiếp theo: Luyện Phát Âm &amp; Đọc To
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Chọn câu bạn muốn chuyển sang Phòng Luyện Nói (Speaking Lab):
                </h4>
              </div>

              {/* Lựa chọn câu để nói */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedSpeakingChoice('polished')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSpeakingChoice === 'polished'
                      ? 'bg-[#801732] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ⭐ Câu nâng cấp bản xứ (Khuyên dùng)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSpeakingChoice('corrected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSpeakingChoice === 'corrected'
                      ? 'bg-[#801732] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📝 Câu của bạn (đã sửa lỗi)
                </button>
              </div>
            </div>

            {/* Preview câu sẽ nói */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold italic">
              "{selectedSpeakingChoice === 'polished' ? evaluation.polishedSentence : evaluation.correctedSentence}"
            </div>

            {/* Nút hành động chính */}
            <div className="mt-5 flex items-center justify-end">
              <button
                type="button"
                onClick={handleTransferClick}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
              >
                <Mic className="w-5 h-5 text-white animate-pulse" />
                <span>🎙️ Luyện Nói Câu Này Ngay (Chuyển sang Speaking Lab) ➔</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
