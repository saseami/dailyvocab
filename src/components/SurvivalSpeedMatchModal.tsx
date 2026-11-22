import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Trophy, Flame, RotateCcw, Sparkles, Award } from 'lucide-react';
import { Word } from '../types';
import { playSound } from '../utils/audio';
import { unlockAchievement } from '../utils/achievements';
import confetti from 'canvas-confetti';

interface SurvivalSpeedMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allWords: Word[];
}

interface CardItem {
  id: string; // word.id
  type: 'word' | 'meaning';
  text: string;
  wordId: string;
}

const HIGH_SCORE_KEY = 'dailyvocab_speed_highscore_v1';

export const SurvivalSpeedMatchModal: React.FC<SurvivalSpeedMatchModalProps> = ({
  isOpen,
  onClose,
  allWords,
}) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    } catch {}
    return 0;
  });

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<CardItem | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<CardItem | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Pick 4 fresh words and generate 8 cards
  const dealNewSet = (usedWordIds: Set<string> = new Set()) => {
    const available = allWords.filter(w => !usedWordIds.has(w.id));
    const pool = available.length >= 4 ? available : allWords;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);

    const wordCards: CardItem[] = shuffled.map(w => ({
      id: `w-${w.id}`,
      type: 'word',
      text: w.word,
      wordId: w.id,
    }));

    const meaningCards: CardItem[] = shuffled.map(w => ({
      id: `m-${w.id}`,
      type: 'meaning',
      text: w.meaningVi.split(',')[0].split(';')[0].trim(),
      wordId: w.id,
    }));

    setCards([...wordCards, ...meaningCards].sort(() => 0.5 - Math.random()));
    setMatchedIds([]);
    setSelectedWord(null);
    setSelectedMeaning(null);
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    dealNewSet();
    playSound('correct');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setGameState('gameover');
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('complete');
  };

  useEffect(() => {
    if (gameState === 'gameover') {
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem(HIGH_SCORE_KEY, String(score));
        } catch {}
      }
      if (score >= 300) {
        unlockAchievement('speed_demon');
      }
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    }
  }, [gameState, score, highScore]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Card Click
  const handleCardClick = (card: CardItem) => {
    if (gameState !== 'playing') return;
    if (matchedIds.includes(card.wordId)) return;

    if (card.type === 'word') {
      if (selectedWord?.id === card.id) {
        setSelectedWord(null);
        return;
      }
      setSelectedWord(card);
      playSound('click');

      // Check match if meaning already selected
      if (selectedMeaning) {
        checkMatch(card, selectedMeaning);
      }
    } else {
      if (selectedMeaning?.id === card.id) {
        setSelectedMeaning(null);
        return;
      }
      setSelectedMeaning(card);
      playSound('click');

      // Check match if word already selected
      if (selectedWord) {
        checkMatch(selectedWord, card);
      }
    }
  };

  const checkMatch = (wordCard: CardItem, meaningCard: CardItem) => {
    if (wordCard.wordId === meaningCard.wordId) {
      // MATCH SUCCESS
      playSound('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 10 + newCombo * 5;
      setScore(prev => prev + points);

      const nextMatched = [...matchedIds, wordCard.wordId];
      setMatchedIds(nextMatched);
      setSelectedWord(null);
      setSelectedMeaning(null);

      // If all 4 matched, deal new set
      if (nextMatched.length >= 4) {
        setTimeout(() => {
          dealNewSet();
        }, 300);
      }
    } else {
      // WRONG MATCH
      playSound('wrong');
      setCombo(0);
      setScore(prev => Math.max(0, prev - 5));
      setWrongFlash(wordCard.id);
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedWord(null);
        setSelectedMeaning(null);
      }, 400);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl text-white space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Thử Thách Sinh Tồn 60 Giây (Speed Match)
              </h3>
              <p className="text-[10px] text-slate-400">
                Ghép nhanh từ vựng • Kích hoạt chuỗi nhân điểm Combo
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* START SCREEN */}
        {gameState === 'idle' && (
          <div className="py-8 text-center space-y-4 animate-in fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Zap className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">
                Sẵn Sàng Thử Thách Phản Xạ?
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Bạn có đúng 60 giây để nối các cặp từ tiếng Anh và nghĩa tiếng Việt tương ứng. Combo càng cao, điểm thưởng càng lớn!
              </p>
            </div>

            {highScore > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
                <Trophy className="w-4 h-4" />
                <span>Kỷ lục cao nhất: {highScore} điểm</span>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-[#801732] hover:from-rose-500 hover:to-[#6b132a] text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 active:scale-95 transition-all"
            >
              BẮT ĐẦU NGAY (60 GIÂY) ⚡
            </button>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && (
          <div className="space-y-3.5 animate-in fade-in">
            {/* Top Score & Timer Bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              {/* Timer Bar */}
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black font-mono text-amber-400">
                  {timeLeft}s
                </div>
                <div className="w-20 sm:w-28 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-300"
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                  />
                </div>
              </div>

              {/* Combo & Score */}
              <div className="text-right">
                <div className="text-xl font-black text-cyan-300 font-mono">
                  {score} pts
                </div>
                {combo > 1 && (
                  <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    combo >= 4 ? 'bg-rose-500 text-white animate-pulse' : 'text-amber-400'
                  }`}>
                    🔥 Combo x{combo}
                  </span>
                )}
              </div>
            </div>

            {/* Cards Grid: 8 Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {cards.map((card) => {
                const isMatched = matchedIds.includes(card.wordId);
                const isSelected = selectedWord?.id === card.id || selectedMeaning?.id === card.id;
                const isFlashingWrong = wrongFlash === card.id;

                let btnClass = 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-750 hover:border-slate-600';
                if (isMatched) {
                  btnClass = 'opacity-0 pointer-events-none transition-opacity duration-300';
                } else if (isFlashingWrong) {
                  btnClass = 'bg-rose-600 text-white border-rose-500 animate-shake';
                } else if (isSelected) {
                  btnClass = 'bg-[#801732] text-white border-rose-400 shadow-md shadow-[#801732]/40 ring-2 ring-white/60 font-black';
                }

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={isMatched}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm min-h-[64px] flex items-center justify-center transition-all active:scale-95 ${btnClass}`}
                  >
                    <span>{card.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState === 'gameover' && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center font-black">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                HẾT GIỜ! TỔNG ĐIỂM CỦA BẠN:
              </span>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400 font-mono mt-1">
                {score} Điểm
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>KỶ LỤC MỚI CỦA BẠN!</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-[#801732] hover:from-rose-500 hover:to-[#6b132a] text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại (60s)</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
