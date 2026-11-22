import React from 'react';
import { ZoomIn, Camera, ShieldCheck } from 'lucide-react';

export type TOEICPictureType = 
  | 'office-typing'
  | 'warehouse-loading'
  | 'cafe-patio'
  | 'boardroom-meeting'
  | 'construction-workers'
  | 'airport-checkin'
  | 'delivery-truck'
  | 'laboratory-research'
  | 'contract-discussion';

interface TOEICPictureCardProps {
  type: TOEICPictureType | string;
  altCaption?: string;
  title?: string;
  className?: string;
  showCaption?: boolean; // When false, hides the answer description to avoid spoiling the question
}

export const TOEICPictureCard: React.FC<TOEICPictureCardProps> = ({
  type,
  altCaption = 'ETS TOEIC Official Photograph',
  title = 'ETS TOEIC Test Photograph',
  className = '',
  showCaption = false,
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md ${className}`}>
      {/* Top Test Header Tag */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>{title}</span>
        </div>
        <span className="px-2 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
          FORM 2026-ETS
        </span>
      </div>

      {/* Visual Scene SVG Illustration */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 overflow-hidden select-none">
        
        {/* 1. Office Typing Scene (Part 1 Listening) */}
        {(type === 'office-typing' || type.includes('office') || type.includes('typing')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>

            {/* Room Background & Wall */}
            <rect width="600" height="360" fill="url(#wallGrad)" />
            
            {/* Window with City Silhouettes */}
            <rect x="40" y="30" width="160" height="150" rx="8" fill="#bae6fd" stroke="#94a3b8" strokeWidth="4" />
            <line x1="120" y1="30" x2="120" y2="180" stroke="#94a3b8" strokeWidth="3" />
            <line x1="40" y1="105" x2="200" y2="105" stroke="#94a3b8" strokeWidth="3" />
            <polygon points="60,180 80,120 100,180" fill="#7dd3fc" opacity="0.7" />
            <polygon points="120,180 140,90 165,180" fill="#38bdf8" opacity="0.6" />

            {/* Certificate / Wall Art */}
            <rect x="420" y="40" width="120" height="80" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
            <rect x="430" y="50" width="100" height="60" fill="#f1f5f9" />
            <line x1="440" y1="65" x2="510" y2="65" stroke="#64748b" strokeWidth="3" />
            <line x1="440" y1="75" x2="490" y2="75" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="510" cy="85" r="8" fill="#f59e0b" />

            {/* Indoor Plant */}
            <path d="M530 240 L550 300 L510 300 Z" fill="#b45309" />
            <ellipse cx="530" cy="240" rx="20" ry="8" fill="#78350f" />
            <path d="M530 240 Q500 200 480 210 Q505 230 530 240" fill="#15803d" />
            <path d="M530 240 Q530 170 515 170 Q525 210 530 240" fill="#16a34a" />
            <path d="M530 240 Q560 190 575 200 Q550 225 530 240" fill="#22c55e" />

            {/* Office Desk */}
            <path d="M50 260 L550 260 L570 360 L30 360 Z" fill="url(#deskGrad)" stroke="#94a3b8" strokeWidth="2" />
            <rect x="50" y="260" width="500" height="12" fill="#cbd5e1" />

            {/* Computer Monitor */}
            <rect x="230" y="110" width="170" height="110" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="4" />
            <rect x="238" y="118" width="154" height="94" rx="2" fill="#38bdf8" opacity="0.9" />
            {/* Content on Screen */}
            <rect x="248" y="128" width="80" height="10" fill="#ffffff" rx="2" />
            <rect x="248" y="145" width="134" height="6" fill="#0284c7" rx="1" />
            <rect x="248" y="156" width="110" height="6" fill="#0284c7" rx="1" />
            <rect x="248" y="167" width="124" height="6" fill="#0284c7" rx="1" />
            {/* Monitor Stand */}
            <path d="M305 220 L325 220 L330 250 L300 250 Z" fill="#64748b" />
            <ellipse cx="315" cy="250" rx="30" ry="6" fill="#475569" />

            {/* Keyboard on Desk */}
            <polygon points="250,270 370,270 380,295 240,295" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            <line x1="250" y1="277" x2="370" y2="277" stroke="#64748b" strokeWidth="1.5" />
            <line x1="246" y1="284" x2="374" y2="284" stroke="#64748b" strokeWidth="1.5" />

            {/* Computer Mouse & Pad */}
            <rect x="395" y="270" width="30" height="25" rx="3" fill="#64748b" />
            <ellipse cx="410" cy="282" rx="7" ry="10" fill="#0f172a" />

            {/* Person (Office Worker) Typing */}
            {/* Office Chair Backrest */}
            <path d="M120 150 Q160 130 200 150 L195 260 L125 260 Z" fill="#1e1b4b" opacity="0.8" />
            {/* Head & Hair */}
            <circle cx="160" cy="140" r="26" fill="#fcd34d" />
            <path d="M135 140 Q160 110 185 130 Q170 115 145 125 Z" fill="#78350f" />
            {/* Torso & Suit Jacket */}
            <path d="M130 170 Q160 165 190 170 L205 265 L115 265 Z" fill="#2563eb" />
            {/* White Collar */}
            <polygon points="152,168 160,185 168,168" fill="#ffffff" />
            {/* Arms reaching forward to type */}
            <path d="M130 190 Q180 230 255 275" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M175 190 Q220 235 285 275" stroke="#1d4ed8" strokeWidth="14" strokeLinecap="round" fill="none" />
            {/* Hands on Keyboard */}
            <circle cx="260" cy="275" r="7" fill="#fcd34d" />
            <circle cx="290" cy="275" r="7" fill="#fcd34d" />

            {/* Coffee Mug & Document Organizer */}
            <rect x="180" y="270" width="18" height="22" rx="3" fill="#ef4444" />
            <path d="M198 274 Q205 280 198 286" stroke="#ef4444" strokeWidth="3" fill="none" />
            <rect x="460" y="240" width="45" height="30" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <line x1="470" y1="230" x2="495" y2="230" stroke="#0284c7" strokeWidth="4" />
          </svg>
        )}

        {/* 2. Warehouse Loading Scene */}
        {type === 'warehouse-loading' && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            {/* Warehouse High Shelving */}
            <rect width="600" height="360" fill="#cbd5e1" />
            <rect x="0" y="270" width="600" height="90" fill="#94a3b8" />
            {/* Storage Racks */}
            <rect x="30" y="30" width="200" height="240" fill="none" stroke="#dc2626" strokeWidth="6" />
            <line x1="30" y1="90" x2="230" y2="90" stroke="#dc2626" strokeWidth="4" />
            <line x1="30" y1="150" x2="230" y2="150" stroke="#dc2626" strokeWidth="4" />
            <line x1="30" y1="210" x2="230" y2="210" stroke="#dc2626" strokeWidth="4" />
            {/* Cardboard Boxes on Racks */}
            <rect x="40" y="45" width="45" height="40" fill="#d97706" />
            <rect x="95" y="45" width="55" height="40" fill="#b45309" />
            <rect x="50" y="105" width="70" height="40" fill="#b45309" />
            <rect x="130" y="105" width="80" height="40" fill="#d97706" />
            {/* Handcart / Trolley with Worker */}
            <rect x="320" y="230" width="110" height="40" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="330" y="190" width="90" height="40" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            {/* Handcart Frame */}
            <path d="M440 270 L310 270 L300 240" stroke="#475569" strokeWidth="6" fill="none" />
            <circle cx="320" cy="285" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
            <circle cx="430" cy="285" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
            {/* Warehouse Staff */}
            <circle cx="475" cy="140" r="22" fill="#fed7aa" />
            {/* Safety Helmet */}
            <path d="M455 135 Q475 115 495 135 Z" fill="#eab308" />
            {/* Body with Vest */}
            <path d="M455 165 L495 165 L505 270 L445 270 Z" fill="#ea580c" />
            <line x1="465" y1="165" x2="465" y2="270" stroke="#facc15" strokeWidth="4" />
            <line x1="485" y1="165" x2="485" y2="270" stroke="#facc15" strokeWidth="4" />
          </svg>
        )}

        {/* 3. Outdoor Café Scene (Speaking Q3) */}
        {(type === 'cafe-patio' || type.includes('cafe')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            {/* Sky & Pavement */}
            <rect width="600" height="200" fill="#bae6fd" />
            <rect y="200" width="600" height="160" fill="#d6d3d1" />
            {/* Cobblestone Pattern */}
            <line x1="0" y1="240" x2="600" y2="240" stroke="#a8a29e" strokeWidth="2" />
            <line x1="0" y1="280" x2="600" y2="280" stroke="#a8a29e" strokeWidth="2" />
            <line x1="0" y1="320" x2="600" y2="320" stroke="#a8a29e" strokeWidth="2" />
            {/* Large Sun Umbrella */}
            <path d="M120 120 Q240 40 360 120 Z" fill="#15803d" />
            <line x1="240" y1="50" x2="240" y2="260" stroke="#78350f" strokeWidth="6" />
            {/* Wooden Café Table */}
            <ellipse cx="240" cy="250" rx="70" ry="20" fill="#92400e" stroke="#78350f" strokeWidth="3" />
            <rect x="235" y="260" width="10" height="60" fill="#78350f" />
            {/* Coffee Cups on Table */}
            <rect x="210" y="240" width="12" height="12" rx="2" fill="#ffffff" />
            <rect x="250" y="240" width="12" height="12" rx="2" fill="#ffffff" />
            {/* Customers Sitting */}
            <circle cx="170" cy="200" r="18" fill="#fed7aa" />
            <path d="M150 220 L190 220 L195 290 L145 290 Z" fill="#2563eb" />
            <circle cx="310" cy="200" r="18" fill="#fed7aa" />
            <path d="M290 220 L330 220 L335 290 L285 290 Z" fill="#ec4899" />
            {/* Waiter Serving */}
            <circle cx="430" cy="160" r="18" fill="#fed7aa" />
            <path d="M410 180 L450 180 L455 310 L405 310 Z" fill="#1e293b" />
            <rect x="415" y="200" width="25" height="40" fill="#ffffff" />
            {/* Waiter Holding Tray */}
            <line x1="410" y1="210" x2="375" y2="215" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="370" cy="215" rx="22" ry="5" fill="#94a3b8" />
            <rect x="365" y="205" width="8" height="10" rx="1" fill="#f8fafc" />
          </svg>
        )}

        {/* 4. Boardroom Meeting Scene (Speaking Q4) */}
        {(type === 'boardroom-meeting' || type.includes('boardroom') || type.includes('meeting')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            <rect width="600" height="360" fill="#f1f5f9" />
            {/* Large Digital Display Screen */}
            <rect x="60" y="40" width="240" height="140" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="4" />
            <rect x="70" y="50" width="220" height="120" rx="2" fill="#1e293b" />
            {/* Revenue Bar Chart on Screen */}
            <line x1="90" y1="150" x2="270" y2="150" stroke="#64748b" strokeWidth="2" />
            <rect x="100" y="110" width="22" height="40" fill="#38bdf8" />
            <rect x="135" y="95" width="22" height="55" fill="#38bdf8" />
            <rect x="170" y="80" width="22" height="70" fill="#38bdf8" />
            <rect x="205" y="65" width="22" height="85" fill="#10b981" />
            <path d="M110 100 L145 85 L180 70 L215 55" stroke="#f59e0b" strokeWidth="3" fill="none" />
            {/* Female Presenter Standing */}
            <circle cx="340" cy="110" r="18" fill="#fed7aa" />
            <path d="M320 130 L360 130 L365 250 L315 250 Z" fill="#4338ca" />
            {/* Arm Pointing to Screen */}
            <line x1="320" y1="145" x2="275" y2="120" stroke="#4338ca" strokeWidth="8" strokeLinecap="round" />
            <circle cx="270" cy="120" r="5" fill="#fed7aa" />
            {/* Conference Table & Seated Colleagues */}
            <ellipse cx="380" cy="270" rx="190" ry="40" fill="#475569" stroke="#334155" strokeWidth="3" />
            {/* Laptops on Table */}
            <polygon points="320,255 350,255 355,270 315,270" fill="#94a3b8" />
            <polygon points="410,255 440,255 445,270 405,270" fill="#94a3b8" />
            <polygon points="480,255 510,255 515,270 475,270" fill="#94a3b8" />
            {/* Seated Attendees */}
            <circle cx="480" cy="210" r="16" fill="#fed7aa" />
            <path d="M465 230 L495 230 L500 280 L460 280 Z" fill="#0369a1" />
            <circle cx="400" cy="210" r="16" fill="#fed7aa" />
            <path d="M385 230 L415 230 L420 280 L380 280 Z" fill="#334155" />
          </svg>
        )}

        {/* 5. Construction Site Scene (Writing Q1) */}
        {(type === 'construction-workers' || type.includes('construction')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            <rect width="600" height="230" fill="#e0f2fe" />
            <rect y="230" width="600" height="130" fill="#a8a29e" />
            {/* Steel Building Frame & Crane Silhouette */}
            <line x1="80" y1="40" x2="80" y2="230" stroke="#94a3b8" strokeWidth="8" />
            <line x1="160" y1="40" x2="160" y2="230" stroke="#94a3b8" strokeWidth="8" />
            <line x1="80" y1="90" x2="160" y2="90" stroke="#94a3b8" strokeWidth="6" />
            <line x1="80" y1="150" x2="160" y2="150" stroke="#94a3b8" strokeWidth="6" />
            <line x1="80" y1="40" x2="160" y2="90" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="160" y1="90" x2="80" y2="150" stroke="#cbd5e1" strokeWidth="3" />
            {/* Crane in Distance */}
            <line x1="480" y1="20" x2="480" y2="230" stroke="#f59e0b" strokeWidth="6" />
            <line x1="380" y1="30" x2="540" y2="30" stroke="#f59e0b" strokeWidth="5" />
            <line x1="480" y1="20" x2="420" y2="30" stroke="#f59e0b" strokeWidth="3" />
            {/* Construction Blueprint Table */}
            <rect x="230" y="230" width="140" height="20" fill="#78350f" rx="3" />
            <rect x="240" y="215" width="120" height="15" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            {/* Two Workers in Yellow Hard Hats & Safety Vests */}
            {/* Worker 1 */}
            <circle cx="210" cy="150" r="20" fill="#fed7aa" />
            <path d="M190 145 Q210 120 230 145 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <path d="M190 175 L230 175 L235 290 L185 290 Z" fill="#ea580c" />
            <line x1="200" y1="175" x2="200" y2="290" stroke="#facc15" strokeWidth="4" />
            <line x1="220" y1="175" x2="220" y2="290" stroke="#facc15" strokeWidth="4" />
            <line x1="220" y1="195" x2="250" y2="220" stroke="#ea580c" strokeWidth="9" strokeLinecap="round" />
            {/* Worker 2 */}
            <circle cx="380" cy="150" r="20" fill="#fed7aa" />
            <path d="M360 145 Q380 120 400 145 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <path d="M360 175 L400 175 L405 290 L355 290 Z" fill="#ea580c" />
            <line x1="370" y1="175" x2="370" y2="290" stroke="#facc15" strokeWidth="4" />
            <line x1="390" y1="175" x2="390" y2="290" stroke="#facc15" strokeWidth="4" />
            <line x1="370" y1="195" x2="340" y2="220" stroke="#ea580c" strokeWidth="9" strokeLinecap="round" />
          </svg>
        )}

        {/* 6. Airport Check-in Scene (Writing Q2) */}
        {(type === 'airport-checkin' || type.includes('airport')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            <rect width="600" height="360" fill="#f8fafc" />
            {/* Airport Terminal Backdrop & Flight Board */}
            <rect x="40" y="30" width="520" height="60" rx="6" fill="#0f172a" />
            <text x="60" y="65" fill="#38bdf8" fontSize="18" fontWeight="bold" fontFamily="monospace">
              INTERNATIONAL DEPARTURES • GATE A12 - A24
            </text>
            {/* Check-in Service Counter */}
            <rect x="80" y="190" width="260" height="170" fill="#0284c7" stroke="#0369a1" strokeWidth="4" rx="4" />
            <rect x="90" y="180" width="240" height="15" fill="#38bdf8" rx="2" />
            <text x="120" y="240" fill="#ffffff" fontSize="16" fontWeight="bold">
              SKYLINE AIRWAYS
            </text>
            {/* Airline Agent behind counter */}
            <circle cx="210" cy="130" r="22" fill="#fed7aa" />
            <path d="M190 115 Q210 100 230 115 Z" fill="#1e3a8a" />
            <path d="M185 155 L235 155 L240 220 L180 220 Z" fill="#1e40af" />
            {/* Passenger with Suitcase */}
            <circle cx="420" cy="140" r="22" fill="#fed7aa" />
            <path d="M395 170 L445 170 L450 310 L390 310 Z" fill="#b91c1c" />
            {/* Handing Passport */}
            <line x1="400" y1="190" x2="310" y2="185" stroke="#b91c1c" strokeWidth="8" strokeLinecap="round" />
            <rect x="300" y="175" width="22" height="15" rx="2" fill="#15803d" />
            {/* Suitcase */}
            <rect x="460" y="240" width="50" height="70" rx="6" fill="#047857" stroke="#065f46" strokeWidth="3" />
            <path d="M475 240 L475 220 L495 220 L495 240" stroke="#334155" strokeWidth="4" fill="none" />
            <circle cx="470" cy="315" r="5" fill="#0f172a" />
            <circle cx="500" cy="315" r="5" fill="#0f172a" />
          </svg>
        )}

        {/* 7. Delivery Truck Scene (Writing Q3) */}
        {(type === 'delivery-truck' || type.includes('truck') || type.includes('delivery')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            {/* Office Building Facade */}
            <rect width="600" height="220" fill="#e2e8f0" />
            <rect y="220" width="600" height="140" fill="#64748b" />
            {/* Office Glass Windows */}
            <rect x="40" y="30" width="120" height="100" fill="#bae6fd" stroke="#94a3b8" strokeWidth="3" />
            <rect x="180" y="30" width="120" height="100" fill="#bae6fd" stroke="#94a3b8" strokeWidth="3" />
            <rect x="320" y="30" width="120" height="100" fill="#bae6fd" stroke="#94a3b8" strokeWidth="3" />
            {/* Delivery Van / Truck */}
            <rect x="80" y="150" width="220" height="110" rx="6" fill="#ffffff" stroke="#334155" strokeWidth="3" />
            <rect x="300" y="180" width="70" height="80" rx="4" fill="#ffffff" stroke="#334155" strokeWidth="3" />
            <polygon points="300,180 340,180 370,220 300,220" fill="#38bdf8" />
            <text x="120" y="210" fill="#dc2626" fontSize="20" fontWeight="bold">
              EXPRESS CARGO
            </text>
            {/* Wheels */}
            <circle cx="140" cy="270" r="22" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
            <circle cx="330" cy="270" r="22" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
            {/* Courier Carrying Boxes */}
            <circle cx="450" cy="170" r="18" fill="#fed7aa" />
            <path d="M430 190 L470 190 L475 300 L425 300 Z" fill="#2563eb" />
            {/* Stacked Cardboard Packages */}
            <rect x="410" y="195" width="45" height="30" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="2" />
            <rect x="415" y="170" width="35" height="25" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          </svg>
        )}

        {/* 8. Laboratory Research Scene (Writing Q4) */}
        {(type === 'laboratory-research' || type.includes('lab') || type.includes('research')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            <rect width="600" height="360" fill="#f8fafc" />
            {/* Lab Bench */}
            <rect y="240" width="600" height="120" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="3" />
            {/* Microscope */}
            <path d="M220 240 L260 240 L250 180 L230 180 Z" fill="#334155" />
            <circle cx="240" cy="170" r="12" fill="#0284c7" />
            <rect x="235" y="130" width="10" height="40" fill="#64748b" />
            <rect x="220" y="120" width="40" height="15" rx="3" fill="#0f172a" />
            {/* Test Tube Rack with Colored Fluids */}
            <rect x="110" y="210" width="70" height="35" fill="none" stroke="#64748b" strokeWidth="2" />
            <rect x="120" y="190" width="8" height="45" rx="4" fill="#38bdf8" />
            <rect x="135" y="190" width="8" height="45" rx="4" fill="#a855f7" />
            <rect x="150" y="190" width="8" height="45" rx="4" fill="#10b981" />
            <rect x="165" y="190" width="8" height="45" rx="4" fill="#f59e0b" />
            {/* Scientist in Lab Coat */}
            <circle cx="340" cy="140" r="22" fill="#fed7aa" />
            {/* Goggles */}
            <rect x="325" y="135" width="30" height="10" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <path d="M315 165 L365 165 L375 300 L305 300 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            {/* Holding Pipette / Flask */}
            <line x1="330" y1="185" x2="270" y2="215" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
            <path d="M260 210 L275 235 L245 235 Z" fill="#ec4899" stroke="#be185d" strokeWidth="2" opacity="0.8" />
          </svg>
        )}

        {/* 9. Contract Discussion Scene (Writing Q5) */}
        {(type === 'contract-discussion' || type.includes('contract')) && (
          <svg viewBox="0 0 600 360" className="w-full h-full object-cover">
            <rect width="600" height="360" fill="#f1f5f9" />
            {/* Large Wooden Boardroom Table */}
            <path d="M40 220 L560 220 L600 360 L0 360 Z" fill="#78350f" stroke="#451a03" strokeWidth="3" />
            {/* Contract Document on Table */}
            <polygon points="210,235 390,235 405,335 195,335" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="235" y="245" width="130" height="8" rx="2" fill="#1e293b" />
            <line x1="225" y1="262" x2="375" y2="262" stroke="#64748b" strokeWidth="2" />
            <line x1="225" y1="274" x2="375" y2="274" stroke="#64748b" strokeWidth="2" />
            <line x1="225" y1="286" x2="355" y2="286" stroke="#64748b" strokeWidth="2" />
            {/* Signature Line & Red Wax Seal */}
            <line x1="230" y1="315" x2="310" y2="315" stroke="#0f172a" strokeWidth="2" />
            <circle cx="350" cy="310" r="12" fill="#dc2626" />
            <circle cx="350" cy="310" r="9" fill="#991b1b" />
            {/* Luxury Pen beside Contract */}
            <line x1="420" y1="250" x2="445" y2="310" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            {/* Two Executives Across the Table */}
            <circle cx="150" cy="140" r="22" fill="#fed7aa" />
            <path d="M125 165 L175 165 L190 260 L110 260 Z" fill="#1e293b" />
            <circle cx="450" cy="140" r="22" fill="#fed7aa" />
            <path d="M425 165 L475 165 L490 260 L410 260 Z" fill="#1e3a8a" />
          </svg>
        )}

        {/* ETS Watermark Overlay */}
        <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[10px] font-mono text-white/90 uppercase tracking-widest pointer-events-none">
          ETS TOEIC PHOTO LAB
        </div>
      </div>

      {/* Caption & Instructions Bar */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        {showCaption && altCaption ? (
          <span className="font-semibold italic text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Mô tả ảnh: "{altCaption}"</span>
          </span>
        ) : (
          <span className="font-medium text-slate-500 dark:text-slate-400">
            🎧 Quan sát ảnh và nghe 4 phương án A, B, C, D để chọn câu mô tả đúng nhất
          </span>
        )}
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Format ảnh chuẩn bài thi ETS TOEIC
        </span>
      </div>
    </div>
  );
};
