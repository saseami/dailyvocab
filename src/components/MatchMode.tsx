import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { Zap, RotateCcw, Clock, Award, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

interface MatchModeProps {
  words: Word[];
  onComplete: () => void;
}

interface Tile {
  id: string;
  wordId: string;
  text: string;
  type: 'en' | 'vi';
  isMatched: boolean;
}

const WORDS_PER_ROUND = 6;

export const MatchMode: React.FC<MatchModeProps> = ({ words, onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const totalRounds = Math.max(1, Math.ceil(words.length / WORDS_PER_ROUND));

  // Setup a specific round
  const setupRound = (roundIdx: number) => {
    if (!words || words.length === 0) return;

    const startIdx = roundIdx * WORDS_PER_ROUND;
    const roundWords = words.slice(startIdx, startIdx + WORDS_PER_ROUND);

    const generatedTiles: Tile[] = [];
    roundWords.forEach((w) => {
      generatedTiles.push({
        id: `en-${w.id}`,
        wordId: w.id,
        text: w.word,
        type: 'en',
        isMatched: false,
      });
      generatedTiles.push({
        id: `vi-${w.id}`,
        wordId: w.id,
        text: w.meaningVi,
        type: 'vi',
        isMatched: false,
      });
    });

    setTiles(generatedTiles.sort(() => 0.5 - Math.random()));
    setSelectedTileId(null);
    setWrongPair(null);
    setRoundCompleted(false);
    setIsTimerRunning(true);
  };

  // Initial load or when words change
  useEffect(() => {
    setCurrentRound(0);
    setMoves(0);
    setSeconds(0);
    setIsAllCompleted(false);
    setupRound(0);
  }, [words]);

  // Timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && !isAllCompleted) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isAllCompleted]);

  const handleTileClick = (tile: Tile) => {
    if (tile.isMatched || wrongPair) return;
    if (selectedTileId === tile.id) return; // clicking same tile

    playSound('click');

    if (!selectedTileId) {
      setSelectedTileId(tile.id);
      return;
    }

    // Second tile clicked
    const firstTile = tiles.find((t) => t.id === selectedTileId);
    if (!firstTile) return;

    setMoves((m) => m + 1);

    // Check if match
    if (firstTile.wordId === tile.wordId && firstTile.type !== tile.type) {
      // Correct match!
      playSound('correct');
      setTiles((prev) =>
        prev.map((t) =>
          t.wordId === tile.wordId ? { ...t, isMatched: true } : t
        )
      );
      setSelectedTileId(null);

      // Check if all tiles in current round are matched
      const remainingUnmatched = tiles.filter(
        (t) => !t.isMatched && t.wordId !== tile.wordId
      );

      if (remainingUnmatched.length === 0) {
        if (currentRound < totalRounds - 1) {
          // Finished this round, ready for next round
          setRoundCompleted(true);
          playSound('complete');
        } else {
          // Finished ALL rounds!
          setIsAllCompleted(true);
          setIsTimerRunning(false);
          playSound('complete');
          onComplete();
        }
      }
    } else {
      // Mismatch
      playSound('wrong');
      setWrongPair([firstTile.id, tile.id]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedTileId(null);
      }, 700);
    }
  };

  const handleNextRound = () => {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setupRound(nextRound);
    playSound('click');
  };

  const handleRestartFromBeginning = () => {
    setCurrentRound(0);
    setMoves(0);
    setSeconds(0);
    setIsAllCompleted(false);
    setupRound(0);
    playSound('click');
  };

  if (!words || words.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">Chưa có đủ từ vựng cho trò chơi ghép từ.</p>
      </div>
    );
  }

  const currentRoundWords = words.slice(
    currentRound * WORDS_PER_ROUND,
    (currentRound + 1) * WORDS_PER_ROUND
  );

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Top Header with Round Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-brand-500" />
            <span>VÒNG {currentRound + 1} / {totalRounds}</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalRounds }).map((_, rIdx) => (
              <span
                key={rIdx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  rIdx < currentRound
                    ? 'bg-emerald-500'
                    : rIdx === currentRound
                    ? 'bg-brand-600 ring-2 ring-brand-400 scale-110'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
                title={`Vòng ${rIdx + 1}`}
              />
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            ({currentRoundWords.length} cặp từ vựng)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>{seconds}s</span>
          </span>
          <span>Lượt thử: {moves}</span>

          <button
            onClick={handleRestartFromBeginning}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Chơi lại từ Vòng 1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Chơi lại từ đầu
          </button>
        </div>
      </div>

      {/* ALL ROUNDS COMPLETED (Grand Victory) */}
      {isAllCompleted ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center animate-scale-up">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            🏆 Xuất Sắc! Bạn Đã Hoàn Thành Toàn Bộ {totalRounds} Vòng!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            Bạn đã ghép chính xác toàn bộ <strong>{words.length} / {words.length} từ vựng</strong> trong chủ đề này!
            <br />
            Thời gian hoàn thành: <strong>{seconds} giây</strong> • Tổng số lượt ghép: <strong>{moves}</strong>
          </p>
          <button
            onClick={handleRestartFromBeginning}
            className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại từ Vòng 1</span>
          </button>
        </div>
      ) : roundCompleted ? (
        /* SINGLE ROUND COMPLETED BANNER */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center animate-scale-up">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            🎉 Hoàn Thành Vòng {currentRound + 1} / {totalRounds}!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Bạn đã ghép đúng <strong>{currentRoundWords.length} cặp từ</strong> của vòng này. Hãy tiếp tục để chinh phục trọn vẹn chủ đề!
          </p>
          <button
            onClick={handleNextRound}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 active:scale-95 transition-all flex items-center gap-2 mx-auto"
          >
            <span>Sang Vòng {currentRound + 2} / {totalRounds}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* GRID OF TILES FOR CURRENT ROUND */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {tiles.map((tile) => {
            const isSelected = selectedTileId === tile.id;
            const isWrong = wrongPair && wrongPair.includes(tile.id);

            let cardClasses =
              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-300 shadow-sm';

            if (tile.isMatched) {
              cardClasses =
                'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 opacity-60 scale-95 cursor-default pointer-events-none';
            } else if (isWrong) {
              cardClasses =
                'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/40 animate-shake';
            } else if (isSelected) {
              cardClasses =
                'bg-brand-50 dark:bg-brand-950/60 border-brand-500 dark:border-brand-500 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/30 scale-102';
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className={`min-h-[96px] p-4 rounded-2xl border flex items-center justify-center text-center font-bold text-xs sm:text-sm select-none transition-all duration-150 active:scale-95 ${cardClasses}`}
              >
                <span>{tile.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
