import { Topic, Word } from '../types';
import { ListeningQuestion, ReadingQuestion, TOEICPhase, TOEIC_LISTENING_QUESTIONS, TOEIC_READING_QUESTIONS } from '../data/toeicSkillData';
import { TOEICPictureType } from '../components/TOEICPictureCard';

// Map each of the 30 TOEIC topic IDs to appropriate visual scene for Part 1
function getTopicImageType(day: number, topicId: string): TOEICPictureType {
  if (topicId.includes('hotel') || topicId.includes('hospitality') || day === 18) return 'cafe-patio';
  if (topicId.includes('dining') || topicId.includes('restaurant') || day === 19) return 'cafe-patio';
  if (topicId.includes('travel') || topicId.includes('airline') || day === 17) return 'airport-checkin';
  if (topicId.includes('shipping') || topicId.includes('delivery') || day === 9) return 'delivery-truck';
  if (topicId.includes('inventory') || topicId.includes('warehouse') || topicId.includes('purchasing') || day === 7) return 'warehouse-loading';
  if (topicId.includes('manufacturing') || topicId.includes('production') || day === 16) return 'construction-workers';
  if (topicId.includes('safety') || topicId.includes('healthcare') || topicId.includes('hospital') || day === 21 || day === 22) return 'laboratory-research';
  if (topicId.includes('planning') || topicId.includes('conference') || topicId.includes('leadership') || day === 2 || day === 30) return 'boardroom-meeting';
  if (topicId.includes('contract') || topicId.includes('negotiation') || day === 1 || day === 29) return 'contract-discussion';
  return 'office-typing';
}

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

  const w1 = topicWords[0] || { word: 'policy', meaningVi: 'chính sách', example: 'The company issued a new policy.' };
  const w2 = topicWords[1] || { word: 'procedure', meaningVi: 'quy trình', example: 'Follow the standard procedure.' };
  const w3 = topicWords[2] || { word: 'manager', meaningVi: 'người quản lý', example: 'The manager approved the request.' };
  const w4 = topicWords[3] || { word: 'schedule', meaningVi: 'lịch trình', example: 'Check the project schedule.' };
  const w5 = topicWords[4] || { word: 'guideline', meaningVi: 'hướng dẫn', example: 'Review all official guidelines.' };

  const imageType = getTopicImageType(topic.day, topic.id);

  // Part 1: Photographs (4 options A, B, C, D; text hidden until answered)
  if (selectedPart === 1) {
    return [
      {
        id: `topic-l-p1-${topic.id}-1`,
        part: 1,
        phase,
        title: `Part 1: Tranh Tình Huống 1 - Chủ Đề "${topic.titleVi}"`,
        imageType,
        scenario: `Khung cảnh công việc chuyên nghiệp phản ánh hoạt động ${topic.titleVi}`,
        audioPrompt: `A. The professional is reviewing ${w1.word} documents at the workstation. B. She is hanging a framed certificate on the wall. C. A client is exiting the conference hall. D. The technician is repairing an office printer.`,
        questionText: 'Look at the photo and listen to the four statements. Select the statement that best describes what you see.',
        options: [
          { key: 'A', text: `A. The professional is reviewing ${w1.word} documents at the workstation.` },
          { key: 'B', text: 'B. She is hanging a framed certificate on the wall.' },
          { key: 'C', text: 'C. A client is exiting the conference hall.' },
          { key: 'D', text: 'D. The technician is repairing an office printer.' },
        ],
        correctAnswer: 'A',
        transcript: `[Audio Part 1]\n(A) The professional is reviewing ${w1.word} documents at the workstation.\n(B) She is hanging a framed certificate on the wall.\n(C) A client is exiting the conference hall.\n(D) The technician is repairing an office printer.`,
        sentenceTranslationVi: `(A) Nhân sự chuyên môn đang xem xét các tài liệu liên quan đến ${w1.meaningVi} tại bàn làm việc.\n(B) Cô ấy đang treo một tấm chứng nhận đóng khung lên tường.\n(C) Khách hàng đang bước ra khỏi hội trường hội nghị.\n(D) Kỹ thuật viên đang sửa chữa máy in văn phòng.`,
        explanationVi: `Đáp án A đúng: Miêu tả trực tiếp thao tác người đang rà soát tài liệu liên quan đến chủ đề "${topic.titleVi}" (từ vựng trọng tâm: "${w1.word}" - ${w1.meaningVi}). Các đáp án B, C, D là bẫy hành động sai chủ thể hoặc đồ vật không tồn tại trong tranh.`,
        trapType: 'Bẫy động tác & Đồ vật gây nhiễu',
        keywords: [w1.word, 'reviewing', 'documents', 'workstation', topic.title],
      },
      {
        id: `topic-l-p1-${topic.id}-2`,
        part: 1,
        phase,
        title: `Part 1: Tranh Tình Huống 2 - Thao Tác Chuyên Môn`,
        imageType: imageType === 'office-typing' ? 'boardroom-meeting' : 'office-typing',
        scenario: `Hai cộng sự đang thảo luận về phương án ${topic.titleVi}`,
        audioPrompt: `A. Two team members are examining the updated ${w2.word}. B. The staff members are organizing books on the shelf. C. The passengers are boarding an airport shuttle bus. D. An employee is watering plants in the hallway.`,
        questionText: 'Select the statement that best describes the interaction between the two professionals.',
        options: [
          { key: 'A', text: `A. Two team members are examining the updated ${w2.word}.` },
          { key: 'B', text: 'B. The staff members are organizing books on the shelf.' },
          { key: 'C', text: 'C. The passengers are boarding an airport shuttle bus.' },
          { key: 'D', text: 'D. An employee is watering plants in the hallway.' },
        ],
        correctAnswer: 'A',
        transcript: `[Audio Part 1]\n(A) Two team members are examining the updated ${w2.word}.\n(B) The staff members are organizing books on the shelf.\n(C) The passengers are boarding an airport shuttle bus.\n(D) An employee is watering plants in the hallway.`,
        sentenceTranslationVi: `(A) Hai thành viên trong đội đang cùng kiểm tra bản cập nhật ${w2.meaningVi}.\n(B) Các nhân viên đang sắp xếp sách lên giá.\n(C) Các hành khách đang bước lên xe buýt đưa đón sân bay.\n(D) Một nhân viên đang tưới cây ở hành lang.`,
        explanationVi: `Đáp án A chính xác: Bức tranh thể hiện hai người đang cùng rà soát và kiểm tra phương án công việc gắn liền từ vựng "${w2.word}" (${w2.meaningVi}).`,
        trapType: 'Tranh miêu tả hành động hợp tác',
        keywords: [w2.word, 'examining', 'updated', 'team members'],
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
        title: `Part 2: Hỏi & Đáp Nhanh - Tiến Độ ${topic.titleVi}`,
        questionText: `Listen to the question and three responses. Select the best response.`,
        audioPrompt: `Question: Has the department finalized the ${w1.word} yet? A. Yes, the team completed it this morning. B. At the supermarket on Fifth Avenue. C. Fifty dollars per hour.`,
        options: [
          { key: 'A', text: `A. Yes, the team completed it this morning.` },
          { key: 'B', text: 'B. At the supermarket on Fifth Avenue.' },
          { key: 'C', text: 'C. Fifty dollars per hour.' },
        ],
        correctAnswer: 'A',
        transcript: `Speaker 1: Has the department finalized the ${w1.word} yet?\nSpeaker 2 (A): Yes, the team completed it this morning.\nSpeaker 2 (B): At the supermarket on Fifth Avenue.\nSpeaker 2 (C): Fifty dollars per hour.`,
        sentenceTranslationVi: `Người hỏi: Phòng ban đã hoàn tất ${w1.meaningVi} chưa?\n(A) Rồi, cả đội đã hoàn thành vào sáng nay.\n(B) Tại siêu thị trên đại lộ số 5.\n(C) 50 đô la mỗi giờ.`,
        explanationVi: `Đáp án A đúng: Phản xạ trực tiếp câu hỏi Yes/No về tiến độ hoàn tất "${w1.word}" (${w1.meaningVi}). Đáp án B là bẫy nơi chốn (Where), C là bẫy giá cả (How much).`,
        trapType: 'Bẫy câu hỏi Yes/No & Sai từ để hỏi',
        keywords: [w1.word, 'finalized', 'department', 'completed'],
      },
      {
        id: `topic-l-p2-${topic.id}-2`,
        part: 2,
        phase,
        title: `Part 2: Câu Hỏi Thời Gian When / Lịch Trình`,
        questionText: `Listen to the question and select the appropriate response.`,
        audioPrompt: `Question: When will the new ${w2.word} take effect? A. Right after management approval. B. In the second floor filing cabinet. C. By express courier delivery.`,
        options: [
          { key: 'A', text: `A. Right after management approval.` },
          { key: 'B', text: 'B. In the second floor filing cabinet.' },
          { key: 'C', text: 'C. By express courier delivery.' },
        ],
        correctAnswer: 'A',
        transcript: `Speaker 1: When will the new ${w2.word} take effect?\nSpeaker 2 (A): Right after management approval.\nSpeaker 2 (B): In the second floor filing cabinet.\nSpeaker 2 (C): By express courier delivery.`,
        sentenceTranslationVi: `Người hỏi: Khi nào ${w2.meaningVi} mới sẽ có hiệu lực?\n(A) Ngay sau khi ban quản lý phê duyệt.\n(B) Ở tủ hồ sơ tầng hai.\n(C) Bằng chuyển phát nhanh.`,
        explanationVi: `Đáp án A đúng: Cung cấp mốc thời gian gián tiếp ("Right after management approval") trả lời chuẩn cho câu hỏi When liên quan đến "${w2.word}".`,
        trapType: 'Bẫy thời gian When & Phản xạ gián tiếp',
        keywords: [w2.word, 'take effect', 'approval', 'management'],
      },
      {
        id: `topic-l-p2-${topic.id}-3`,
        part: 2,
        phase,
        title: `Part 2: Câu Hỏi Người Chịu Trách Nhiệm Who`,
        questionText: `Listen to the question and select the most fitting response.`,
        audioPrompt: `Question: Who is in charge of reviewing the ${w3.word}? A. Mr. Henderson from operations. B. Yes, I will attend the session. C. It was very informative.`,
        options: [
          { key: 'A', text: 'A. Mr. Henderson from operations.' },
          { key: 'B', text: 'B. Yes, I will attend the session.' },
          { key: 'C', text: 'C. It was very informative.' },
        ],
        correctAnswer: 'A',
        transcript: `Speaker 1: Who is in charge of reviewing the ${w3.word}?\nSpeaker 2 (A): Mr. Henderson from operations.\nSpeaker 2 (B): Yes, I will attend the session.\nSpeaker 2 (C): It was very informative.`,
        sentenceTranslationVi: `Người hỏi: Ai là người chịu trách nhiệm rà soát ${w3.meaningVi}?\n(A) Ông Henderson từ bộ phận vận hành.\n(B) Vâng, tôi sẽ tham dự buổi họp.\n(C) Buổi đó cung cấp rất nhiều thông tin.`,
        explanationVi: `Đáp án A đúng: Trả lời chỉ đích danh người chịu trách nhiệm ("Mr. Henderson") cho câu hỏi bắt đầu bằng "Who is in charge of". B và C là bẫy câu hỏi Yes/No và nhận xét chung.`,
        trapType: 'Bẫy câu hỏi người chịu trách nhiệm Who',
        keywords: [w3.word, 'who is in charge', 'Henderson', 'operations'],
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
        questionText: `What is the woman concerned about regarding the project?`,
        audioPrompt: `Man: Hello, have you had a chance to look over the new proposal regarding ${topic.title}? Woman: Yes, I reviewed it earlier. I noticed that the guidelines on ${w1.word} need to be clarified before we present to the board. Man: Good catch. I will ask the department lead to update the details before tomorrow's conference.`,
        options: [
          { key: 'A', text: `A. The guidelines regarding ${w1.word} are unclear.` },
          { key: 'B', text: 'B. The conference room was double-booked.' },
          { key: 'C', text: 'C. The invoice payment was overdue.' },
          { key: 'D', text: 'D. The flight tickets arrived too late.' },
        ],
        correctAnswer: 'A',
        transcript: `Man: Hello, have you had a chance to look over the new proposal regarding ${topic.title}?\nWoman: Yes, I reviewed it earlier. I noticed that the guidelines on ${w1.word} need to be clarified before we present to the board.\nMan: Good catch. I will ask the department lead to update the details before tomorrow's conference.`,
        sentenceTranslationVi: `Người nam: Chào cô, cô đã có dịp xem qua bản đề xuất mới liên quan đến ${topic.titleVi} chưa?\nNgười nữ: Vâng, tôi đã xem lúc nãy. Tôi nhận thấy các hướng dẫn về ${w1.meaningVi} cần được làm rõ thêm trước khi chúng ta trình bày trước ban giám đốc.\nNgười nam: Nhận xét hay đấy. Tôi sẽ nhờ trưởng bộ phận cập nhật các chi tiết trước hội nghị ngày mai.\n➔ Dịch câu hỏi: Người phụ nữ lo ngại về điều gì? (Đáp án A: Các hướng dẫn liên quan đến ${w1.meaningVi} chưa rõ ràng).`,
        explanationVi: `Người phụ nữ nói: "I noticed that the guidelines on ${w1.word} need to be clarified" ➔ Đáp án A là diễn đạt đồng nghĩa (Paraphrase) chuẩn mực nhất.`,
        trapType: 'Bẫy Paraphrase từ vựng chủ đề',
        keywords: [w1.word, 'guidelines', 'clarified', topic.title],
      },
      {
        id: `topic-l-p3-${topic.id}-2`,
        part: 3,
        phase,
        title: `Part 3: Kế Hoạch Tiếp Theo Của Người Nói`,
        questionText: 'What will the man do next?',
        audioPrompt: `Man: I will consult with the director to modify the schedule before tomorrow's briefing. Woman: Excellent, that will prevent any misunderstandings.`,
        options: [
          { key: 'A', text: 'A. Consult with the director to update the schedule.' },
          { key: 'B', text: 'B. Book an airline ticket for a business trip.' },
          { key: 'C', text: 'C. Terminate the supplier contract.' },
          { key: 'D', text: 'D. Purchase new office machinery.' },
        ],
        correctAnswer: 'A',
        transcript: `Man: I will consult with the director to modify the schedule before tomorrow's briefing.\nWoman: Excellent, that will prevent any misunderstandings.`,
        sentenceTranslationVi: `Người nam: Tôi sẽ tham vấn giám đốc để điều chỉnh lịch trình trước buổi họp giao ban ngày mai.\nNgười nữ: Tuyệt vời, điều đó sẽ ngăn ngừa mọi hiểu lầm.\n➔ Dịch câu hỏi: Người đàn ông sẽ làm gì tiếp theo? (Đáp án A: Tham vấn giám đốc để cập nhật lịch trình).`,
        explanationVi: `Người đàn ông khẳng định sẽ trao đổi với giám đốc ("consult with the director to modify the schedule" = "update the schedule").`,
        trapType: 'Câu hỏi hành động kế tiếp (Action Question)',
        keywords: ['director', 'modify', 'schedule', 'briefing'],
      },
    ];
  }

  // Part 4: Short Talks
  return [
    {
      id: `topic-l-p4-${topic.id}-1`,
      part: 4,
      phase,
      title: `Part 4: Thông Báo Doanh Nghiệp về "${topic.titleVi}"`,
      questionText: `What is the main purpose of the announcement?`,
      audioPrompt: `Attention all employees. Please be advised that the updated policy concerning ${topic.title} has now been posted on the internal employee portal. All personnel must review the new ${w2.word} and confirm compliance by Friday afternoon. Thank you for your continued cooperation.`,
      options: [
        { key: 'A', text: `A. An updated policy regarding ${topic.title} and compliance.` },
        { key: 'B', text: 'B. A schedule change for the holiday party.' },
        { key: 'C', text: 'C. Safety warnings for warehouse workers.' },
        { key: 'D', text: 'D. The promotion of a new regional director.' },
      ],
      correctAnswer: 'A',
      transcript: `Speaker: Attention all employees. Please be advised that the updated policy concerning ${topic.title} has now been posted on the internal employee portal. All personnel must review the new ${w2.word} and confirm compliance by Friday afternoon. Thank you for your continued cooperation.`,
      sentenceTranslationVi: `Người nói: Xin toàn thể nhân viên chú ý. Xin thông báo rằng chính sách cập nhật liên quan đến ${topic.titleVi} hiện đã được đăng tải trên cổng thông tin nội bộ. Tất cả nhân sự phải rà soát ${w2.meaningVi} mới và xác nhận việc tuân thủ trước chiều thứ Sáu. Cảm ơn sự hợp tác liên tục của các bạn.\n➔ Dịch câu hỏi: Mục đích chính của thông báo là gì? (Đáp án A: Chính sách cập nhật liên quan đến ${topic.titleVi} và việc tuân thủ quy định).`,
      explanationVi: `Thông báo mở đầu bằng việc công bố chính sách mới về chủ đề "${topic.titleVi}" ("updated policy concerning ${topic.title}"). Đáp án A tóm tắt chuẩn xác mục đích chính.`,
      trapType: 'Câu hỏi ý chính (Main Idea)',
      keywords: [w2.word, 'policy', 'compliance', topic.title],
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

  // Extract up to 15 vocabulary words from the topic
  const w = topicWords;
  const w1 = w[0] || { word: 'policy', meaningVi: 'chính sách' };
  const w2 = w[1] || { word: 'agreement', meaningVi: 'thỏa thuận' };
  const w3 = w[2] || { word: 'procedure', meaningVi: 'thủ tục' };
  const w4 = w[3] || { word: 'guideline', meaningVi: 'hướng dẫn' };
  const w5 = w[4] || { word: 'requirement', meaningVi: 'yêu cầu' };
  const w6 = w[5] || { word: 'specifications', meaningVi: 'quy chuẩn' };
  const w7 = w[6] || { word: 'supervisor', meaningVi: 'người giám sát' };
  const w8 = w[7] || { word: 'schedule', meaningVi: 'lịch trình' };
  const w9 = w[8] || { word: 'applicant', meaningVi: 'ứng viên' };
  const w10 = w[9] || { word: 'representative', meaningVi: 'đại diện' };
  const w11 = w[10] || { word: 'facility', meaningVi: 'cơ sở vật chất' };
  const w12 = w[11] || { word: 'inventory', meaningVi: 'hàng tồn kho' };
  const w13 = w[12] || { word: 'invoice', meaningVi: 'hóa đơn' };
  const w14 = w[13] || { word: 'evaluation', meaningVi: 'đánh giá' };
  const w15 = w[14] || { word: 'strategy', meaningVi: 'chiến lược' };

  // --------------------------------------------------------------------------
  // PART 5: 15 COMPREHENSIVE TOEIC QUESTIONS TIED DIRECTLY TO THIS TOPIC
  // --------------------------------------------------------------------------
  if (selectedPart === 5) {
    return [
      {
        id: `topic-r-p5-${topic.id}-1`,
        part: 5,
        phase,
        category: `1. Từ Loại: Trạng Từ Bổ Nghĩa Động Từ (Adverb -ly)`,
        questionText: `The management committee requested that all ${w1.word} documents be outlined as _______ as possible to avoid misunderstandings.`,
        options: [
          { key: 'A', text: 'specific' },
          { key: 'B', text: 'specifically' },
          { key: 'C', text: 'specifications' },
          { key: 'D', text: 'specifying' },
        ],
        correctAnswer: 'B',
        sentenceTranslationVi: `Ban quản lý đã yêu cầu toàn bộ các tài liệu ${w1.meaningVi} phải được phác thảo một cách cụ thể nhất có thể để tránh những hiểu lầm.`,
        explanationVi: `Cấu trúc so sánh "as + adv + as possible" bổ nghĩa cho phân từ quá khứ "outlined" (được phác thảo một cách cụ thể). Chỗ trống cần một trạng từ kết thúc bằng đuôi "-ly": chọn "specifically".`,
        grammarRuleVi: `Cấu trúc so sánh bằng: as + adj/adv + as. Khi bổ nghĩa cho động từ/phân từ, bắt buộc dùng trạng từ (adv).`,
        trapType: `Bẫy từ loại (Chọn nhầm tính từ 'specific' do thói quen thấy 'as...as')`,
      },
      {
        id: `topic-r-p5-${topic.id}-2`,
        part: 5,
        phase,
        category: `2. Từ Loại: Cụm Danh Từ (Noun Suffix -ment)`,
        questionText: `Prior to executing the new ${w2.word}, both corporate parties thoroughly reviewed all terms and stipulations.`,
        options: [
          { key: 'A', text: 'agreement' },
          { key: 'B', text: 'agreed' },
          { key: 'C', text: 'agreeable' },
          { key: 'D', text: 'agreeably' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Trước khi thực thi ${w2.meaningVi} mới, cả hai bên doanh nghiệp đã rà soát kỹ lưỡng toàn bộ các điều khoản và quy định.`,
        explanationVi: `Sau tính từ "new" cần một danh từ để tạo thành cụm danh từ làm tân ngữ. Đuôi "-ment" là dấu hiệu đặc trưng của danh từ: chọn "agreement".`,
        grammarRuleVi: `Trật tự cụm danh từ: Tính từ (Adj) + Danh từ (Noun).`,
        trapType: `Bẫy nhầm lẫn giữa tính từ và danh từ`,
      },
      {
        id: `topic-r-p5-${topic.id}-3`,
        part: 5,
        phase,
        category: `3. Từ Loại: Phân Từ Bị Động Làm Tính Từ (Adjective -ed)`,
        questionText: `The operations team was legally _______ by corporate policy to replace any defective components within twenty-four hours.`,
        options: [
          { key: 'A', text: 'obligate' },
          { key: 'B', text: 'obligated' },
          { key: 'C', text: 'obligation' },
          { key: 'D', text: 'obligatory' },
        ],
        correctAnswer: 'B',
        sentenceTranslationVi: `Đội ngũ vận hành đã bị ràng buộc về mặt pháp lý bởi chính sách công ty phải thay thế mọi linh kiện bị lỗi trong vòng 24 giờ.`,
        explanationVi: `Cấu trúc bị động "be + legally + V3/ed + to V" (được/bị ai bắt buộc làm gì): chọn "obligated".`,
        grammarRuleVi: `Cấu trúc bị động: S + be + (adv) + V-ed/V3 + to-infinitive.`,
        trapType: `Bẫy cấu trúc phân từ bị động sau trạng từ`,
      },
      {
        id: `topic-r-p5-${topic.id}-4`,
        part: 5,
        phase,
        category: `4. Thì Động Từ: Hiện Tại Hoàn Thành (Present Perfect)`,
        questionText: `Over the past three weeks, the department _______ several critical provisions regarding the ${w3.word}.`,
        options: [
          { key: 'A', text: 'has modified' },
          { key: 'B', text: 'modifies' },
          { key: 'C', text: 'will modify' },
          { key: 'D', text: 'modifying' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Trong suốt ba tuần qua, phòng ban đã sửa đổi một số điều khoản then chốt liên quan đến ${w3.meaningVi}.`,
        explanationVi: `Cụm trạng ngữ thời gian "Over the past three weeks" là dấu hiệu kinh điển của thì Hiện tại hoàn thành (have/has + V3/ed). Chủ ngữ "the department" là số ít nên chọn "has modified".`,
        grammarRuleVi: `Dấu hiệu Hiện tại hoàn thành: Over/In/During the past/last + khoảng thời gian ➔ S + have/has + V3/ed.`,
        trapType: `Bẫy chia thì động từ theo trạng ngữ thời gian`,
      },
      {
        id: `topic-r-p5-${topic.id}-5`,
        part: 5,
        phase,
        category: `5. Thể Bị Động: Bị Động Với Động Từ Khiếm Khuyết (Modal Passive)`,
        questionText: `All disputed inquiries regarding the ${w4.word} must be _______ by an authorized supervisor before refunds are approved.`,
        options: [
          { key: 'A', text: 'resolve' },
          { key: 'B', text: 'resolves' },
          { key: 'C', text: 'resolved' },
          { key: 'D', text: 'resolving' },
        ],
        correctAnswer: 'C',
        sentenceTranslationVi: `Tất cả các thắc mắc còn tranh chấp liên quan đến ${w4.meaningVi} phải được giải quyết bởi một người giám sát có thẩm quyền trước khi việc hoàn tiền được phê duyệt.`,
        explanationVi: `Cấu trúc bị động với động từ khiếm khuyết: "must be + V3/ed": chọn "resolved".`,
        grammarRuleVi: `Bị động với Modal verb: Modal verb + be + V-ed/V3.`,
        trapType: `Bẫy thể chủ động vs bị động`,
      },
      {
        id: `topic-r-p5-${topic.id}-6`,
        part: 5,
        phase,
        category: `6. Giới Từ Chỉ Thời Gian & Sự Kiện (Preposition - Prior to)`,
        questionText: `_______ submitting the official report on the ${w5.word}, please ensure all figures have been double-checked.`,
        options: [
          { key: 'A', text: 'Prior to' },
          { key: 'B', text: 'Ahead' },
          { key: 'C', text: 'In front' },
          { key: 'D', text: 'Previous' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Trước khi nộp bản báo cáo chính thức về ${w5.meaningVi}, xin vui lòng đảm bảo mọi số liệu đều đã được kiểm tra kỹ lưỡng.`,
        explanationVi: `"Prior to + V-ing/Noun" là cụm giới từ trang trọng mang nghĩa "Trước khi" (= before). "Ahead" phải đi với "of", "In front" đi với "of".`,
        grammarRuleVi: `Cụm giới từ chỉ thời gian: Prior to + V-ing/Noun Phrase (= Before).`,
        trapType: `Bẫy giới từ thiếu giới từ phụ đi kèm (Ahead of vs Prior to)`,
      },
      {
        id: `topic-r-p5-${topic.id}-7`,
        part: 5,
        phase,
        category: `7. Liên Từ vs Giới Từ: Nhượng Bộ (Although vs Despite)`,
        questionText: `_______ the regional office experienced unforeseen delays, the staff successfully fulfilled all ${w6.word}.`,
        options: [
          { key: 'A', text: 'Although' },
          { key: 'B', text: 'Despite' },
          { key: 'C', text: 'In spite of' },
          { key: 'D', text: 'Regardless' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Mặc dù văn phòng khu vực đã gặp phải những sự chậm trễ ngoài dự kiến, đội ngũ nhân viên vẫn hoàn thành xuất sắc tất cả ${w6.meaningVi}.`,
        explanationVi: `Phía sau là một mệnh đề hoàn chỉnh gồm Chủ ngữ ("the regional office") và Động từ ("experienced") ➔ Bắt buộc phải dùng liên từ phụ thuộc "Although". Các phương án "Despite" và "In spite of" chỉ đi với Cụm danh từ / V-ing.`,
        grammarRuleVi: `Mệnh đề nhượng bộ: Although / Even though + S + V, S + V. Tránh nhầm với Despite / In spite of + Noun/V-ing.`,
        trapType: `Bẫy kinh điển ETS giữa Liên từ (Clause) và Giới từ (Noun Phrase)`,
      },
      {
        id: `topic-r-p5-${topic.id}-8`,
        part: 5,
        phase,
        category: `8. Đại Từ Quan Hệ: Sở Hữu Cách (Relative Pronoun - Whose)`,
        questionText: `Mr. Alvarez is the senior ${w7.word} _______ strategic initiative increased department productivity by thirty percent.`,
        options: [
          { key: 'A', text: 'whose' },
          { key: 'B', text: 'who' },
          { key: 'C', text: 'whom' },
          { key: 'D', text: 'which' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Ông Alvarez là người ${w7.meaningVi} cấp cao có sáng kiến chiến lược đã giúp tăng năng suất của bộ phận lên 30%.`,
        explanationVi: `Khoảng trống đứng giữa danh từ chỉ người ("senior ${w7.word}") và danh từ làm chủ ngữ trong mệnh đề quan hệ ("strategic initiative") ➔ Dùng đại từ quan hệ sở hữu "whose".`,
        grammarRuleVi: `Đại từ quan hệ sở hữu: Noun (person/thing) + whose + Noun + V.`,
        trapType: `Bẫy đại từ quan hệ chủ ngữ (who) vs sở hữu (whose)`,
      },
      {
        id: `topic-r-p5-${topic.id}-9`,
        part: 5,
        phase,
        category: `9. Rút Gọn Mệnh Đề Quan Hệ: Phân Từ Chủ Động (Present Participle -ing)`,
        questionText: `Employees _______ to participate in the seminar on ${w8.word} must register online by Thursday noon.`,
        options: [
          { key: 'A', text: 'wishing' },
          { key: 'B', text: 'wish' },
          { key: 'C', text: 'wished' },
          { key: 'D', text: 'are wishing' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Những nhân viên có nguyện vọng tham gia hội thảo về ${w8.meaningVi} phải đăng ký trực tuyến trước trưa thứ Năm.`,
        explanationVi: `Câu đã có vị ngữ chính "must register". Khoảng trống cần phân từ hiện tại mang nghĩa chủ động để bổ nghĩa cho "Employees" (rút gọn từ "Employees who wish to"): chọn "wishing".`,
        grammarRuleVi: `Rút gọn mệnh đề quan hệ chủ động: S + V-ing + (O) + Động từ chính.`,
        trapType: `Bẫy thừa vị ngữ chia thì (chọn nhầm 'are wishing' hoặc 'wish')`,
      },
      {
        id: `topic-r-p5-${topic.id}-10`,
        part: 5,
        phase,
        category: `10. Liên Từ Tương Quan: Cấu Trúc Song Hành (Correlative - Either...or)`,
        questionText: `The committee decided that _______ the senior manager or the lead ${w9.word} will deliver the keynote address.`,
        options: [
          { key: 'A', text: 'either' },
          { key: 'B', text: 'neither' },
          { key: 'C', text: 'both' },
          { key: 'D', text: 'not only' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Ủy ban đã quyết định rằng hoặc người quản lý cấp cao hoặc ${w9.meaningVi} trưởng sẽ trình bày bài phát biểu chủ chốt.`,
        explanationVi: `Trong câu có liên từ "or" ➔ Cặp liên từ tương quan bắt buộc là "either...or" (hoặc cái này hoặc cái kia).`,
        grammarRuleVi: `Cặp liên từ cố định: either...or, neither...nor, both...and, not only...but also.`,
        trapType: `Bẫy phối hợp cặp liên từ tương quan`,
      },
      {
        id: `topic-r-p5-${topic.id}-11`,
        part: 5,
        phase,
        category: `11. Thể Giả Định Trong Môi Trường Doanh Nghiệp (Mandative Subjunctive)`,
        questionText: `The director requested that every department member _______ the new guidelines before next week's session.`,
        options: [
          { key: 'A', text: 'review' },
          { key: 'B', text: 'reviews' },
          { key: 'C', text: 'reviewed' },
          { key: 'D', text: 'reviewing' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Giám đốc yêu cầu rằng mọi thành viên trong phòng ban phải xem xét các hướng dẫn mới trước phiên làm việc tuần tới.`,
        explanationVi: `Động từ yêu cầu "request that + S + (should) + V-nguyên thể". Dù chủ ngữ "every department member" là số ít, động từ vẫn phải ở dạng nguyên thể không chia: chọn "review".`,
        grammarRuleVi: `Cấu trúc giả định thức: S + request / recommend / insist / require + that + S + (should) + V-infinitive.`,
        trapType: `Bẫy chia động từ thêm -s/es cho chủ ngữ số ít`,
      },
      {
        id: `topic-r-p5-${topic.id}-12`,
        part: 5,
        phase,
        category: `12. Collocation Cố Định: Động Từ Đi Kèm Giới Từ (Comply with)`,
        questionText: `All manufacturing facilities must strictly _______ with national environmental regulations.`,
        options: [
          { key: 'A', text: 'comply' },
          { key: 'B', text: 'abide' },
          { key: 'C', text: 'conform' },
          { key: 'D', text: 'adhere' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Tất cả các cơ sở sản xuất phải tuân thủ nghiêm ngặt các quy định về môi trường của quốc gia.`,
        explanationVi: `Giới từ đi sau chỗ trống là "with". Cụm động từ cố định: "comply with" (tuân thủ). Các động từ khác: "abide by", "adhere to", "conform to/with".`,
        grammarRuleVi: `Cụm từ tuân thủ TOEIC: comply with = adhere to = abide by = conform to.`,
        trapType: `Bẫy giới từ đi kèm động từ đồng nghĩa`,
      },
      {
        id: `topic-r-p5-${topic.id}-13`,
        part: 5,
        phase,
        category: `13. Cấu Trúc So Sánh: So Sánh Hơn Của Trạng Từ (Comparative Adverb)`,
        questionText: `Following the recent system upgrade, the network operations center functioned significantly _______ than before.`,
        options: [
          { key: 'A', text: 'more efficiently' },
          { key: 'B', text: 'efficient' },
          { key: 'C', text: 'efficiently' },
          { key: 'D', text: 'most efficient' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Sau đợt nâng cấp hệ thống gần đây, trung tâm vận hành mạng đã hoạt động hiệu quả hơn đáng kể so với trước đây.`,
        explanationVi: `Sau động từ hành động "functioned" và có từ "than" ➔ Cần cấu trúc so sánh hơn của trạng từ: "more efficiently". "Significantly" đóng vai trò từ nhấn mạnh mức độ so sánh.`,
        grammarRuleVi: `So sánh hơn trạng từ: S + V + (much/significantly) + more + adv + than.`,
        trapType: `Bẫy chọn nhầm tính từ 'efficient' sau động từ hành động`,
      },
      {
        id: `topic-r-p5-${topic.id}-14`,
        part: 5,
        phase,
        category: `14. Từ Vựng & Ngữ Cảnh Doanh Nghiệp (Contextual Vocabulary)`,
        questionText: `The executive board expressed great _______ with the substantial revenue growth achieved in the third quarter.`,
        options: [
          { key: 'A', text: 'satisfaction' },
          { key: 'B', text: 'complaint' },
          { key: 'C', text: 'hesitation' },
          { key: 'D', text: 'reluctance' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Ban điều hành đã bày tỏ sự hài lòng to lớn đối với mức tăng trưởng doanh thu đáng kể đạt được trong quý 3.`,
        explanationVi: `Cụm từ "expressed great satisfaction with" (bày tỏ sự hài lòng sâu sắc với kết quả kinh doanh tích cực). Các từ B (khiếu nại), C (do dự), D (ngập ngừng) không phù hợp ngữ cảnh khen ngợi tăng trưởng.`,
        grammarRuleVi: `Cụm danh từ biểu thị cảm xúc doanh nghiệp: express satisfaction with something.`,
        trapType: `Bẫy từ vựng trái nghĩa ngữ cảnh`,
      },
      {
        id: `topic-r-p5-${topic.id}-15`,
        part: 5,
        phase,
        category: `15. Từ Loại: Tính Từ Đuôi -ive (Adjective Suffix -ive)`,
        questionText: `The marketing division implemented a highly _______ promotional campaign that expanded market share.`,
        options: [
          { key: 'A', text: 'effective' },
          { key: 'B', text: 'effectively' },
          { key: 'C', text: 'effectiveness' },
          { key: 'D', text: 'effect' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Bộ phận tiếp thị đã triển khai một chiến dịch quảng bá vô cùng hiệu quả giúp mở rộng thị phần.`,
        explanationVi: `Chỗ trống đứng sau trạng từ "highly" và đứng trước danh từ "promotional campaign" ➔ Cần một tính từ: "effective" (có hiệu quả).`,
        grammarRuleVi: `Trật tự từ bổ nghĩa: Trạng từ (Adv) + Tính từ (Adj) + Danh từ (Noun).`,
        trapType: `Bẫy vị trí trạng từ bổ nghĩa tính từ`,
      },
    ];
  }

  // --------------------------------------------------------------------------
  // PART 6: TEXT COMPLETION (DEDICATED MEMO / EMAIL PASSAGE)
  // --------------------------------------------------------------------------
  if (selectedPart === 6) {
    return [
      {
        id: `topic-r-p6-${topic.id}-1`,
        part: 6,
        phase,
        category: `Part 6: Hoàn Thành Đoạn Văn - Thông Báo Về "${topic.titleVi}"`,
        passageTitle: `MEMORANDUM: Official Notice Regarding ${topic.title}`,
        passageType: 'Memo',
        passage: `TO: All Department Staff\nFROM: Office Administration\nDATE: October 14, 2026\nSUBJECT: Implementation of Revised ${topic.title} Procedures\n\nWe are pleased to announce that our updated corporate policy regarding ${topic.title} will take effect on the first of next month. Over the past quarter, the management team has worked diligently to streamline internal protocols and ensure full alignment with international standards.\n\nAll employees are encouraged to review the documentation carefully. Please note that [1] _______ must be submitted through the new online employee portal. In addition, department supervisors will hold informational sessions next Tuesday to address any operational questions.\n\nThank you for your dedication to operational excellence.`,
        questionText: `Select the word that best completes blank [1] in the memorandum.`,
        options: [
          { key: 'A', text: `${w5.word} forms` },
          { key: 'B', text: 'grocery recipes' },
          { key: 'C', text: 'airline tickets' },
          { key: 'D', text: 'movie vouchers' },
        ],
        correctAnswer: 'A',
        sentenceTranslationVi: `Xin lưu ý rằng các biểu mẫu ${w5.meaningVi} phải được nộp thông qua cổng thông tin trực tuyến mới của nhân viên.`,
        explanationVi: `Ngữ cảnh văn bản nội bộ yêu cầu nộp các biểu mẫu liên quan đến chủ đề công việc: chọn "${w5.word} forms".`,
        trapType: 'Bẫy từ vựng không liên quan văn cảnh công sở',
      },
    ];
  }

  // --------------------------------------------------------------------------
  // PART 7: READING COMPREHENSION (EMAIL / ANNOUNCEMENT / SCHEDULE)
  // --------------------------------------------------------------------------
  return [
    {
      id: `topic-r-p7-${topic.id}-1`,
      part: 7,
      phase,
      category: `Part 7: Đọc Hiểu Tài Liệu - Thư Tín Thương Mại Về "${topic.titleVi}"`,
      passageTitle: `BUSINESS CORRESPONDENCE: Apex Solutions & Vertex Global`,
      passageType: 'Email',
      passage: `From: Eleanor Vance <e.vance@apexsolutions.com>\nTo: Marcus Sterling <m.sterling@vertexglobal.com>\nDate: November 3, 2026\nSubject: Update Regarding ${topic.title}\n\nDear Mr. Sterling,\n\nI am writing to confirm that our committee has thoroughly evaluated your proposal regarding ${topic.title}. We are exceptionally impressed with the strategic outline and the comprehensive timeline your team provided.\n\nOur legal and operational executives have endorsed all primary provisions, including the ${w1.word} requirements outlined in Section 4. We anticipate finalizing the signed agreement by Friday, November 7.\n\nShould you require any supplementary documentation prior to our scheduled briefing, please feel free to contact my office directly.\n\nSincerely,\nEleanor Vance\nDirector of Operations\nApex Solutions International`,
      questionText: `What is the main purpose of the email?`,
      options: [
        { key: 'A', text: `A. To express approval of a business proposal regarding ${topic.title}.` },
        { key: 'B', text: 'B. To notify an employee of a scheduled performance appraisal.' },
        { key: 'C', text: 'C. To request a refund for defective merchandise.' },
        { key: 'D', text: 'D. To announce the relocation of corporate headquarters.' },
      ],
      correctAnswer: 'A',
      sentenceTranslationVi: `Dịch câu hỏi: Mục đích chính của bức email là gì?\n➔ Đáp án A: Bày tỏ sự phê duyệt đối với một đề xuất kinh doanh liên quan đến ${topic.titleVi}.`,
      explanationVi: `Người gửi (Eleanor Vance) viết: "I am writing to confirm that our committee has thoroughly evaluated your proposal... Our legal and operational executives have endorsed all primary provisions" ➔ Mục đích chính là thông báo phê duyệt bản đề xuất hợp tác.`,
      trapType: 'Câu hỏi ý chính văn bản (Main Purpose)',
      paraphrasedKeywords: [
        { inPassage: 'endorsed all primary provisions', inQuestion: 'express approval' },
      ],
    },
    {
      id: `topic-r-p7-${topic.id}-2`,
      part: 7,
      phase,
      category: `Part 7: Câu Hỏi Chi Tiết & Mốc Thời Gian (Detail Question)`,
      passageTitle: `BUSINESS CORRESPONDENCE: Apex Solutions & Vertex Global`,
      passageType: 'Email',
      passage: `(Tham chiếu thư điện tử của Eleanor Vance gửi Marcus Sterling ở câu 1)`,
      questionText: `When does Ms. Vance expect the agreement to be finalized?`,
      options: [
        { key: 'A', text: 'A. By Friday, November 7' },
        { key: 'B', text: 'B. On November 3' },
        { key: 'C', text: 'C. Early next year' },
        { key: 'D', text: 'D. Immediately after the phone conference' },
      ],
      correctAnswer: 'A',
      sentenceTranslationVi: `Dịch câu hỏi: Bà Vance dự kiến thỏa thuận sẽ được hoàn tất vào thời gian nào?\n➔ Đáp án A: Trước hoặc vào thứ Sáu, ngày 7 tháng 11.`,
      explanationVi: `Trong bức thư, bà Vance nêu rõ: "We anticipate finalizing the signed agreement by Friday, November 7" ➔ Khẳng định chính xác thời điểm là ngày 7 tháng 11.`,
      trapType: 'Câu hỏi thông tin chi tiết (Fact/Detail Finding)',
    },
  ];
}
