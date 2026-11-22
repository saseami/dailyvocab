import { Topic, Word } from '../types';
import { ListeningQuestion, ReadingQuestion, TOEICPhase, TOEIC_LISTENING_QUESTIONS, TOEIC_READING_QUESTIONS } from '../data/toeicSkillData';

/**
 * Dynamically generates TOEIC Listening questions tightly linked to the active Topic and its vocabulary words.
 * Formatted strictly according to official ETS TOEIC exam standards.
 */
export function generateTopicListeningQuestions(
  topic: Topic,
  topicWords: Word[],
  selectedPart: number,
  phase: TOEICPhase
): ListeningQuestion[] {
  if (!topicWords || topicWords.length === 0) {
    return TOEIC_LISTENING_QUESTIONS.filter((q) => q.part === selectedPart);
  }

  const nounWords = topicWords.filter(w => w.partOfSpeech === 'noun');
  const wNoun1 = nounWords[0] || topicWords[0] || { word: 'contract', meaningVi: 'hợp đồng' };
  const wNoun2 = nounWords[1] || topicWords[1] || { word: 'agreement', meaningVi: 'thỏa thuận' };
  const w1 = topicWords[0] || { word: 'agreement', meaningVi: 'thỏa thuận', example: 'Both parties signed the agreement.' };
  const w2 = topicWords[1] || { word: 'contract', meaningVi: 'hợp đồng', example: 'Review the contract carefully.' };
  const w3 = topicWords[2] || { word: 'provision', meaningVi: 'điều khoản', example: 'Comply with all provisions.' };
  const w4 = topicWords[3] || { word: 'warranty', meaningVi: 'bảo hành', example: 'Check the warranty period.' };

  // Part 1: Photographs (4 options A, B, C, D; text hidden until answered)
  if (selectedPart === 1) {
    return [
      {
        id: `topic-l-p1-${topic.id}-1`,
        part: 1,
        phase,
        title: `Part 1: Tranh Tình Huống - Chủ Đề "${topic.titleVi}"`,
        imageType: 'office-typing',
        scenario: `Khung cảnh công sở chuyên nghiệp liên quan đến ${topic.titleVi}`,
        audioPrompt: `A. The executive is reviewing business documents at the desk. B. She is hanging a framed certificate on the wall. C. A client is exiting the conference room. D. The technician is repairing an office printer.`,
        questionText: 'Look at the photo and listen to the four statements. Select the statement that best describes what you see.',
        options: [
          { key: 'A', text: `A. The executive is reviewing business documents at the desk.` },
          { key: 'B', text: 'B. She is hanging a framed certificate on the wall.' },
          { key: 'C', text: 'C. A client is exiting the conference room.' },
          { key: 'D', text: 'D. The technician is repairing an office printer.' },
        ],
        correctAnswer: 'A',
        transcript: `[Audio Part 1]\n(A) The executive is reviewing business documents at the desk.\n(B) She is hanging a framed certificate on the wall.\n(C) A client is exiting the conference room.\n(D) The technician is repairing an office printer.`,
        sentenceTranslationVi: `(A) Người giám đốc đang xem xét các tài liệu kinh doanh tại bàn làm việc.\n(B) Cô ấy đang treo một tấm bằng khen đóng khung lên tường.\n(C) Một khách hàng đang bước ra khỏi phòng hội nghị.\n(D) Kỹ thuật viên đang sửa chữa một máy in văn phòng.`,
        explanationVi: `Đáp án A đúng: Miêu tả trực tiếp hành động nhân sự đang ngồi rà soát tài liệu liên quan đến "${topic.title}" (từ vựng cốt lõi: "${w1.word}" - ${w1.meaningVi}). Các đáp án B, C, D là bẫy hành động sai chủ thể hoặc đồ vật không có trong tranh.`,
        trapType: 'Bẫy động tác & Đồ vật gây nhiễu',
        keywords: [w1.word, 'reviewing', 'documents', 'desk', topic.title],
      },
      {
        id: `topic-l-p1-${topic.id}-2`,
        part: 1,
        phase,
        title: `Part 1: Tranh Tình Huống 2 - Thao tác với ${wNoun2.word}`,
        imageType: 'document-review',
        scenario: `Hai đối tác kinh doanh đang trao đổi về văn bản hợp đồng`,
        audioPrompt: `A. Two managers are signing the official agreement. B. The staff members are organizing books on the shelf. C. The visitors are boarding an airport shuttle bus. D. An employee is watering plants in the hallway.`,
        questionText: 'Select the statement that best describes the interaction between the two professionals.',
        options: [
          { key: 'A', text: `A. Two managers are signing the official agreement.` },
          { key: 'B', text: 'B. The staff members are organizing books on the shelf.' },
          { key: 'C', text: 'C. The visitors are boarding an airport shuttle bus.' },
          { key: 'D', text: 'D. An employee is watering plants in the hallway.' },
        ],
        correctAnswer: 'A',
        transcript: `[Audio Part 1]\n(A) Two managers are signing the official agreement.\n(B) The staff members are organizing books on the shelf.\n(C) The visitors are boarding an airport shuttle bus.\n(D) An employee is watering plants in the hallway.`,
        sentenceTranslationVi: `(A) Hai người quản lý đang ký kết bản thỏa thuận chính thức.\n(B) Các nhân viên đang sắp xếp sách lên giá.\n(C) Những người khách đang bước lên xe buýt đưa đón sân bay.\n(D) Một nhân viên đang tưới cây ở hành lang.`,
        explanationVi: `Đáp án A chính xác: Bức tranh thể hiện hai người đang ký kết và kiểm tra văn bản thỏa thuận (gắn liền từ vựng "${wNoun2.word}" - ${wNoun2.meaningVi}).`,
        trapType: 'Tranh miêu tả hành động hợp tác',
        keywords: [wNoun2.word, 'signing', 'managers', 'agreement'],
      },
    ];
  }

  // Part 2: Question-Response (strictly 3 options A, B, C; text hidden until answered)
  if (selectedPart === 2) {
    return [
      {
        id: `topic-l-p2-${topic.id}-1`,
        part: 2,
        phase,
        title: `Part 2: Hỏi & Đáp Nhanh - Chủ đề ${topic.titleVi}`,
        questionText: `Listen to the question and three responses. Select the best response.`,
        audioPrompt: `Question: Has the legal team finalized the agreement terms yet? A. Yes, both parties signed it this morning. B. At the supermarket on Fifth Avenue. C. Fifty dollars per hour.`,
        options: [
          { key: 'A', text: `A. Yes, both parties signed it this morning.` },
          { key: 'B', text: 'B. At the supermarket on Fifth Avenue.' },
          { key: 'C', text: 'C. Fifty dollars per hour.' },
        ],
        correctAnswer: 'A',
        transcript: `Speaker 1: Has the legal team finalized the agreement terms yet?\nSpeaker 2 (A): Yes, both parties signed it this morning.\nSpeaker 2 (B): At the supermarket on Fifth Avenue.\nSpeaker 2 (C): Fifty dollars per hour.`,
        sentenceTranslationVi: `Người hỏi: Đội ngũ pháp lý đã hoàn tất các điều khoản thỏa thuận chưa?\n(A) Rồi, cả hai bên đã ký vào sáng nay.\n(B) Tại siêu thị trên đại lộ số 5.\n(C) 50 đô la mỗi giờ.`,
        explanationVi: `Đáp án A đúng: Trả lời trực tiếp cho câu hỏi Yes/No về tiến độ hoàn tất thỏa thuận liên quan đến chủ đề "${topic.title}" (từ vựng: "${w1.word}"). B là bẫy nơi chốn (Where), C là bẫy giá cả (How much).`,
        trapType: 'Bẫy câu hỏi Yes/No & Sai từ để hỏi',
        keywords: [w1.word, 'legal team', 'signed', 'finalized'],
      },
      {
        id: `topic-l-p2-${topic.id}-2`,
        part: 2,
        phase,
        title: `Part 2: Câu Hỏi Gián Tiếp về Chính Sách & Điều Khoản`,
        questionText: `Listen to the statement and select the appropriate response.`,
        audioPrompt: `Question: When does the warranty policy take effect? A. Right after the agreement is approved. B. In the second floor filing cabinet. C. By express mail service.`,
        options: [
          { key: 'A', text: `A. Right after the agreement is approved.` },
          { key: 'B', text: 'B. In the second floor filing cabinet.' },
          { key: 'C', text: 'C. By express mail service.' },
        ],
        correctAnswer: 'A',
        transcript: `Speaker 1: When does the warranty policy take effect?\nSpeaker 2 (A): Right after the agreement is approved.\nSpeaker 2 (B): In the second floor filing cabinet.\nSpeaker 2 (C): By express mail service.`,
        sentenceTranslationVi: `Người hỏi: Khi nào chính sách bảo hành có hiệu lực?\n(A) Ngay sau khi bản thỏa thuận được phê duyệt.\n(B) Ở tủ hồ sơ tầng hai.\n(C) Bằng dịch vụ chuyển phát nhanh.`,
        explanationVi: `Đáp án A đúng: Trả lời mốc thời gian (When) cho sự việc có hiệu lực ("take effect") liên quan đến chủ đề "${topic.title}" (từ vựng: "${w4.word}"). B trả lời Where, C trả lời Phương tiện (How).`,
        trapType: 'Bẫy thời gian When',
        keywords: [w4.word, 'take effect', 'approved', 'policy'],
      },
    ];
  }

  // Part 3: Short Conversations (Text shown in test booklet)
  if (selectedPart === 3) {
    return [
      {
        id: `topic-l-p3-${topic.id}-1`,
        part: 3,
        phase,
        title: `Part 3: Hội Thoại Doanh Nghiệp về "${topic.titleVi}"`,
        questionText: `What is the woman concerned about regarding the proposal?`,
        audioPrompt: `Man: Hello Sarah, have you had a chance to look over the new proposal with Vertex Corporation? Woman: Yes, I reviewed it earlier. I noticed that the clause on product warranty needs to be clarified, especially regarding defective items. Man: Good catch. I will ask our legal counsel to modify that provision before tomorrow's conference.`,
        options: [
          { key: 'A', text: `A. The terms concerning the warranty are unclear.` },
          { key: 'B', text: 'B. The conference room was double-booked.' },
          { key: 'C', text: 'C. The invoice payment was overdue.' },
          { key: 'D', text: 'D. The flight tickets arrived too late.' },
        ],
        correctAnswer: 'A',
        transcript: `Man: Hello Sarah, have you had a chance to look over the new proposal with Vertex Corporation?\nWoman: Yes, I reviewed it earlier. I noticed that the clause on product warranty needs to be clarified, especially regarding defective items.\nMan: Good catch. I will ask our legal counsel to modify that provision before tomorrow's conference.`,
        sentenceTranslationVi: `Người nam: Chào Sarah, cô đã có dịp xem qua bản đề xuất mới với Tập đoàn Vertex chưa?\nNgười nữ: Vâng, tôi đã xem lúc nãy. Tôi nhận thấy điều khoản về bảo hành sản phẩm cần được làm rõ hơn, đặc biệt là với các mặt hàng bị lỗi.\nNgười nam: Nhận xét hay đấy. Tôi sẽ nhờ cố vấn pháp lý chỉnh sửa điều khoản đó trước hội nghị ngày mai.\n➔ Dịch câu hỏi: Người phụ nữ lo ngại về điều gì liên quan đến bản đề xuất? (Đáp án A: Các điều khoản liên quan đến bảo hành chưa rõ ràng).`,
        explanationVi: `Người phụ nữ nói: "I noticed that the clause on product warranty needs to be clarified" ➔ Đáp án A là cách diễn đạt đồng nghĩa (Paraphrase) chuẩn xác nhất. Sử dụng từ vựng chủ đề: "${w3.word}" (${w3.meaningVi}) và "${w4.word}".`,
        trapType: 'Bẫy Paraphrase từ vựng chủ đề',
        keywords: [w1.word, w4.word, 'clause', 'clarified', 'warranty'],
      },
      {
        id: `topic-l-p3-${topic.id}-2`,
        part: 3,
        phase,
        title: `Part 3: Kế Hoạch Tiếp Theo Của Người Nói`,
        questionText: 'What will the man do next?',
        audioPrompt: `What will the man do next? A. Consult legal counsel to amend the terms. B. Book a flight to the regional branch. C. Cancel the client contract. D. Order new office equipment.`,
        options: [
          { key: 'A', text: 'A. Consult legal counsel to amend the terms.' },
          { key: 'B', text: 'B. Book a flight to the regional branch.' },
          { key: 'C', text: 'C. Cancel the client contract.' },
          { key: 'D', text: 'D. Order new office equipment.' },
        ],
        correctAnswer: 'A',
        transcript: `Man: "I will ask our legal counsel to modify that provision before tomorrow's conference."`,
        sentenceTranslationVi: `Người nam: "Tôi sẽ nhờ cố vấn pháp lý sửa đổi điều khoản đó trước hội nghị ngày mai."\n➔ Dịch câu hỏi: Người đàn ông sẽ làm gì tiếp theo? (Đáp án A: Tham vấn cố vấn pháp lý để sửa đổi các điều khoản).`,
        explanationVi: `Người đàn ông khẳng định sẽ liên hệ cố vấn pháp lý để sửa đổi điều khoản ("modify that provision" = "amend the terms").`,
        trapType: 'Câu hỏi hành động kế tiếp (Action Question)',
        keywords: ['legal counsel', 'modify', 'amend'],
      },
    ];
  }

  // Part 4: Short Talks
  return [
    {
      id: `topic-l-p4-${topic.id}-1`,
      part: 4,
      phase,
      title: `Part 4: Thông Báo Nội Bộ về "${topic.titleVi}"`,
      questionText: `What is the main topic of the announcement?`,
      audioPrompt: `Attention all department heads. Please be advised that the updated corporate policy regarding ${topic.title} is now available on the company portal. All managers must ensure full compliance with the new provisions by next Monday. Thank you for your cooperation.`,
      options: [
        { key: 'A', text: `A. An updated policy regarding regulations and compliance.` },
        { key: 'B', text: 'B. A schedule change for the holiday party.' },
        { key: 'C', text: 'C. New safety guidelines for warehouse workers.' },
        { key: 'D', text: 'D. The introduction of a new marketing director.' },
      ],
      correctAnswer: 'A',
      transcript: `Speaker: Attention all department heads. Please be advised that the updated corporate policy regarding ${topic.title} is now available on the company portal. All managers must ensure full compliance with the new provisions by next Monday. Thank you for your cooperation.`,
      sentenceTranslationVi: `Người nói: Xin các trưởng bộ phận chú ý. Xin thông báo rằng chính sách doanh nghiệp cập nhật liên quan đến ${topic.title} hiện đã có trên cổng thông tin nội bộ. Tất cả các quản lý phải đảm bảo tuân thủ đầy đủ các điều khoản mới trước thứ Hai tới. Cảm ơn sự hợp tác của các bạn.\n➔ Dịch câu hỏi: Chủ đề chính của thông báo là gì? (Đáp án A: Chính sách cập nhật liên quan đến các quy định và việc tuân thủ).`,
      explanationVi: `Bài nói thông báo về chính sách cập nhật liên quan đến chủ đề "${topic.title}" (từ vựng trọng tâm: "${w3.word}" - ${w3.meaningVi}). Đáp án A nêu bật đúng trọng tâm.`,
      trapType: 'Câu hỏi ý chính (Main Idea)',
      keywords: [w1.word, w3.word, 'policy', 'compliance'],
    },
  ];
}

/**
 * Dynamically generates TOEIC Reading questions tightly linked to the active Topic and its vocabulary words.
 * Includes AT LEAST 15 comprehensive Part 5 questions covering essential TOEIC grammar and traps,
 * a dedicated Part 6 Text Completion passage, and Part 7 Single/Double passages (all 100% English).
 */
export function generateTopicReadingQuestions(
  topic: Topic,
  topicWords: Word[],
  selectedPart: number,
  phase: TOEICPhase
): ReadingQuestion[] {
  if (!topicWords || topicWords.length === 0) {
    return TOEIC_READING_QUESTIONS.filter((q) => q.part === selectedPart);
  }

  // --------------------------------------------------------------------------
  // PART 5: AT LEAST 15 COMPREHENSIVE TOEIC QUESTIONS WITH FULL VIETNAMESE TRANSLATION
  // --------------------------------------------------------------------------
  if (selectedPart === 5) {
    return [
      {
        id: `topic-r-p5-${topic.id}-1`,
        part: 5,
        phase,
        category: `1. Từ Loại: Trạng Từ Bổ Nghĩa (Adverb Form)`,
        questionText: `The legal committee requested that all guidelines be outlined as _______ as possible to avoid misunderstandings.`,
        options: [
          { key: 'A', text: 'specific' },
          { key: 'B', text: 'specifically' },
          { key: 'C', text: 'specifications' },
          { key: 'D', text: 'specifying' },
        ],
        correctAnswer: 'B',
        sentenceTranslationVi: `Hội đồng pháp lý đã yêu cầu toàn bộ các bản hướng dẫn phải được phác thảo một cách cụ thể nhất có thể để tránh những hiểu lầm.`,
        explanationVi: `Cấu trúc "as + adv + as possible" bổ nghĩa cho phân từ quá khứ "outlined" (được phác thảo một cách cụ thể). Do đó chỗ trống bắt buộc phải là một trạng từ kết thúc bằng đuôi "-ly": "specifically".`,
        grammarRuleVi: `Cấu trúc so sánh bằng: as + adj/adv + as. Khi bổ nghĩa cho động từ/phân từ, dùng trạng từ (adv).`,
        trapType: `Bẫy từ loại (Chọn nhầm tính từ 'specific' do thói quen thấy 'as...as')`,
      },
      {
        id: `topic-r-p5-${topic.id}-2`,
        part: 5,
        phase,
        category: `2. Từ Loại: Cụm Danh Từ (Noun Suffix -ment)`,
        questionText: `Prior to signing the binding _______, both corporate parties thoroughly reviewed all warranty stipulations.`,
        options: [
          { key: 'A', text: 'agreement' },
          { key: 'B', text: 'agreed' },
          { key: 'C', text: 'agreeable' },
          { key: 'D', text: 'agreeably' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Trước khi ký kết bản thỏa thuận có tính ràng buộc pháp lý, cả hai bên doanh nghiệp đã rà soát kỹ lưỡng toàn bộ các quy định bảo hành.`,
        explanationVi: `Sau tính từ "binding" (mang tính ràng buộc) cần một danh từ để tạo thành cụm danh từ làm tân ngữ: "binding agreement" (thỏa thuận ràng buộc). Đuôi "-ment" là hậu tố đặc trưng của danh từ.`,
        grammarRuleVi: `Trật tự cụm danh từ: Tính từ (Adj) + Danh từ (Noun).`,
        trapType: `Bẫy nhầm lẫn giữa tính từ và danh từ`,
      },
      {
        id: `topic-r-p5-${topic.id}-3`,
        part: 5,
        phase,
        category: `3. Từ Loại: Tính Từ Đuôi Bị Động (Adjective -ed)`,
        questionText: `The supplier was legally _______ by the contract to replace any defective parts within forty-eight hours.`,
        options: [
          { key: 'A', text: 'obligate' },
          { key: 'B', text: 'obligated' },
          { key: 'C', text: 'obligation' },
          { key: 'D', text: 'obligatory' },
        ],
        correctAnswer: 'B',
        sentenceTranslationVi: `Nhà cung cấp đã bị ràng buộc về mặt pháp lý bởi hợp đồng phải thay thế bất kỳ linh kiện nào bị lỗi trong vòng 48 giờ.`,
        explanationVi: `Cấu trúc bị động "be + legally + V3/ed + to V" (được/bị ai bắt buộc làm gì): "was legally obligated to replace".`,
        grammarRuleVi: `Cấu trúc bị động: S + be + (adv) + V-ed/V3 + to-infinitive.`,
        trapType: `Bẫy cấu trúc phân từ bị động sau trạng từ`,
      },
      {
        id: `topic-r-p5-${topic.id}-4`,
        part: 5,
        phase,
        category: `4. Thì Động Từ: Hiện Tại Hoàn Thành (Present Perfect)`,
        questionText: `Over the past three weeks, the senior management _______ several critical provisions in the employment contract.`,
        options: [
          { key: 'A', text: 'has modified' },
          { key: 'B', text: 'modifies' },
          { key: 'C', text: 'will modify' },
          { key: 'D', text: 'modifying' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Trong suốt ba tuần qua, ban quản lý cấp cao đã sửa đổi một số điều khoản then chốt trong hợp đồng lao động.`,
        explanationVi: `Dấu hiệu thời gian "Over the past three weeks" (trong suốt 3 tuần qua) là dấu hiệu kinh điển của thì Hiện tại hoàn thành (have/has + V3/ed). Chủ ngữ "senior management" là danh từ tập hợp số ít nên chọn "has modified".`,
        grammarRuleVi: `Dấu hiệu Hiện tại hoàn thành: Over/In/During the past/last + khoảng thời gian ➔ S + have/has + V3/ed.`,
        trapType: `Bẫy chia thì động từ theo trạng ngữ thời gian`,
      },
      {
        id: `topic-r-p5-${topic.id}-5`,
        part: 5,
        phase,
        category: `5. Thể Bị Động: Bị Động Hiện Tại (Passive Voice)`,
        questionText: `All disputed warranty claims must be _______ by an authorized technician before refunds are issued.`,
        options: [
          { key: 'A', text: 'resolve' },
          { key: 'B', text: 'resolves' },
          { key: 'C', text: 'resolved' },
          { key: 'D', text: 'resolving' },
        ],
        correctAnswer: 'C',
        sentenceTranslationVi: `Tất cả các yêu cầu bảo hành có tranh chấp phải được giải quyết bởi một kỹ thuật viên được ủy quyền trước khi việc hoàn tiền được thực hiện.`,
        explanationVi: `Sau động từ khiếm khuyết ở dạng bị động "must be + V3/ed" chỉ hành động được thực hiện bởi người khác ("by an authorized technician"): chọn "resolved".`,
        grammarRuleVi: `Bị động với động từ khiếm khuyết: Modal verb + be + V-ed/V3.`,
        trapType: `Bẫy thể chủ động vs bị động`,
      },
      {
        id: `topic-r-p5-${topic.id}-6`,
        part: 5,
        phase,
        category: `6. Đại Từ Phản Thân: Nhấn Mạnh Chủ Thể (Reflexive Pronoun)`,
        questionText: `The regional directors reviewed the annual procurement policies _______ rather than delegating the task.`,
        options: [
          { key: 'A', text: 'they' },
          { key: 'B', text: 'them' },
          { key: 'C', text: 'their' },
          { key: 'D', text: 'themselves' },
        ],
        correctAnswer: 'D',
        sentenceTranslationVi: `Các giám đốc khu vực đã tự mình xem xét các chính sách thu mua thường niên thay vì ủy quyền nhiệm vụ đó cho người khác.`,
        explanationVi: `Đại từ phản thân "themselves" đứng ở cuối mệnh đề để nhấn mạnh chính chủ thể "The regional directors" tự thực hiện hành động.`,
        grammarRuleVi: `Đại từ phản thân đứng sau tân ngữ hoặc cuối câu đóng vai trò nhấn mạnh (Emphatic pronoun).`,
        trapType: `Bẫy đại từ tân ngữ (them) vs đại từ phản thân (themselves)`,
      },
      {
        id: `topic-r-p5-${topic.id}-7`,
        part: 5,
        phase,
        category: `7. Liên Từ vs Giới Từ: Chỉ Sự Nhượng Bộ (Although vs Despite)`,
        questionText: `_______ the contract terms were extremely stringent, both corporate parties managed to reach a mutual compromise.`,
        options: [
          { key: 'A', text: 'Although' },
          { key: 'B', text: 'Despite' },
          { key: 'C', text: 'In spite of' },
          { key: 'D', text: 'Because of' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Mặc dù các điều khoản hợp đồng vô cùng nghiêm ngặt, cả hai bên doanh nghiệp vẫn cố gắng đạt được một sự thỏa hiệp chung.`,
        explanationVi: `Phía sau chỗ trống là một mệnh đề hoàn chỉnh gồm S ("the contract terms") + V ("were") + C ("extremely stringent"). Do đó bắt buộc phải dùng liên từ "Although", không được dùng giới từ "Despite / In spite of" (chỉ đi với danh từ/V-ing).`,
        grammarRuleVi: `Although / Even though + Mệnh đề (S + V) &harr; Despite / In spite of + Cụm danh từ / V-ing.`,
        trapType: `Bẫy kinh điển ETS giữa liên từ (mệnh đề) và giới từ (cụm danh từ)`,
      },
      {
        id: `topic-r-p5-${topic.id}-8`,
        part: 5,
        phase,
        category: `8. Giới Từ Đi Kèm: Cụm Cố Định (Prepositional Idiom)`,
        questionText: `All manufactured components must be rigorously tested in _______ with international safety standards.`,
        options: [
          { key: 'A', text: 'accordance' },
          { key: 'B', text: 'according' },
          { key: 'C', text: 'accord' },
          { key: 'D', text: 'accorded' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Tất cả các linh kiện được sản xuất phải được kiểm định nghiêm ngặt theo đúng các tiêu chuẩn an toàn quốc tế.`,
        explanationVi: `Cụm giới từ cố định xuất hiện liên tục trong bài thi TOEIC: "in accordance with" có nghĩa là "phù hợp với / theo đúng với quy định".`,
        grammarRuleVi: `Cụm thành ngữ công sở: in accordance with + Noun = complying with.`,
        trapType: `Bẫy phân biệt 'according to' vs 'in accordance with'`,
      },
      {
        id: `topic-r-p5-${topic.id}-9`,
        part: 5,
        phase,
        category: `9. Hòa Hợp Chủ Vị: Cấu Trúc Each / Every (Subject-Verb Agreement)`,
        questionText: `Each of the legal consultants _______ submitted an independent evaluation of the merger agreement.`,
        options: [
          { key: 'A', text: 'has' },
          { key: 'B', text: 'have' },
          { key: 'C', text: 'are' },
          { key: 'D', text: 'were' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Mỗi một chuyên viên tư vấn pháp lý đều đã nộp một bản đánh giá độc lập về thỏa thuận sáp nhập.`,
        explanationVi: `Chủ ngữ bắt đầu bằng "Each of + danh từ số nhiều" luôn luôn chia động từ ở ngôi thứ ba số ít. Vì vậy trợ động từ đúng phải là "has" (has submitted).`,
        grammarRuleVi: `Quy tắc chủ ngữ số ít: Each / Every / One of + Plural Noun ➔ Động từ số ít (V-s/es / has / is / was).`,
        trapType: `Bẫy nhìn thấy danh từ số nhiều 'consultants' ngay trước chỗ trống dẫn tới chọn nhầm 'have'`,
      },
      {
        id: `topic-r-p5-${topic.id}-10`,
        part: 5,
        phase,
        category: `10. Dạng Động Từ: Động Từ Đi Kèm V-ing (Gerund)`,
        questionText: `The executive committee is currently considering _______ the warranty coverage from two years to five years.`,
        options: [
          { key: 'A', text: 'to extend' },
          { key: 'B', text: 'extending' },
          { key: 'C', text: 'extension' },
          { key: 'D', text: 'extended' },
        ],
        correctAnswer: 'B',
        sentenceTranslationVi: `Ủy ban điều hành hiện đang cân nhắc việc gia hạn phạm vi bảo hành từ hai năm lên năm năm.`,
        explanationVi: `Sau động từ "consider" khi mang nghĩa cân nhắc làm gì thì động từ theo sau luôn ở dạng V-ing: "consider doing something".`,
        grammarRuleVi: `Động từ theo sau bởi Danh động từ (V-ing): consider / avoid / postpone / recommend + V-ing.`,
        trapType: `Bẫy chọn 'to extend' do nhầm với các động từ chỉ mục đích`,
      },
      {
        id: `topic-r-p5-${topic.id}-11`,
        part: 5,
        phase,
        category: `11. Cụm Danh Từ Ghép: Từ Vựng Công Sở (Compound Noun)`,
        questionText: `Customers who experience equipment failure within the warranty _______ are entitled to free replacement parts.`,
        options: [
          { key: 'A', text: 'period' },
          { key: 'B', text: 'periodic' },
          { key: 'C', text: 'periodically' },
          { key: 'D', text: 'periodical' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Những khách hàng gặp sự cố hỏng hóc thiết bị trong thời hạn bảo hành có quyền được nhận linh kiện thay thế miễn phí.`,
        explanationVi: `Cụm danh từ ghép quen thuộc trong hợp đồng thương mại: "warranty period" (thời hạn bảo hành). "period" là danh từ hoàn thiện cụm.`,
        grammarRuleVi: `Cụm danh từ ghép (Compound Noun): Noun + Noun (warranty + period).`,
        trapType: `Bẫy chọn tính từ 'periodic' bổ nghĩa cho warranty`,
      },
      {
        id: `topic-r-p5-${topic.id}-12`,
        part: 5,
        phase,
        category: `12. Thể Giả Định: Động Từ Yêu Cầu / Đề Nghị (Subjunctive Mood)`,
        questionText: `The contract specifies that every branch manager _______ all transaction records at the end of each business quarter.`,
        options: [
          { key: 'A', text: 'audit' },
          { key: 'B', text: 'audits' },
          { key: 'C', text: 'audited' },
          { key: 'D', text: 'auditing' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Hợp đồng quy định rõ rằng mọi giám đốc chi nhánh phải kiểm toán tất cả các hồ sơ giao dịch vào cuối mỗi quý kinh doanh.`,
        explanationVi: `Cấu trúc giả định thức sau động từ chỉ yêu cầu/quy định: "specifies / requires / demands that + S + (should) + V-nguyên thể". Dù chủ ngữ là "every branch manager" (số ít), động từ vẫn giữ nguyên thể không chia: "audit".`,
        grammarRuleVi: `Thể giả định: S1 + demand/require/insist/specify + that + S2 + (should) + V-bare infinitive.`,
        trapType: `Bẫy chia động từ số ít 'audits' theo chủ ngữ 'every manager'`,
      },
      {
        id: `topic-r-p5-${topic.id}-13`,
        part: 5,
        phase,
        category: `13. Rút Gọn Mệnh Đề Quan Hệ Dạng Bị Động (Reduced Relative Clause)`,
        questionText: `The revised guidelines _______ by the legal department will become effective on the first of next month.`,
        options: [
          { key: 'A', text: 'draft' },
          { key: 'B', text: 'drafting' },
          { key: 'C', text: 'drafted' },
          { key: 'D', text: 'drafts' },
        ],
        correctAnswer: 'C',
        sentenceTranslationVi: `Bản hướng dẫn sửa đổi được soạn thảo bởi phòng pháp chế sẽ có hiệu lực vào ngày mùng một tháng sau.`,
        explanationVi: `Mệnh đề quan hệ rút gọn ở thể bị động: "The revised guidelines (which were) drafted by the legal department". Động từ chính của câu là "will become effective". Do đó chỗ trống là phân từ quá khứ "drafted".`,
        grammarRuleVi: `Rút gọn mệnh đề quan hệ bị động: Noun + (which/that + be) + V-ed/V3 + by O.`,
        trapType: `Bẫy chọn nhầm động từ chia thì 'drafts' thay vì phân từ quá khứ`,
      },
      {
        id: `topic-r-p5-${topic.id}-14`,
        part: 5,
        phase,
        category: `14. Từ Vựng Ngữ Cảnh: Quyết Định & Thẩm Định (Vocabulary Choice)`,
        questionText: `The independent auditor was hired to _______ whether the vendor complied with all contractual covenants.`,
        options: [
          { key: 'A', text: 'determine' },
          { key: 'B', text: 'terminate' },
          { key: 'C', text: 'hesitate' },
          { key: 'D', text: 'eliminate' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Kiểm toán viên độc lập đã được thuê để xác định liệu nhà cung cấp có tuân thủ tất cả các giao ước trong hợp đồng hay không.`,
        explanationVi: `Xét về mặt ngữ nghĩa trong ngữ cảnh kiểm toán và hợp đồng: "determine whether..." (xác định / thẩm định xem liệu có hay không). Các từ khác không hợp nghĩa: terminate (chấm dứt), hesitate (ngập ngừng), eliminate (loại trừ).`,
        grammarRuleVi: `Cụm từ vựng hay gặp: determine whether + S + V (xác định xem liệu).`,
        trapType: `Bẫy từ vựng có cách phát âm và hình thức na ná nhau (determine vs terminate)`,
      },
      {
        id: `topic-r-p5-${topic.id}-15`,
        part: 5,
        phase,
        category: `15. Cấu Trúc So Sánh: Trạng Từ Trong So Sánh Hơn (Comparative Adverb)`,
        questionText: `The legal team reviewed the warranty clauses much more _______ than the client had initially expected.`,
        options: [
          { key: 'A', text: 'thorough' },
          { key: 'B', text: 'thoroughly' },
          { key: 'C', text: 'thoroughness' },
          { key: 'D', text: 'thoroughbred' },
        ],
        correctAnswer: 'B',
        sentenceTranslationVi: `Đội ngũ pháp lý đã xem xét các điều khoản bảo hành kỹ lưỡng hơn rất nhiều so với những gì khách hàng dự tính ban đầu.`,
        explanationVi: `Trong cấu trúc so sánh hơn "more + adv + than", trạng từ "thoroughly" đứng sau để bổ nghĩa cho động từ hành động "reviewed".`,
        grammarRuleVi: `So sánh hơn với động từ hành động: S + V + more + Adverb + than.`,
        trapType: `Bẫy chọn tính từ 'thorough' sau 'more'`,
      },
    ];
  }

  // --------------------------------------------------------------------------
  // PART 6: DEDICATED TEXT COMPLETION PASSAGE (ĐIỀN TỪ VÀO ĐOẠN VĂN - 100% ENGLISH)
  // --------------------------------------------------------------------------
  if (selectedPart === 6) {
    const p6Passage = `MEMORANDUM\nTO: All Regional Operations Managers\nFROM: Clara Sterling, Director of Commercial Affairs\nDATE: November 12, 2026\nSUBJECT: New Framework for ${topic.title} and Equipment Purchases\n\nAs part of our continuous commitment to operational excellence, we are updating our standard vendor agreement protocols. Effective immediately, all purchasing agreements must contain an explicit clause regarding product durability and warranty support. [1] _______ entering into negotiations with suppliers, procurement representatives must verify that the vendor is fully licensed and insured.\n\nFurthermore, all warranty stipulations must clearly define the timeframe for replacement components. In the past, some contracts lacked [2] _______ language, resulting in avoidable operational delays. The revised documentation will ensure that all obligations [3] _______ clearly understood by both parties prior to signing.\n\n[4] _______. Please contact the commercial legal division if you require assistance with these newly adopted procedures.\n\nClara Sterling\nDirector of Commercial Affairs`;

    return [
      {
        id: `topic-r-p6-${topic.id}-1`,
        part: 6,
        phase,
        category: `Part 6 (Chỗ trống [1]): Giới Từ Thời Gian Trước Khi Hành Động`,
        passageType: 'Memo',
        passageTitle: `Official Policy Memorandum: ${topic.title}`,
        passage: p6Passage,
        questionText: `Select the best word or phrase to complete blank [1] in the memorandum.`,
        options: [
          { key: 'A', text: 'Prior to' },
          { key: 'B', text: 'In spite of' },
          { key: 'C', text: 'Whereas' },
          { key: 'D', text: 'Apart from' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Trước khi bước vào các cuộc đàm phán với các nhà cung cấp, đại diện thu mua phải xác minh rằng nhà cung cấp đó có đầy đủ giấy phép và bảo hiểm.`,
        explanationVi: `Cụm giới từ "Prior to + V-ing" mang nghĩa "Trước khi làm gì" là lựa chọn logic và chuẩn xác nhất cho câu văn: "Prior to entering into negotiations".`,
        grammarRuleVi: `Giới từ thời gian: Prior to + Noun / V-ing = Before.`,
        trapType: `Bẫy liên từ chỉ sự tương phản (Whereas)`,
      },
      {
        id: `topic-r-p6-${topic.id}-2`,
        part: 6,
        phase,
        category: `Part 6 (Chỗ trống [2]): Từ Loại Tính Từ Bổ Nghĩa Cho Danh Từ`,
        passageType: 'Memo',
        passageTitle: `Official Policy Memorandum: ${topic.title}`,
        passage: p6Passage,
        questionText: `Select the best word or phrase to complete blank [2] in the memorandum.`,
        options: [
          { key: 'A', text: 'specific' },
          { key: 'B', text: 'specifically' },
          { key: 'C', text: 'specifications' },
          { key: 'D', text: 'specifying' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Trước đây, một số hợp đồng thiếu ngôn ngữ cụ thể, dẫn đến những sự chậm trễ hoạt động có thể tránh được.`,
        explanationVi: `Trước danh từ "language" cần một tính từ đứng trước để bổ nghĩa: "specific language" (ngôn ngữ cụ thể, rõ ràng).`,
        grammarRuleVi: `Trật tự cụm từ: Tính từ (Adj) + Danh từ (Noun).`,
        trapType: `Bẫy trạng từ -ly đứng trước danh từ`,
      },
      {
        id: `topic-r-p6-${topic.id}-3`,
        part: 6,
        phase,
        category: `Part 6 (Chỗ trống [3]): Thể Bị Động Của Mệnh Đề Danh Từ`,
        passageType: 'Memo',
        passageTitle: `Official Policy Memorandum: ${topic.title}`,
        passage: p6Passage,
        questionText: `Select the best word or phrase to complete blank [3] in the memorandum.`,
        options: [
          { key: 'A', text: 'are' },
          { key: 'B', text: 'is' },
          { key: 'C', text: 'be' },
          { key: 'D', text: 'being' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Hồ sơ tài liệu sửa đổi sẽ đảm bảo rằng tất cả các nghĩa vụ đều được hiểu rõ ràng bởi cả hai bên trước khi ký kết.`,
        explanationVi: `Chủ ngữ của mệnh đề "that" là "all obligations" (danh từ số nhiều), kết hợp với phân từ "clearly understood" tạo thành thể bị động ở hiện tại: "are clearly understood".`,
        grammarRuleVi: `Hòa hợp chủ vị thể bị động: Plural Subject + are + V3/ed.`,
        trapType: `Bẫy chia số ít 'is' do nhầm với danh từ tài liệu documentation`,
      },
      {
        id: `topic-r-p6-${topic.id}-4`,
        part: 6,
        phase,
        category: `Part 6 (Chỗ trống [4]): Điền Câu Hoàn Chỉnh Phù Hợp Ngữ Cảnh`,
        passageType: 'Memo',
        passageTitle: `Official Policy Memorandum: ${topic.title}`,
        passage: p6Passage,
        questionText: `Select the best sentence to complete blank [4] in the memorandum.`,
        options: [
          { key: 'A', text: 'A training webinar will be held next Tuesday to guide managers through the new contract templates.' },
          { key: 'B', text: 'The catering staff has already ordered refreshments for the annual dinner party.' },
          { key: 'C', text: 'Parking permits must be displayed on vehicle windshields at all times.' },
          { key: 'D', text: 'Our branch office in London has announced a temporary hiring freeze.' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Một buổi hội thảo trực tuyến đào tạo sẽ được tổ chức vào thứ Ba tới để hướng dẫn các nhà quản lý về các mẫu hợp đồng mới.`,
        explanationVi: `Câu tiếp theo nói: "Please contact the commercial legal division if you require assistance with these newly adopted procedures" ➔ Câu A (tổ chức webinar hướng dẫn dùng mẫu hợp đồng mới) là câu duy nhất khớp hoàn hảo với mạch văn quy trình nội bộ của văn bản.`,
        grammarRuleVi: `Kỹ năng Part 6: Đọc câu văn trước và sau chỗ trống để tìm manh mối logic (webinar hướng dẫn &rarr; hỗ trợ giải đáp).`,
        trapType: `Bẫy câu lạc đề (tiệc tối, bãi đỗ xe, tuyển dụng)`,
      },
    ];
  }

  // --------------------------------------------------------------------------
  // PART 7: THEMATIC BUSINESS DOCUMENTS (100% ENGLISH PASSAGES)
  // --------------------------------------------------------------------------
  const p7Passage = `FROM: David Vance, Chief Legal Counsel <d.vance@apexcorp.com>\nTO: All Regional Department Directors\nDATE: October 14, 2026\nSUBJECT: Updated Protocols Regarding ${topic.title} and Quality Standards\n\nDear Team,\n\nPlease be advised that our corporate guidelines regarding ${topic.title} have been officially updated to ensure full compliance with international commercial benchmarks. Under the new provisions, all newly procured office equipment and machinery must include a minimum three-year warranty period.\n\nShould you encounter any defective merchandise or have questions regarding contract terms, please submit an inquiry form directly to the procurement desk before the end of the current fiscal month.\n\nSincerely,\nDavid Vance\nChief Legal Counsel, Apex Corporation`;

  return [
    {
      id: `topic-r-p7-${topic.id}-1`,
      part: 7,
      phase,
      category: `Part 7: Đọc Hiểu Thư Tín Thương Mại (${topic.title})`,
      passageType: 'Email',
      passageTitle: `Official Corporate Email: ${topic.title}`,
      passage: p7Passage,
      questionText: `According to the email, what must accompany all newly procured equipment purchases?`,
      options: [
        { key: 'A', text: 'A minimum three-year warranty period.' },
        { key: 'B', text: 'A personal recommendation from the CEO.' },
        { key: 'C', text: 'An immediate cash reimbursement.' },
        { key: 'D', text: 'A digital product demonstration video.' },
      ],
      correctAnswer: 'A',
      sentenceTranslationVi: `Đoạn văn nêu rõ: "all newly procured office equipment and machinery must include a minimum three-year warranty period" ➔ Dịch câu hỏi: Theo email, điều gì bắt buộc phải đi kèm với tất cả các thiết bị mới được mua sắm? (Đáp án A: Thời hạn bảo hành tối thiểu ba năm).`,
      explanationVi: `Đoạn văn nêu rõ trong đoạn 1: "all newly procured office equipment and machinery must include a minimum three-year warranty period" ➔ Đáp án A là câu trả lời trực tiếp từ bài đọc. Toàn bộ từ vựng gắn liền với chủ đề "${topic.title}".`,
      paraphrasedKeywords: [{ inPassage: 'minimum three-year warranty period', inQuestion: 'three-year warranty coverage' }],
    },
    {
      id: `topic-r-p7-${topic.id}-2`,
      part: 7,
      phase,
      category: `Part 7: Câu Hỏi Suy Luận & Thời Hạn Xử Lý (Inference & Deadline)`,
      passageType: 'Email',
      passageTitle: `Official Corporate Email: ${topic.title}`,
      passage: p7Passage,
      questionText: `What are department directors instructed to do if they receive defective merchandise?`,
      options: [
        { key: 'A', text: 'Submit an inquiry form to the procurement desk before month-end.' },
        { key: 'B', text: 'Dispose of the equipment immediately.' },
        { key: 'C', text: 'Contact external police authorities.' },
        { key: 'D', text: 'Withhold all employee salary payments.' },
      ],
      correctAnswer: 'A',
      sentenceTranslationVi: `Đoạn văn hướng dẫn: "Should you encounter any defective merchandise... please submit an inquiry form directly to the procurement desk before the end of the current fiscal month." ➔ Dịch câu hỏi: Các giám đốc bộ phận được hướng dẫn làm gì nếu nhận phải hàng hóa bị lỗi? (Đáp án A: Gửi biểu mẫu yêu cầu đến bộ phận thu mua trước cuối tháng).`,
      explanationVi: `Đoạn văn nêu: "Should you encounter any defective merchandise... please submit an inquiry form directly to the procurement desk before the end of the current fiscal month" ➔ Đáp án A chính xác.`,
      paraphrasedKeywords: [{ inPassage: 'submit an inquiry form', inQuestion: 'file a formal inquiry' }],
    },
  ];
}
