import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Plus, Check, Trash2, X, Target, Award, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ProfileSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSwitchProfile: (profileId: string) => void;
  onCreateProfile: (name: string, avatar: string, targetScore: number) => void;
  onDeleteProfile: (profileId: string) => void;
}

const AVATAR_OPTIONS = ['🦁', '🎯', '🚀', '👑', '⭐', '🦉', '🦊', '🏆', '💎', '💡', '🔥', '📚'];
const TARGET_SCORES = [450, 600, 750, 850, 990];

export const ProfileSwitcherModal: React.FC<ProfileSwitcherModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSwitchProfile,
  onCreateProfile,
  onDeleteProfile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎯');
  const [selectedTarget, setSelectedTarget] = useState(850);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onCreateProfile(newName, selectedAvatar, selectedTarget);
    setNewName('');
    setIsCreating(false);
    playSound('correct');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#801732] dark:text-rose-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Hồ Sơ Học Viên
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lưu giữ tiến độ riêng biệt cho từng người học
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Profiles List */}
        {!isCreating ? (
          <div className="space-y-3">
            <div className="space-y-2">
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                const learned = p.progress?.learnedWords?.length || 0;
                const streak = p.progress?.streak || 1;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSwitchProfile(p.id);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'border-[#801732] bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-[#801732]/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-xs flex-shrink-0">
                        {p.avatar || '🦁'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            🎯 Mục tiêu {p.targetScore || 850}+
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          🔥 {streak} ngày • 📚 {learned} từ đã học
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isActive ? (
                        <span className="w-7 h-7 rounded-full bg-[#801732] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Bạn có chắc muốn xóa hồ sơ "${p.name}"?`)) {
                              onDeleteProfile(p.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Button to open creation form */}
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tạo Thêm Hồ Sơ Mới Cho Người Khác</span>
            </button>
          </div>
        ) : (
          /* Create New Profile Form */
          <form onSubmit={handleCreateSubmit} className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tên Hồ Sơ / Người Học:
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Saseami, Bạn bè, Em gái, v.v."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#801732]/30"
              />
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Chọn Biểu Tượng Avatar:
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setSelectedAvatar(em)}
                    className={`h-11 rounded-2xl text-xl flex items-center justify-center transition-all ${
                      selectedAvatar === em
                        ? 'bg-rose-100 dark:bg-rose-950 border-2 border-[#801732] scale-110 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Score Picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Mục Tiêu Điểm TOEIC:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {TARGET_SCORES.map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setSelectedTarget(score)}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      selectedTarget === score
                        ? 'bg-[#801732] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {score}+
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-[#801732] hover:bg-[#681026] text-white font-extrabold text-xs shadow-md shadow-[#801732]/20"
              >
                Tạo Hồ Sơ Ngay
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
