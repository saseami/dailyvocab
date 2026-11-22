export interface GrammarDiagnostic {
  id: string;
  category: 'grammar' | 'punctuation' | 'collocation' | 'spelling';
  issue: string; // Tên lỗi: e.g. "Lỗi chia động từ (Subject-Verb Agreement)"
  originalSnippet: string; // Đoạn từ sai: e.g. "the manager review"
  correctedSnippet: string; // Đoạn sửa đúng: e.g. "the manager reviews" (hoặc "reviewed")
  ruleExplanation: string; // Lời giải thích quy tắc chi tiết
}

export interface PolishingTip {
  title: string;
  explanation: string;
  example: string;
}

export interface WritingEvaluation {
  score: number; // 0 - 100
  toeicWritingScaled: number; // 0 - 200
  band: 'A2' | 'B1' | 'B2' | 'C1';
  keywordsUsed: { word: string; found: boolean }[];
  wordCount: number;
  feedback: string[];
  suggestions: string[];
  modelAnswer: string;
  // Chi tiết lỗi sai & cách khắc phục
  grammarDiagnostics: GrammarDiagnostic[];
  correctedSentence: string;
  // Câu nâng cấp chuẩn văn phong bản xứ & mẹo viết câu hay
  polishedSentence: string;
  polishedSentenceVi: string;
  polishingTips: PolishingTip[];
}

const BUSINESS_CONNECTORS = [
  'furthermore', 'moreover', 'consequently', 'therefore', 'in accordance with',
  'regarding', 'with reference to', 'please be advised', 'as requested', 'in addition to',
  'nevertheless', 'promptly', 'sincerely', 'we would appreciate', 'in order to',
  'prior to', 'as a result', 'in response to', 'to ensure that'
];

/**
 * Phân tích lỗi ngữ pháp, chính tả, giới từ, mạo từ và sự hòa hợp S-V
 */
function analyzeGrammarErrors(rawText: string): { diagnostics: GrammarDiagnostic[]; corrected: string } {
  const diagnostics: GrammarDiagnostic[] = [];
  let corrected = rawText.trim();

  // 1. Kiểm tra viết hoa đầu câu
  if (corrected.length > 0 && corrected[0] !== corrected[0].toUpperCase()) {
    const firstChar = corrected[0];
    const upperFirst = firstChar.toUpperCase();
    diagnostics.push({
      id: 'cap-first',
      category: 'punctuation',
      issue: 'Chữ cái đầu câu chưa viết hoa',
      originalSnippet: firstChar,
      correctedSnippet: upperFirst,
      ruleExplanation: 'Trong văn phong chuẩn, ký tự đầu tiên của câu luôn luôn phải viết hoa.'
    });
    corrected = upperFirst + corrected.slice(1);
  }

  // 2. Kiểm tra đại từ "i" viết thường
  if (/\bi\b/.test(corrected)) {
    diagnostics.push({
      id: 'cap-pronoun-i',
      category: 'punctuation',
      issue: "Đại từ nhân xưng 'I' viết thường",
      originalSnippet: 'i',
      correctedSnippet: 'I',
      ruleExplanation: "Đại từ nhân xưng 'I' (tôi) luôn luôn phải viết hoa trong tiếng Anh dù đứng ở bất kỳ vị trí nào."
    });
    corrected = corrected.replace(/\bi\b/g, 'I');
  }

  // 3. Kiểm tra dấu câu kết thúc
  if (corrected.length > 0 && !['.', '!', '?'].includes(corrected.slice(-1))) {
    diagnostics.push({
      id: 'punct-end',
      category: 'punctuation',
      issue: 'Thiếu dấu chấm kết thúc câu',
      originalSnippet: '(cuối câu trống)',
      correctedSnippet: '.',
      ruleExplanation: 'Một câu hoàn chỉnh trong bài thi TOEIC Writing bắt buộc phải kết thúc bằng dấu chấm câu.'
    });
    corrected = corrected + '.';
  }

  // 4. Khoảng trắng thừa trước dấu câu (ví dụ: "word , word" hoặc "word .")
  if (/\s+([,\.!\?])/.test(corrected)) {
    diagnostics.push({
      id: 'punct-space-before',
      category: 'punctuation',
      issue: 'Khoảng trắng thừa đứng trước dấu câu',
      originalSnippet: ' [dấu câu]',
      correctedSnippet: '[dấu câu]',
      ruleExplanation: 'Dấu phẩy, dấu chấm phải viết liền kề ký tự trước đó, không chèn khoảng trắng phía trước.'
    });
    corrected = corrected.replace(/\s+([,\.!\?])/g, '$1');
  }

  // 5. Thiếu khoảng trắng sau dấu câu (ví dụ: "word,word" hoặc "word.Word")
  if (/([,\.!\?])([a-zA-Z])/.test(corrected)) {
    diagnostics.push({
      id: 'punct-space-after',
      category: 'punctuation',
      issue: 'Thiếu khoảng trắng sau dấu câu',
      originalSnippet: ',[từ]',
      correctedSnippet: ', [từ]',
      ruleExplanation: 'Sau dấu phẩy hoặc dấu chấm cần có một khoảng cách (space) trước khi viết từ tiếp theo.'
    });
    corrected = corrected.replace(/([,\.!\?])([a-zA-Z])/g, '$1 $2');
  }

  // 6. Lỗi thừa giới từ kinh điển sau ngoại động từ (TOEIC Traps)
  const transitiveErrors = [
    {
      regex: /\b(discuss|discusses|discussed)\s+about\b/gi,
      wrong: 'discuss about',
      right: 'discuss',
      issue: "Thừa giới từ 'about' sau động từ 'discuss'",
      explanation: "Trong tiếng Anh thương mại, 'discuss' là ngoại động từ trực tiếp (discuss the proposal), không đi kèm giới từ 'about'."
    },
    {
      regex: /\b(mention|mentions|mentioned)\s+about\b/gi,
      wrong: 'mention about',
      right: 'mention',
      issue: "Thừa giới từ 'about' sau động từ 'mention'",
      explanation: "'Mention' là ngoại động từ tác động thẳng vào đối tượng (mention the policy), không dùng 'about'."
    },
    {
      regex: /\b(contact|contacts|contacted)\s+with\b/gi,
      wrong: 'contact with',
      right: 'contact',
      issue: "Thừa giới từ 'with' sau động từ 'contact'",
      explanation: "Động từ 'contact' tác động trực tiếp vào người nhận (contact our customer service), không có 'with'."
    },
    {
      regex: /\b(reach|reaches|reached)\s+to\s+(an?|the|our|their)?\s*(agreement|conclusion|decision|office)\b/gi,
      wrong: 'reach to',
      right: 'reach',
      issue: "Thừa giới từ 'to' sau động từ 'reach'",
      explanation: "Cụm 'reach an agreement' hoặc 'reach the venue' không dùng giới từ 'to'."
    }
  ];

  for (const item of transitiveErrors) {
    if (item.regex.test(corrected)) {
      diagnostics.push({
        id: `trans-${item.wrong}`,
        category: 'collocation',
        issue: item.issue,
        originalSnippet: item.wrong,
        correctedSnippet: item.right,
        ruleExplanation: item.explanation
      });
      corrected = corrected.replace(item.regex, (_m, p1, p2, p3) => {
        return p3 ? `${p1} ${p2 ? p2 + ' ' : ''}${p3}` : p1;
      });
    }
  }

  // 7. Lỗi dùng sai giới từ trong Collocation (Preposition Errors)
  const prepErrors = [
    {
      regex: /\bpay\s+attention\s+on\b/gi,
      wrong: 'pay attention on',
      right: 'pay attention to',
      issue: "Dùng sai giới từ 'on' với cụm 'pay attention'",
      explanation: "Cấu trúc cố định là 'pay attention to something' (chú ý tới điều gì)."
    },
    {
      regex: /\bresponsible\s+of\b/gi,
      wrong: 'responsible of',
      right: 'responsible for',
      issue: "Dùng sai giới từ 'of' với tính từ 'responsible'",
      explanation: "Tính từ 'responsible' luôn đi kèm giới từ 'for' (chịu trách nhiệm về)."
    },
    {
      regex: /\bdepend\s+of\b/gi,
      wrong: 'depend of',
      right: 'depend on',
      issue: "Dùng sai giới từ 'of' với động từ 'depend'",
      explanation: "Động từ 'depend' đi kèm giới từ 'on' (phụ thuộc vào)."
    },
    {
      regex: /\bcomply\s+to\b/gi,
      wrong: 'comply to',
      right: 'comply with',
      issue: "Dùng sai giới từ 'to' với động từ 'comply'",
      explanation: "Quy tắc chuẩn TOEIC: Động từ 'comply' luôn đi với giới từ 'with' (tuân thủ quy chuẩn)."
    },
    {
      regex: /\badhere\s+with\b/gi,
      wrong: 'adhere with',
      right: 'adhere to',
      issue: "Dùng sai giới từ 'with' với động từ 'adhere'",
      explanation: "Động từ 'adhere' luôn đi kèm giới từ 'to' (tuân thủ nguyên tắc)."
    },
    {
      regex: /\blook\s+forward\s+to\s+meet\b/gi,
      wrong: 'look forward to meet',
      right: 'look forward to meeting',
      issue: "Sau cụm 'look forward to' phải dùng V-ing",
      explanation: "Trong cụm 'look forward to', 'to' là giới từ nên động từ đi sau bắt buộc phải ở dạng danh động từ (meeting)."
    }
  ];

  for (const item of prepErrors) {
    if (item.regex.test(corrected)) {
      diagnostics.push({
        id: `prep-${item.wrong}`,
        category: 'collocation',
        issue: item.issue,
        originalSnippet: item.wrong,
        correctedSnippet: item.right,
        ruleExplanation: item.explanation
      });
      corrected = corrected.replace(item.regex, item.right);
    }
  }

  // 8. Lỗi động từ sau giới từ (Preposition + V-bare -> V-ing)
  const prepVingRules = [
    { regex: /\b(before|after|without|by|for)\s+sign\b/gi, verb: 'sign', ing: 'signing' },
    { regex: /\b(before|after|without|by|for)\s+review\b/gi, verb: 'review', ing: 'reviewing' },
    { regex: /\b(before|after|without|by|for)\s+send\b/gi, verb: 'send', ing: 'sending' },
    { regex: /\b(before|after|without|by|for)\s+approve\b/gi, verb: 'approve', ing: 'approving' },
    { regex: /\b(before|after|without|by|for)\s+check\b/gi, verb: 'check', ing: 'checking' }
  ];

  for (const item of prepVingRules) {
    if (item.regex.test(corrected)) {
      diagnostics.push({
        id: `prep-ving-${item.verb}`,
        category: 'grammar',
        issue: `Động từ sau giới từ chưa chia V-ing ('${item.verb}')`,
        originalSnippet: item.verb,
        correctedSnippet: item.ing,
        ruleExplanation: `Sau các giới từ (before, after, by, without...), động từ phải chia ở dạng danh động từ V-ing (${item.ing}).`
      });
      corrected = corrected.replace(item.regex, (_m, p1) => `${p1} ${item.ing}`);
    }
  }

  // 9. Lỗi thừa "to" sau động từ khuyết thiếu (Modal verb: can to, must to, will to, should to)
  const modalToRegex = /\b(can|will|must|should|could|would)\s+to\s+([a-zA-Z]+)\b/gi;
  if (modalToRegex.test(corrected)) {
    diagnostics.push({
      id: 'modal-to-bare',
      category: 'grammar',
      issue: "Thừa 'to' sau động từ khuyết thiếu (Modal Verb)",
      originalSnippet: 'modal + to + V',
      correctedSnippet: 'modal + V-bare',
      ruleExplanation: 'Sau các trợ động từ khuyết thiếu (can, will, must, should...), luôn dùng động từ nguyên mẫu không có "to".'
    });
    corrected = corrected.replace(modalToRegex, '$1 $2');
  }

  // 10. Lỗi hòa hợp Chủ ngữ - Động từ (Subject-Verb Agreement)
  const hasPastMarker = /\b(yesterday|last\s+(week|month|year)|ago|in\s+202[0-5])\b/i.test(corrected);
  const svSingleErrors = [
    {
      subjectRegex: /\b(the manager|the supervisor|the director|the company|he|she|it|the client|the customer)\s+(review|sign|want|need|require|approve|decide|confirm|agree|state)\b/gi,
      issue: 'Lỗi chia động từ với chủ ngữ số ít (Subject-Verb Agreement)',
      ruleExplanation: hasPastMarker
        ? 'Câu có mốc thời gian trong quá khứ nên động từ cần chia ở thì quá khứ đơn (-ed).'
        : 'Chủ ngữ ngôi thứ 3 số ít cần chia động từ thêm -s/-es ở thì hiện tại đơn.'
    }
  ];

  for (const sv of svSingleErrors) {
    if (sv.subjectRegex.test(corrected)) {
      diagnostics.push({
        id: 'sv-agreement-singular',
        category: 'grammar',
        issue: sv.issue,
        originalSnippet: 'Chủ ngữ số ít + V-nguyên mẫu',
        correctedSnippet: hasPastMarker ? 'V-quá khứ (-ed)' : 'V-thêm s/es',
        ruleExplanation: sv.ruleExplanation
      });
      corrected = corrected.replace(sv.subjectRegex, (_m, subj, verb) => {
        if (hasPastMarker) {
          const pastVerb = verb.endsWith('e') ? `${verb}d` : `${verb}ed`;
          return `${subj} ${pastVerb}`;
        } else {
          const sVerb = verb.endsWith('e') ? `${verb}s` : `${verb}s`;
          return `${subj} ${sVerb}`;
        }
      });
    }
  }

  // S-V với have/has: "he have" -> "he has"
  if (/\b(he|she|it|the manager|the company)\s+have\b/gi.test(corrected)) {
    diagnostics.push({
      id: 'sv-has',
      category: 'grammar',
      issue: "Dùng sai 'have' với chủ ngữ số ít",
      originalSnippet: 'have',
      correctedSnippet: 'has',
      ruleExplanation: "Với chủ ngữ số ít, trợ động từ bắt buộc là 'has'."
    });
    corrected = corrected.replace(/\b(he|she|it|the manager|the company)\s+have\b/gi, '$1 has');
  }

  // 11. Kiểm tra thiếu mạo từ trước danh từ đếm được số ít thông dụng
  const articleTraps = [
    { regex: /\b(sign|signed|review|reviewed|approve|approved)\s+(contract|agreement|report|proposal)\b/gi, noun: 'contract/agreement' },
    { regex: /\b(in|at)\s+(office|meeting\s+room|headquarters)\b/gi, noun: 'office' }
  ];

  for (const art of articleTraps) {
    if (art.regex.test(corrected)) {
      diagnostics.push({
        id: `art-${art.noun}`,
        category: 'grammar',
        issue: `Thiếu mạo từ 'the' hoặc 'a' trước danh từ '${art.noun}'`,
        originalSnippet: `đứng trơ trọi không có mạo từ`,
        correctedSnippet: `the ${art.noun}`,
        ruleExplanation: "Trong tiếng Anh, danh từ đếm được số ít bắt buộc phải có mạo từ (the/a/an) hoặc đại từ sở hữu đứng trước."
      });
      corrected = corrected.replace(art.regex, '$1 the $2');
    }
  }

  // 12. Dọn dẹp khoảng trắng kép thừa
  corrected = corrected.replace(/\s{2,}/g, ' ').trim();

  return { diagnostics, corrected };
}

/**
 * Tạo câu nâng cấp chuẩn văn phong bản xứ (Level 8 / C1) dựa trên ý tưởng của học viên
 */
function generatePolishedSentence(
  studentInput: string,
  correctedSentence: string,
  modelAnswer: string,
  requiredWords: string[]
): { polishedSentence: string; polishedSentenceVi: string; tips: PolishingTip[] } {
  const lower = studentInput.toLowerCase();

  let polishedSentence = '';
  let polishedSentenceVi = '';

  // Nhận diện theo ngữ nghĩa và từ vựng
  if (lower.includes('contract') || lower.includes('warranty') || lower.includes('agreement') || lower.includes('hợp đồng') || lower.includes('bảo hành')) {
    polishedSentence = 'In accordance with our contractual obligations, the management has officially finalized the agreement to ensure comprehensive warranty coverage.';
    polishedSentenceVi = 'Căn cứ theo các nghĩa vụ trong hợp đồng, ban điều hành đã chính thức ký kết thỏa thuận nhằm đảm bảo quyền lợi bảo hành toàn diện.';
  } else if (lower.includes('plan') || lower.includes('budget') || lower.includes('conference') || lower.includes('kế hoạch') || lower.includes('ngân sách')) {
    polishedSentence = 'To ensure maximum organizational efficiency, the executive committee approved the strategic plan and allocated sufficient financial resources for the upcoming conference.';
    polishedSentenceVi = 'Để đảm bảo hiệu quả điều hành cao nhất, ban thường trực đã phê duyệt kế hoạch chiến lược và phân bổ đầy đủ nguồn lực tài chính cho hội nghị sắp tới.';
  } else if (lower.includes('system') || lower.includes('technology') || lower.includes('upgrade') || lower.includes('công nghệ') || lower.includes('máy tính')) {
    polishedSentence = 'Please be advised that the technical department will upgrade our core infrastructure this weekend to enhance operational security and network stability.';
    polishedSentenceVi = 'Xin lưu ý rằng bộ phận kỹ thuật sẽ nâng cấp hệ thống hạ tầng trọng yếu vào cuối tuần này nhằm tăng cường bảo mật vận hành và tính ổn định của mạng lưới.';
  } else if (lower.includes('email') || lower.includes('inquiry') || lower.includes('customer') || lower.includes('client') || lower.includes('khách hàng')) {
    polishedSentence = 'Thank you for your prompt correspondence regarding our services, and we assure you that your request will be addressed with the utmost priority.';
    polishedSentenceVi = 'Cảm ơn bạn đã phản hồi nhanh chóng về các dịch vụ của chúng tôi, và chúng tôi đảm bảo rằng yêu cầu của bạn sẽ được giải quyết với ưu tiên cao nhất.';
  } else {
    // Nâng cấp tổng quát dựa trên correctedSentence
    let enhanced = correctedSentence.replace(/\.$/, '');
    // Thay thế từ thông thường bằng từ công sở
    enhanced = enhanced
      .replace(/\bvery\s+good\b/gi, 'exceptional')
      .replace(/\btalk\s+about\b/gi, 'thoroughly address')
      .replace(/\bhelp\b/gi, 'facilitate')
      .replace(/\bfix\b/gi, 'resolve')
      .replace(/\bmake\s+sure\b/gi, 'ensure that');

    if (!BUSINESS_CONNECTORS.some(c => enhanced.toLowerCase().includes(c))) {
      polishedSentence = `Furthermore, ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)} in order to optimize business productivity and achieve long-term objectives.`;
    } else {
      polishedSentence = `${enhanced} to ensure optimal business outcomes.`;
    }
    polishedSentenceVi = 'Hơn nữa, tiến trình đã được hoàn thiện nhằm tối ưu hóa năng suất doanh nghiệp và đạt được các mục tiêu dài hạn.';
  }

  const tips: PolishingTip[] = [
    {
      title: 'Mẹo 1: Sử dụng Mệnh đề Trạng ngữ Mở đầu (Introductory Clause)',
      explanation: 'Thay vì mở đầu đơn điệu bằng chủ ngữ "We" hoặc "The manager", hãy dùng các cụm giới từ trang trọng như "In accordance with...", "To ensure optimal efficiency...", hoặc "Having reviewed the proposal...".',
      example: 'In accordance with our contractual obligations, the management finalized the agreement.'
    },
    {
      title: 'Mẹo 2: Nâng cấp Business Collocation chuẩn bản xứ',
      explanation: 'Thay thế các động từ bình dân bằng cụm từ vựng hành chính công sở: thay "make an agreement" bằng "finalize/execute a contract"; thay "talk about" bằng "thoroughly address/negotiate"; thay "fix" bằng "rectify/resolve".',
      example: 'resolve the issue promptly (thay vì: fix the problem quickly)'
    },
    {
      title: 'Mẹo 3: Cấu trúc Thể bị động & Mệnh đề chỉ mục đích (Passive & Purpose)',
      explanation: 'Kết hợp thể bị động khách quan (e.g. "must be formally approved") cùng liên từ chỉ mục đích ("in order to", "so as to") để tạo nên câu văn gãy gọn, học thuật chuẩn bài thi TOEIC Writing Level 8.',
      example: 'All guidelines were updated in order to maintain international quality standards.'
    }
  ];

  return { polishedSentence, polishedSentenceVi, tips };
}

export function evaluateTOEICWriting(
  studentText: string,
  requiredWords: string[],
  modelAnswer: string,
  minWordCount: number = 20
): WritingEvaluation {
  const text = studentText.trim();
  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Phân tích ngữ pháp & chẩn đoán lỗi chi tiết
  const { diagnostics: grammarDiagnostics, corrected: correctedSentence } = analyzeGrammarErrors(text);

  // 2. Kiểm tra từ khóa mục tiêu
  const keywordsUsed = requiredWords.map(kw => {
    const cleanKw = kw.toLowerCase().trim();
    const found = lowerText.includes(cleanKw) || lowerText.includes(cleanKw.slice(0, -1));
    return { word: kw, found };
  });

  const matchedKeywordsCount = keywordsUsed.filter(k => k.found).length;
  const keywordScore = requiredWords.length > 0 
    ? (matchedKeywordsCount / requiredWords.length) * 35 
    : 35;

  // 3. Điểm độ dài câu (tối đa 25 điểm)
  let lengthScore = 0;
  if (wordCount >= minWordCount) {
    lengthScore = 25;
  } else if (wordCount > 0) {
    lengthScore = (wordCount / minWordCount) * 20;
  }

  // 4. Cấu trúc câu & Cụm liên từ thương mại (tối đa 25 điểm)
  const usedConnectors = BUSINESS_CONNECTORS.filter(c => lowerText.includes(c));
  const connectorBonus = Math.min(25, usedConnectors.length * 8 + (text.includes(',') ? 5 : 0) + (text.includes('.') ? 5 : 0));

  // 5. Trừ điểm ngữ pháp dựa trên số lượng lỗi thực tế được phát hiện
  let grammarScore = 15;
  const errorPenalty = grammarDiagnostics.length * 3;
  grammarScore = Math.max(2, grammarScore - errorPenalty);

  const totalScore = Math.round(Math.min(100, Math.max(10, keywordScore + lengthScore + connectorBonus + grammarScore)));

  // Scaled to TOEIC Writing (0 - 200)
  const toeicWritingScaled = Math.round((totalScore / 100) * 190) + 10;

  let band: 'A2' | 'B1' | 'B2' | 'C1' = 'B1';
  if (totalScore >= 85) band = 'C1';
  else if (totalScore >= 70) band = 'B2';
  else if (totalScore >= 50) band = 'B1';
  else band = 'A2';

  const feedback: string[] = [];
  const suggestions: string[] = [];

  if (grammarDiagnostics.length === 0) {
    feedback.push('Ngữ pháp & Chính tả chuẩn xác! Không phát hiện lỗi cấu trúc cơ bản.');
  } else {
    feedback.push(`Phát hiện ${grammarDiagnostics.length} điểm ngữ pháp & dùng từ cần tinh chỉnh.`);
  }

  if (matchedKeywordsCount === requiredWords.length) {
    feedback.push(`Xuất sắc! Đã lồng ghép chuẩn xác ${matchedKeywordsCount}/${requiredWords.length} từ vựng trọng tâm.`);
  } else {
    const missing = keywordsUsed.filter(k => !k.found).map(k => `"${k.word}"`).join(', ');
    feedback.push(`Cần bổ sung các từ khóa còn thiếu: ${missing}.`);
    suggestions.push(`Thử dùng từ ${missing} vào một mệnh đề quan hệ hoặc cụm giới từ.`);
  }

  if (wordCount >= minWordCount) {
    feedback.push(`Độ dài câu lý tưởng (${wordCount} từ), thể hiện khả năng diễn đạt thông tin trọn vẹn.`);
  } else {
    suggestions.push(`Bổ sung thêm lý do (Because/Since...), thời gian (By next week...), hoặc điều kiện (Provided that...).`);
  }

  if (usedConnectors.length > 0) {
    feedback.push(`Rất chuyên nghiệp! Đã sử dụng cụm nối thương mại: "${usedConnectors.join(', ')}".`);
  } else {
    suggestions.push(`Thử dùng thêm liên từ công sở như "Regarding...", "In accordance with...", "Please note that..." để nâng band điểm.`);
  }

  // 6. Tạo câu nâng cấp chuẩn bản xứ & Mẹo tạo câu hay
  const { polishedSentence, polishedSentenceVi, tips: polishingTips } = generatePolishedSentence(
    studentText,
    correctedSentence,
    modelAnswer,
    requiredWords
  );

  return {
    score: totalScore,
    toeicWritingScaled,
    band,
    keywordsUsed,
    wordCount,
    feedback,
    suggestions,
    modelAnswer,
    grammarDiagnostics,
    correctedSentence,
    polishedSentence,
    polishedSentenceVi,
    polishingTips
  };
}
