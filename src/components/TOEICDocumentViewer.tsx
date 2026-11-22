import React, { useState } from 'react';
import { 
  Mail, FileText, Calendar, Tag, Newspaper, Paperclip, 
  Printer, CornerUpLeft, CornerUpRight, ArrowRight, CheckCircle2,
  Building2, Hash, DollarSign, Clock, MapPin, Phone, ShieldAlert,
  Download, Eye, ExternalLink
} from 'lucide-react';

export type TOEICDocType = 'Email' | 'Invoice' | 'Schedule' | 'Memo' | 'Advertisement' | 'Notice' | 'Article';

interface TOEICDocumentViewerProps {
  passage: string;
  passageType?: TOEICDocType | string;
  passageTitle?: string;
  className?: string;
}

export const TOEICDocumentViewer: React.FC<TOEICDocumentViewerProps> = ({
  passage,
  passageType = 'Email',
  passageTitle,
  className = '',
}) => {
  const [viewRawText, setViewRawText] = useState(false);

  // Helper to extract email headers if present
  const parseEmailHeaders = (text: string) => {
    const fromMatch = text.match(/FROM:\s*([^\n\r]+)/i);
    const toMatch = text.match(/TO:\s*([^\n\r]+)/i);
    const dateMatch = text.match(/DATE:\s*([^\n\r]+)/i);
    const subjectMatch = text.match(/SUBJECT:\s*([^\n\r]+)/i);

    // Filter out header lines to get clean body
    const bodyLines = text
      .split('\n')
      .filter(line => !line.match(/^(FROM|TO|DATE|SUBJECT):/i))
      .join('\n')
      .trim();

    return {
      from: fromMatch ? fromMatch[1].trim() : 'David Miller, Operations Manager <d.miller@apextech.com>',
      to: toMatch ? toMatch[1].trim() : 'Sarah Jenkins, Client Relations <s.jenkins@officemaster.com>',
      date: dateMatch ? dateMatch[1].trim() : 'October 14, 2026 09:24 AM',
      subject: subjectMatch ? subjectMatch[1].trim() : 'Lease renewal inquiry - Multifunction copiers',
      body: bodyLines || text,
    };
  };

  const emailData = parseEmailHeaders(passage);

  return (
    <div className={`overflow-hidden rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md transition-all ${className}`}>
      {/* Top Test Document Meta Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-b border-slate-300 dark:border-slate-700">
        <div className="flex items-center gap-2">
          {passageType === 'Email' && <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          {passageType === 'Invoice' && <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          {passageType === 'Schedule' && <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
          {passageType === 'Memo' && <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          {passageType === 'Advertisement' && <Tag className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          {passageType === 'Article' && <Newspaper className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}

          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {passageTitle || `ETS Official ${passageType} Document`}
          </span>

          <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-300/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {passageType.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewRawText(!viewRawText)}
            className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{viewRawText ? 'Dạng thiết kế ETS' : 'Văn bản gốc'}</span>
          </button>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
            ETS FORM 2026-RC
          </span>
        </div>
      </div>

      {/* Raw Text Fallback Mode */}
      {viewRawText ? (
        <div className="p-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line font-mono bg-slate-50 dark:bg-slate-950">
          {passage}
        </div>
      ) : (
        /* REALISTIC ETS DOCUMENT VIEWERS */
        <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-900/60">
          
          {/* 1. REALISTIC EMAIL CLIENT UI */}
          {passageType === 'Email' && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden font-sans">
              {/* Webmail Client Actions Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 ml-2">Inbox &gt; Commercial Correspondence</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"><CornerUpLeft className="w-3.5 h-3.5" /> Reply</span>
                  <span className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"><CornerUpRight className="w-3.5 h-3.5" /> Forward</span>
                  <span className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"><Printer className="w-3.5 h-3.5" /> Print</span>
                </div>
              </div>

              {/* Email Meta Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {emailData.subject}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 whitespace-nowrap">
                    Business Priority
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 shadow-xs">
                      {emailData.from.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase block">FROM:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{emailData.from}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase block">TO:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{emailData.to}</span>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emailData.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Paperclip className="w-3 h-3 text-slate-500" />
                      <span>Attachment: Copier_Spec_Sheet_v4.pdf (1.4 MB)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="p-5 sm:p-6 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-normal">
                {emailData.body}
              </div>

              {/* Corporate Email Footer Signature */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>ApexTech Logistics & Enterprise Solutions • Confidential Business Document</span>
                <span className="font-mono text-[10px]">VERIFIED TLS 1.3</span>
              </div>
            </div>
          )}

          {/* 2. REALISTIC INVOICE / BILLING STATEMENT */}
          {passageType === 'Invoice' && (
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 font-sans">
              {/* Company Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 dark:border-slate-600 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-brand-600" />
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                      OFFICEMASTER GLOBAL INC.
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    452 Commercial Boulevard, Suite 800, Chicago, IL 60601<br />
                    Tel: (312) 555-0199 • support@officemaster.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-[#801732] text-white font-black text-sm rounded uppercase tracking-wider">
                    INVOICE
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-2">
                    INV #OM-4482-B<br />
                    Date: Oct 15, 2026<br />
                    Due: Nov 15, 2026 (Net 30)
                  </p>
                </div>
              </div>

              {/* Billed To / Shipped To Grid */}
              <div className="grid grid-cols-2 gap-4 mb-5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold uppercase text-slate-400 block mb-1">BILLED TO:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">ApexTech Solutions Corp.</p>
                  <p className="text-slate-600 dark:text-slate-400">Attn: David Miller, Operations</p>
                  <p className="text-slate-600 dark:text-slate-400">800 Innovation Way, Suite 400</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold uppercase text-slate-400 block mb-1">SERVICE PERIOD:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Nov 01, 2026 – Oct 31, 2028</p>
                  <p className="text-slate-600 dark:text-slate-400">Terms: 24-Month Lease Extension</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">Status: Pending Authorization</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden mb-4">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Item / Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-3">
                        <span className="font-bold">Multifunction Heavy-Duty Copier Model OM-900</span>
                        <span className="text-[11px] text-slate-500 block">Monthly commercial lease fee per unit</span>
                      </td>
                      <td className="p-3 text-center">3</td>
                      <td className="p-3 text-right">$450.00</td>
                      <td className="p-3 text-right font-bold">$1,350.00</td>
                    </tr>
                    <tr>
                      <td className="p-3">
                        <span className="font-bold">Contactless Cloud-Scan Firmware Upgrade</span>
                        <span className="text-[11px] text-slate-500 block">Enterprise security & remote scan license</span>
                      </td>
                      <td className="p-3 text-center">3</td>
                      <td className="p-3 text-right">$80.00</td>
                      <td className="p-3 text-right font-bold">$240.00</td>
                    </tr>
                    <tr>
                      <td className="p-3">
                        <span className="font-bold">24-Month Comprehensive Maintenance Service</span>
                        <span className="text-[11px] text-slate-500 block">Includes toner replacements & emergency repair</span>
                      </td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right">$200.00</td>
                      <td className="p-3 text-right font-bold">$200.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Calculation & Stamp */}
              <div className="flex items-center justify-between pt-2">
                {/* Barcode & Stamp */}
                <div className="space-y-1">
                  <div className="font-mono text-lg tracking-widest text-slate-800 dark:text-slate-300">
                    ||| | ||||| || |||||| ||| ||||
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">BARCODE: 4482-90184-ETS</span>
                </div>

                <div className="w-56 text-xs space-y-1 text-right">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span>$1,790.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Loyalty Renewal Discount (10%):</span>
                    <span className="text-emerald-600 font-bold">-$179.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Applicable State Tax (7%):</span>
                    <span>$112.77</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-300 dark:border-slate-700">
                    <span>TOTAL MONTHLY:</span>
                    <span className="text-[#801732] dark:text-rose-400 text-base">$1,723.77</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. REALISTIC SCHEDULE / CONFERENCE PROGRAM */}
          {passageType === 'Schedule' && (
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 font-sans">
              <div className="text-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  ANNUAL CORPORATE SYMPOSIUM
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2">
                  2026 GLOBAL SUPPLY CHAIN &amp; TECH FORUM
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Friday, November 20, 2026</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Grand Hyatt Regency, Floor 2</span>
                </p>
              </div>

              {/* Time Slot Cards */}
              <div className="space-y-3">
                {[
                  { time: '08:30 - 09:15', title: 'Delegate Registration & Continental Breakfast', room: 'Grand Lobby A', speaker: 'Event Steering Committee', badge: 'General' },
                  { time: '09:15 - 10:30', title: 'Keynote Address: Artificial Intelligence in Modern Logistics', room: 'Main Auditorium (Ballroom B)', speaker: 'Dr. Michael Chen, Chief Innovation Officer, Logix Global', badge: 'Keynote' },
                  { time: '10:45 - 12:00', title: 'Panel Session: Supplier Contract Negotiations & Risk Mitigation', room: 'Executive Room 204', speaker: 'Moderator: Sarah Jenkins (OfficeMaster), Panel of 4 Industry Leaders', badge: 'Strategy' },
                  { time: '12:00 - 13:30', title: 'Networking Luncheon & Technology Product Demonstration', room: 'Terrace Dining Pavilion', speaker: 'Hosted by ApexTech Solutions & Corporate Sponsors', badge: 'Networking' },
                  { time: '13:30 - 15:00', title: 'Interactive Workshop: Transitioning to Zero-Carbon Cloud Warehouses', room: 'Innovation Lab 102', speaker: 'Elena Rostova, Environmental Policy Advisor', badge: 'Workshop' },
                ].map((slot, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-brand-400 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs whitespace-nowrap">
                        {slot.time}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {slot.title}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                            {slot.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Speaker: {slot.speaker}
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 self-end sm:self-center bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      <MapPin className="w-3 h-3 text-brand-600" />
                      <span>{slot.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. REALISTIC CORPORATE MEMO */}
          {passageType === 'Memo' && (
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 font-sans">
              <div className="border-b-4 border-[#801732] pb-4 mb-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black tracking-widest text-[#801732] dark:text-rose-400 uppercase font-serif">
                    MEMORANDUM
                  </h1>
                  <span className="text-xs font-mono font-bold text-slate-400 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded">
                    INTERNAL CIRCULATION ONLY
                  </span>
                </div>
              </div>

              {/* Memo Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 mb-5 border-b border-slate-200 dark:border-slate-700 text-xs font-mono">
                <div>
                  <strong className="text-slate-500 dark:text-slate-400 uppercase">TO: </strong>
                  <span className="font-bold text-slate-900 dark:text-white">All Regional Department Managers</span>
                </div>
                <div>
                  <strong className="text-slate-500 dark:text-slate-400 uppercase">FROM: </strong>
                  <span className="font-bold text-slate-900 dark:text-white">Executive Committee &amp; Facilities Ops</span>
                </div>
                <div>
                  <strong className="text-slate-500 dark:text-slate-400 uppercase">DATE: </strong>
                  <span className="text-slate-800 dark:text-slate-200">October 24, 2026</span>
                </div>
                <div>
                  <strong className="text-slate-500 dark:text-slate-400 uppercase">SUBJECT: </strong>
                  <span className="font-bold text-slate-900 dark:text-white">Relocation &amp; IT Hardware Upgrades</span>
                </div>
              </div>

              {/* Memo Body */}
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed space-y-3 font-sans">
                {emailData.body}
              </div>

              {/* Department Seal */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
                <span>Corporate Management Division • Office of Central Operations</span>
                <span className="font-bold text-[#801732]">AUTHORIZED SIGNATURE: [D. MILLER]</span>
              </div>
            </div>
          )}

          {/* 5. REALISTIC ADVERTISEMENT / PROMOTIONAL FLYER */}
          {passageType === 'Advertisement' && (
            <div className="rounded-xl border-2 border-dashed border-rose-300 dark:border-rose-900/60 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 shadow-sm p-6 font-sans">
              <div className="text-center pb-4 mb-4 border-b border-rose-200 dark:border-rose-900/40">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-[#801732] text-white shadow-xs tracking-wider">
                  EXCLUSIVE LIMITED-TIME PROMOTION
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                  OFFICE APEX ANNUAL CLEARANCE SALE
                </h2>
                <p className="text-xs text-rose-700 dark:text-rose-300 font-bold mt-1">
                  Save up to 40% on Ergonomic Furniture, High-Speed Printers &amp; Enterprise IT Gear!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Copiers &amp; Printers</span>
                  <p className="text-lg font-black text-[#801732] dark:text-rose-400 mt-1">30% OFF</p>
                  <p className="text-[11px] text-slate-500">Includes free installation &amp; 1-year toner kit</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ergonomic Desks</span>
                  <p className="text-lg font-black text-[#801732] dark:text-rose-400 mt-1">BUY 2 GET 1</p>
                  <p className="text-[11px] text-slate-500">Electric height-adjustable standing desks</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Enterprise Support</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">FREE TRIAL</p>
                  <p className="text-[11px] text-slate-500">60-day 24/7 dedicated IT hotline access</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold">Terms &amp; Coupon Instructions:</p>
                <p className="mt-1">
                  Present coupon code <strong className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-amber-300">ETS2026SAVE</strong> at checkout or quote via phone. Valid until the final business day of this month. Cannot be combined with government contractor discounts.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> 1200 Commerce Park Blvd, North Wing</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> 1-800-555-APEX (Mon - Sat: 8 AM - 7 PM)</span>
              </div>
            </div>
          )}

          {/* 6. GENERIC / ARTICLE DOCUMENT FALLBACK */}
          {passageType !== 'Email' && passageType !== 'Invoice' && passageType !== 'Schedule' && passageType !== 'Memo' && passageType !== 'Advertisement' && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {passage}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
