import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none max-w-[94vw] w-auto animate-in fade-in slide-in-from-top-2 duration-200">
      {!isOnline ? (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 dark:bg-slate-950/95 text-amber-300 border border-amber-500/50 shadow-xl backdrop-blur-md text-xs font-bold pointer-events-auto">
          <WifiOff className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
          <span>Chế độ Ngoại Tuyến (Offline) • 30 chủ đề &amp; Flashcard sẵn sàng</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/95 text-emerald-200 border border-emerald-500/50 shadow-xl backdrop-blur-md text-xs font-bold pointer-events-auto animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Đã khôi phục kết nối mạng</span>
        </div>
      )}
    </div>
  );
};
