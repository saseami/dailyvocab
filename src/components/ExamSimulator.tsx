import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MOCK_EXAM_LIST, MockExamMetadata, TOEIC_LISTENING_QUESTIONS, 
  TOEIC_READING_QUESTIONS, TOEIC_SW_QUESTIONS, SWExamQuestion,
  ListeningQuestion, ReadingQuestion, TOEIC_DIAGNOSTIC_LR_QUESTIONS,
  TOEIC_ADVANCED_LR_QUESTIONS
} from '../data/toeicSkillData';
import { 
  Trophy, Clock, CheckCircle2, AlertTriangle, Play, RotateCcw, 
  BarChart3, Award, Sparkles, BookOpen, Headphones, ArrowRight, 
  ShieldCheck, Volume2, VolumeX, Pause, RefreshCw, Eye, EyeOff, 
  Image as ImageIcon, Mic, MicOff, PenTool, Check, AlertCircle, FileText,
  HelpCircle, StopCircle, CheckCheck
} from 'lucide-react';
import { playSound, speakWord, stopSpeaking } from '../utils/audio';
import { VoiceRecognitionService, calculatePronunciationScore, isSpeechRecognitionSupported, PronunciationEvaluation } from '../utils/speechRecognition';
import { TOEICPictureCard } from './TOEICPictureCard';
import { TOEICDocumentViewer } from './TOEICDocumentViewer';

export const ExamSimulator: React.FC = () => {
  const [selectedExamId, setSelectedExamId] = useState<string>(MOCK_EXAM_LIST[0].id);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Audio Playback State for Listening Questions
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);

  // Active question index
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // LR Answers: Record<number, 'A' | 'B' | 'C' | 'D'>
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});

  // SW Answers: Record<number, { text: string; score?: number; transcript?: string }>
  const [swAnswers, setSwAnswers] = useState<Record<number, { text: string; score?: number; transcript?: string }>>({});

  // Speaking Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [speakingEvaluation, setSpeakingEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [speechError, setSpeechError] = useState('');

  // Show Model Answer toggles
  const [showModelAnswerMap, setShowModelAnswerMap] = useState<Record<number, boolean>>({});

  const voiceServiceRef = useRef<VoiceRecognitionService | null>(null);
  const currentExam = MOCK_EXAM_LIST.find(e => e.id === selectedExamId) || MOCK_EXAM_LIST[0];
  const isSWExam = currentExam.type === 'full_test_sw';

  // Determine active questions based on selected exam type:
  // - Mini Test (mock-lr-mini-01): 16 câu chẩn đoán 7 Part
  // - Advanced Test (mock-lr-full-01): 30 câu thực chiến nâng cao 800+
  // - Speaking & Writing (mock-sw-full-01): 19 câu Nói & Viết
  const testQuestions = useMemo(() => {
    if (selectedExamId === 'mock-sw-full-01') {
      return TOEIC_SW_QUESTIONS;
    }
    if (selectedExamId === 'mock-lr-full-01') {
      return TOEIC_ADVANCED_LR_QUESTIONS;
    }
    return TOEIC_DIAGNOSTIC_LR_QUESTIONS;
  }, [selectedExamId]);

  const totalQuestions = testQuestions.length;
  const currentQuestion = testQuestions[currentQIndex] || testQuestions[0];

  // Speech Recognition Service Init
  useEffect(() => {
    voiceServiceRef.current = new VoiceRecognitionService(
      (result) => {
        setLiveTranscript(result.transcript);
        if (isSWExam && 'promptText' in currentQuestion) {
          const target = (currentQuestion as SWExamQuestion).promptText;
          const evalResult = calculatePronunciationScore(target, result.transcript);
          setSpeakingEvaluation(evalResult);

          setSwAnswers(prev => ({
            ...prev,
            [currentQIndex]: {
              text: result.transcript,
              transcript: result.transcript,
              score: evalResult.score,
            }
          }));

          if (result.isFinal) {
            if (evalResult.score >= 70) {
              playSound('correct');
            }
          }
        }
      },
      (err) => {
        setSpeechError(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    return () => {
      try {
        voiceServiceRef.current?.stop();
      } catch {}
    };
  }, [isSWExam, currentQuestion, currentQIndex]);

  const startTest = () => {
    setUserAnswers({});
    setSwAnswers({});
    setCurrentQIndex(0);
    setIsTestSubmitted(false);
    setIsTestStarted(true);
    setSecondsRemaining(currentExam.durationMinutes * 60);
    setLiveTranscript('');
    setSpeakingEvaluation(null);
    setSpeechError('');
    playSound('click');
  };

  // Timer countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isTestStarted && !isTestSubmitted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTestStarted, isTestSubmitted, secondsRemaining]);

  // Handle Audio for LR Questions
  const handlePlayCurrentAudio = (speed: number = audioSpeed) => {
    if (!('audioPrompt' in currentQuestion) || !currentQuestion.audioPrompt) return;
    
    setAudioSpeed(speed);
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

  // Auto-play audio when navigating to a listening question (LR mode only)
  useEffect(() => {
    if (isTestStarted && !isTestSubmitted) {
      handleStopAudio();
      
      // Reset speech recognition on question switch
      if (isRecording) {
        voiceServiceRef.current?.stop();
        setIsRecording(false);
      }
      setLiveTranscript(swAnswers[currentQIndex]?.transcript || '');
      setSpeakingEvaluation(null);
      setSpeechError('');

      if (!isSWExam && 'part' in currentQuestion && currentQuestion.part <= 4 && 'audioPrompt' in currentQuestion && currentQuestion.audioPrompt) {
        if (autoPlayAudio) {
          const timeout = setTimeout(() => {
            handlePlayCurrentAudio(audioSpeed);
          }, 400);
          return () => clearTimeout(timeout);
        }
      }
    } else {
      handleStopAudio();
    }
  }, [currentQIndex, isTestStarted, isTestSubmitted]);

  // Speaking Recording Toggle & Controls
  const handleForceStopRecording = () => {
    try {
      voiceServiceRef.current?.stop();
    } catch (e) {
      console.warn('Error stopping voice recognition:', e);
    } finally {
      setIsRecording(false);
    }
  };

  const handleSimulateAnswer = () => {
    handleForceStopRecording();
    if (isSWExam && 'promptText' in currentQuestion) {
      const sample = (currentQuestion as SWExamQuestion).sampleAnswer || (currentQuestion as SWExamQuestion).promptText;
      setLiveTranscript(sample);
      const evalResult = calculatePronunciationScore((currentQuestion as SWExamQuestion).promptText, sample);
      setSpeakingEvaluation(evalResult);
      setSwAnswers(prev => ({
        ...prev,
        [currentQIndex]: {
          text: sample,
          transcript: sample,
          score: Math.max(90, evalResult.score),
        }
      }));
      playSound('correct');
    }
  };

  const toggleRecording = () => {
    setSpeechError('');
    if (isRecording) {
      handleForceStopRecording();
    } else {
      setLiveTranscript('');
      setSpeakingEvaluation(null);
      try {
        const started = voiceServiceRef.current?.start();
        if (started) {
          setIsRecording(true);
          playSound('click');
        } else {
          setSpeechError('Không thể kích hoạt micro. Bạn có thể bấm nút "AI Đọc & Chấm Mẫu Nhanh" bên dưới để tiếp tục.');
          setIsRecording(false);
        }
      } catch (e: any) {
        setSpeechError('Lỗi mở micro: ' + (e?.message || 'Vui lòng kiểm tra quyền truy cập micro'));
        setIsRecording(false);
      }
    }
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQIndex]: key,
    }));
    playSound('click');
  };

  const handleWritingInputChange = (text: string) => {
    setSwAnswers(prev => ({
      ...prev,
      [currentQIndex]: {
        text,
      }
    }));
  };

  const submitTest = () => {
    handleStopAudio();
    handleForceStopRecording();
    setIsTestSubmitted(true);
    setIsTestStarted(false);
    playSound('complete');
  };

  // Score Calculation
  let correctCount = 0;
  let listeningCorrect = 0;
  let readingCorrect = 0;
  let listeningTotal = 0;
  let readingTotal = 0;

  if (!isSWExam) {
    (testQuestions as (ListeningQuestion | ReadingQuestion)[]).forEach((q, idx) => {
      const isListening = q.part <= 4;
      if (isListening) listeningTotal++;
      else readingTotal++;

      if (userAnswers[idx] === q.correctAnswer) {
        correctCount++;
        if (isListening) listeningCorrect++;
        else readingCorrect++;
      }
    });
  }

  // ETS LR standard score projection
  const projectedListening = Math.min(495, Math.max(5, Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 490 + 5)));
  const projectedReading = Math.min(495, Math.max(5, Math.round((readingCorrect / Math.max(1, readingTotal)) * 490 + 5)));
  const totalProjectedScore = projectedListening + projectedReading;

  // ETS SW standard score projection
  let speakingSum = 0;
  let speakingCount = 0;
  let writingWordsSum = 0;
  let writingCount = 0;

  if (isSWExam) {
    TOEIC_SW_QUESTIONS.forEach((q, idx) => {
      const ans = swAnswers[idx];
      if (q.skill === 'speaking') {
        speakingCount++;
        if (ans?.score) speakingSum += ans.score;
        else if (ans?.transcript) speakingSum += 60;
      } else {
        writingCount++;
        const words = (ans?.text || '').trim().split(/\s+/).filter(Boolean).length;
        writingWordsSum += Math.min(100, words * 5);
      }
    });
  }

  const projectedSpeaking = isSWExam ? Math.min(200, Math.max(20, Math.round((speakingSum / Math.max(1, speakingCount * 100)) * 200))) : 0;
  const projectedWriting = isSWExam ? Math.min(200, Math.max(20, Math.round((writingWordsSum / Math.max(1, writingCount * 100)) * 200))) : 0;
  const totalProjectedSW = projectedSpeaking + projectedWriting;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Test Selection Screen */}
      {!isTestStarted && !isTestSubmitted && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#661225] via-[#801732] to-[#540c1c] text-white shadow-xl shadow-[#801732]/15">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Giai đoạn 3: Thực chiến Đề thi Thật ETS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              Phòng Thi Thử Chuẩn Format ETS 2026
            </h2>
            <p className="text-white/85 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Chọn đề thi phù hợp với kỹ năng mục tiêu của bạn: Đề thi Nghe & Đọc (LR) hoặc Đề thi Nói & Viết (Speaking & Writing) có ghi âm thu giọng và chấm điểm phát âm AI theo thời gian thực.
            </p>
          </div>

          {/* Quick Comparison Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[#801732] dark:text-rose-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                So Sánh 3 Bộ Đề Thi Khác Biệt Hoàn Toàn Về Cấu Trúc & Kỹ Năng:
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-extrabold text-amber-700 dark:text-amber-300 block mb-0.5">1. Mini Test (20 Phút)</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  16 câu trắc nghiệm bao quát đủ 7 Part. Dành cho kiểm tra chẩn đoán nhanh năng lực Nghe & Đọc.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-extrabold text-brand-700 dark:text-brand-300 block mb-0.5">2. Đề Nâng Cao (45 Phút)</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  30 câu thực chiến chuyên sâu với câu hỏi bẫy khó Target 800+, bài đọc kép Double Passage và audio 3 người.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-extrabold text-purple-700 dark:text-purple-300 block mb-0.5">3. Đề Nói & Viết (80 Phút)</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  19 câu hoàn toàn khác biệt: Thu âm giọng nói Speaking (Q1-11) + Soạn email & viết luận Writing (Q12-19).
                </p>
              </div>
            </div>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_EXAM_LIST.map((exam) => {
              const isSelected = selectedExamId === exam.id;
              const isSW = exam.type === 'full_test_sw';

              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-[#801732] ring-2 ring-[#801732]/25 shadow-md shadow-[#801732]/10 scale-[1.01]'
                      : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isSW
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
                          : exam.id === 'mock-lr-full-01'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      }`}>
                        {exam.formatBadge || exam.targetBand}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exam.durationMinutes} phút</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5 leading-snug">
                      {exam.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                      {exam.descriptionVi}
                    </p>

                    {/* Features list */}
                    {exam.features && (
                      <div className="space-y-1 mb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {exam.features.map((feat, fidx) => (
                          <div key={fidx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">{exam.totalQuestions} câu hỏi • {exam.skillsFocus}</span>
                    <span className={isSelected ? 'text-[#801732] dark:text-rose-400' : 'text-slate-400'}>
                      {isSelected ? 'Đang chọn ✓' : 'Bấm để chọn'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Exam Structure Details */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 block mb-1">
              📌 Cấu Trúc Đề Thi Đang Chọn ({currentExam.name}):
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
              {currentExam.id === 'mock-lr-mini-01' && (
                <p>
                  • <strong>16 câu trắc nghiệm chẩn đoán</strong> bao gồm: Part 1 Ảnh văn phòng & kho hàng (2 câu), Part 2 Hỏi đáp When/Or/Gián tiếp (3 câu), Part 3 Hội thoại đặt phòng (1 câu), Part 4 Thông báo phần mềm (1 câu), Part 5 Ngữ pháp từ loại & liên từ (4 câu), Part 6 Thông báo memo (1 câu), Part 7 Email, Hóa đơn & Lịch trình (4 câu).
                </p>
              )}
              {currentExam.id === 'mock-lr-full-01' && (
                <p>
                  • <strong>30 câu chuyên sâu nâng cao</strong> bao gồm: Toàn bộ 16 câu nền tảng + 14 câu bẫy khó Target 800+ (Part 1 Họp hội đồng & Café ngoài trời, Part 2 Bẫy phủ định & lùi hạn ngân sách, Part 3 Chuỗi cung ứng chip, Part 4 Sân bay quốc tế & Hợp đồng thuê nhà, Part 5 Đảo ngữ Should & Collocation biosafety, Part 6 Sáp nhập Crestview, Part 7 Bài đọc kép Double Passage hợp đồng & báo giá IT CloudCore).
                </p>
              )}
              {currentExam.id === 'mock-sw-full-01' && (
                <p>
                  • <strong>19 câu Nói & Viết thực chiến</strong> bao gồm: 11 câu Speaking (Đọc to văn bản thông báo, Miêu tả ảnh tại văn phòng & xưởng sản xuất, Trả lời phỏng vấn theo chủ đề, Bày tỏ quan điểm) + 8 câu Writing (Viết câu hoàn chỉnh dựa trên tranh ảnh, Phản hồi email khách hàng, Viết bài luận quan điểm 300 từ).
                </p>
              )}
            </div>
          </div>

          {/* Start Test CTA */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  {currentExam.type === 'full_test_sw' ? 'Bài thi Speaking & Writing (Nói & Viết)' : 'Bài thi Listening & Reading (Nghe & Đọc)'}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                Sẵn sàng làm bài thi: <span className="text-[#801732] dark:text-rose-400">{currentExam.name}</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Thời gian: <strong>{currentExam.durationMinutes} phút</strong> • Tổng số: <strong>{currentExam.totalQuestions} câu</strong> • Bấm nút bên phải để bắt đầu.
              </p>
            </div>

            <button
              onClick={startTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#801732] to-[#540b1e] hover:from-[#661225] hover:to-[#420817] text-white font-bold text-sm shadow-md shadow-[#801732]/25 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt Đầu Làm Bài Ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* Test In-Progress Screen */}
      {isTestStarted && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          {/* Top Timer Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Câu {currentQIndex + 1} / {totalQuestions}
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                isSWExam
                  ? (currentQuestion as SWExamQuestion).skill === 'speaking'
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : ('part' in currentQuestion && currentQuestion.part <= 4)
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {isSWExam
                  ? (currentQuestion as SWExamQuestion).skill === 'speaking'
                    ? `Phần Nói (Speaking Q${(currentQuestion as SWExamQuestion).questionNumber})`
                    : `Phần Viết (Writing Q${(currentQuestion as SWExamQuestion).questionNumber - 11})`
                  : ('part' in currentQuestion && currentQuestion.part <= 4)
                  ? 'Phần Nghe (Listening)'
                  : 'Phần Đọc (Reading)'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-mono font-bold">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              <button
                onClick={submitTest}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95"
              >
                Nộp bài sớm
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CASE A: SPEAKING & WRITING QUESTION INTERFACE            */}
          {/* ======================================================== */}
          {isSWExam && 'instructionsVi' in currentQuestion && (
            <div className="space-y-6">
              {/* Question Header & Title */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {(currentQuestion as SWExamQuestion).sectionTitleVi}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {(currentQuestion as SWExamQuestion).skill === 'speaking'
                      ? `Chuẩn bị: ${(currentQuestion as SWExamQuestion).prepTimeSeconds}s | Nói: ${(currentQuestion as SWExamQuestion).responseTimeSeconds}s`
                      : `Thời gian gợi ý: ${(currentQuestion as SWExamQuestion).timeLimitMinutes || 5} phút`}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {(currentQuestion as SWExamQuestion).title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {(currentQuestion as SWExamQuestion).instructionsVi}
                </p>
              </div>

              {/* Visual Photo Illustration for Speaking Part 2 & Writing Part 1 */}
              {(currentQuestion as SWExamQuestion).imageType && (
                <div className="mb-4">
                  <TOEICPictureCard 
                    type={(currentQuestion as SWExamQuestion).imageType!} 
                    title={(currentQuestion as SWExamQuestion).title}
                    altCaption={(currentQuestion as SWExamQuestion).contextVi || 'ETS Official Test Photograph'}
                    showCaption={isTestSubmitted}
                  />
                </div>
              )}

              {/* Realistic Document for Writing Part 2 (Email / Memo) */}
              {(currentQuestion as SWExamQuestion).skill === 'writing' && (currentQuestion as SWExamQuestion).part === 2 ? (
                <div className="mb-4">
                  <TOEICDocumentViewer 
                    passage={(currentQuestion as SWExamQuestion).promptText}
                    passageType={currentQuestion.id === 'sw-q17' ? 'Email' : 'Memo'}
                    passageTitle={(currentQuestion as SWExamQuestion).title}
                  />
                </div>
              ) : (
                /* Standard Prompt Box for Read Aloud, Opinion, and Questions */
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[11px] font-black uppercase text-slate-400 block mb-2">
                    {(currentQuestion as SWExamQuestion).skill === 'speaking' ? 'Văn bản đề bài / Câu hỏi phát thanh:' : 'Nội dung đề bài / Yêu cầu viết:'}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">
                    {(currentQuestion as SWExamQuestion).promptText}
                  </p>
                </div>
              )}

              {/* SUB-CASE A1: SPEAKING QUESTION (VOICE RECORDER) */}
              {(currentQuestion as SWExamQuestion).skill === 'speaking' && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 dark:from-slate-800 dark:via-purple-950/20 dark:to-slate-900 border-2 border-purple-200 dark:border-purple-800 shadow-md space-y-4">
                  
                  {/* Sample Audio Playback */}
                  <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-slate-700 flex-wrap gap-2">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                      Nghe phát âm chuẩn người bản xứ ETS:
                    </span>
                    <button
                      onClick={() => speakWord((currentQuestion as SWExamQuestion).sampleAnswer, audioSpeed)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Nghe mẫu ({audioSpeed}x)</span>
                    </button>
                  </div>

                  {/* Microphone Action Button */}
                  <div className="text-center py-3">
                    <button
                      onClick={toggleRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto transition-all shadow-xl active:scale-95 ${
                        isRecording
                          ? 'bg-rose-600 hover:bg-rose-700 ring-8 ring-rose-400/30 animate-pulse'
                          : 'bg-purple-600 hover:bg-purple-700 ring-8 ring-purple-400/20'
                      }`}
                      title={isRecording ? 'Bấm để dừng ghi âm' : 'Bấm vào micro để bắt đầu phát âm'}
                    >
                      {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
                    </button>

                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-3">
                      {isRecording ? '🔴 Đang lắng nghe... Hãy đọc to câu trả lời của bạn' : 'Bấm vào micro để bắt đầu thu âm phát âm'}
                    </p>

                    {/* Explicit Control Buttons when recording or stuck */}
                    {isRecording ? (
                      <div className="flex items-center justify-center gap-2.5 mt-3 flex-wrap">
                        <button
                          onClick={handleForceStopRecording}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md active:scale-95 flex items-center gap-1.5"
                        >
                          <StopCircle className="w-4 h-4" />
                          <span>⏹ Dừng Thu & Chấm Điểm</span>
                        </button>
                        <button
                          onClick={() => {
                            handleForceStopRecording();
                            setLiveTranscript('');
                            setSpeakingEvaluation(null);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold active:scale-95"
                        >
                          <span>Hủy</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                        <button
                          onClick={handleSimulateAnswer}
                          className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                          title="Tự động điền bài nói mẫu chuẩn bản xứ và chấm điểm AI nhanh nếu không tiện dùng mic trên Safari"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span>AI Đọc & Chấm Mẫu Nhanh (Không cần mic)</span>
                        </button>
                      </div>
                    )}

                    {speechError && (
                      <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-semibold mt-3 max-w-md mx-auto text-center space-y-1.5">
                        <p>{speechError}</p>
                        <button
                          onClick={handleSimulateAnswer}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-extrabold text-xs inline-flex items-center gap-1 active:scale-95 shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Dùng Câu Trả Lời Mẫu ETS & Đi Tiếp ➔</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Real-time Transcript & Score */}
                  {(liveTranscript || speakingEvaluation) && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          AI Nhận Diện Lời Nói:
                        </span>
                        {speakingEvaluation && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                            speakingEvaluation.score >= 80
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            Độ chuẩn xác: {speakingEvaluation.score}%
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic mb-3">
                        "{liveTranscript}"
                      </p>

                      {/* Colored Word Chips */}
                      {speakingEvaluation && (
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                            Chi tiết phát âm từng từ (Bấm vào từ để nghe lại âm chuẩn):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {speakingEvaluation.wordFeedback.map((wf, widx) => (
                              <button
                                key={widx}
                                onClick={() => speakWord(wf.word, 0.9)}
                                className={`px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                                  wf.status === 'correct'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 ring-1 ring-rose-400'
                                }`}
                                title="Bấm để nghe phát âm từ này"
                              >
                                {wf.status === 'correct' ? <Check className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-rose-600" />}
                                <span>{wf.word}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Vocabulary Hints */}
                  {(currentQuestion as SWExamQuestion).keyVocabulary && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold uppercase text-purple-700 dark:text-purple-300 block mb-1.5">
                        Từ vựng ghi điểm Part này:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(currentQuestion as SWExamQuestion).keyVocabulary?.map((kv, kIdx) => (
                          <button
                            key={kIdx}
                            onClick={() => speakWord(kv.word, 0.9)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:border-purple-400 flex items-center gap-1.5"
                          >
                            <Volume2 className="w-3 h-3 text-purple-600" />
                            <strong>{kv.word}</strong>
                            <span className="text-slate-400 text-[11px]">{kv.ipa}</span>
                            <span className="text-slate-500">({kv.meaningVi})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-CASE A2: WRITING QUESTION (TEXT EDITOR) */}
              {(currentQuestion as SWExamQuestion).skill === 'writing' && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border-2 border-emerald-200 dark:border-emerald-800 shadow-md space-y-4">
                  {/* Required Keywords Checklist for Q12-16 */}
                  {(currentQuestion as SWExamQuestion).requiredWords && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase block mb-1.5">
                        Từ vựng bắt buộc phải có trong câu:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(currentQuestion as SWExamQuestion).requiredWords?.map((kw, kwIdx) => {
                          const typedText = (swAnswers[currentQIndex]?.text || '').toLowerCase();
                          const isContained = typedText.includes(kw.toLowerCase().trim());
                          return (
                            <span
                              key={kwIdx}
                              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isContained
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300'
                              }`}
                            >
                              {isContained ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
                              <span>{kw}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Textarea Editor */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Nhập bài viết của bạn tại đây:
                    </label>
                    <textarea
                      rows={(currentQuestion as SWExamQuestion).questionNumber === 19 ? 12 : 5}
                      value={swAnswers[currentQIndex]?.text || ''}
                      onChange={(e) => handleWritingInputChange(e.target.value)}
                      placeholder={(currentQuestion as SWExamQuestion).questionNumber === 19 ? 'Viết bài luận tối thiểu 300 từ tại đây...' : 'Nhập câu trả lời bằng tiếng Anh...'}
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                    />
                    
                    {/* Live Word Counter */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mt-1 px-1">
                      <span>
                        Số từ đã viết: <strong className="text-emerald-600 dark:text-emerald-400">
                          {(swAnswers[currentQIndex]?.text || '').trim().split(/\s+/).filter(Boolean).length}
                        </strong> từ
                      </span>
                      {(currentQuestion as SWExamQuestion).questionNumber === 19 && (
                        <span>Mục tiêu tối thiểu: 300 từ</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsible Model Answer & Scoring Rubric */}
              <div className="pt-2">
                <button
                  onClick={() => setShowModelAnswerMap(prev => ({ ...prev, [currentQIndex]: !prev[currentQIndex] }))}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>
                    {showModelAnswerMap[currentQIndex] ? 'Ẩn câu trả lời mẫu & tiêu chí chấm điểm' : 'Xem câu trả lời mẫu chuẩn Level 8 ETS & tiêu chí chấm điểm'}
                  </span>
                </button>

                {showModelAnswerMap[currentQIndex] && (
                  <div className="mt-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
                    <div>
                      <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                        Câu trả lời mẫu đạt điểm tối đa (Level 8 / Band 200 điểm):
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-sans leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        {(currentQuestion as SWExamQuestion).sampleAnswer}
                      </p>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Bản dịch nghĩa:</strong> {(currentQuestion as SWExamQuestion).sampleAnswerVi}
                    </div>

                    <div className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 leading-relaxed">
                      <strong>Tiêu chí chấm điểm ETS:</strong> {(currentQuestion as SWExamQuestion).scoringCriteria}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* CASE B: LISTENING & READING QUESTION INTERFACE (LR)     */}
          {/* ======================================================== */}
          {!isSWExam && (
            <div>
              {/* DEDICATED HIGH-VISIBILITY AUDIO PLAYER FOR LISTENING QUESTIONS */}
              {'part' in currentQuestion && currentQuestion.part <= 4 && 'audioPrompt' in currentQuestion && currentQuestion.audioPrompt && (
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 dark:from-slate-800 dark:via-blue-950/40 dark:to-slate-900 border-2 border-blue-300 dark:border-blue-800 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Play / Replay Audio Button */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (isPlayingAudio) {
                            handleStopAudio();
                          } else {
                            handlePlayCurrentAudio(audioSpeed);
                          }
                        }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-all active:scale-95 ${
                          isPlayingAudio
                            ? 'bg-amber-600 hover:bg-amber-700 ring-4 ring-amber-400/30 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-400/20'
                        }`}
                        title={isPlayingAudio ? 'Dừng audio' : 'Phát audio đề thi'}
                      >
                        {isPlayingAudio ? (
                          <Pause className="w-7 h-7 fill-white" />
                        ) : (
                          <Volume2 className="w-7 h-7" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {isPlayingAudio ? 'Đang phát Audio Đề Thi ETS...' : 'Âm Thanh Đề Thi TOEIC Listening'}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isPlayingAudio 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 animate-pulse' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {isPlayingAudio ? 'AUDIO ĐANG CHẠY' : 'SẴN SÀNG'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-2">
                          <span>Bấm nút loa để nghe lại audio</span>
                          <span>•</span>
                          <span>Tốc độ: <strong>{audioSpeed}x</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Speed Controls & Auto-play Toggle */}
                    <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                      <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        {[0.75, 1.0].map(spd => (
                          <button
                            key={spd}
                            onClick={() => handlePlayCurrentAudio(spd)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              audioSpeed === spd
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setAutoPlayAudio(prev => !prev)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          autoPlayAudio
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                        title="Tự động phát audio khi chuyển sang câu tiếp theo"
                      >
                        <span>Tự động phát: {autoPlayAudio ? 'BẬT' : 'TẮT'}</span>
                      </button>
                    </div>

                  </div>

                  {/* Visual Wave */}
                  {isPlayingAudio && (
                    <div className="mt-3 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center gap-1.5 justify-center">
                      <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 mr-2">
                        Listening Audio:
                      </span>
                      {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 65, 30, 85, 55, 75].map((height, i) => (
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
                </div>
              )}

              {/* Part 1 Photo Card (Visual Test Photo) */}
              {'part' in currentQuestion && currentQuestion.part === 1 && (
                <div className="mb-6">
                  <TOEICPictureCard 
                    type={(currentQuestion as ListeningQuestion).imageType || (currentQuestion.id === 'l-p1-02' ? 'warehouse-loading' : 'office-typing')} 
                    title="Part 1: ETS Official Test Photograph"
                    altCaption={(currentQuestion as ListeningQuestion).scenario || 'Look at the photo and listen to the statements.'}
                    showCaption={isTestSubmitted}
                  />
                </div>
              )}

              {/* Reading Passage Rendered as Authentic ETS Document */}
              {'passage' in currentQuestion && currentQuestion.passage && (
                <div className="mb-6">
                  <TOEICDocumentViewer 
                    passage={currentQuestion.passage}
                    passageType={(currentQuestion as ReadingQuestion).passageType || 'Email'}
                    passageTitle={(currentQuestion as ReadingQuestion).passageTitle}
                  />
                </div>
              )}

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mb-6">
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {(currentQuestion as (ListeningQuestion | ReadingQuestion)).questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {(currentQuestion as (ListeningQuestion | ReadingQuestion)).options.map(opt => {
                  const isSelected = userAnswers[currentQIndex] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-500 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/30'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation & Bubble Matrix */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200"
            >
              Câu trước
            </button>

            {/* Quick Bubble Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md no-scrollbar">
              {testQuestions.map((q, idx) => {
                const isAnswered = isSWExam
                  ? Boolean(swAnswers[idx]?.text || swAnswers[idx]?.transcript)
                  : Boolean(userAnswers[idx]);

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all relative ${
                      currentQIndex === idx
                        ? 'bg-brand-600 text-white ring-2 ring-brand-400 scale-105'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                    title={`Câu ${idx + 1}`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentQIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentQIndex === totalQuestions - 1}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-all active:scale-95"
            >
              Câu tiếp
            </button>
          </div>
        </div>
      )}

      {/* Test Result Screen */}
      {isTestSubmitted && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-scale-up">
          {/* Header */}
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              Kết Quả Thi Thử TOEIC ETS
            </h2>
            <p className="text-xs text-slate-500">
              Đã hoàn thành bài thi: <strong>{currentExam.name}</strong>
            </p>
          </div>

          {/* LR SCORE RESULTS */}
          {!isSWExam && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 text-center">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Dự đoán Listening</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {projectedListening}
                </span>
                <span className="text-xs text-slate-400 block">/ 495 điểm ({listeningCorrect}/{listeningTotal} đúng)</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 text-center">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Dự đoán Reading</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {projectedReading}
                </span>
                <span className="text-xs text-slate-400 block">/ 495 điểm ({readingCorrect}/{readingTotal} đúng)</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#801732] to-[#540b1e] text-white text-center shadow-lg shadow-[#801732]/20">
                <span className="text-xs text-white/80 uppercase font-bold block mb-1">Tổng điểm ETS Dự Đoán</span>
                <span className="text-3xl sm:text-4xl font-black text-amber-300">
                  {totalProjectedScore}
                </span>
                <span className="text-xs text-white/80 block">/ 990 điểm ({correctCount}/{totalQuestions} câu)</span>
              </div>
            </div>
          )}

          {/* SW SCORE RESULTS */}
          {isSWExam && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 text-center">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Dự đoán Speaking</span>
                <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                  {projectedSpeaking}
                </span>
                <span className="text-xs text-slate-400 block">/ 200 điểm (Q1 - 11 Speaking)</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 text-center">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Dự đoán Writing</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {projectedWriting}
                </span>
                <span className="text-xs text-slate-400 block">/ 200 điểm (Q12 - 19 Writing)</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#801732] to-[#540b1e] text-white text-center shadow-lg shadow-[#801732]/20">
                <span className="text-xs text-white/80 uppercase font-bold block mb-1">Tổng Điểm TOEIC SW</span>
                <span className="text-3xl sm:text-4xl font-black text-amber-300">
                  {totalProjectedSW}
                </span>
                <span className="text-xs text-white/80 block">/ 400 điểm (19 câu hỏi)</span>
              </div>
            </div>
          )}

          {/* Retake Test CTA */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => {
                setIsTestSubmitted(false);
                setIsTestStarted(false);
                playSound('click');
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 active:scale-95 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thi Lại Đề Khác</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
