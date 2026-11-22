import React, { useState, useEffect, useMemo } from 'react';
import { TOEIC_LISTENING_QUESTIONS, ListeningQuestion, TOEICPhase } from '../data/toeicSkillData';
import { Topic, Word } from '../types';
import { generateTopicListeningQuestions } from '../utils/topicSkillGenerator';
import { saveTopicSkillCompleted } from '../utils/topicProgress';
import { 
  Headphones, Volume2, CheckCircle2, AlertTriangle, Eye, EyeOff, Sparkles, 
  HelpCircle, ArrowRight, RotateCcw, Lightbulb, Compass, Zap, Target, Pause, Info, Award, Globe
} from 'lucide-react';
import { speakWord, stopSpeaking, playSound } from '../utils/audio';
import { TOEICPictureCard } from './TOEICPictureCard';

interface ListeningHubProps {
  currentPhase: TOEICPhase;
  topic?: Topic;
  topicWords?: Word[];
  onCompleteListening?: () => void;
}

export const ListeningHub: React.FC<ListeningHubProps> = ({ 
  currentPhase, 
  topic, 
  topicWords,
  onCompleteListening 
}) => {
  // Available Listening parts strictly filtered by current Phase:
  // GĐ 1 (Nền tảng): Part 1 (Tranh ảnh) & Part 2 (Hỏi đáp nhanh)
  // GĐ 2 (Tăng tốc): Part 3 (Hội thoại) & Part 4 (Bài nói ngắn)
  // GĐ 3 (Thực chiến): Đầy đủ Part 1, 2, 3, 4
  const availableParts = useMemo(() => {
    if (currentPhase === 'foundation') {
      return [
        { part: 1, label: 'Part 1: Tranh ảnh', phaseTag: 'Trọng tâm GĐ 1' },
        { part: 2, label: 'Part 2: Hỏi - Đáp', phaseTag: 'Trọng tâm GĐ 1' },
      ];
    } else if (currentPhase === 'acceleration') {
      return [
        { part: 3, label: 'Part 3: Hội thoại', phaseTag: 'Trọng tâm GĐ 2' },
        { part: 4, label: 'Part 4: Bài nói ngắn', phaseTag: 'Trọng tâm GĐ 2' },
      ];
    }
    return [
      { part: 1, label: 'Part 1: Tranh ảnh', phaseTag: 'GĐ 1' },
      { part: 2, label: 'Part 2: Hỏi - Đáp', phaseTag: 'GĐ 1' },
      { part: 3, label: 'Part 3: Hội thoại', phaseTag: 'GĐ 2' },
      { part: 4, label: 'Part 4: Bài nói ngắn', phaseTag: 'GĐ 2' },
    ];
  }, [currentPhase]);

  const [selectedPart, setSelectedPart] = useState<number>(() => {
    return currentPhase === 'acceleration' ? 3 : 1;
  });
  const [completedParts, setCompletedParts] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync selectedPart with currentPhase on change
  useEffect(() => {
    if (currentPhase === 'acceleration') {
      setSelectedPart(3);
    } else if (currentPhase === 'foundation') {
      setSelectedPart(1);
    }
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowTranscript(false);
    stopSpeaking();
    setIsPlayingAudio(false);
  }, [currentPhase]);

  // Stop audio on index or part change
  useEffect(() => {
    stopSpeaking();
    setIsPlayingAudio(false);
  }, [currentIndex, selectedPart]);

  // Dynamically generate topic-linked questions or fallback to phase questions
  const questions = useMemo(() => {
    if (topic && topicWords && topicWords.length > 0) {
      return generateTopicListeningQuestions(topic, topicWords, selectedPart, currentPhase);
    }
    return TOEIC_LISTENING_QUESTIONS.filter(q => q.part === selectedPart);
  }, [topic, topicWords, selectedPart, currentPhase]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handlePlayAudio = (speed: number = playbackSpeed) => {
    if (!currentQuestion?.audioPrompt) return;
    setPlaybackSpeed(speed);
    setIsPlayingAudio(true);
    speakWord(currentQuestion.audioPrompt, {
      rate: speed,
      lang: 'en-US',
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setIsPlayingAudio(false);
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(key);
    setShowExplanation(true);

    if (key === currentQuestion.correctAnswer) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    // Save listening skill completion for this topic
    if (topic?.id) {
      saveTopicSkillCompleted(topic.id, 'listening');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowTranscript(false);
      playSound('click');
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowTranscript(false);
    playSound('click');
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">Chưa có dữ liệu bài nghe cho phần này.</p>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isPart1or2 = currentQuestion.part === 1 || currentQuestion.part === 2;
  const isPart2 = currentQuestion.part === 2;

  // Filter out Option D for Part 2 (Real ETS Part 2 only has 3 choices: A, B, C)
  const displayOptions = isPart2
    ? currentQuestion.options.filter(o => o.key !== 'D')
    : currentQuestion.options;

  return (
    <div className="max-w-4xl mx-auto py-4">
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
            <Headphones className="w-5 h-5" />
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
                  ? 'Kỹ năng Nghe Part 1 (Hình ảnh) & Part 2 (Hỏi đáp nhanh)'
                  : currentPhase === 'acceleration'
                  ? 'Kỹ năng Nghe Part 3 (Hội thoại ngắn) & Part 4 (Độc thoại)'
                  : 'Luyện tập tổng hợp cả 4 Part chuẩn format ETS'}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {currentPhase === 'foundation'
                ? 'Mục tiêu 450 - 600+: Bắt thì động từ "is/are V-ing" vs "has been V3" ở Part 1; Bắt từ để hỏi WH-, bẫy từ đồng âm lặp lại và câu trả lời Yes/No ở Part 2.'
                : currentPhase === 'acceleration'
                ? 'Mục tiêu 650 - 800+: Đọc lướt 3 câu hỏi trong 8s nghỉ, bắt từ khóa đồng nghĩa (Paraphrase), nghe câu hỏi ngụ ý của người nói và câu hỏi đối chiếu bảng biểu.'
                : 'Mục tiêu 850 - 990+: Luyện nghe áp lực cao với giọng đọc đa quốc gia (Mỹ, Anh, Úc, Canada) và xử lý 100 câu liên tục.'}
            </p>
          </div>
        </div>
      </div>

      {/* Part Navigation Pills (Filtered strictly by current phase) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          {availableParts.map(item => (
            <button
              key={item.part}
              onClick={() => {
                setSelectedPart(item.part);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setShowExplanation(false);
                setShowTranscript(false);
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

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Audio Player Bar with Speed Controls */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/50 dark:from-slate-800 dark:via-slate-850 dark:to-blue-950/30 border border-blue-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isPlayingAudio) {
                  handleStopAudio();
                } else {
                  handlePlayAudio(playbackSpeed);
                }
              }}
              className={`w-13 h-13 rounded-2xl text-white flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                isPlayingAudio
                  ? 'bg-amber-600 hover:bg-amber-700 ring-4 ring-amber-400/30 animate-pulse'
                  : 'bg-brand-600 hover:bg-brand-700 ring-4 ring-brand-500/20'
              }`}
              title={isPlayingAudio ? 'Dừng audio' : 'Bấm để nghe audio bản xứ'}
            >
              {isPlayingAudio ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  {isPlayingAudio ? 'Đang phát Audio người bản xứ ETS...' : 'Audio Đề Thi Listening Chuẩn ETS'}
                </p>
                {isPlayingAudio && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 animate-pulse">
                    ĐANG PHÁT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bấm nút loa để phát / dừng • Tốc độ: <strong>{playbackSpeed}x</strong>
              </p>
            </div>
          </div>

          {/* Speed Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            {[0.5, 0.75, 1.0].map(speed => (
              <button
                key={speed}
                onClick={() => handlePlayAudio(speed)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Visual Audio Wave Animation Bar when Playing */}
        {isPlayingAudio && (
          <div className="mb-6 -mt-3 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-1.5 justify-center">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 mr-2">
              Playing Audio:
            </span>
            {[30, 60, 25, 80, 50, 90, 45, 75, 40, 85, 60, 30, 70, 50, 65].map((height, i) => (
              <div
                key={i}
                className="w-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"
                style={{
                  height: `${height * 0.22}px`,
                  animationDuration: `${0.3 + (i % 5) * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Visual Photograph for Part 1 Questions */}
        {currentQuestion.part === 1 && (
          <div className="mb-6">
            <TOEICPictureCard 
              type={currentQuestion.imageType || (currentQuestion.id === 'l-p1-02' ? 'warehouse-loading' : 'office-typing')} 
              title="Part 1: ETS Official Test Photograph"
              altCaption={currentQuestion.scenario || 'Look at the photo and listen to the four statements.'}
              showCaption={selectedAnswer !== null}
            />
          </div>
        )}

        {/* Question Text / Prompt */}
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {currentQuestion.title}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* ETS Exam Rule Notice for Part 1 and Part 2 (Answers hidden in test booklet) */}
        {isPart1or2 && selectedAnswer === null && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block font-bold">Quy chuẩn đề thi thật ETS TOEIC (Part {currentQuestion.part}):</strong>
              Trong bài thi thật, các câu trả lời <strong>KHÔNG ĐƯỢC IN CHỮ</strong> trên đề. Bạn chỉ nghe người bản xứ đọc và tích chọn <strong>({isPart2 ? 'A, B, C' : 'A, B, C, D'})</strong> vào phiếu trả lời.
              <span className="block mt-0.5 text-amber-700 dark:text-amber-300 font-medium italic">
                ➔ Bấm nút Loa nghe audio và chọn đáp án bên dưới. Văn bản, dịch nghĩa và lời giải sẽ hiện ra ngay sau khi bạn chọn!
              </span>
            </div>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {displayOptions.map(opt => {
            const key = opt.key;
            const optText = opt.text;
            const isSelected = selectedAnswer === key;
            const isRight = key === currentQuestion.correctAnswer;

            // In Part 1 & Part 2, hide the sentence text before answering to simulate the real ETS exam
            const hideText = isPart1or2 && selectedAnswer === null;

            let optionStyle = 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 hover:border-brand-400';
            if (selectedAnswer !== null) {
              if (isRight) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
              } else if (isSelected && !isRight) {
                optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
              } else {
                optionStyle = 'bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400';
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

                  {hideText ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        Phương án ({key})
                      </span>
                      <span className="text-xs text-slate-400 italic">
                        • Nghe audio và tích chọn
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold">{optText}</span>
                  )}
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

        {/* Transcript Toggle, Sentence Translation & Trap Explanation */}
        {showExplanation && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
            
            {/* Correct/Wrong Feedback Alert */}
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
                {isCorrect ? 'Chính xác! Bạn đã chọn đúng đáp án.' : `Chưa đúng! Đáp án chính xác là (${currentQuestion.correctAnswer}).`}
              </span>
            </div>

            {/* Dịch nghĩa toàn bộ câu / Lời thoại */}
            {currentQuestion.sentenceTranslationVi && (
              <div className="p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-900/60 text-blue-950 dark:text-blue-100 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5 text-blue-700 dark:text-blue-300">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Dịch Nghĩa Lời Thoại &amp; Câu Hỏi (Tiếng Việt):
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold leading-relaxed bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 whitespace-pre-line">
                  {currentQuestion.sentenceTranslationVi}
                </div>
              </div>
            )}

            {/* Trap Warning Analysis */}
            {currentQuestion.trapType && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Phân tích bẫy đề ETS ({currentQuestion.trapType}):
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {currentQuestion.keywords?.length > 0 && `Từ khóa cần chú ý: ${currentQuestion.keywords.join(', ')}`}
                </p>
              </div>
            )}

            {/* Transcript Reveal Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Audio Script & Lời thoại:
                </span>
                <button
                  onClick={() => setShowTranscript(prev => !prev)}
                  className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
                >
                  {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}</span>
                </button>
              </div>

              {showTranscript && (
                <div className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-line">
                  {currentQuestion.transcript}
                </div>
              )}
            </div>

            {/* In-depth Explanation */}
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                Giải thích chi tiết:
              </strong>
              {currentQuestion.explanationVi}
            </div>

            {/* Next Question or Complete Skill Button */}
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
                          <span>Đã xong {availableParts.find(p => p.part === selectedPart)?.label}. Hãy tiếp tục phần {nextPartToRun.label}!</span>
                        </div>
                        <button
                          onClick={() => {
                            setCompletedParts(updatedCompleted);
                            setSelectedPart(nextPartToRun.part);
                            setCurrentIndex(0);
                            setSelectedAnswer(null);
                            setShowExplanation(false);
                            setShowTranscript(false);
                            stopSpeaking();
                            setIsPlayingAudio(false);
                            playSound('click');
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#801732] to-rose-700 hover:from-[#6b132a] hover:to-rose-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <span>Tiếp tục: Sang {nextPartToRun.label}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>✓ Đã hoàn tất toàn bộ {availableParts.length} phần Luyện Nghe ({availableParts.map(p => p.label.split(':')[0]).join(' & ')})! (+25% tiến độ)</span>
                      </div>
                      {onCompleteListening && (
                        <button
                          onClick={() => {
                            setCompletedParts(updatedCompleted);
                            onCompleteListening();
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <span>Hoàn thành Nghe ➔ Sang Kỹ năng Đọc</span>
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
