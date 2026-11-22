import React from 'react';
import { BookOpen, Headphones, Layers, Mic, Target, Sparkles } from 'lucide-react';

export interface RadarSkillsData {
  vocab: number;      // 0 - 100%
  listening: number;  // 0 - 100%
  reading: number;    // 0 - 100%
  speakingWriting: number; // 0 - 100%
  targetScore: number;
}

interface RadarSkillsChartProps {
  data: RadarSkillsData;
  className?: string;
}

export const RadarSkillsChart: React.FC<RadarSkillsChartProps> = ({
  data,
  className = '',
}) => {
  // Center and scale parameters for 320x320 SVG canvas
  const size = 300;
  const center = size / 2;
  const radius = 100;

  // 4 Axes: Top (Vocab), Right (Listening), Bottom (Reading), Left (Speaking & Writing)
  // Angles in radians:
  // Top: -PI/2
  // Right: 0
  // Bottom: PI/2
  // Left: PI
  const angles = [
    -Math.PI / 2, // 0: Vocab (Top)
    0,            // 1: Listening (Right)
    Math.PI / 2,  // 2: Reading (Bottom)
    Math.PI,      // 3: Speaking & Writing (Left)
  ];

  // Helper to calculate X, Y from radius ratio and angle
  const getCoordinates = (valueRatio: number, angle: number) => {
    const r = radius * Math.max(0.08, Math.min(1, valueRatio));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Target ratio based on profile targetScore (e.g. 850 / 990 = ~0.86)
  const targetRatio = Math.min(1, Math.max(0.4, data.targetScore / 990));

  // Current values
  const currentRatios = [
    data.vocab / 100,
    data.listening / 100,
    data.reading / 100,
    data.speakingWriting / 100,
  ];

  // Current polygon points
  const currentPoints = currentRatios.map((ratio, i) => {
    const pt = getCoordinates(ratio, angles[i]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Target polygon points
  const targetPoints = angles.map((angle) => {
    const pt = getCoordinates(targetRatio, angle);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Web rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1];

  const skillInfo = [
    { label: 'Từ Vựng (Vocab)', value: data.vocab, icon: BookOpen, color: 'text-indigo-400' },
    { label: 'Luyện Nghe (LC)', value: data.listening, icon: Headphones, color: 'text-rose-400' },
    { label: 'Đọc Hiểu (RC)', value: data.reading, icon: Layers, color: 'text-emerald-400' },
    { label: 'Viết & Nói (SW)', value: data.speakingWriting, icon: Mic, color: 'text-amber-400' },
  ];

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#801732] to-rose-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white">
              Biểu Đồ Radar Năng Lực 4 Kỹ Năng
            </h3>
            <p className="text-[10px] text-slate-400">
              Đo lường độ đồng đều và thế mạnh chuyên sâu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <div className="flex items-center gap-1 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-xs shadow-cyan-400/50" />
            <span>Thực tế</span>
          </div>
          <div className="flex items-center gap-1 text-rose-300">
            <span className="w-2.5 h-1 rounded-sm bg-rose-400 inline-block border-b border-dashed border-rose-300" />
            <span>Mục tiêu ({data.targetScore}+)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex items-center justify-center py-2">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible select-none">
          {/* Concentric Web Rings */}
          {rings.map((ringRatio, idx) => {
            const rPoints = angles.map((angle) => {
              const pt = getCoordinates(ringRatio, angle);
              return `${pt.x},${pt.y}`;
            }).join(' ');

            return (
              <g key={idx}>
                <polygon
                  points={rPoints}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={idx === 3 ? 'none' : '3 3'}
                  opacity={0.6 + idx * 0.1}
                />
                <text
                  x={center + 6}
                  y={center - radius * ringRatio + 3}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {Math.round(ringRatio * 100)}%
                </text>
              </g>
            );
          })}

          {/* 4 Radial Axis Lines */}
          {angles.map((angle, idx) => {
            const end = getCoordinates(1, angle);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="#475569"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Target Score Polygon (Dashed Rose) */}
          <polygon
            points={targetPoints}
            fill="#f43f5e"
            fillOpacity="0.1"
            stroke="#f43f5e"
            strokeWidth="1.8"
            strokeDasharray="4 4"
          />

          {/* User Current Proficiency Polygon (Filled Cyan Gradient) */}
          <polygon
            points={currentPoints}
            fill="#06b6d4"
            fillOpacity="0.25"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Data Point Dots */}
          {currentRatios.map((ratio, idx) => {
            const pt = getCoordinates(ratio, angles[idx]);
            return (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
                className="animate-pulse"
              />
            );
          })}

          {/* Axis Labels */}
          {/* Top: Vocab */}
          <text x={center} y={center - radius - 16} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
            📖 Từ Vựng: {data.vocab}%
          </text>
          {/* Right: Listening */}
          <text x={center + radius + 14} y={center + 4} textAnchor="start" fill="#e2e8f0" fontSize="11" fontWeight="bold">
            🎧 Nghe: {data.listening}%
          </text>
          {/* Bottom: Reading */}
          <text x={center} y={center + radius + 22} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
            📚 Đọc: {data.reading}%
          </text>
          {/* Left: Speaking & Writing */}
          <text x={center - radius - 14} y={center + 4} textAnchor="end" fill="#e2e8f0" fontSize="11" fontWeight="bold">
            🎤 Viết/Nói: {data.speakingWriting}%
          </text>
        </svg>
      </div>

      {/* 4 Skill Cards Grid */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800">
        {skillInfo.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${s.color}`} />
                <span className="text-[11px] font-bold text-slate-300 truncate">
                  {s.label}
                </span>
              </div>
              <span className="text-xs font-black text-cyan-300 font-mono">
                {s.value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
