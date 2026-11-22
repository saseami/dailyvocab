import React, { useState, useEffect, useMemo } from 'react';
import { TOEIC_READING_QUESTIONS, ReadingQuestion, TOEICPhase } from '../data/toeicSkillData';
import { Topic, Word } from '../types';
import { generateTopicReadingQuestions } from '../utils/topicSkillGenerator';
import { saveTopicSkillCompleted } from '../utils/topicProgress';
import { saveWrongQuestion } from '../utils/errorVault';
import { 
  BookOpen, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, 
  Lightbulb, Link2, Clock, Sparkles, Layers, Target, Zap, Globe, FileText 
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { TOEICDocumentViewer } from './TOEICDocumentViewer';

interface ReadingHubProps {
  currentPhase: TOEICPhase;
  topic?: Topic;
  topicWords?: Word[];
  onCompleteReading?: () => void;
}

export const ReadingHub: React.FC<ReadingHubProps> = ({ 
  currentPhase, 
  topic, 
  topicWords,
  onCompleteReading 
}) => {
  // Available parts strictly mapped to the current Phase:
  // Giai đoạn 1 (Nền tảng): Part 5 (Hoàn thành câu) & Part 6 (Điền đoạn văn)
  // Giai đoạn 2 (Tăng tốc): Part 6 (Điền đoạn văn) & Part 7 (Đọc hiểu văn bản đơn & kép)
  // Giai đoạn 3 (Thực chiến): Đầy đủ Part 5, 6, 7
  const availableParts = useMemo(() => {
    if (currentPhase === 'foundation') {
      return [
        { part: 5, label: 'Part 5: Hoàn thành câu (15 câu)', phaseTag: 'Trọng tâm GĐ 1' },
        { part: 6, label: 'Part 6: Điền đoạn văn', phaseTag: 'Trọng tâm GĐ 1' },
      ];
    } else if (currentPhase === 'acceleration') {
      return [
        { part: 6, label: 'Part 6: Điền đoạn văn', phaseTag: 'Ôn tập GĐ 1' },
        { part: 7, label: 'Part 7: Đọc hiểu văn bản', phaseTag: 'Trọng tâm GĐ 2' },
      ];
    }
    return [
      { part: 5, label: 'Part 5: Hoàn thành câu (15 câu)', phaseTag: 'GĐ 1' },
      { part: 6, label: 'Part 6: Điền đoạn văn', phaseTag: 'GĐ 1' },
      { part: 7, label: 'Part 7: Đọc hiểu văn bản', phaseTag: 'GĐ 2' },
    ];
  }, [currentPhase]);

  const [selectedPart, setSelectedPart] = useState<number>(() => {
    return currentPhase === 'acceleration' ? 7 : 5;
  });
  const [completedParts, setCompletedParts] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Sync selectedPart with currentPhase on change
  useEffect(() => {
    if (currentPhase === 'acceleration') {
      setSelectedPart(7);
    } else if (currentPhase === 'foundation') {
      setSelectedPart(5);
    }
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [currentPhase]);

  // Filter questions dynamically by topic or fallback to phase questions
  const questions = useMemo(() => {
    if (topic && topicWords && topicWords.length > 0) {
      return generateTopicReadingQuestions(topic, topicWords, selectedPart, currentPhase);
    }
    return TOEIC_READING_QUESTIONS.filter(q => q.part === selectedPart);
  }, [topic, topicWords, selectedPart, currentPhase]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(key);
    setShowExplanation(true);

    if (key === currentQuestion.correctAnswer) {
      playSound('correct');
    } else {
      playSound('wrong');
      // Save wrong question to Error Vault
      saveWrongQuestion({
        source: 'reading',
        part: currentQuestion.part,
        topicId: topic?.id || 'general',
        topicTitle: topic ? (topic.titleVi || topic.title) : 'Reading Practice',
        questionText: currentQuestion.questionText,
        passage: currentQuestion.passage,
        options: currentQuestion.options.map(o => ({ key: o.key, text: o.text })),
        userAnswer: key,
        correctAnswer: currentQuestion.correctAnswer,
        explanationVi: currentQuestion.explanationVi,
        grammarRuleVi: currentQuestion.grammarRuleVi,
        trapType: currentQuestion.trapType,
      });
    }

    // Save reading skill completion for this topic
    if (topic?.id) {
      saveTopicSkillCompleted(topic.id, 'reading');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      playSound('click');
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    playSound('click');
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">Chưa có dữ liệu bài đọc cho phần này.</p>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto py-3">
      {/* Dynamic Phase Guidance Banner */}
      <div className={`p-4 rounded-2xl mb-5 border transition-all ${
        currentPhase === 'foundation'
          ? 'bg-blue-50/90 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-100'
          : currentPhase === 'acceleration'
          ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100'
          : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-100'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black ${
            currentPhase === 'foundation' ? 'bg-blue-600' : currentPhase === 'acceleration' ? 'bg-amber-600' : 'bg-[#801732]'
          }`}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                currentPhase === 'foundation' ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : currentPhase === 'acceleration' ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
              }`}>
                {currentPhase === 'foundation' ? 'TRỌNG TÂM GIAI ĐOẠN 1' : currentPhase === 'acceleration' ? 'TRỌNG TÂM GIAI ĐOẠN 2' : 'THỰC CHIẾN GIAI ĐOẠN 3'}
              </span>
              <h4 className="text-sm font-extrabold">
                {currentPhase === 'foundation'
                  ? 'Kỹ năng Đọc Part 5 (Hoàn thành 15 câu trọng tâm) & Part 6 (Điền đoạn văn)'
                  : currentPhase === 'acceleration'
                  ? 'Kỹ năng Đọc Part 6 (Điền đoạn văn) & Part 7 (Đọc hiểu văn bản đơn & kép)'
                  : 'Luyện tập tổng hợp Reading chuẩn ETS 100 câu 75 phút'}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {currentPhase === 'foundation'
                ? 'Mục tiêu 450 - 600+: Nắm chắc 15 cấu trúc ngữ pháp then chốt (Từ loại Danh/Tính/Động/Trạng, đại từ, liên từ, câu điều kiện, bị động, thì động từ).'
                : currentPhase === 'acceleration'
                ? 'Mục tiêu 650 - 800+: Chiến thuật Skimming & Scanning, nhận diện bẫy suy luận ngụ ý, đọc hiểu nhanh Email, Hóa đơn, Lịch trình, Đoạn kép.'
                : 'Mục tiêu 850 - 990+: Phân bổ thời gian tối ưu (Part 5: 10s/câu, Part 6: 30s/câu, Part 7: 50s/câu), chinh phục 100 câu đọc hiểu.'}
            </p>
          </div>
        </div>
      </div>

      {/* Part Navigation Pills (Strictly filtered by current phase) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          {availableParts.map(item => (
            <button
              key={item.part}
              onClick={() => {
                setSelectedPart(item.part);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setShowExplanation(false);
                playSound('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedPart === item.part
                  ? 'bg-[#801732] text-white shadow-sm'
                  : completedParts.includes(item.part)
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <span>{completedParts.includes(item.part) ? `✓ ${item.label}` : item.label}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-black ${
                selectedPart === item.part ? 'bg-white/20 text-white' : completedParts.includes(item.part) ? 'bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {completedParts.includes(item.part) ? 'ĐÃ XONG' : item.phaseTag}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          {currentIndex > 0 && (
            <button
              onClick={handleReset}
              className="text-[11px] font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Làm lại từ đầu
            </button>
          )}
        </div>
      </div>

      {/* Main Reading Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Category Pill */}
        <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {currentQuestion.category}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {selectedPart === 5 ? `Bộ 15 câu trọng tâm Part 5` : selectedPart === 6 ? `Part 6: Điền đoạn văn` : `Part 7: Đọc hiểu văn bản`}
          </span>
        </div>

        {/* Document Passage Viewer for Part 6 & Part 7 (100% English) */}
        {(currentQuestion.part === 6 || currentQuestion.part === 7) && currentQuestion.passage && (
          <div className="mb-6">
            <TOEICDocumentViewer 
              passage={currentQuestion.passage}
              passageType={currentQuestion.passageType || 'Memo'}
              passageTitle={currentQuestion.passageTitle || 'TOEIC Official Business Passage'}
            />
          </div>
        )}

        {/* Question Text */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map(opt => {
            const key = opt.key;
            const text = opt.text;
            const isSelected = selectedAnswer === key;
            const isRight = key === currentQuestion.correctAnswer;

            let optionStyle = 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-700 hover:border-brand-400';
            if (selectedAnswer !== null) {
              if (isRight) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
              } else if (isSelected && !isRight) {
                optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
              } else {
                optionStyle = 'bg-white/50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={key}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelectOption(key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                    selectedAnswer !== null && isRight
                      ? 'bg-emerald-500 text-white'
                      : selectedAnswer !== null && isSelected && !isRight
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}>
                    {key}
                  </span>
                  <span className="text-sm font-semibold">{text}</span>
                </div>

                {selectedAnswer !== null && isRight && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
                {selectedAnswer !== null && isSelected && !isRight && (
                  <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation, Sentence Translation & Paraphrasing Clues */}
        {showExplanation && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
            
            {/* Feedback Alert */}
            <div className={`p-4 rounded-2xl flex items-center gap-3 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-bold">
                {isCorrect ? 'Chính xác! Bạn đã chọn đúng đáp án.' : `Chưa đúng! Đáp án đúng là (${currentQuestion.correctAnswer}).`}
              </span>
            </div>

            {/* FULL SENTENCE TRANSLATION (DỊCH NGHĨA NGUYÊN CÂU HOÀN CHỈNH TIẾNG VIỆT) */}
            {currentQuestion.sentenceTranslationVi && (
              <div className="p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-900/60 text-blue-950 dark:text-blue-100 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5 text-blue-700 dark:text-blue-300">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Dịch Nghĩa Toàn Câu (Hoàn chỉnh tiếng Việt):
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed italic bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  "{currentQuestion.sentenceTranslationVi}"
                </p>
              </div>
            )}

            {/* Paraphrasing Clues if present */}
            {currentQuestion.paraphrasedKeywords && currentQuestion.paraphrasedKeywords.length > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Bản đồ Từ Đồng Nghĩa (Paraphrasing Map ETS):
                  </span>
                </div>
                <div className="space-y-1">
                  {currentQuestion.paraphrasedKeywords.map((item, idx) => (
                    <div key={idx} className="text-xs flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>Trong bài: <strong>"{item.inPassage}"</strong> &harr; Trong câu hỏi/đáp án: <strong>"{item.inQuestion}"</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trap Warning Analysis if present */}
            {currentQuestion.trapType && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Phân tích bẫy đề ETS:
                  </span>
                </div>
                <p className="text-xs font-medium">
                  {currentQuestion.trapType}
                </p>
              </div>
            )}

            {/* Grammar Rule if present */}
            {currentQuestion.grammarRuleVi && (
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Quy tắc ngữ pháp then chốt ETS:
                  </span>
                </div>
                <p className="text-xs font-medium">
                  {currentQuestion.grammarRuleVi}
                </p>
              </div>
            )}

            {/* Explanation Content */}
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                Giải thích chi tiết & Mẹo tư duy nhanh:
              </strong>
              {currentQuestion.explanationVi}
            </div>

            {/* Next Button or Complete Skill Button */}
            <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
              {currentIndex < questions.length - 1 ? (
                <div className="ml-auto">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/20 flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <span>Câu tiếp theo ({currentIndex + 2}/{questions.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                (() => {
                  const updatedCompleted = Array.from(new Set([...completedParts, selectedPart]));
                  const nextPartToRun = availableParts.find(p => !updatedCompleted.includes(p.part));

                  if (nextPartToRun) {
                    return (
                      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <span>Đã xong {availableParts.find(p => p.part === selectedPart)?.label.split('(')[0]}. Hãy tiếp tục phần {nextPartToRun.label.split('(')[0]}!</span>
                        </div>
                        <button
                          onClick={() => {
                            setCompletedParts(updatedCompleted);
                            setSelectedPart(nextPartToRun.part);
                            setCurrentIndex(0);
                            setSelectedAnswer(null);
                            setShowExplanation(false);
                            playSound('click');
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#801732] to-rose-700 hover:from-[#6b132a] hover:to-rose-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <span>Tiếp tục: Sang {nextPartToRun.label.split('(')[0]}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>✓ Đã hoàn tất toàn bộ {availableParts.length} phần Luyện Đọc ({availableParts.map(p => p.label.split(':')[0]).join(' & ')})! (+25% tiến độ)</span>
                      </div>
                      {onCompleteReading && (
                        <button
                          onClick={() => {
                            setCompletedParts(updatedCompleted);
                            onCompleteReading();
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <span>Hoàn thành Đọc ➔ Sang Kỹ năng Nói &amp; Viết</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
