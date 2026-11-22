import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Clock, 
  Repeat, X, Sparkles, Headphones, Settings2 
} from 'lucide-react';
import { Word } from '../types';
import { playSound } from '../utils/audio';
import { 
  TOEICAccent, ETS_ACCENTS, getPreferredAccent, 
  setPreferredAccent, speakWithETSAccent 
} from '../utils/audioAccents';

interface HandsFreeAudioPlayerProps {
  words: Word[];
  topicTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const HandsFreeAudioPlayer: React.FC<HandsFreeAudioPlayerProps> = ({
  words,
  topicTitle,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0.95);
  const [accent, setAccent] = useState<TOEICAccent>(getPreferredAccent());
  const [sleepMinutes, setSleepMinutes] = useState<number>(0); // 0 = off
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const isPlayingRef = useRef<boolean>(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Handle sleep timer countdown
  useEffect(() => {
    if (sleepMinutes === 0 || !isPlaying) return;

    setRemainingSeconds(sleepMinutes * 60);
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handlePause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepMinutes, isPlaying]);

  // MediaSession API for lock-screen controls
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    const currentWord = words[currentIndex];
    if (currentWord) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${currentWord.word} (${currentWord.phonetic})`,
        artist: currentWord.meaningVi,
        album: `DailyVocab - ${topicTitle}`,
        artwork: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => handlePlay());
      navigator.mediaSession.setActionHandler('pause', () => handlePause());
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
    }
  }, [currentIndex, words, topicTitle]);

  const speakSequence = (index: number) => {
    if (!isPlayingRef.current) return;
    if (index >= words.length) {
      // Loop back to start
      index = 0;
      setCurrentIndex(0);
    }

    const w = words[index];
    if (!w) return;

    // Step 1: Speak English word
    speakWithETSAccent(w.word, accent, speed, () => {
      if (!isPlayingRef.current) return;

      // Small pause, then Step 2: Speak Vietnamese meaning
      timeoutRef.current = setTimeout(() => {
        if (!isPlayingRef.current) return;

        // Speak Vietnamese meaning via Web Speech with vi-VN if available
        const viUtterance = new SpeechSynthesisUtterance(w.meaningVi);
        viUtterance.lang = 'vi-VN';
        viUtterance.rate = 1.0;

        viUtterance.onend = () => {
          if (!isPlayingRef.current) return;

          // Step 3: Speak Example Sentence
          timeoutRef.current = setTimeout(() => {
            if (!isPlayingRef.current) return;

            speakWithETSAccent(w.example, accent, speed, () => {
              if (!isPlayingRef.current) return;

              // Step 4: Wait 1.8s, then next word
              timeoutRef.current = setTimeout(() => {
                if (!isPlayingRef.current) return;
                const nextIdx = (index + 1) % words.length;
                setCurrentIndex(nextIdx);
                speakSequence(nextIdx);
              }, 1800);
            });
          }, 800);
        };

        viUtterance.onerror = () => {
          // If Vietnamese voice not supported, proceed directly to example
          speakWithETSAccent(w.example, accent, speed, () => {
            if (!isPlayingRef.current) return;
            timeoutRef.current = setTimeout(() => {
              if (!isPlayingRef.current) return;
              const nextIdx = (index + 1) % words.length;
              setCurrentIndex(nextIdx);
              speakSequence(nextIdx);
            }, 1800);
          });
        };

        try {
          window.speechSynthesis.speak(viUtterance);
        } catch {
          viUtterance.onerror?.(new Event('error') as any);
        }
      }, 900);
    });
  };

  const handlePlay = () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    speakSequence(currentIndex);
    playSound('click');
  };

  const handlePause = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    playSound('click');
  };

  const handleNext = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    const nextIdx = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIdx);
    if (isPlaying) {
      speakSequence(nextIdx);
    }
    playSound('click');
  };

  const handlePrev = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    const prevIdx = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIdx);
    if (isPlaying) {
      speakSequence(prevIdx);
    }
    playSound('click');
  };

  const handleAccentChange = (acc: TOEICAccent) => {
    setAccent(acc);
    setPreferredAccent(acc);
    if (isPlaying) {
      handlePause();
      setTimeout(() => handlePlay(), 200);
    }
  };

  if (!isOpen) return null;

  const currentWord = words[currentIndex] || words[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl text-white space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-[#801732] flex items-center justify-center text-white shadow-xs">
              <Headphones className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Nghe Thụ Động Khi Di Chuyển
              </h3>
              <p className="text-[10px] text-slate-400">
                Tự động phát liên tục • Hỗ trợ màn hình khóa
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handlePause();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Playing Word Card */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 text-center space-y-2 relative overflow-hidden shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
            Từ {currentIndex + 1} / {words.length} • {topicTitle}
          </span>

          <h2 className="text-3xl font-black text-white tracking-tight">
            {currentWord?.word}
          </h2>

          <p className="text-sm font-mono text-cyan-300">
            {currentWord?.phonetic}
          </p>

          <div className="pt-2">
            <span className="text-base font-extrabold text-amber-300 block">
              {currentWord?.meaningVi}
            </span>
            <p className="text-xs text-slate-300 italic mt-1 leading-relaxed px-2 line-clamp-2">
              "{currentWord?.example}"
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 py-1">
          <button
            onClick={handlePrev}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Từ trước đó"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-600 to-[#801732] hover:from-rose-500 hover:to-[#6b132a] text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
            title={isPlaying ? 'Tạm dừng' : 'Bắt đầu phát'}
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Từ tiếp theo"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* ETS Accent Selector */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Chất Giọng ETS:
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs font-bold">
            {ETS_ACCENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAccentChange(item.id)}
                className={`py-1.5 px-1 rounded-xl transition-all text-center ${
                  accent === item.id
                    ? 'bg-[#801732] text-white shadow-xs font-black ring-1 ring-rose-400'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={item.desc}
              >
                <span className="mr-1">{item.flag}</span>
                <span className="text-[10px]">{item.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed & Sleep Timer Settings */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Speed Toggle */}
          <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-bold">Tốc độ:</span>
            <div className="flex items-center gap-1 font-mono font-bold">
              {[0.75, 1, 1.25].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded-lg ${
                    speed === s ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Timer */}
          <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Hẹn giờ:</span>
            </span>
            <select
              value={sleepMinutes}
              onChange={(e) => setSleepMinutes(Number(e.target.value))}
              className="bg-transparent text-rose-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900 text-white">Tắt</option>
              <option value={15} className="bg-slate-900 text-white">15 phút</option>
              <option value={30} className="bg-slate-900 text-white">30 phút</option>
              <option value={45} className="bg-slate-900 text-white">45 phút</option>
            </select>
          </div>
        </div>

        {remainingSeconds > 0 && (
          <p className="text-[11px] text-center text-amber-300 font-mono">
            ⏳ Tự động tắt sau: {Math.floor(remainingSeconds / 60)} phút {remainingSeconds % 60}s
          </p>
        )}
      </div>
    </div>
  );
};
