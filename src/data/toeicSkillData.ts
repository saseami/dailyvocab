// Comprehensive TOEIC 4-Skills Dataset covering Listening, Reading, Speaking, Writing
// Categorized by Phase: Foundation (450-600+), Acceleration (650-800+), Real Exam (850-990)

export type TOEICPhase = 'foundation' | 'acceleration' | 'mock_exam';
export type TOEICSkill = 'vocabulary' | 'listening' | 'reading' | 'speaking' | 'writing' | 'exam';

export interface ListeningQuestion {
  id: string;
  part: 1 | 2 | 3 | 4;
  skill?: 'listening';
  phase: TOEICPhase;
  title: string;
  audioPrompt?: string; // Spoken text via Web Speech API or audio file
  imageUrl?: string;
  imageType?: string; // 'office-typing', 'warehouse-loading', etc.
  scenario?: string;
  questionText: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  transcript: string;
  explanationVi: string;
  sentenceTranslationVi?: string; // Dịch nghĩa lời thoại tiếng Việt
  trapType?: string; // 'Sound Trap', 'Similar Word', 'Wrong Subject', 'Wrong Tense', 'Distractor'
  keywords: string[];
}

export interface ReadingQuestion {
  id: string;
  part: 5 | 6 | 7;
  skill?: 'reading';
  phase: TOEICPhase;
  category: string; // 'Grammar: Verb Tense', 'Vocabulary: Word Form', 'Part 7: Double Passage', etc.
  passage?: string; // For Part 6 and Part 7
  passageTitle?: string;
  passageType?: 'Email' | 'Memo' | 'Advertisement' | 'Invoice' | 'Notice' | 'Article' | 'Schedule';
  questionText: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  sentenceTranslationVi?: string; // Dịch nghĩa nguyên câu hoàn chỉnh tiếng Việt
  explanationVi: string;
  grammarRuleVi?: string;
  trapType?: string;
  paraphrasedKeywords?: { inPassage: string; inQuestion: string }[];
}

// -------------------------------------------------------------
// 1. LISTENING QUESTIONS (PART 1 - 4)
// -------------------------------------------------------------
export const TOEIC_LISTENING_QUESTIONS: ListeningQuestion[] = [
  // --- PART 1: PHOTOGRAPHS ---
  {
    id: 'l-p1-01',
    part: 1,
    phase: 'foundation',
    title: 'Part 1: Miêu tả thao tác người trong văn phòng',
    imageType: 'office-typing',
    scenario: 'Office worker typing on desktop computer at workstation',
    audioPrompt: 'A. She is typing on a computer keyboard. B. She is hanging a picture on the wall. C. She is drinking water from a cup. D. She is closing the office door.',
    questionText: 'Look at the photo and listen to the four statements. Select the statement that best describes what you see.',
    options: [
      { key: 'A', text: 'A. She is typing on a computer keyboard.' },
      { key: 'B', text: 'B. She is hanging a picture on the wall.' },
      { key: 'C', text: 'C. She is drinking water from a cup.' },
      { key: 'D', text: 'D. She is closing the office door.' },
    ],
    correctAnswer: 'A',
    transcript: 'Statement A: She is typing on a computer keyboard. (Đúng: người phụ nữ đang gõ bàn phím máy tính).',
    explanationVi: 'Câu A miêu tả chính xác hành động trọng tâm của nhân vật ("typing on a computer keyboard"). Các câu B, C, D miêu tả các hành động không hề xuất hiện trong bức ảnh.',
    trapType: 'Wrong Action',
    keywords: ['typing', 'keyboard', 'computer', 'office'],
  },
  {
    id: 'l-p1-02',
    part: 1,
    phase: 'foundation',
    title: 'Part 1: Miêu tả sắp đặt đồ vật và hàng hóa',
    imageType: 'warehouse-loading',
    scenario: 'Warehouse worker with stacked boxes and handcart',
    audioPrompt: 'A. Some boxes have been stacked on the warehouse floor. B. Workers are loading packages into a truck. C. The warehouse shelves are completely empty. D. The floor is being swept by a custodian.',
    questionText: 'Select the statement that best describes the arrangement in the warehouse.',
    options: [
      { key: 'A', text: 'A. Some boxes have been stacked on the warehouse floor.' },
      { key: 'B', text: 'B. Workers are loading packages into a truck.' },
      { key: 'C', text: 'C. The warehouse shelves are completely empty.' },
      { key: 'D', text: 'D. The floor is being swept by a custodian.' },
    ],
    correctAnswer: 'A',
    transcript: 'Statement A: Some boxes have been stacked on the warehouse floor. (Một số thùng các-tông đã được xếp chồng lên sàn kho).',
    explanationVi: 'Bẫy thì hiện tại tiếp diễn bị động ("is being swept"): câu D sai vì trong tranh đồ vật không hề có người đang quét. Câu A sử dụng thì hiện tại hoàn thành bị động ("have been stacked") miêu tả đúng trạng thái đồ vật trong ảnh.',
    trapType: 'Being Trap (Thì bị động tiếp diễn khi không có người)',
    keywords: ['stacked', 'warehouse', 'packages', 'floor'],
  },

  // --- PART 2: QUESTION - RESPONSE ---
  {
    id: 'l-p2-01',
    part: 2,
    phase: 'foundation',
    title: 'Part 2: Câu hỏi thời gian (When)',
    audioPrompt: 'When is the final draft of the proposal due? A. Yes, I thought it was very interesting. B. By five o\'clock this afternoon. C. In the conference room on the second floor.',
    questionText: 'When is the final draft of the proposal due?',
    options: [
      { key: 'A', text: 'A. Yes, I thought it was very interesting.' },
      { key: 'B', text: 'B. By five o\'clock this afternoon.' },
      { key: 'C', text: 'C. In the conference room on the second floor.' },
    ],
    correctAnswer: 'B',
    transcript: 'Question: When is the final draft of the proposal due? -> Answer B: By five o\'clock this afternoon.',
    explanationVi: 'Câu hỏi bắt đầu bằng "When" (Khi nào) hỏi mốc thời gian hạn chót ("due"). Phương án B trả lời mốc giờ cụ thể ("By 5 o\'clock this afternoon"). Câu A sai vì câu hỏi Wh- không bao giờ trả lời bằng Yes/No. Câu C bẫy nơi chốn ("In the conference room" trả lời cho Where).',
    trapType: 'Yes/No Trap with Wh- Questions',
    keywords: ['When', 'due', 'proposal', 'five o\'clock'],
  },
  {
    id: 'l-p2-02',
    part: 2,
    phase: 'foundation',
    title: 'Part 2: Câu hỏi lựa chọn (Or Question)',
    audioPrompt: 'Would you prefer to review the contract now, or should we discuss it after lunch? A. It was signed yesterday. B. Let\'s wait until after we eat. C. Yes, I prefer coffee.',
    questionText: 'Would you prefer to review the contract now, or should we discuss it after lunch?',
    options: [
      { key: 'A', text: 'A. It was signed yesterday.' },
      { key: 'B', text: 'B. Let\'s wait until after we eat.' },
      { key: 'C', text: 'C. Yes, I prefer coffee.' },
    ],
    correctAnswer: 'B',
    transcript: 'Question: Would you prefer to review now, or after lunch? -> Answer B: Let\'s wait until after we eat.',
    explanationVi: 'Câu hỏi có "or" (bây giờ hay sau bữa trưa). Câu B chọn vế thứ hai một cách tự nhiên thông qua cách diễn đạt tương đương ("after we eat" = "after lunch"). Câu C bẫy lặp từ "prefer" và Yes/No.',
    trapType: 'Repeated Word Distractor',
    keywords: ['prefer', 'review', 'lunch', 'contract'],
  },
  {
    id: 'l-p2-03',
    part: 2,
    phase: 'acceleration',
    title: 'Part 2: Câu trả lời gián tiếp (Indirect Response - Target 750+)',
    audioPrompt: 'Who approved the budget for the new marketing campaign? A. The marketing director is still out on business travel. B. About fifteen thousand dollars. C. Yes, it was very effective.',
    questionText: 'Who approved the budget for the new marketing campaign?',
    options: [
      { key: 'A', text: 'A. The marketing director is still out on business travel.' },
      { key: 'B', text: 'B. About fifteen thousand dollars.' },
      { key: 'C', text: 'C. Yes, it was very effective.' },
    ],
    correctAnswer: 'A',
    transcript: 'Question: Who approved the budget? -> Answer A: The marketing director is still out on business travel.',
    explanationVi: 'Đây là câu hỏi "Who" nhưng câu trả lời gián tiếp phủ định ngầm: người có thẩm quyền phê duyệt ("marketing director") hiện vẫn đang đi công tác nên chưa thể duyệt được. Câu B bẫy trả lời cho "How much".',
    trapType: 'Indirect Answer Trap',
    keywords: ['Who', 'approved', 'budget', 'marketing director'],
  },

  // --- PART 3: CONVERSATION ---
  {
    id: 'l-p3-01',
    part: 3,
    phase: 'acceleration',
    title: 'Part 3: Đoạn hội thoại đặt phòng khách sạn & hội nghị',
    scenario: 'Lắng nghe cuộc đối thoại giữa đại diện công ty và nhân viên lễ tân trung tâm hội nghị.',
    audioPrompt: 'Man: Hello, I am calling from Vantage Logistics. We booked the grand ballroom for our annual shareholder meeting next Thursday, but our attendee list has grown by thirty people. Woman: I understand, sir. We can easily accommodate the additional guests by opening the partition to the adjoining garden terrace. There will just be a minor surcharge for the extra banquet chairs. Man: That sounds perfect. Please email me the updated invoice so I can forward it to accounting for approval.',
    questionText: 'What problem does the man mention?',
    options: [
      { key: 'A', text: 'A. The meeting date has been postponed.' },
      { key: 'B', text: 'B. The guest attendance has exceeded the initial booking.' },
      { key: 'C', text: 'C. The catering menu was delivered incorrectly.' },
      { key: 'D', text: 'D. The audiovisual equipment is malfunctioning.' },
    ],
    correctAnswer: 'B',
    transcript: 'Man: ...our attendee list has grown by thirty people. -> B. The guest attendance has exceeded the initial booking.',
    explanationVi: 'Người đàn ông nói "our attendee list has grown by thirty people" (danh sách người tham dự đã tăng thêm 30 người). Cụm này được diễn đạt tương đương (paraphrase) thành câu B: "guest attendance has exceeded the initial booking" (số lượng khách đã vượt quá lượt đặt ban đầu).',
    trapType: 'Paraphrasing Identification',
    keywords: ['attendee list', 'grown', 'exceeded', 'booking', 'ballroom'],
  },

  // --- PART 4: SHORT TALK ---
  {
    id: 'l-p4-01',
    part: 4,
    phase: 'acceleration',
    title: 'Part 4: Thông báo cập nhật phần mềm nội bộ công ty',
    scenario: 'Lắng nghe bản tin phát thanh nội bộ từ phòng IT.',
    audioPrompt: 'Attention all staff members. This is an urgent announcement from the IT department. At midnight tonight, our main enterprise servers will undergo scheduled maintenance to install crucial cybersecurity patches. During this four-hour downtime window, access to the internal employee portal and cloud drives will be temporarily suspended. Please make sure to save all work and log off before leaving the office today at five PM.',
    questionText: 'What are employees instructed to do before five PM?',
    options: [
      { key: 'A', text: 'A. Install antivirus software manually on their devices.' },
      { key: 'B', text: 'B. Save their files and log off their workstations.' },
      { key: 'C', text: 'C. Contact human resources for password resets.' },
      { key: 'D', text: 'D. Submit their weekly timesheets early.' },
    ],
    correctAnswer: 'B',
    transcript: 'Speaker: Please make sure to save all work and log off before leaving the office today at five PM. -> B. Save their files and log off.',
    explanationVi: 'Ở cuối bài nói, người phát ngôn yêu cầu rõ ràng: "Please make sure to save all work and log off before leaving the office today at five PM" $\rightarrow$ Đáp án chính xác là B.',
    trapType: 'Specific Detail Extraction',
    keywords: ['save all work', 'log off', 'five PM', 'IT department'],
  },
];

// -------------------------------------------------------------
// 2. READING QUESTIONS (PART 5 - 7)
// -------------------------------------------------------------
export const TOEIC_READING_QUESTIONS: ReadingQuestion[] = [
  // --- PART 5: INCOMPLETE SENTENCES ---
  {
    id: 'r-p5-01',
    part: 5,
    phase: 'foundation',
    category: 'Ngữ pháp: Từ loại (Parts of Speech - Adverb)',
    questionText: 'The newly appointed vice president spoke _______ about the strategic expansion plans during the quarterly press conference.',
    options: [
      { key: 'A', text: 'A. enthusiastic' },
      { key: 'B', text: 'B. enthusiasm' },
      { key: 'C', text: 'C. enthusiastically' },
      { key: 'D', text: 'D. enthusiast' },
    ],
    correctAnswer: 'C',
    explanationVi: 'Chỗ trống đứng sau động từ thường "spoke" (quá khứ của speak). Để bổ nghĩa cho động từ thường, ta bắt buộc phải sử dụng trạng từ (Adverb - đuôi -ly). Đáp án đúng là C: enthusiastically (một cách nhiệt huyết / hào hứng).',
    grammarRuleVi: 'Quy tắc vàng Part 5: Verb + Adverb (hoặc Adverb + Verb) để bổ nghĩa cho động từ.',
  },
  {
    id: 'r-p5-02',
    part: 5,
    phase: 'foundation',
    category: 'Ngữ pháp: Mệnh đề quan hệ rút gọn (Reduced Relative Clause)',
    questionText: 'Any employee _______ in participating in the professional development seminar should submit the registration form by Friday.',
    options: [
      { key: 'A', text: 'A. interest' },
      { key: 'B', text: 'B. interested' },
      { key: 'C', text: 'C. interesting' },
      { key: 'D', text: 'D. interestingly' },
    ],
    correctAnswer: 'B',
    explanationVi: 'Câu đã có động từ chính của vị ngữ là "should submit". Do đó cụm phía trước là mệnh đề quan hệ rút gọn miêu tả chủ ngữ "Any employee" mang nghĩa bị động/cảm xúc: [who is] interested in. Tính từ/quá khứ phân từ "interested" luôn đi với giới từ "in".',
    grammarRuleVi: 'Cấu trúc be interested in + V-ing/Noun $\\rightarrow$ Rút gọn thành: Noun + interested in...',
  },
  {
    id: 'r-p5-03',
    part: 5,
    phase: 'acceleration',
    category: 'Ngữ pháp: Phân biệt Liên từ (Conjunction) vs Giới từ (Preposition)',
    questionText: '_______ the severe weather conditions caused major transport delays, all conference speakers managed to arrive on schedule.',
    options: [
      { key: 'A', text: 'A. In spite of' },
      { key: 'B', text: 'B. Although' },
      { key: 'C', text: 'C. Because of' },
      { key: 'D', text: 'D. Furthermore' },
    ],
    correctAnswer: 'B',
    explanationVi: 'Phía sau chỗ trống là một mệnh đề hoàn chỉnh có đầy đủ chủ ngữ ("the severe weather conditions") và động từ ("caused"). Do đó ta bắt buộc phải dùng Liên từ (Conjunction) như "Although", loại trừ giới từ "In spite of" và "Because of" (vốn chỉ đi kèm Noun Phrase). "Although" mang nghĩa đối lập phù hợp ngữ cảnh: Mặc dù thời tiết xấu nhưng tất cả diễn giả vẫn đến đúng giờ.',
    grammarRuleVi: 'Although / Even though + S + V + O; In spite of / Despite + Noun / V-ing.',
  },
  {
    id: 'r-p5-04',
    part: 5,
    phase: 'acceleration',
    category: 'Từ vựng: Collocation thương mại nâng cao (Target 800+)',
    questionText: 'The legal counsel advised the board to exercise extreme _______ when disclosing financial projections to outside investors.',
    options: [
      { key: 'A', text: 'A. caution' },
      { key: 'B', text: 'B. reservation' },
      { key: 'C', text: 'C. prevention' },
      { key: 'D', text: 'D. suspension' },
    ],
    correctAnswer: 'A',
    explanationVi: 'Collocation kinh điển trong văn phong thương mại: "exercise caution" mang nghĩa "hết sức cẩn trọng / thận trọng". Cố vấn pháp lý khuyên ban giám đốc phải hết sức thận trọng khi công bố dự báo tài chính cho nhà đầu tư bên ngoài.',
    grammarRuleVi: 'Collocation: Exercise extreme caution (hành xử vô cùng thận trọng).',
  },

  // --- PART 6: TEXT COMPLETION (MEMO) ---
  {
    id: 'r-p6-01',
    part: 6,
    phase: 'acceleration',
    category: 'Part 6: Điền từ vào Thông báo nội bộ (Corporate Memo)',
    passageType: 'Memo',
    passageTitle: 'Internal Memorandum: Enterprise IT Upgrade',
    passage: `MEMORANDUM
TO: All Regional Department Managers
FROM: Corporate Facilities & IT Support
DATE: October 24, 2026
SUBJECT: Relocation & IT Hardware Upgrades

Please be advised that the network infrastructure in Buildings A and C will undergo scheduled maintenance this coming weekend. During this period, remote server access will be temporarily interrupted. 

We kindly request all team leads to ensure that their staff save all critical files to local drives before 5:00 PM on Friday. The engineering crew will work diligently to _______ all services by early Monday morning.`,
    questionText: 'Which word best fits the blank to complete the memorandum?',
    options: [
      { key: 'A', text: 'A. restore' },
      { key: 'B', text: 'B. restoration' },
      { key: 'C', text: 'C. restorative' },
      { key: 'D', text: 'D. restorement' },
    ],
    correctAnswer: 'A',
    explanationVi: 'Sau cấu trúc "to + V nguyên mẫu" ("to _______ all services"), ta cần một động từ nguyên mẫu ngoại động từ. Động từ "restore" (khôi phục) là đáp án đúng ngữ pháp và ngữ nghĩa.',
    grammarRuleVi: 'Cấu trúc chỉ mục đích: to + V (bare infinitive).',
  },

  // --- PART 7: READING COMPREHENSION (DOCUMENTS) ---
  {
    id: 'r-p7-01',
    part: 7,
    phase: 'acceleration',
    category: 'Part 7: Đọc hiểu Thư điện tử (Email)',
    passageType: 'Email',
    passageTitle: 'Email: Yêu cầu gia hạn hợp đồng thuê thiết bị văn phòng',
    passage: `FROM: David Miller, Operations Manager <d.miller@apextech.com>
TO: Sarah Jenkins, Client Relations <s.jenkins@officemaster.com>
DATE: October 14, 2026
SUBJECT: Lease renewal inquiry - Heavy-duty multifunction copiers

Dear Ms. Jenkins,
Our current two-year equipment lease agreement (#OM-4482) for three industrial multifunction copiers is scheduled to terminate at the end of next month. 

Overall, our administrative staff has been extremely satisfied with the reliability of the machines and your prompt maintenance support. We would like to negotiate a renewal for an additional 24 months, provided that OfficeMaster can upgrade the firmware on all three units to support contactless cloud scanning. 

Could you please send an updated pricing quotation that reflects this technical enhancement? If the rates remain competitive, our finance committee is prepared to authorize the contract before the end of the current fiscal quarter.

Sincerely,
David Miller`,
    questionText: 'What condition does Mr. Miller specify for extending the lease?',
    options: [
      { key: 'A', text: 'A. The monthly lease fee must be reduced by ten percent.' },
      { key: 'B', text: 'B. A firmware upgrade for cloud scanning must be provided.' },
      { key: 'C', text: 'C. The equipment must be replaced with brand-new models.' },
      { key: 'D', text: 'D. The maintenance contract must include free toner refills.' },
    ],
    correctAnswer: 'B',
    explanationVi: 'Trong đoạn 2, ông Miller nêu rõ điều kiện gia hạn: "...provided that OfficeMaster can upgrade the firmware on all three units to support contactless cloud scanning" (với điều kiện OfficeMaster nâng cấp firmware trên cả 3 máy để hỗ trợ quét đám mây). Đáp án B phản ánh chính xác điều kiện này.',
    paraphrasedKeywords: [
      { inPassage: 'provided that OfficeMaster can upgrade the firmware', inQuestion: 'firmware upgrade for cloud scanning must be provided' }
    ],
  },
  {
    id: 'r-p7-02',
    part: 7,
    phase: 'acceleration',
    category: 'Part 7: Đọc hiểu Hóa đơn thương mại (Invoice)',
    passageType: 'Invoice',
    passageTitle: 'Official Billing Invoice: OfficeMaster Solutions Inc.',
    passage: `INVOICE #OM-4482-B
DATE: October 15, 2026
DUE DATE: November 15, 2026 (Net 30)
BILLED TO: ApexTech Solutions Corp. (Attn: David Miller)

ITEM 1: Multifunction Heavy-Duty Copier Model OM-900 (Qty: 3) - $1,350.00
ITEM 2: Contactless Cloud-Scan Firmware Upgrade (Qty: 3) - $240.00
ITEM 3: 24-Month Comprehensive Maintenance Service (Qty: 1) - $200.00
Subtotal: $1,790.00 | Loyalty Renewal Discount (10%): -$179.00 | State Tax: $112.77
TOTAL MONTHLY: $1,723.77`,
    questionText: 'According to the invoice, what benefit is given to ApexTech Solutions Corp.?',
    options: [
      { key: 'A', text: 'A. Free delivery within 24 hours' },
      { key: 'B', text: 'B. A ten percent loyalty renewal discount' },
      { key: 'C', text: 'C. Waiver of all applicable state taxes' },
      { key: 'D', text: 'D. An extra copier machine at zero cost' },
    ],
    correctAnswer: 'B',
    explanationVi: 'Nhìn vào mục tính tiền trên hóa đơn (Invoice calculation): "Loyalty Renewal Discount (10%): -$179.00" chứng minh khách hàng ApexTech được hưởng chiết khấu 10% khách hàng thân thiết khi gia hạn hợp đồng.',
    paraphrasedKeywords: [
      { inPassage: 'Loyalty Renewal Discount (10%)', inQuestion: 'A ten percent loyalty renewal discount' }
    ],
  },
  {
    id: 'r-p7-03',
    part: 7,
    phase: 'acceleration',
    category: 'Part 7: Đọc hiểu Lịch trình sự kiện (Conference Schedule)',
    passageType: 'Schedule',
    passageTitle: 'Program Schedule: 2026 Global Supply Chain & Tech Forum',
    passage: `2026 GLOBAL SUPPLY CHAIN & TECH FORUM
VENUE: Grand Hyatt Regency, Floor 2 | DATE: Friday, November 20, 2026

08:30 - 09:15 | Registration & Continental Breakfast | Grand Lobby A
09:15 - 10:30 | Keynote: AI in Modern Logistics (Dr. Michael Chen) | Main Auditorium
10:45 - 12:00 | Panel: Supplier Contract Negotiations (Sarah Jenkins, OfficeMaster) | Room 204
12:00 - 13:30 | Networking Luncheon & Demo | Terrace Dining Pavilion
13:30 - 15:00 | Workshop: Zero-Carbon Warehouses (Elena Rostova) | Innovation Lab 102`,
    questionText: 'Where will attendees go if they want to listen to Ms. Sarah Jenkins speak?',
    options: [
      { key: 'A', text: 'A. Grand Lobby A' },
      { key: 'B', text: 'B. Main Auditorium' },
      { key: 'C', text: 'C. Executive Room 204' },
      { key: 'D', text: 'D. Innovation Lab 102' },
    ],
    correctAnswer: 'C',
    explanationVi: 'Đối chiếu dòng sự kiện lúc 10:45 - 12:00: "Panel: Supplier Contract Negotiations (Sarah Jenkins, OfficeMaster) | Room 204". Như vậy người tham dự sẽ đến Phòng 204.',
    paraphrasedKeywords: [
      { inPassage: 'Room 204 (Sarah Jenkins)', inQuestion: 'Executive Room 204' }
    ],
  },
  {
    id: 'r-p7-04',
    part: 7,
    phase: 'acceleration',
    category: 'Part 7: Đọc hiểu Tờ rơi Quảng cáo (Advertisement)',
    passageType: 'Advertisement',
    passageTitle: 'Promotional Flyer: Office Apex Annual Clearance Sale',
    passage: `OFFICE APEX ANNUAL CLEARANCE SALE
Up to 40% OFF on Ergonomic Furniture & Enterprise IT Gear!
- Copiers & Printers: 30% OFF (includes toner kit)
- Electric Standing Desks: Buy 2 Get 1 Free
- Enterprise IT Support: 60-day Free Trial
Use coupon code ETS2026SAVE at checkout. Valid until the end of the month.`,
    questionText: 'What is required for customers to claim the promotional savings?',
    options: [
      { key: 'A', text: 'A. Providing coupon code ETS2026SAVE at checkout' },
      { key: 'B', text: 'B. Signing an exclusive 5-year service contract' },
      { key: 'C', text: 'C. Visiting the store before 8:00 AM on weekdays' },
      { key: 'D', text: 'D. Purchasing at least ten ergonomic office chairs' },
    ],
    correctAnswer: 'A',
    explanationVi: 'Trong phần điều khoản phiếu giảm giá (Terms & Coupon Instructions): "Present coupon code ETS2026SAVE at checkout or quote via phone" nêu rõ khách hàng cần cung cấp mã giảm giá này khi thanh toán.',
    paraphrasedKeywords: [
      { inPassage: 'Present coupon code ETS2026SAVE at checkout', inQuestion: 'Providing coupon code ETS2026SAVE at checkout' }
    ],
  },
];

export const TOEIC_ADVANCED_LISTENING_ADDITIONS: ListeningQuestion[] = [
  {
    id: 'l-p1-adv-01',
    part: 1,
    phase: 'mock_exam',
    title: 'Part 1: Cuộc họp thảo luận dự án tại phòng hội đồng',
    audioPrompt: 'A. They are painting the conference table. B. They are looking at a presentation on the screen. C. They are exiting the boardroom. D. They are eating lunch in the cafeteria.',
    imageType: 'boardroom-meeting',
    scenario: 'Two executives seated across a conference table reviewing project plans.',
    questionText: 'Look at the photo and listen to the statements. Choose the best description.',
    options: [
      { key: 'A', text: 'A. They are painting the conference table.' },
      { key: 'B', text: 'B. They are looking at a presentation on the screen.' },
      { key: 'C', text: 'C. They are exiting the boardroom.' },
      { key: 'D', text: 'D. They are eating lunch in the cafeteria.' }
    ],
    correctAnswer: 'B',
    transcript: '(A) They are painting the conference table. (B) They are looking at a presentation on the screen. (C) They are exiting the boardroom. (D) They are eating lunch in the cafeteria.',
    sentenceTranslationVi: '(B) Họ đang cùng quan sát bài thuyết trình trên màn hình trong phòng họp.',
    explanationVi: 'Phương án B miêu tả chính xác hành động của hai người trong phòng hội đồng đang tập trung theo dõi slide thuyết trình.',
    trapType: 'Sound Trap & Wrong Action',
    keywords: ['presentation', 'boardroom', 'conference', 'screen']
  },
  {
    id: 'l-p1-adv-02',
    part: 1,
    phase: 'mock_exam',
    title: 'Part 1: Khách hàng ngồi tại quán cà phê ngoài trời',
    audioPrompt: 'A. Customers are seated outdoors beneath umbrellas. B. The restaurant is closed for renovations. C. Vehicles are parked on the sidewalk. D. A waiter is washing the windows.',
    imageType: 'cafe-patio',
    scenario: 'Customers seated at outdoor patio tables under sun umbrellas.',
    questionText: 'Look at the photo and listen to the statements. Choose the best description.',
    options: [
      { key: 'A', text: 'A. Customers are seated outdoors beneath umbrellas.' },
      { key: 'B', text: 'B. The restaurant is closed for renovations.' },
      { key: 'C', text: 'C. Vehicles are parked on the sidewalk.' },
      { key: 'D', text: 'D. A waiter is washing the windows.' }
    ],
    correctAnswer: 'A',
    transcript: '(A) Customers are seated outdoors beneath umbrellas. (B) The restaurant is closed for renovations. (C) Vehicles are parked on the sidewalk. (D) A waiter is washing the windows.',
    sentenceTranslationVi: '(A) Các khách hàng đang ngồi ngoài trời bên dưới những chiếc ô che nắng.',
    explanationVi: 'Phương án A miêu tả đúng cảnh thực tế với khách hàng ngồi uống nước tại khu vực bàn ngoài trời có ô che.',
    trapType: 'Distractor Action',
    keywords: ['seated outdoors', 'umbrellas', 'patio', 'customers']
  },
  {
    id: 'l-p2-adv-01',
    part: 2,
    phase: 'mock_exam',
    title: 'Part 2: Bẫy câu trả lời gián tiếp - Trì hoãn ngân sách',
    audioPrompt: 'Has the quarterly budget proposal been submitted to senior management yet?',
    questionText: 'Has the quarterly budget proposal been submitted to senior management yet?',
    options: [
      { key: 'A', text: 'A. Yes, at the downtown department store.' },
      { key: 'B', text: 'B. Linda requested a two-day extension to review the figures.' },
      { key: 'C', text: 'C. About twenty-five thousand dollars.' }
    ],
    correctAnswer: 'B',
    transcript: 'Question: Has the quarterly budget proposal been submitted to senior management yet? (A) Yes, at the downtown department store. (B) Linda requested a two-day extension to review the figures. (C) About twenty-five thousand dollars.',
    sentenceTranslationVi: 'Bản đề xuất ngân sách quý đã được nộp lên ban giám đốc chưa? -> (B) Linda đã xin gia hạn thêm hai ngày để kiểm tra lại các số liệu.',
    explanationVi: 'Bẫy câu trả lời gián tiếp phổ biến trong TOEIC Target 800+: Người nói không trả lời trực tiếp Yes/No mà đưa ra lý do tại sao chưa nộp (xin gia hạn thêm 2 ngày).',
    trapType: 'Indirect Response Trap',
    keywords: ['budget proposal', 'submitted', 'extension', 'figures']
  },
  {
    id: 'l-p2-adv-02',
    part: 2,
    phase: 'mock_exam',
    title: 'Part 2: Câu hỏi phủ định gợi ý hành động (Shouldn\'t we...)',
    audioPrompt: 'Shouldn\'t we reserve the conference auditorium before the weekend?',
    questionText: 'Shouldn\'t we reserve the conference auditorium before the weekend?',
    options: [
      { key: 'A', text: 'A. Mark already confirmed the booking this morning.' },
      { key: 'B', text: 'B. No, the weekend was very quiet.' },
      { key: 'C', text: 'C. To attend the keynote lecture.' }
    ],
    correctAnswer: 'A',
    transcript: 'Question: Shouldn\'t we reserve the conference auditorium before the weekend? (A) Mark already confirmed the booking this morning. (B) No, the weekend was very quiet. (C) To attend the keynote lecture.',
    sentenceTranslationVi: 'Chẳng phải chúng ta nên đặt trước hội trường hội nghị trước cuối tuần sao? -> (A) Sáng nay Mark đã xác nhận đặt chỗ rồi.',
    explanationVi: 'Phương án A giải quyết trực tiếp mối bận tâm bằng cách thông báo việc đặt phòng đã được người khác hoàn thành vào sáng nay.',
    trapType: 'Sound Repetition & Purpose Trap',
    keywords: ['reserve', 'auditorium', 'confirmed', 'booking']
  },
  {
    id: 'l-p3-adv-01',
    part: 3,
    phase: 'mock_exam',
    title: 'Part 3: Hội thoại đàm phán chuỗi cung ứng linh kiện',
    audioPrompt: 'Man: Hello Sarah, our primary electronics supplier notified us that the microchip shipment will be delayed by three weeks due to port congestion. Woman: That is going to disrupt our production schedule for the new prototype. Should we expedite parts from our backup supplier in Taiwan? Man: Their unit cost is about 8% higher, but they guarantee delivery within four business days. Woman: Please proceed with Taiwan immediately. Meeting our launch deadline is our highest priority.',
    questionText: 'Why is the woman willing to pay higher prices for replacement parts?',
    options: [
      { key: 'A', text: 'A. To secure a new patent registration' },
      { key: 'B', text: 'B. To prevent a delay in product launch' },
      { key: 'C', text: 'C. To establish an office branch in Taiwan' },
      { key: 'D', text: 'D. To conduct a quality assurance audit' }
    ],
    correctAnswer: 'B',
    transcript: 'Why is the woman willing to pay higher prices for replacement parts? Woman: "Please proceed with Taiwan immediately. Meeting our launch deadline is our highest priority."',
    sentenceTranslationVi: 'Tại sao người phụ nữ sẵn sàng chi trả mức giá linh kiện cao hơn? -> Để tránh làm chậm tiến độ ra mắt sản phẩm (Meeting our launch deadline is our highest priority).',
    explanationVi: 'Chi tiết quan trọng ở câu kết của người phụ nữ: "Meeting our launch deadline is our highest priority" tương đương với "To prevent a delay in product launch".',
    trapType: 'Paraphrasing Trap',
    keywords: ['supplier', 'shipment delayed', 'expedite', 'launch deadline']
  },
  {
    id: 'l-p4-adv-01',
    part: 4,
    phase: 'mock_exam',
    title: 'Part 4: Thông báo phát thanh khẩn cấp tại sân bay quốc tế',
    audioPrompt: 'May I have your attention, please. Passengers on flight VN384 departing for Tokyo Haneda, our aircraft is experiencing a minor electrical inspection at Gate 12. Boarding will be postponed until 4:15 PM. Passengers needing special assistance or traveling with infants should report to the customer service podium near Gate 14. We apologize for the inconvenience and complimentary beverage vouchers are available on your mobile boarding pass.',
    questionText: 'What compensation is offered to the delayed passengers?',
    options: [
      { key: 'A', text: 'A. Hotel overnight accommodations' },
      { key: 'B', text: 'B. Complimentary beverage vouchers' },
      { key: 'C', text: 'C. Free upgrade to first class' },
      { key: 'D', text: 'D. Full cash refund at the gate' }
    ],
    correctAnswer: 'B',
    transcript: 'What compensation is offered to the delayed passengers? Speaker: "...complimentary beverage vouchers are available on your mobile boarding pass."',
    sentenceTranslationVi: 'Khoản đền bù nào được cung cấp cho hành khách bị hoãn chuyến bay? -> Phiếu đồ uống miễn phí (complimentary beverage vouchers).',
    explanationVi: 'Nghe từ khóa "complimentary beverage vouchers" ở câu kết của thông báo sân bay.',
    trapType: 'Excessive Compensation Distractor',
    keywords: ['postponed', 'complimentary beverage vouchers', 'boarding pass']
  },
  {
    id: 'l-p4-adv-02',
    part: 4,
    phase: 'mock_exam',
    title: 'Part 4: Lời nhắn hộp thư thoại - Đàm phán hợp đồng cho thuê',
    audioPrompt: 'Good afternoon, Mr. Ramirez. This is Christine from Apex Commercial Real Estate. I am following up on your inquiry regarding the office suite on the 14th floor. The landlord agreed to waive the parking fee for the first year, provided that you sign a minimum three-year lease agreement by Friday. Please call me back before 5:00 PM today so we can finalize the paperwork.',
    questionText: 'What incentive did the building landlord offer?',
    options: [
      { key: 'A', text: 'A. Two months of free office rent' },
      { key: 'B', text: 'B. Waived parking fees for the first year' },
      { key: 'C', text: 'C. Complementary office furniture' },
      { key: 'D', text: 'D. Free fiber optic internet installation' }
    ],
    correctAnswer: 'B',
    transcript: 'What incentive did the building landlord offer? Speaker: "The landlord agreed to waive the parking fee for the first year, provided that you sign a minimum three-year lease agreement..."',
    sentenceTranslationVi: 'Chủ tòa nhà đã đưa ra ưu đãi nào? -> Miễn phí gửi xe trong năm đầu tiên (waive the parking fee for the first year).',
    explanationVi: 'Cụm từ "waive the parking fee" (miễn phí giữ xe) tương đương với "Waived parking fees".',
    trapType: 'Misleading Incentive Trap',
    keywords: ['landlord', 'waive parking fee', 'lease agreement']
  }
];

export const TOEIC_ADVANCED_READING_ADDITIONS: ReadingQuestion[] = [
  {
    id: 'r-p5-adv-01',
    part: 5,
    phase: 'mock_exam',
    category: 'Ngữ pháp Nâng cao: Đảo ngữ câu điều kiện loại 1 (Inverted Conditional with Should)',
    questionText: '------- you require any supplementary documentation regarding the patent application, please contact our legal counsel immediately.',
    options: [
      { key: 'A', text: 'A. Should' },
      { key: 'B', text: 'B. Unless' },
      { key: 'C', text: 'C. Provided' },
      { key: 'D', text: 'D. Whether' }
    ],
    correctAnswer: 'A',
    sentenceTranslationVi: 'Nếu quý vị cần bất kỳ tài liệu bổ sung nào liên quan đến đơn đăng ký bằng sáng chế, vui lòng liên hệ ngay với cố vấn pháp lý của chúng tôi.',
    explanationVi: 'Cấu trúc đảo ngữ câu điều kiện loại 1 trang trọng trong thư từ kinh doanh: "Should + S + V-nguyên thể" thay thế cho "If + S + V-hiện tại đơn".',
    grammarRuleVi: 'Should + S + V (bare-inf) = If + S + V (present simple)',
    trapType: 'Inversion Grammar Trap',
  },
  {
    id: 'r-p5-adv-02',
    part: 5,
    phase: 'mock_exam',
    category: 'Từ vựng Nâng cao: Collocation thương mại & Quy chuẩn an toàn',
    questionText: 'All laboratory technicians are strictly required to adhere ------- the revised biosafety protocols published last week.',
    options: [
      { key: 'A', text: 'A. at' },
      { key: 'B', text: 'B. to' },
      { key: 'C', text: 'C. with' },
      { key: 'D', text: 'D. for' }
    ],
    correctAnswer: 'B',
    sentenceTranslationVi: 'Tất cả kỹ thuật viên phòng thí nghiệm được yêu cầu nghiêm ngặt phải tuân thủ các quy chuẩn an toàn sinh học sửa đổi vừa được công bố tuần trước.',
    explanationVi: 'Cụm từ cố định chuẩn TOEIC: "adhere to something" (tuân thủ theo, làm theo quy tắc/tiêu chuẩn).',
    grammarRuleVi: 'adhere to = comply with = conform to = abide by',
    trapType: 'Preposition Collocation Trap',
  },
  {
    id: 'r-p5-adv-03',
    part: 5,
    phase: 'mock_exam',
    category: 'Ngữ pháp: Liên từ chỉ sự nhượng bộ (Concession Clause)',
    questionText: '------- the unexpected surge in raw material costs, Apex Manufacturing managed to maintain strong profit margins during the third quarter.',
    options: [
      { key: 'A', text: 'A. Even though' },
      { key: 'B', text: 'B. In spite of' },
      { key: 'C', text: 'C. Because' },
      { key: 'D', text: 'D. Whereas' }
    ],
    correctAnswer: 'B',
    sentenceTranslationVi: 'Bất chấp sự gia tăng bất ngờ về chi phí nguyên vật liệu thô, Công ty Sản xuất Apex vẫn duy trì được biên lợi nhuận vững chắc trong quý 3.',
    explanationVi: 'Phía sau chỗ trống là một cụm danh từ "the unexpected surge in raw material costs", do đó cần một giới từ như "In spite of" hoặc "Despite" chứ không dùng liên từ có mệnh đề "Even though".',
    grammarRuleVi: 'In spite of / Despite + Noun/V-ing; Even though / Although + S + V',
    trapType: 'Conjunction vs Preposition Trap',
  },
  {
    id: 'r-p5-adv-04',
    part: 5,
    phase: 'mock_exam',
    category: 'Từ vựng: Trạng từ nhấn mạnh mức độ hoàn toàn (Degree Adverbs)',
    questionText: 'The newly recruited human resources director is ------- familiar with international employment labor regulations.',
    options: [
      { key: 'A', text: 'A. thoroughly' },
      { key: 'B', text: 'B. thoroughlyness' },
      { key: 'C', text: 'C. thorough' },
      { key: 'D', text: 'D. more thorough' }
    ],
    correctAnswer: 'A',
    sentenceTranslationVi: 'Giám đốc nhân sự mới được tuyển dụng rất am hiểu thấu đáo về các quy định luật lao động quốc tế.',
    explanationVi: 'Vị trí giữa to-be ("is") và tính từ ("familiar") cần một trạng từ ("thoroughly") để bổ nghĩa cho tính từ.',
    grammarRuleVi: 'Be + Adverb + Adjective',
    trapType: 'Word Form Trap',
  },
  {
    id: 'r-p6-adv-01',
    part: 6,
    phase: 'mock_exam',
    category: 'Part 6: Điền từ vào Thông báo Sáp nhập Doanh nghiệp (Corporate Memo)',
    passageTitle: 'INTERNAL MEMORANDUM: CORPORATE RESTRUCTURING UPDATE',
    passageType: 'Memo',
    passage: `To: All Staff Members
From: Executive Committee, Crestview Holdings
Date: November 15, 2026
Subject: Completion of Strategic Merger

We are pleased to announce that Crestview Holdings has successfully finalized its strategic acquisition of Nexa Logistics. This partnership will allow us to expand our distribution network across Southeast Asia.

------- [Q1]. Consequently, our operational capacity will increase by an estimated 40 percent before the end of the fiscal year.

All current employees will retain their positions without disruption. Human Resources will conduct informational webinars next Tuesday to address questions regarding employee benefits.`,
    questionText: 'Which sentence best fits into the passage at [Q1]?',
    options: [
      { key: 'A', text: 'A. All travel reimbursement requests must be submitted by Friday afternoon.' },
      { key: 'B', text: 'B. By integrating Nexa\'s automated fulfillment centers, we can streamline cargo handling.' },
      { key: 'C', text: 'C. The annual company banquet has been relocated to the downtown convention hall.' },
      { key: 'D', text: 'D. Nexa Logistics was founded twenty years ago as a small local courier.' }
    ],
    correctAnswer: 'B',
    sentenceTranslationVi: 'Bằng cách tích hợp các trung tâm xử lý đơn hàng tự động của Nexa, chúng ta có thể tối ưu hóa quy trình vận chuyển hàng hóa.',
    explanationVi: 'Câu B kết nối logic hoàn hảo giữa việc mở rộng mạng lưới phân phối ở câu trước với kết quả "công suất vận hành tăng 40%" ở câu tiếp theo.',
    trapType: 'Sentence Insertion Context Trap',
  },
  {
    id: 'r-p7-adv-01',
    part: 7,
    phase: 'mock_exam',
    category: 'Part 7: Đọc hiểu Bài đọc kép (Double Passage) - Email & Báo giá Hợp đồng IT',
    passageTitle: 'DOCUMENT 1: EMAIL INQUIRY & DOCUMENT 2: SERVICE ESTIMATE',
    passageType: 'Email',
    passage: `[DOCUMENT 1: EMAIL INQUIRY]
From: Marcus Vance (mvance@vancearchitects.com)
To: Sales Department, CloudCore Solutions (sales@cloudcore.io)
Date: October 10, 2026
Subject: Enterprise Cloud Migration Quote

Dear CloudCore Team,
Our architecture firm has 45 workstation users currently storing CAD designs on local servers. We need to migrate all files to a secure cloud platform with real-time file versioning and automated daily off-site backups. We need the transition completed prior to December 1. Could you send an itemized estimate?
Sincerely, Marcus Vance

----------------------------------------------------------------------
[DOCUMENT 2: ITEMISED SERVICE ESTIMATE - CLOUDCORE SOLUTIONS]
Estimate #: CC-8924 | Date: October 12, 2026 | Prepared for: Vance Architects
- Cloud Storage Tier 3 (Up to 10 TB encrypted): $450/month
- User Licenses (45 user accounts @ $15/user): $675/month
- Initial Data Migration & Setup Assistance: $1,200 (One-time fee)
- Expedited 14-day Deployment Guarantee: $400 (Optional)
*Special Promotional Term: Clients signing a 24-month service commitment receive a 10% discount on monthly recurring charges.`,
    questionText: 'According to both documents, how much would Vance Architects pay each month if they commit to a 24-month agreement?',
    options: [
      { key: 'A', text: 'A. $1,012.50' },
      { key: 'B', text: 'B. $1,125.00' },
      { key: 'C', text: 'C. $950.00' },
      { key: 'D', text: 'D. $1,200.00' }
    ],
    correctAnswer: 'A',
    sentenceTranslationVi: 'Theo cả hai tài liệu, Vance Architects sẽ phải trả bao nhiêu tiền mỗi tháng nếu ký cam kết hợp đồng 24 tháng? -> $1,012.50/tháng (Tổng $450 + $675 = $1,125, giảm 10% còn $1,012.50).',
    explanationVi: 'Đây là dạng câu hỏi liên kết hai văn bản (Cross-document inference): Tổng phí định kỳ hàng tháng là $450 (Storage) + $675 (Licenses) = $1,125. Khi ký hợp đồng 24 tháng được giảm 10% của $1,125 = giảm $112.50 -> Số tiền hàng tháng là $1,012.50.',
    trapType: 'Cross-document Calculation Trap',
  },
  {
    id: 'r-p7-adv-02',
    part: 7,
    phase: 'mock_exam',
    category: 'Part 7: Đọc hiểu Bài đọc kép - Yêu cầu thời hạn dự án',
    passageTitle: 'DOCUMENT 1 & 2 (REFER TO EMAIL CC-8924)',
    passageType: 'Email',
    passage: `Refer to the email and service estimate from CloudCore Solutions above.`,
    questionText: 'Why might Vance Architects choose to include the optional $400 fee in their project?',
    options: [
      { key: 'A', text: 'A. To ensure the transition finishes before their December 1 deadline' },
      { key: 'B', text: 'B. To upgrade their storage capacity to unlimited bandwidth' },
      { key: 'C', text: 'C. To obtain onsite weekend technical support training' },
      { key: 'D', text: 'D. To purchase custom computer hardware workstations' }
    ],
    correctAnswer: 'A',
    sentenceTranslationVi: 'Tại sao Vance Architects có thể chọn thêm khoản phí tùy chọn $400 vào dự án? -> Để đảm bảo quá trình chuyển đổi hoàn tất trước thời hạn ngày 1 tháng 12 của họ.',
    explanationVi: 'Trong Email, ông Marcus Vance nhấn mạnh: "We need the transition completed prior to December 1". Ở Báo giá, khoản phí $400 tùy chọn là "Expedited 14-day Deployment Guarantee" (Cam kết triển khai nhanh trong 14 ngày).',
    trapType: 'Cross-document Paraphrasing Trap',
  }
];

// Combined Question Pools for the 3 distinct exams:
export const TOEIC_DIAGNOSTIC_LR_QUESTIONS: (ListeningQuestion | ReadingQuestion)[] = [
  ...TOEIC_LISTENING_QUESTIONS.map(q => ({ ...q, skill: 'listening' as const })),
  ...TOEIC_READING_QUESTIONS.map(q => ({ ...q, skill: 'reading' as const }))
];

export const TOEIC_ADVANCED_LR_QUESTIONS: (ListeningQuestion | ReadingQuestion)[] = [
  ...TOEIC_DIAGNOSTIC_LR_QUESTIONS,
  ...TOEIC_ADVANCED_LISTENING_ADDITIONS.map(q => ({ ...q, skill: 'listening' as const })),
  ...TOEIC_ADVANCED_READING_ADDITIONS.map(q => ({ ...q, skill: 'reading' as const }))
];

// -------------------------------------------------------------
// 3. FULL MOCK EXAM SETS (ETS STANDARD TIMED SIMULATION)
// -------------------------------------------------------------
export interface MockExamMetadata {
  id: string;
  name: string;
  type: 'mini_test' | 'full_test_lr' | 'full_test_sw';
  durationMinutes: number;
  totalQuestions: number;
  targetBand: string;
  descriptionVi: string;
  formatBadge: string;
  skillsFocus: string;
  features: string[];
}

export const MOCK_EXAM_LIST: MockExamMetadata[] = [
  {
    id: 'mock-lr-mini-01',
    name: 'ETS Quick Check 16 (Mini Mock Exam LR)',
    type: 'mini_test',
    durationMinutes: 20,
    totalQuestions: 16,
    targetBand: 'Chẩn đoán 450 - 750+',
    descriptionVi: 'Bộ đề thi rút gọn 16 câu bao quát đủ 7 Part của bài thi Listening & Reading, giúp kiểm tra nhanh trình độ và phát hiện lỗ hổng kiến thức trong 20 phút.',
    formatBadge: '⚡ ĐỀ RÚT GỌN 20 PHÚT',
    skillsFocus: 'Nghe & Đọc (Trắc nghiệm)',
    features: ['16 câu trắc nghiệm 7 Part', 'Audio phát âm giọng chuẩn ETS', 'Chẩn đoán nhanh Band điểm 10-990']
  },
  {
    id: 'mock-lr-full-01',
    name: 'ETS Actual Test 2026 - Test 01 (Thực Chiến 30 Câu Nâng Cao)',
    type: 'full_test_lr',
    durationMinutes: 45,
    totalQuestions: 30,
    targetBand: 'Mục tiêu 800 - 990',
    descriptionVi: 'Đề thi thực chiến chuyên sâu 30 câu Listening & Reading với bẫy gián tiếp Part 2, hội thoại 3 người Part 3, đảo ngữ Part 5 và bài đọc kép Part 7 chuẩn ETS.',
    formatBadge: '🎯 ĐỀ NÂNG CAO 45 PHÚT',
    skillsFocus: 'Nghe & Đọc Chuyên Sâu (Trắc nghiệm)',
    features: ['30 câu chuyên sâu chuẩn format ETS', 'Bẫy đảo ngữ & Collocation thương mại', 'Bài đọc kép Double Passage email & hóa đơn']
  },
  {
    id: 'mock-sw-full-01',
    name: 'TOEIC Speaking & Writing Real Simulator - Test 01',
    type: 'full_test_sw',
    durationMinutes: 80,
    totalQuestions: 19,
    targetBand: 'Mục tiêu 350 - 400 SW',
    descriptionVi: 'Mô phỏng trọn vẹn 11 câu hỏi Speaking (20 phút) và 8 câu hỏi Writing (60 phút). Có ghi âm giọng nói, hỗ trợ đọc mẫu và chấm điểm tự động bằng AI theo rubric chính thức của ETS.',
    formatBadge: '🎙️ & ✍️ NÓI & VIẾT 80 PHÚT',
    skillsFocus: 'Nói & Viết (Ghi âm & Soạn thảo)',
    features: ['11 câu Speaking thu âm giọng nói', '8 câu Writing soạn email & viết luận', 'Chấm điểm phát âm & ngữ pháp AI thời gian thực']
  },
];

// -------------------------------------------------------------
// 4. TOEIC SPEAKING & WRITING FULL SIMULATOR QUESTIONS (19 QUESTIONS)
// -------------------------------------------------------------
export interface SWExamQuestion {
  id: string;
  skill: 'speaking' | 'writing';
  part: number; // 1 to 5 for Speaking; 1 to 3 for Writing
  questionNumber: number; // 1 to 19 (Q1-11 Speaking, Q12-19 Writing)
  title: string;
  sectionTitleVi: string;
  instructionsVi: string;
  promptText: string;
  contextVi?: string;
  imageType?: string; // photo illustration key
  audioPrompt?: string;
  prepTimeSeconds?: number;
  responseTimeSeconds?: number;
  timeLimitMinutes?: number;
  requiredWords?: string[]; // for Writing Q1-5
  sampleAnswer: string;
  sampleAnswerVi: string;
  scoringCriteria: string;
  keyVocabulary?: { word: string; ipa: string; meaningVi: string }[];
}

export const TOEIC_SW_QUESTIONS: SWExamQuestion[] = [
  // --- PART 1: READ A TEXT ALOUD (Q1 - 2) ---
  {
    id: 'sw-q1',
    skill: 'speaking',
    part: 1,
    questionNumber: 1,
    title: 'Speaking Q1: Read a text aloud (Thông báo sân bay)',
    sectionTitleVi: 'Part 1: Đọc to đoạn văn (Read a Text Aloud)',
    instructionsVi: 'Bạn có 45 giây để chuẩn bị và 45 giây để đọc to đoạn văn sau. Hãy chú ý phát âm chuẩn IPA, ngắt nghỉ đúng nhịp và lên xuống giọng tự nhiên.',
    prepTimeSeconds: 45,
    responseTimeSeconds: 45,
    promptText: 'Attention passengers on Flight 842 to Chicago. Due to severe weather conditions in the Midwest area, our departure time has been rescheduled to 4:30 PM. Please proceed to Gate 14 and present your boarding pass to our ground representatives. We sincerely apologize for this unexpected delay and appreciate your patience.',
    contextVi: 'Thông báo chính thức tại sân bay về việc hoãn chuyến bay do thời tiết xấu.',
    audioPrompt: 'Attention passengers on Flight 842 to Chicago. Due to severe weather conditions in the Midwest area, our departure time has been rescheduled to 4:30 PM. Please proceed to Gate 14 and present your boarding pass to our ground representatives. We sincerely apologize for this unexpected delay and appreciate your patience.',
    sampleAnswer: 'Attention passengers on Flight 842 to Chicago. Due to severe weather conditions in the Midwest area, our departure time has been rescheduled to 4:30 PM. Please proceed to Gate 14 and present your boarding pass to our ground representatives. We sincerely apologize for this unexpected delay and appreciate your patience.',
    sampleAnswerVi: 'Xin hành khách trên chuyến bay 842 đến Chicago chú ý. Do điều kiện thời tiết xấu ở khu vực Trung Tây, giờ khởi hành đã được lùi lại đến 4 giờ 30 chiều. Vui lòng di chuyển đến Cửa số 14 và xuất trình thẻ lên máy bay cho đại diện mặt đất của chúng tôi. Chúng tôi thành thật xin lỗi vì sự chậm trễ này.',
    scoringCriteria: 'Phát âm (Pronunciation): Rõ ràng âm đuôi /s/, /d/, /t/. Ngữ điệu (Intonation): Xuống giọng ở cuối câu khẳng định; lên giọng ở danh sách liệt kê.',
    keyVocabulary: [
      { word: 'rescheduled', ipa: '/ˌriːˈskedʒ.uːld/', meaningVi: 'được đổi lịch' },
      { word: 'boarding pass', ipa: '/ˈbɔː.dɪŋ ˌpɑːs/', meaningVi: 'thẻ lên máy bay' },
      { word: 'representatives', ipa: '/ˌrep.rɪˈzen.tə.tɪvz/', meaningVi: 'đại diện viên' },
      { word: 'apologize', ipa: '/əˈpɒl.ə.dʒaɪz/', meaningVi: 'xin lỗi' },
    ],
  },
  {
    id: 'sw-q2',
    skill: 'speaking',
    part: 1,
    questionNumber: 2,
    title: 'Speaking Q2: Read a text aloud (Quảng cáo khuyến mãi siêu thị)',
    sectionTitleVi: 'Part 1: Đọc to đoạn văn (Read a Text Aloud)',
    instructionsVi: 'Đọc to thông báo quảng cáo sau với giọng điệu hào hứng, thân thiện và rõ ràng.',
    prepTimeSeconds: 45,
    responseTimeSeconds: 45,
    promptText: 'Welcome to Apex Electronics! To celebrate our fifth anniversary, we are offering extraordinary discounts on laptops, smart televisions, and audio systems. Visit our customer service counter today to register for our loyalty membership and receive an additional ten percent discount coupon. Hurry while supplies last!',
    contextVi: 'Thông báo quảng cáo sự kiện tri ân kỷ niệm 5 năm thành lập tại cửa hàng điện máy.',
    audioPrompt: 'Welcome to Apex Electronics! To celebrate our fifth anniversary, we are offering extraordinary discounts on laptops, smart televisions, and audio systems. Visit our customer service counter today to register for our loyalty membership and receive an additional ten percent discount coupon. Hurry while supplies last!',
    sampleAnswer: 'Welcome to Apex Electronics! To celebrate our fifth anniversary, we are offering extraordinary discounts on laptops, smart televisions, and audio systems. Visit our customer service counter today to register for our loyalty membership and receive an additional ten percent discount coupon. Hurry while supplies last!',
    sampleAnswerVi: 'Chào mừng quý khách đến với Siêu thị Điện máy Apex! Để kỷ niệm 5 năm thành lập, chúng tôi mang đến những ưu đãi đặc biệt cho máy tính xách tay, tivi thông minh và hệ thống âm thanh. Hãy ghé quầy dịch vụ khách hàng ngay hôm nay để đăng ký thẻ thành viên và nhận thêm phiếu giảm giá 10%. Số lượng có hạn!',
    scoringCriteria: 'Nhấn trọng âm từ đúng: extraordinary /ɪkˈstrɔː.dɪn.ər.i/, anniversary /ˌæn.ɪˈvɜː.sər.i/. Lên giọng ở "laptops", "smart televisions", và xuống giọng ở "audio systems".',
    keyVocabulary: [
      { word: 'anniversary', ipa: '/ˌæn.ɪˈvɜː.sər.i/', meaningVi: 'kỷ niệm ngày thành lập' },
      { word: 'extraordinary', ipa: '/ɪkˈstrɔː.dɪn.ər.i/', meaningVi: 'đặc biệt, phi thường' },
      { word: 'membership', ipa: '/ˈmem.bə.ʃɪp/', meaningVi: 'tư cách thành viên' },
    ],
  },

  // --- PART 2: DESCRIBE A PICTURE (Q3 - 4) ---
  {
    id: 'sw-q3',
    skill: 'speaking',
    part: 2,
    questionNumber: 3,
    title: 'Speaking Q3: Describe a picture (Outdoor Café)',
    sectionTitleVi: 'Part 2: Miêu tả bức tranh (Describe a Picture)',
    instructionsVi: 'Quan sát bức tranh bên dưới. Bạn có 45 giây để chuẩn bị và 30 giây để miêu tả chi tiết bức tranh.',
    imageType: 'cafe-patio',
    prepTimeSeconds: 45,
    responseTimeSeconds: 30,
    promptText: 'Directions: In this part of the test, you will describe the picture on your screen in as much detail as you can. You will have 45 seconds to prepare your response. Then you will have 30 seconds to speak about the picture.',
    contextVi: 'Quán cà phê ngoài trời với ô che nắng, bàn ghế gỗ, phục vụ mang khay và khách ngồi thưởng thức.',
    sampleAnswer: 'This picture was taken at an outdoor café on a bright sunny day. In the center, there are several wooden tables arranged under large green umbrellas. A male waiter wearing a black apron is carrying a silver tray with cups of coffee toward a couple sitting on the left. In the background, pedestrians are walking along the cobblestone sidewalk, and lush trees provide a peaceful atmosphere.',
    sampleAnswerVi: 'Bức tranh được chụp tại một quán cà phê ngoài trời vào một ngày nắng đẹp. Ở trung tâm, có nhiều bàn gỗ được xếp dưới những chiếc ô lớn. Người phục vụ mặc tạp dề đen đang bưng khay cà phê về phía cặp đôi ngồi bên trái. Phía sau, người đi bộ đang rảo bước và tán cây xanh tạo không khí yên bình.',
    scoringCriteria: 'Bố cục miêu tả: Tổng quan (Where) -> Chi tiết trọng tâm (Center/Foreground) -> Hậu cảnh (Background) -> Đánh giá cảm xúc (Impression).',
  },
  {
    id: 'sw-q4',
    skill: 'speaking',
    part: 2,
    questionNumber: 4,
    title: 'Speaking Q4: Describe a picture (Corporate Meeting)',
    sectionTitleVi: 'Part 2: Miêu tả bức tranh (Describe a Picture)',
    instructionsVi: 'Quan sát bức tranh phòng họp. Bạn có 45 giây để chuẩn bị và 30 giây để miêu tả chi tiết bức tranh.',
    imageType: 'boardroom-meeting',
    prepTimeSeconds: 45,
    responseTimeSeconds: 30,
    promptText: 'Directions: Describe the picture on your screen in as much detail as you can. Describe the participants, their attire, their postures, and the equipment in the room.',
    contextVi: 'Phòng họp hội đồng quản trị: Người thuyết trình đang chỉ vào biểu đồ doanh thu trên màn hình kỹ thuật số.',
    sampleAnswer: 'This image captures a business meeting taking place in a modern conference room. On the left, a professional woman in a navy blazer is standing beside a digital display, pointing to a revenue growth chart. Around the conference table, four executives are attentively listening, with open laptops and notepads in front of them. The room is well-lit with glass walls, conveying a collaborative and productive corporate environment.',
    sampleAnswerVi: 'Hình ảnh ghi lại buổi họp doanh nghiệp trong phòng họp hiện đại. Bên trái, một phụ nữ mặc áo vest đang chỉ vào biểu đồ tăng trưởng doanh thu. Xung quanh bàn, 4 cộng sự đang chăm chú theo dõi với laptop mở sẵn.',
    scoringCriteria: 'Sử dụng thì Hiện tại Tiếp diễn chính xác (is standing, pointing, listening) và từ vựng công sở chuyên nghiệp (executives, conference table, digital display).',
  },

  // --- PART 3: RESPOND TO QUESTIONS (Q5 - 7) ---
  {
    id: 'sw-q5',
    skill: 'speaking',
    part: 3,
    questionNumber: 5,
    title: 'Speaking Q5: Phone Interview - Online Shopping Habits',
    sectionTitleVi: 'Part 3: Trả lời câu hỏi phỏng vấn nhanh (Respond to Questions)',
    instructionsVi: 'Tình huống: Bạn đang tham gia khảo sát qua điện thoại về thói quen mua sắm trực tuyến. Bạn có 15 giây để trả lời câu hỏi.',
    prepTimeSeconds: 3,
    responseTimeSeconds: 15,
    promptText: 'How often do you shop online for clothes or accessories, and what is your favorite shopping app?',
    audioPrompt: 'How often do you shop online for clothes or accessories, and what is your favorite shopping app?',
    sampleAnswer: 'I usually shop online for clothes about once or twice a month, and my favorite platform is Shopee because it offers fast shipping and convenient return policies.',
    sampleAnswerVi: 'Tôi thường mua sắm quần áo trực tuyến khoảng 1 đến 2 lần một tháng, và ứng dụng yêu thích của tôi là Shopee vì nó giao hàng nhanh và chính sách đổi trả thuận tiện.',
    scoringCriteria: 'Trả lời trực diện cả 2 vế của câu hỏi (Tần suất + Ứng dụng yêu thích) trong vòng 15 giây mà không bị ngập ngừng.',
  },
  {
    id: 'sw-q6',
    skill: 'speaking',
    part: 3,
    questionNumber: 6,
    title: 'Speaking Q6: Factors when buying electronics',
    sectionTitleVi: 'Part 3: Trả lời câu hỏi phỏng vấn nhanh (Respond to Questions)',
    instructionsVi: 'Bạn có 15 giây để trả lời câu hỏi sau.',
    prepTimeSeconds: 3,
    responseTimeSeconds: 15,
    promptText: 'When purchasing electronic devices like smartphones or laptops, what factor is most important to you: price, brand reputation, or warranty service?',
    audioPrompt: 'When purchasing electronic devices like smartphones or laptops, what factor is most important to you: price, brand reputation, or warranty service?',
    sampleAnswer: 'For me, warranty service is the most crucial factor because electronic devices can malfunction unexpectedly, so reliable technical support gives me peace of mind.',
    sampleAnswerVi: 'Đối với tôi, dịch vụ bảo hành là quan trọng nhất vì đồ điện tử có thể gặp sự cố bất ngờ, nên chế độ hỗ trợ kỹ thuật đáng tin cậy giúp tôi an tâm nhất.',
    scoringCriteria: 'Chọn rõ ràng 1 trong 3 yếu tố và đưa ra 1 lý do giải thích thuyết phục trong 15 giây.',
  },
  {
    id: 'sw-q7',
    skill: 'speaking',
    part: 3,
    questionNumber: 7,
    title: 'Speaking Q7: Future of Traditional Retail Stores',
    sectionTitleVi: 'Part 3: Trả lời câu hỏi phỏng vấn nhanh (Respond to Questions)',
    instructionsVi: 'Bạn có 30 giây để đưa ra quan điểm và giải thích chi tiết cho câu hỏi sau.',
    prepTimeSeconds: 3,
    responseTimeSeconds: 30,
    promptText: 'Do you believe physical retail stores will completely disappear in the future because of e-commerce? Why or why not?',
    audioPrompt: 'Do you believe physical retail stores will completely disappear in the future because of e-commerce? Why or why not?',
    sampleAnswer: 'No, I don’t believe physical stores will disappear entirely. Although e-commerce is extremely convenient, many consumers still prefer seeing, touching, and trying on products before purchasing, especially for clothing and luxury items. Furthermore, shopping in malls is also a popular social and recreational activity that online platforms cannot fully replace.',
    sampleAnswerVi: 'Không, tôi không nghĩ cửa hàng truyền thống sẽ biến mất hoàn toàn. Dù thương mại điện tử rất tiện lợi, nhiều người vẫn muốn sờ tận tay và thử đồ trước khi mua. Thêm vào đó, đi mua sắm tại trung tâm thương mại còn là hoạt động giải trí kết nối bạn bè mà online không thể thay thế.',
    scoringCriteria: 'Cấu trúc câu trả lời 30 giây: Câu chủ đề khẳng định quan điểm -> Luận điểm 1 (Trải nghiệm thực tế) -> Luận điểm 2 (Yếu tố xã hội) -> Kết luận ngắn.',
  },

  // --- PART 4: RESPOND USING INFORMATION PROVIDED (Q8 - 10) ---
  {
    id: 'sw-q8',
    skill: 'speaking',
    part: 4,
    questionNumber: 8,
    title: 'Speaking Q8: Conference Schedule Inquiry (Keynote start time)',
    sectionTitleVi: 'Part 4: Trả lời câu hỏi dựa trên tài liệu cho sẵn (Respond using Information)',
    instructionsVi: 'Đọc kỹ lịch trình Hội nghị Công nghệ Toàn cầu bên dưới và trả lời thắc mắc của người gọi trong 15 giây.',
    prepTimeSeconds: 45,
    responseTimeSeconds: 15,
    promptText: 'Global Tech Summit 2026 Schedule:\n• 09:00 AM - 10:30 AM: Keynote Address by Dr. Angela Harris (Auditorium A)\n• 10:45 AM - 12:00 PM: Panel Discussion: AI in Healthcare (Room 201)\n• 12:00 PM - 01:30 PM: Networking Lunch (Grand Ballroom)\n• 01:45 PM - 03:15 PM: Workshop: Cloud Security (Room 305)\n• 03:30 PM - 05:00 PM: Product Showcase & Closing (Exhibition Hall)\n\nQuestion: "Hi, I will be arriving around 9:00 AM. Could you tell me who the keynote speaker is and where the presentation will take place?"',
    audioPrompt: 'Hi, I will be arriving around 9:00 AM. Could you tell me who the keynote speaker is and where the presentation will take place?',
    sampleAnswer: 'The keynote address will be delivered by Dr. Angela Harris, and it will take place in Auditorium A from 9:00 AM to 10:30 AM.',
    sampleAnswerVi: 'Bài phát biểu khai mạc sẽ do Tiến sĩ Angela Harris trình bày, diễn ra tại Hội trường A từ 9:00 đến 10:30 sáng.',
    scoringCriteria: 'Cung cấp chính xác thông tin: Tên diễn giả (Dr. Angela Harris) và địa điểm (Auditorium A).',
  },
  {
    id: 'sw-q9',
    skill: 'speaking',
    part: 4,
    questionNumber: 9,
    title: 'Speaking Q9: Conference Schedule Inquiry (Fact Checking)',
    sectionTitleVi: 'Part 4: Trả lời câu hỏi dựa trên tài liệu cho sẵn (Respond using Information)',
    instructionsVi: 'Người gọi có thông tin sai lệch về giờ ăn trưa. Hãy đính chính lịch trình cho họ trong 15 giây.',
    prepTimeSeconds: 3,
    responseTimeSeconds: 15,
    promptText: 'Question: "I heard from a colleague that the networking lunch starts at 1:00 PM. Is that correct?"',
    audioPrompt: 'I heard from a colleague that the networking lunch starts at 1:00 PM. Is that correct?',
    sampleAnswer: 'Actually, no. The networking lunch is scheduled from 12:00 PM to 1:30 PM in the Grand Ballroom, so it starts at 12:00 PM, not 1:00 PM.',
    sampleAnswerVi: 'Thực ra không phải vậy. Bữa trưa kết nối được sắp xếp từ 12:00 đến 1:30 chiều tại Grand Ballroom, do đó nó bắt đầu lúc 12:00 chứ không phải 1:00.',
    scoringCriteria: 'Đính chính lịch sự ("Actually, no...") và nêu rõ thời gian chính xác (12:00 PM to 1:30 PM).',
  },
  {
    id: 'sw-q10',
    skill: 'speaking',
    part: 4,
    questionNumber: 10,
    title: 'Speaking Q10: Conference Schedule Inquiry (Afternoon sessions)',
    sectionTitleVi: 'Part 4: Trả lời câu hỏi dựa trên tài liệu cho sẵn (Respond using Information)',
    instructionsVi: 'Liệt kê đầy đủ tất cả các hoạt động diễn ra trong buổi chiều sau giờ nghỉ trưa trong 30 giây.',
    prepTimeSeconds: 3,
    responseTimeSeconds: 30,
    promptText: 'Question: "I can only attend the afternoon sessions after lunch. Could you give me the full details of all the activities scheduled for the afternoon?"',
    audioPrompt: 'I can only attend the afternoon sessions after lunch. Could you give me the full details of all the activities scheduled for the afternoon?',
    sampleAnswer: 'Certainly! There are two sessions scheduled for the afternoon. First, from 1:45 PM to 3:15 PM, there is a workshop on Cloud Security in Room 305. Following that, from 3:30 PM to 5:00 PM, you can attend the Product Showcase and Closing Ceremony in the Exhibition Hall.',
    sampleAnswerVi: 'Chắc chắn rồi! Có 2 phiên diễn ra vào buổi chiều. Đầu tiên từ 1:45 đến 3:15 chiều là hội thảo Bảo mật đám mây tại Phòng 305. Tiếp theo từ 3:30 đến 5:00 chiều là Triển lãm giới thiệu sản phẩm và Lễ bế mạc tại Nhà triển lãm.',
    scoringCriteria: 'Sử dụng từ nối chuyển ý mượt mà (First, Following that, Finally) và liệt kê đủ 2 phiên chiều kèm giờ và phòng.',
  },

  // --- PART 5: EXPRESS AN OPINION (Q11) ---
  {
    id: 'sw-q11',
    skill: 'speaking',
    part: 5,
    questionNumber: 11,
    title: 'Speaking Q11: Express an Opinion (Remote Work Policy)',
    sectionTitleVi: 'Part 5: Trình bày quan điểm cá nhân (Express an Opinion)',
    instructionsVi: 'Bạn có 45 giây để chuẩn bị và 60 giây để trình bày bài nói thể hiện quan điểm của mình với đầy đủ dẫn chứng và lý lẽ.',
    prepTimeSeconds: 45,
    responseTimeSeconds: 60,
    promptText: 'Do you agree or disagree with the following statement: "Companies should allow employees to work remotely from home at least two days a week." Explain why, using specific reasons and examples to support your view.',
    audioPrompt: 'Do you agree or disagree with the following statement: Companies should allow employees to work remotely from home at least two days a week. Explain why, using specific reasons and examples to support your view.',
    sampleAnswer: 'I strongly agree with the idea that companies should allow employees to work remotely at least two days a week. There are two main reasons for my opinion. First, remote work significantly boosts employee productivity and work-life balance. By eliminating stressful daily commutes, workers save up to two hours every day, allowing them to start work feeling refreshed and well-rested. Second, flexible working arrangements enhance job satisfaction and reduce staff turnover. For example, in my previous company, when management introduced hybrid work, team morale soared and retention rates improved by twenty percent. Therefore, offering a hybrid schedule is a win-win strategy for both employers and staff.',
    sampleAnswerVi: 'Tôi hoàn toàn đồng ý rằng các công ty nên cho phép nhân viên làm việc từ xa ít nhất 2 ngày một tuần. Thứ nhất, nó gia tăng năng suất và cân bằng công việc - cuộc sống nhờ giảm thiểu thời gian di chuyển kẹt xe. Thứ hai, sự linh hoạt giúp tăng mức độ gắn bó của nhân viên. Ví dụ ở công ty cũ của tôi, tỷ lệ giữ chân nhân sự tăng 20% khi áp dụng làm việc hybrid.',
    scoringCriteria: 'Cấu trúc bài nói 60 giây chuẩn TOEIC Speaking Level 8: Khẳng định quan điểm (10s) -> Lý do 1 kèm dẫn chứng (20s) -> Lý do 2 kèm ví dụ thực tế (20s) -> Kết luận khẳng định lại (10s).',
  },

  // --- WRITING PART 1: WRITE A SENTENCE BASED ON A PICTURE (Q12 - 16) ---
  {
    id: 'sw-q12',
    skill: 'writing',
    part: 1,
    questionNumber: 12,
    title: 'Writing Q1: Sentence based on picture (Construction Site)',
    sectionTitleVi: 'Part 1: Viết một câu dựa trên bức tranh và 2 từ khóa',
    instructionsVi: 'Quan sát bức tranh bên dưới và viết MỘT câu hoàn chỉnh đúng ngữ pháp sử dụng 2 từ khóa cho sẵn.',
    timeLimitMinutes: 2,
    imageType: 'construction-workers',
    requiredWords: ['workers', 'wear'],
    promptText: 'Directions: Write ONE sentence that is based on the picture. You must use the two words provided below: workers, wear. You can change the forms of the words.',
    contextVi: 'Công trường xây dựng với các công nhân mặc áo phản quang và đội mũ bảo hộ vàng.',
    sampleAnswer: 'The construction workers are wearing yellow safety helmets while inspecting the building blueprints.',
    sampleAnswerVi: 'Các công nhân xây dựng đang đội mũ bảo hộ màu vàng trong khi kiểm tra bản thiết kế tòa nhà.',
    scoringCriteria: 'Đúng ngữ pháp, sử dụng đủ 2 từ "workers" và "wear", nội dung miêu tả sát với bối cảnh tranh.',
  },
  {
    id: 'sw-q13',
    skill: 'writing',
    part: 1,
    questionNumber: 13,
    title: 'Writing Q2: Sentence based on picture (Airport Check-in)',
    sectionTitleVi: 'Part 1: Viết một câu dựa trên bức tranh và 2 từ khóa',
    instructionsVi: 'Quan sát bức tranh bên dưới và viết MỘT câu hoàn chỉnh sử dụng 2 từ khóa cho sẵn.',
    timeLimitMinutes: 2,
    imageType: 'airport-checkin',
    requiredWords: ['passenger', 'because'],
    promptText: 'Directions: Write ONE sentence that is based on the picture. You must use the two words provided below: passenger, because.',
    contextVi: 'Quầy làm thủ tục tại sân bay quốc tế.',
    sampleAnswer: 'The passenger is handing over her passport to the agent because she is checking in for her international flight.',
    sampleAnswerVi: 'Nữ hành khách đang đưa hộ chiếu cho nhân viên vì cô ấy đang làm thủ tục cho chuyến bay quốc tế của mình.',
    scoringCriteria: 'Sử dụng liên từ "because" để kết nối 2 mệnh đề độc lập chuẩn ngữ pháp (S + V because S + V).',
  },
  {
    id: 'sw-q14',
    skill: 'writing',
    part: 1,
    questionNumber: 14,
    title: 'Writing Q3: Sentence based on picture (Delivery Truck)',
    sectionTitleVi: 'Part 1: Viết một câu dựa trên bức tranh và 2 từ khóa',
    instructionsVi: 'Quan sát bức tranh bên dưới và viết MỘT câu hoàn chỉnh sử dụng 2 từ khóa cho sẵn.',
    timeLimitMinutes: 2,
    imageType: 'delivery-truck',
    requiredWords: ['truck', 'in front of'],
    promptText: 'Directions: Write ONE sentence that is based on the picture. You must use the two words provided below: truck, in front of.',
    contextVi: 'Xe chở hàng đỗ ở lề đường trước cổng trụ sở công ty.',
    sampleAnswer: 'A delivery truck is parked directly in front of the office building while packages are being unloaded.',
    sampleAnswerVi: 'Một chiếc xe tải giao hàng đang đỗ ngay trước tòa nhà văn phòng trong khi các kiện hàng đang được dỡ xuống.',
    scoringCriteria: 'Sử dụng cụm giới từ "in front of" và danh từ "truck" chính xác.',
  },
  {
    id: 'sw-q15',
    skill: 'writing',
    part: 1,
    questionNumber: 15,
    title: 'Writing Q4: Sentence based on picture (Laboratory Research)',
    sectionTitleVi: 'Part 1: Viết một câu dựa trên bức tranh và 2 từ khóa',
    instructionsVi: 'Quan sát bức tranh bên dưới và viết MỘT câu hoàn chỉnh sử dụng 2 từ khóa cho sẵn.',
    timeLimitMinutes: 2,
    imageType: 'laboratory-research',
    requiredWords: ['research', 'carefully'],
    promptText: 'Directions: Write ONE sentence that is based on the picture. You must use the two words provided below: research, carefully.',
    contextVi: 'Phòng nghiên cứu dược phẩm công nghệ cao.',
    sampleAnswer: 'The scientists are conducting scientific research carefully by analyzing chemical samples under the microscope.',
    sampleAnswerVi: 'Các nhà khoa học đang tiến hành nghiên cứu khoa học một cách cẩn thận bằng cách phân tích các mẫu hóa chất dưới kính hiển vi.',
    scoringCriteria: 'Vị trí trạng từ "carefully" đứng sau cụm động từ "conducting scientific research" hoặc ở cuối mệnh đề.',
  },
  {
    id: 'sw-q16',
    skill: 'writing',
    part: 1,
    questionNumber: 16,
    title: 'Writing Q5: Sentence based on picture (Contract Signing)',
    sectionTitleVi: 'Part 1: Viết một câu dựa trên bức tranh và 2 từ khóa',
    instructionsVi: 'Quan sát bức tranh bên dưới và viết MỘT câu hoàn chỉnh sử dụng 2 từ khóa cho sẵn.',
    timeLimitMinutes: 2,
    imageType: 'contract-discussion',
    requiredWords: ['discuss', 'before'],
    promptText: 'Directions: Write ONE sentence that is based on the picture. You must use the two words provided below: discuss, before.',
    contextVi: 'Bàn làm việc pháp lý với tài liệu hợp đồng và bút ký.',
    sampleAnswer: 'Both corporate executives are discussing the contract terms thoroughly before signing the final legal agreement.',
    sampleAnswerVi: 'Cả hai giám đốc điều hành đang thảo luận kỹ lưỡng các điều khoản hợp đồng trước khi ký thỏa thuận pháp lý cuối cùng.',
    scoringCriteria: 'Cấu trúc "before + V-ing" hoặc "before + S + V" kết hợp với động từ "discuss".',
  },

  // --- WRITING PART 2: RESPOND TO A WRITTEN REQUEST (Q17 - 18) ---
  {
    id: 'sw-q17',
    skill: 'writing',
    part: 2,
    questionNumber: 17,
    title: 'Writing Q6: Respond to an email inquiry (Hỗ trợ đơn hàng trễ)',
    sectionTitleVi: 'Part 2: Viết email phản hồi nghiệp vụ (Respond to a Written Request)',
    instructionsVi: 'Đọc email khiếu nại của khách hàng bên dưới và viết một email phản hồi dài ít nhất 80-120 từ. Trong email phản hồi, bạn PHẢI: (1) Đưa ra lời xin lỗi chính thức, (2) Giải thích lý do đơn hàng bị trễ, (3) Đưa ra giải pháp bồi thường thỏa đáng.',
    timeLimitMinutes: 10,
    promptText: 'From: Sarah Jenkins <s.jenkins@clientmail.com>\nTo: Customer Support <support@officetech.com>\nSubject: Urgent: Order #48291 Not Received\n\nDear Support Team,\nI ordered ten ergonomic office chairs for our new branch opening two weeks ago, with guaranteed delivery by yesterday. However, the shipment has not arrived, and our grand opening is scheduled for this Friday. Could you please let me know where my order is and what you can do to resolve this issue immediately?\n\nSincerely,\nSarah Jenkins',
    contextVi: 'Khách hàng gửi thư khẩn cấp khiếu nại đơn hàng 10 ghế văn phòng chưa nhận được trước lễ khai trương.',
    sampleAnswer: 'Dear Ms. Jenkins,\n\nThank you for contacting OfficeTech Support regarding Order #48291. We sincerely apologize for the delay and any inconvenience this has caused for your upcoming branch opening.\n\nDue to unexpected logistics disruptions caused by severe weather at our regional warehouse, your shipment was temporarily held up. However, we have prioritized your order and upgraded it to express overnight courier service at no extra charge. The chairs are guaranteed to arrive at your facility tomorrow morning before 10:00 AM.\n\nFurthermore, as a token of our goodwill, we would like to offer you a 15% discount on your current invoice. Please let us know if you need any further assistance.\n\nBest regards,\nCustomer Relations Team\nOfficeTech Corporation',
    sampleAnswerVi: 'Thư phản hồi mẫu đạt điểm tối đa: Đủ 3 yêu cầu (Xin lỗi trang trọng -> Giải thích lý do thời tiết -> Nâng cấp chuyển phát nhanh hỏa tốc miễn phí & Giảm giá 15% bồi thường).',
    scoringCriteria: 'Đầy đủ 3 phần của email thương mại (Lời chào, Thân bài giải quyết đủ 3 yêu cầu đề bài, Lời kết lịch sự). Ngữ pháp và từ vựng phong phú.',
  },
  {
    id: 'sw-q18',
    skill: 'writing',
    part: 2,
    questionNumber: 18,
    title: 'Writing Q7: Respond to an internal HR memo (Di dời phòng ban)',
    sectionTitleVi: 'Part 2: Viết email phản hồi nghiệp vụ (Respond to a Written Request)',
    instructionsVi: 'Đọc thông báo của Phòng Nhân sự và viết email phản hồi dài ít nhất 80 từ. Đề cập đến: (1) Xác nhận sự đồng thuận, (2) Đặt 2 câu hỏi về thời gian biểu đóng gói và vị trí chỗ ngồi mới.',
    timeLimitMinutes: 10,
    promptText: 'From: Human Resources Department <hr@corporate.com>\nTo: Marketing Team\nSubject: Department Relocation to 8th Floor\n\nDear Marketing Colleagues,\nAs our company expands, the Marketing Department will be moving to the newly renovated 8th floor at the end of this month. Please review your departmental equipment and let us know your requirements or questions before next Monday.\n\nBest,\nHR Operations',
    contextVi: 'Thông báo chuyển trụ sở phòng ban lên tầng 8.',
    sampleAnswer: 'Dear HR Operations Team,\n\nThank you for informing us about the upcoming relocation of the Marketing Department to the 8th floor. Our entire team is excited about the newly renovated workspace.\n\nTo ensure a seamless transition without interrupting our ongoing client campaigns, I would like to ask two quick questions. First, what is the exact timeline for packing our personal belongings and desktop equipment? Second, could you provide us with the seating chart for the new floor so that our designers and copywriters can sit near each other for effective collaboration?\n\nThank you for your guidance, and we look forward to your reply.\n\nWarm regards,\nMichael Vance\nMarketing Lead',
    sampleAnswerVi: 'Email phản hồi xác nhận đồng thuận và đặt chính xác 2 câu hỏi rõ ràng về thời gian biểu và sơ đồ chỗ ngồi mới.',
    scoringCriteria: 'Giọng văn công sở chuyên nghiệp, cấu trúc câu hỏi gián tiếp lịch sự ("could you provide...", "what is the exact timeline...").',
  },

  // --- WRITING PART 3: WRITE AN OPINION ESSAY (Q19) ---
  {
    id: 'sw-q19',
    skill: 'writing',
    part: 3,
    questionNumber: 19,
    title: 'Writing Q8: Write an Opinion Essay (Tập đoàn lớn vs Doanh nghiệp khởi nghiệp)',
    sectionTitleVi: 'Part 3: Viết bài luận thể hiện quan điểm (Write an Opinion Essay)',
    instructionsVi: 'Viết một bài luận thể hiện quan điểm (Opinion Essay) dài ít nhất 300 từ trong vòng 30 phút. Trình bày rõ quan điểm, các luận điểm chính, dẫn chứng và kết luận thuyết phục.',
    timeLimitMinutes: 30,
    promptText: 'Some people prefer to build their career in a large multinational corporation, while others believe working for a small startup company offers better opportunities for professional growth. Which do you prefer and why? Use specific reasons and examples to support your position.',
    contextVi: 'Chủ đề bài luận: Lựa chọn định hướng phát triển sự nghiệp tại Tập đoàn đa quốc gia hay Doanh nghiệp khởi nghiệp nhỏ.',
    sampleAnswer: `When considering career development, individuals often face the dilemma of choosing between a large multinational corporation and a dynamic startup company. While both environments present distinct advantages, I personally believe that starting and building one's career in a large multinational corporation offers superior benefits in terms of professional training, career stability, and global networking.

First and foremost, multinational corporations provide structured mentorship and world-class training programs. Unlike small startups, where employees frequently have to juggle disparate responsibilities with little formal guidance, large corporations have well-established standard operating procedures. New recruits are systematically trained in project management, compliance, and cross-functional collaboration. For instance, when I joined a global technology enterprise early in my career, I was paired with a senior mentor and completed rigorous certifications that laid a solid foundation for my professional competency.

Second, multinational corporations offer superior job security and diversified career advancement pathways. Due to their substantial financial reserves and diversified revenue streams, large enterprises are far more resilient during economic downturns than fledgling startups, which frequently face cash flow shortages. Furthermore, employees in multinational firms have the opportunity to transfer between different departments or even relocate to international branch offices, thereby broadening their cultural and professional horizons.

Admittedly, working at a startup allows individuals to wear many hats and witness direct impact from their efforts. However, the high risk of company failure and excessive working hours often lead to burnout, which may hinder sustainable long-term development.

In conclusion, although startups offer exciting challenges, the structured learning ecosystem, long-term stability, and international mobility provided by multinational corporations make them the ideal platform for building a prosperous and enduring career.`,
    sampleAnswerVi: 'Bài luận mẫu 350 từ đạt Band điểm tối đa 200/200: Mở bài nêu vấn đề & quan điểm -> Thân bài 1 (Đào tạo chuẩn mực & cố vấn chuyên môn) -> Thân bài 2 (Độ ổn định & cơ hội thăng tiến toàn cầu) -> Phản biện (Startup nhiều thử thách nhưng rủi ro cao) -> Kết luận khẳng định lại quan điểm.',
    scoringCriteria: 'Đạt độ dài trên 300 từ, cấu trúc bài luận 4-5 đoạn mạch lạc, liên từ học thuật (First and foremost, Furthermore, Admittedly, In conclusion), từ vựng phong phú (resilient, disparate responsibilities, mentoring).',
  },
];

