import { INITIAL_WORDS } from '../data/curriculum';
import { SUPPLEMENTAL_WORDS } from '../data/supplementalVocab';
import { LEXICON, KNOWN_COLLOCATIONS } from './contextualDictionary';
import { Word } from '../types';

export interface TranslatedWordResult {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningVi: string;
  definitionEn: string;
  example: string;
  exampleVi?: string;
  suggestedExamples?: { en: string; vi: string }[];
  collocations?: string[];
  synonyms?: string[];
  isOnlineTranslated?: boolean;
}

// Built-in high-frequency TOEIC business dictionary for instant offline lookup
const TOEIC_LOCAL_DICTIONARY: Record<string, { ipa: string; pos: string; vi: string; defEn?: string }> = {
  committee: { ipa: '/kəˈmɪti/', pos: 'noun', vi: 'ủy ban, hội đồng', defEn: 'a group of people appointed for a specific function' },
  guideline: { ipa: '/ˈɡaɪdlaɪn/', pos: 'noun', vi: 'nguyên tắc chỉ đạo, hướng dẫn', defEn: 'a general rule, principle, or piece of advice' },
  guidelines: { ipa: '/ˈɡaɪdlaɪnz/', pos: 'noun', vi: 'các hướng dẫn, quy tắc chỉ đạo', defEn: 'rules or instructions on how something should be done' },
  outline: { ipa: '/ˈaʊtlaɪn/', pos: 'verb', vi: 'phác thảo, vạch ra các nét chính', defEn: 'give a summary of; sketch' },
  outlined: { ipa: '/ˈaʊtlaɪnd/', pos: 'verb', vi: 'được vạch ra, phác thảo chi tiết', defEn: 'summarized or marked out in general terms' },
  misunderstanding: { ipa: '/ˌmɪsʌndəˈstændɪŋ/', pos: 'noun', vi: 'sự hiểu lầm, bất đồng ý kiến', defEn: 'a failure to understand something correctly' },
  misunderstandings: { ipa: '/ˌmɪsʌndəˈstændɪŋz/', pos: 'noun', vi: 'những sự hiểu lầm, khúc mắc', defEn: 'failures to correctly interpret words or actions' },
  request: { ipa: '/rɪˈkwest/', pos: 'verb', vi: 'yêu cầu, đề nghị', defEn: 'politely or formally ask for something' },
  requested: { ipa: '/rɪˈkwestɪd/', pos: 'verb', vi: 'được yêu cầu, đề nghị', defEn: 'asked for formally or politely' },
  avoid: { ipa: '/əˈvɔɪd/', pos: 'verb', vi: 'tránh, ngăn ngừa', defEn: 'keep away from or stop oneself from doing' },
  avoiding: { ipa: '/əˈvɔɪdɪŋ/', pos: 'verb', vi: 'việc né tránh, ngăn ngừa', defEn: 'keeping away from' },
  legal: { ipa: '/ˈliːɡl/', pos: 'adjective', vi: 'pháp lý, hợp pháp', defEn: 'relating to the law or permitted by law' },
  thorough: { ipa: '/ˈθʌrə/', pos: 'adjective', vi: 'kỹ lưỡng, thấu đáo, triệt để', defEn: 'complete with regard to every detail' },
  thoroughly: { ipa: '/ˈθʌrəli/', pos: 'adverb', vi: 'một cách kỹ lưỡng, cẩn trọng', defEn: 'in a thorough and extremely detailed manner' },
  mandatory: { ipa: '/ˈmændətəri/', pos: 'adjective', vi: 'bắt buộc theo quy định', defEn: 'required by law or rules; compulsory' },
  procedure: { ipa: '/prəˈsiːdʒər/', pos: 'noun', vi: 'thủ tục, quy trình thực hiện', defEn: 'an established or official way of doing something' },
  procedures: { ipa: '/prəˈsiːdʒərz/', pos: 'noun', vi: 'các thủ tục, quy trình', defEn: 'official rules or ways of doing things' },
  policy: { ipa: '/ˈpɒləsi/', pos: 'noun', vi: 'chính sách, quy chế', defEn: 'a course or principle of action adopted by an organization' },
  policies: { ipa: '/ˈpɒləsiz/', pos: 'noun', vi: 'các chính sách, quy chế', defEn: 'courses or principles of action' },
  schedule: { ipa: '/ˈʃedjuːl/', pos: 'noun/verb', vi: 'lịch trình, lên kế hoạch', defEn: 'a plan for carrying out process or procedure' },
  scheduled: { ipa: '/ˈʃedjuːld/', pos: 'verb', vi: 'đã được lên lịch', defEn: 'arranged according to a timetable' },
  relocate: { ipa: '/ˌriːləʊˈkeɪt/', pos: 'verb', vi: 'chuyển địa điểm, dời trụ sở', defEn: 'move to a new place and establish home or business there' },
  relocation: { ipa: '/ˌriːləʊˈkeɪʃn/', pos: 'noun', vi: 'việc chuyển dời văn phòng/chỗ ở', defEn: 'the action of moving to a new place' },
  renovation: { ipa: '/ˌrenəˈveɪʃn/', pos: 'noun', vi: 'sự cải tạo, tu sửa cơ sở vật chất', defEn: 'the action of renovating a building' },
  renovations: { ipa: '/ˌrenəˈveɪʃnz/', pos: 'noun', vi: 'các công tác tu sửa, nâng cấp', defEn: 'improvements or repairs to a building' },
  candidate: { ipa: '/ˈkændɪdət/', pos: 'noun', vi: 'ứng viên ứng tuyển', defEn: 'a person who applies for a job' },
  candidates: { ipa: '/ˈkændɪdəts/', pos: 'noun', vi: 'các ứng viên tiềm năng', defEn: 'persons applying for a job or position' },
  applicant: { ipa: '/ˈæplɪkənt/', pos: 'noun', vi: 'người nộp đơn xin việc', defEn: 'a person who makes a formal application' },
  applicants: { ipa: '/ˈæplɪkənts/', pos: 'noun', vi: 'những người nộp đơn', defEn: 'people applying for jobs' },
  supervisor: { ipa: '/ˈsuːpəvaɪzər/', pos: 'noun', vi: 'người giám sát, cấp trên trực tiếp', defEn: 'a person who supervises a person or an activity' },
  management: { ipa: '/ˈmænɪdʒmənt/', pos: 'noun', vi: 'ban quản lý, sự quản trị', defEn: 'the process of dealing with or controlling things or people' },
  executive: { ipa: '/ɪɡˈzekjətɪv/', pos: 'noun', vi: 'nhân viên cấp cao, chuyên viên điều hành', defEn: 'a person with senior managerial responsibility' },
  director: { ipa: '/daɪˈrektər/', pos: 'noun', vi: 'giám đốc, người phụ trách bộ phận', defEn: 'a person who is in charge of an activity or department' },
  quarterly: { ipa: '/ˈkwɔːtəli/', pos: 'adverb/adj', vi: 'hàng quý (3 tháng một lần)', defEn: 'produced or occurring once every quarter of a year' },
  annual: { ipa: '/ˈænjuəl/', pos: 'adjective', vi: 'thường niên, diễn ra hằng năm', defEn: 'occurring once every year' },
  budget: { ipa: '/ˈbʌdʒɪt/', pos: 'noun', vi: 'ngân sách tài chính', defEn: 'an estimate of income and expenditure for a set period' },
  revenue: { ipa: '/ˈrevənjuː/', pos: 'noun', vi: 'doanh thu công ty', defEn: 'income generated from normal business operations' },
  expenditure: { ipa: '/ɪkˈspendɪtʃər/', pos: 'noun', vi: 'chi phí, kinh phí bỏ ra', defEn: 'the action of spending funds' },
  invoice: { ipa: '/ˈɪnvɔɪs/', pos: 'noun', vi: 'hóa đơn bán hàng / yêu cầu thanh toán', defEn: 'a list of goods sent or services provided with statement of sum due' },
  receipt: { ipa: '/rɪˈsiːt/', pos: 'noun', vi: 'biên lai, hóa đơn thu tiền', defEn: 'a written acknowledgment of having received a specified amount' },
  shipment: { ipa: '/ˈʃɪpmənt/', pos: 'noun', vi: 'lô hàng vận chuyển', defEn: 'a quantity of goods shipped or dispatched' },
  inventory: { ipa: '/ˈɪnvəntri/', pos: 'noun', vi: 'hàng tồn kho, sự kiểm kê', defEn: 'a complete list of items such as property, goods in stock' },
  warehouse: { ipa: '/ˈweəhaʊs/', pos: 'noun', vi: 'nhà kho, kho chứa hàng', defEn: 'a large building where raw materials or manufactured goods may be stored' },
  supplier: { ipa: '/səˈplaɪər/', pos: 'noun', vi: 'nhà cung cấp nguyên vật liệu', defEn: 'a person or organization that provides something needed' },
  vendor: { ipa: '/ˈvendər/', pos: 'noun', vi: 'người bán, đối tác cung ứng', defEn: 'a person or company offering something for sale' },
  client: { ipa: '/ˈklaɪənt/', pos: 'noun', vi: 'khách hàng, thân chủ', defEn: 'a person or organization using the services of a professional' },
  feedback: { ipa: '/ˈfiːdbæk/', pos: 'noun', vi: 'ý kiến phản hồi, đánh giá', defEn: 'information about reactions to a product, a person\'s performance of a task' },
  complaint: { ipa: '/kəmˈpleɪnt/', pos: 'noun', vi: 'lời phàn nàn, khiếu nại', defEn: 'a statement that something is unsatisfactory or unacceptable' },
  satisfaction: { ipa: '/ˌsætɪsˈfækʃn/', pos: 'noun', vi: 'sự hài lòng, thỏa mãn của khách hàng', defEn: 'fulfillment of one\'s wishes, expectations, or needs' },
  inquiry: { ipa: '/ɪnˈkwaɪəri/', pos: 'noun', vi: 'thắc mắc, câu hỏi tìm hiểu thông tin', defEn: 'an act of asking for information' },
  inquiries: { ipa: '/ɪnˈkwaɪəriz/', pos: 'noun', vi: 'các thắc mắc, câu hỏi của khách hàng', defEn: 'questions or requests for information' },
  negotiate: { ipa: '/nɪˈɡəʊʃieɪt/', pos: 'verb', vi: 'thương lượng, đàm phán hợp đồng', defEn: 'try to reach an agreement or compromise by discussion' },
  negotiation: { ipa: '/nɪˌɡəʊʃiˈeɪʃn/', pos: 'noun', vi: 'cuộc đàm phán thương mại', defEn: 'discussion aimed at reaching an agreement' },
  confirm: { ipa: '/kənˈfɜːm/', pos: 'verb', vi: 'xác nhận thông tin / lịch hẹn', defEn: 'establish the truth or correctness of' },
  confirmation: { ipa: '/ˌkɒnfəˈmeɪʃn/', pos: 'noun', vi: 'giấy/thư xác nhận', defEn: 'the action of confirming something' },
  maintenance: { ipa: '/ˈmeɪntənəns/', pos: 'noun', vi: 'công tác bảo trì, bảo dưỡng thiết bị', defEn: 'the process of preserving a condition or situation' },
  facility: { ipa: '/fəˈsɪləti/', pos: 'noun', vi: 'cơ sở vật chất, trang thiết bị', defEn: 'a place, amenity, or piece of equipment provided for a purpose' },
  facilities: { ipa: '/fəˈsɪlətiz/', pos: 'noun', vi: 'hệ thống cơ sở vật chất', defEn: 'buildings, services, or equipment provided for a particular purpose' },
  headquarters: { ipa: '/ˌhedˈkwɔːtəz/', pos: 'noun', vi: 'trụ sở chính của công ty', defEn: 'the premises serving as the managerial center' },
  branch: { ipa: '/brɑːntʃ/', pos: 'noun', vi: 'chi nhánh công ty', defEn: 'a division or office of a large business or organization' },
  expand: { ipa: '/ɪkˈspænd/', pos: 'verb', vi: 'mở rộng quy mô kinh doanh', defEn: 'become or make larger or more extensive' },
  expansion: { ipa: '/ɪkˈspænʃn/', pos: 'noun', vi: 'sự mở rộng, bành trướng thị trường', defEn: 'the action of becoming larger or more extensive' },
  reimburse: { ipa: '/ˌriːɪmˈbɜːs/', pos: 'verb', vi: 'hoàn trả lại tiền chi tiêu (công tác phí)', defEn: 'repay a person who has spent or lost money' },
  reimbursement: { ipa: '/ˌriːɪmˈbɜːsmənt/', pos: 'noun', vi: 'khoản tiền hoàn trả (công tác phí)', defEn: 'a sum paid to cover money that has been spent' },
};

/**
 * Generate 2-3 realistic business/TOEIC example sentences for the selected word/collocation
 */
export function generateSuggestedExamples(
  wordOrPhrase: string,
  meaningVi: string,
  pos: string = 'noun',
  contextSentence: string = ''
): { en: string; vi: string }[] {
  const clean = wordOrPhrase.trim();
  const lower = clean.toLowerCase();

  // If word already matches curriculum word, use its authentic example if distinct
  const fromCurriculum = [...INITIAL_WORDS, ...SUPPLEMENTAL_WORDS].find(
    w => w.word.toLowerCase() === lower
  );

  const results: { en: string; vi: string }[] = [];

  if (fromCurriculum && fromCurriculum.example && fromCurriculum.example !== contextSentence) {
    results.push({
      en: fromCurriculum.example,
      vi: fromCurriculum.exampleVi || `Ví dụ với "${clean}" (${meaningVi})`,
    });
  }

  // Pre-curated high-impact ETS context examples for common business words
  const businessTemplates: Record<string, { en: string; vi: string }[]> = {
    'warranty period': [
      {
        en: 'The warranty period will expire at the end of next month unless extended by customer support.',
        vi: 'Thời hạn bảo hành sẽ hết hạn vào cuối tháng tới trừ khi được bộ phận hỗ trợ khách hàng gia hạn thêm.',
      },
      {
        en: 'Any defective equipment returned within the warranty period is eligible for free parts replacement.',
        vi: 'Bất kỳ thiết bị lỗi nào được hoàn trả trong thời hạn bảo hành đều đủ điều kiện được thay thế linh kiện miễn phí.',
      },
    ],
    'warranty': [
      {
        en: 'All electronic office appliances come with a two-year standard manufacturer warranty.',
        vi: 'Tất cả thiết bị văn phòng điện tử đều đi kèm gói bảo hành tiêu chuẩn hai năm từ nhà sản xuất.',
      },
      {
        en: 'Customers are strongly advised to register their warranty online within 30 days of purchase.',
        vi: 'Khách hàng được khuyến nghị đăng ký bảo hành trực tuyến trong vòng 30 ngày kể từ ngày mua hàng.',
      },
    ],
    'period': [
      {
        en: 'The 14-day trial period allows prospective clients to evaluate all platform features free of charge.',
        vi: 'Thời gian dùng thử 14 ngày cho phép khách hàng tiềm năng trải nghiệm miễn phí toàn bộ tính năng.',
      },
      {
        en: 'During the introductory period, annual subscription fees are discounted by 20 percent.',
        vi: 'Trong giai đoạn giới thiệu ban đầu, phí thuê bao hàng năm được giảm giá 20%.',
      },
    ],
    'failure': [
      {
        en: 'Rigorous maintenance inspections help prevent unexpected mechanical failure on the production line.',
        vi: 'Kiểm tra bảo dưỡng nghiêm ngặt giúp ngăn ngừa sự cố hỏng hóc cơ khí bất ngờ trên dây chuyền sản xuất.',
      },
      {
        en: 'Failure to comply with international safety regulations may result in substantial financial penalties.',
        vi: 'Việc không tuân thủ các quy định an toàn quốc tế có thể dẫn đến các khoản phạt tài chính nặng.',
      },
    ],
    'experience': [
      {
        en: 'Our 24/7 technical helpdesk assists all registered users who experience network connectivity issues.',
        vi: 'Bộ phận hỗ trợ kỹ thuật 24/7 hỗ trợ mọi người dùng đã đăng ký khi gặp phải sự cố kết nối mạng.',
      },
      {
        en: 'Qualified candidates should possess at least three years of proven managerial experience in logistics.',
        vi: 'Ứng viên đạt yêu cầu cần có ít nhất ba năm kinh nghiệm quản lý đã được chứng minh trong ngành logistics.',
      },
    ],
    'entitled': [
      {
        en: 'Full-time staff members are entitled to comprehensive medical benefits and paid vacation days.',
        vi: 'Nhân viên chính thức được quyền hưởng quyền lợi y tế toàn diện và những ngày nghỉ phép có lương.',
      },
      {
        en: 'Corporate club members are entitled to complimentary access to the airport lounge facilities.',
        vi: 'Thành viên câu lạc bộ doanh nghiệp có quyền sử dụng miễn phí phòng chờ tiện nghi tại sân bay.',
      },
    ],
    'replacement': [
      {
        en: 'The distributor promised to dispatch an immediate replacement for the defective shipments.',
        vi: 'Nhà phân phối cam kết gửi linh kiện thay thế ngay lập tức cho các lô hàng bị lỗi.',
      },
      {
        en: 'The human resources department is actively screening candidates for the department head replacement.',
        vi: 'Phòng nhân sự đang tích cực sàng lọc ứng viên để thay thế vị trí trưởng phòng.',
      },
    ],
    'guideline': [
      {
        en: 'All newly hired staff must review the company safety guidelines before operating machinery.',
        vi: 'Tất cả nhân viên mới tuyển dụng phải xem xét các hướng dẫn an toàn trước khi vận hành máy móc.',
      },
    ],
    'guidelines': [
      {
        en: 'The committee published strict guidelines to prevent any conflict of interest during the tender process.',
        vi: 'Ủy ban đã công bố các nguyên tắc hướng dẫn nghiêm ngặt để ngăn ngừa xung đột lợi ích.',
      },
    ],
    'misunderstanding': [
      {
        en: 'Clear and transparent written communication is vital to eliminate misunderstandings between clients and contractors.',
        vi: 'Giao tiếp bằng văn bản rõ ràng và minh bạch là thiết yếu để loại bỏ sự hiểu lầm giữa khách hàng và nhà thầu.',
      },
    ],
  };

  if (businessTemplates[lower]) {
    businessTemplates[lower].forEach(item => {
      if (item.en !== contextSentence && !results.some(r => r.en === item.en)) {
        results.push(item);
      }
    });
  }

  // Dynamic sentence generation based on part of speech if not enough examples
  if (results.length < 2) {
    if (pos.includes('verb')) {
      results.push({
        en: `The executive board decided to ${clean} the ongoing proposal to maximize quarterly revenue.`,
        vi: `Hội đồng quản trị đã quyết định ${meaningVi} đề xuất hiện tại để tối đa hóa doanh thu quý.`,
      });
      results.push({
        en: `All regional branch supervisors are instructed to ${clean} departmental records before the internal audit.`,
        vi: `Tất cả giám sát viên chi nhánh được chỉ đạo phải ${meaningVi} hồ sơ phòng ban trước kỳ kiểm toán nội bộ.`,
      });
    } else if (pos.includes('adj')) {
      results.push({
        en: `The committee released a ${clean} evaluation report addressing all key concerns of the investors.`,
        vi: `Hội đồng đã phát hành một báo cáo đánh giá ${meaningVi} giải quyết tất cả các quan ngại của nhà đầu tư.`,
      });
      results.push({
        en: `Delivering ${clean} customer service remains our organization's primary commitment this fiscal year.`,
        vi: `Cung cấp dịch vụ khách hàng ${meaningVi} vẫn là cam kết hàng đầu của tổ chức chúng tôi trong năm tài chính này.`,
      });
    } else {
      results.push({
        en: `All official corporate documents regarding the ${clean} must be submitted to administration by Friday.`,
        vi: `Mọi tài liệu công ty chính thức liên quan đến ${meaningVi} phải được nộp cho ban hành chính trước thứ Sáu.`,
      });
      results.push({
        en: `The newly approved initiative is expected to optimize the ${clean} across all global regional offices.`,
        vi: `Sáng kiến mới được phê duyệt dự kiến sẽ tối ưu hóa ${meaningVi} trên toàn bộ các văn phòng khu vực toàn cầu.`,
      });
    }
  }

  return results.slice(0, 3);
}

/**
 * Find related collocations and business idioms
 */
export function findRelatedCollocations(wordOrPhrase: string): string[] {
  const clean = wordOrPhrase.toLowerCase().trim();
  const found: string[] = [];

  KNOWN_COLLOCATIONS.forEach(c => {
    if (c.phrase.toLowerCase().includes(clean) || clean.includes(c.phrase.toLowerCase())) {
      found.push(`${c.phrase} (${c.meaningVi})`);
    }
  });

  return Array.from(new Set(found)).slice(0, 4);
}

/**
 * Clean raw input to extract base words
 */
export function cleanSelectedWord(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
    .trim();
}

/**
 * Synchronous local lookup from curriculum, supplement, lexicon & local dictionary
 */
export function lookupWordLocal(rawText: string, contextSentence: string = ''): TranslatedWordResult | null {
  const clean = cleanSelectedWord(rawText);
  if (!clean) return null;

  // 1. Check TOEIC Collocations
  const lowerSentence = contextSentence.toLowerCase();
  for (const c of KNOWN_COLLOCATIONS) {
    if (lowerSentence.includes(c.phrase.toLowerCase()) || clean.includes(c.phrase.toLowerCase())) {
      const examples = generateSuggestedExamples(c.phrase, c.meaningVi, 'phrase', contextSentence);
      const collocations = findRelatedCollocations(c.phrase);
      return {
        word: c.phrase,
        phonetic: `/${c.phrase}/`,
        partOfSpeech: 'phrase',
        meaningVi: c.meaningVi,
        definitionEn: c.explanation || `Thành ngữ/Collocation thường gặp: "${c.phrase}"`,
        example: contextSentence || c.phrase,
        exampleVi: c.meaningVi,
        suggestedExamples: examples,
        collocations: collocations.length > 0 ? collocations : undefined,
      };
    }
  }

  // 2. Check Curated Local TOEIC Dictionary
  if (TOEIC_LOCAL_DICTIONARY[clean]) {
    const item = TOEIC_LOCAL_DICTIONARY[clean];
    const examples = generateSuggestedExamples(rawText.trim(), item.vi, item.pos, contextSentence);
    const collocations = findRelatedCollocations(clean);
    return {
      word: rawText.trim(),
      phonetic: item.ipa,
      partOfSpeech: item.pos,
      meaningVi: item.vi,
      definitionEn: item.defEn || `TOEIC core vocabulary: "${rawText.trim()}"`,
      example: contextSentence || rawText.trim(),
      suggestedExamples: examples,
      collocations: collocations.length > 0 ? collocations : undefined,
    };
  }

  // 3. Check LEXICON
  if (LEXICON[clean]) {
    const item = LEXICON[clean];
    const examples = generateSuggestedExamples(rawText.trim(), item.meaningVi, item.pos || 'noun', contextSentence);
    const collocations = findRelatedCollocations(clean);
    return {
      word: rawText.trim(),
      phonetic: item.ipa,
      partOfSpeech: item.pos || 'noun',
      meaningVi: item.meaningVi,
      definitionEn: `Thuật ngữ kinh doanh & bài thi TOEIC: "${rawText.trim()}"`,
      example: contextSentence || rawText.trim(),
      suggestedExamples: examples,
      collocations: collocations.length > 0 ? collocations : undefined,
    };
  }

  // 4. Check Curriculum Words
  const allKnown = [...INITIAL_WORDS, ...SUPPLEMENTAL_WORDS];
  const fromCurriculum = allKnown.find(
    (w: Word) => w.word.toLowerCase() === clean || w.word.toLowerCase() === rawText.toLowerCase().trim()
  );
  if (fromCurriculum) {
    const examples = generateSuggestedExamples(fromCurriculum.word, fromCurriculum.meaningVi, fromCurriculum.partOfSpeech, contextSentence);
    const collocations = findRelatedCollocations(clean);
    return {
      word: fromCurriculum.word,
      phonetic: fromCurriculum.phonetic,
      partOfSpeech: fromCurriculum.partOfSpeech,
      meaningVi: fromCurriculum.meaningVi,
      definitionEn: fromCurriculum.definitionEn,
      example: contextSentence || fromCurriculum.example,
      exampleVi: fromCurriculum.exampleVi,
      suggestedExamples: examples,
      collocations: (fromCurriculum.collocations && fromCurriculum.collocations.length > 0) ? fromCurriculum.collocations : (collocations.length > 0 ? collocations : undefined),
      synonyms: fromCurriculum.synonyms,
    };
  }

  return null;
}

/**
 * Intelligent Online Translation using Google Translate GTX API + Dictionary API fallback
 */
export async function translateWordOnline(text: string, contextSentence: string = ''): Promise<TranslatedWordResult> {
  const trimmed = text.trim();
  const clean = cleanSelectedWord(trimmed);

  // 1. First attempt instant local lookup
  const localMatch = lookupWordLocal(trimmed, contextSentence);
  if (localMatch) {
    return localMatch;
  }

  let meaningVi = '';
  let phonetic = `/${clean}/`;
  let definitionEn = `Từ vựng tra cứu theo ngữ cảnh: "${trimmed}"`;
  let partOfSpeech = 'noun';

  // 2. Online Google Translate GTX endpoint (instant, free, 100% accurate Vietnamese meaning)
  try {
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(trimmed)}`;
    const resp = await fetch(gtxUrl);
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        meaningVi = data[0].map((item: any) => item[0]).filter(Boolean).join(' ').trim();
      }
    }
  } catch (err) {
    console.warn('Google Translate GTX failed, falling back to MyMemory', err);
  }

  // Fallback translation: MyMemory API
  if (!meaningVi) {
    try {
      const myMemUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|vi`;
      const resp = await fetch(myMemUrl);
      if (resp.ok) {
        const data = await resp.json();
        if (data?.responseData?.translatedText && !data.responseData.translatedText.includes('///')) {
          meaningVi = data.responseData.translatedText.trim();
        }
      }
    } catch {}
  }

  // 3. Online Dictionary lookup for accurate phonetic & definition
  try {
    const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`;
    const dictResp = await fetch(dictUrl);
    if (dictResp.ok) {
      const dictData = await dictResp.json();
      if (Array.isArray(dictData) && dictData.length > 0) {
        const entry = dictData[0];
        if (entry.phonetic) {
          phonetic = entry.phonetic;
        } else if (entry.phonetics && entry.phonetics.length > 0) {
          const ph = entry.phonetics.find((p: any) => p.text);
          if (ph) phonetic = ph.text;
        }

        if (entry.meanings && entry.meanings.length > 0) {
          partOfSpeech = entry.meanings[0].partOfSpeech || partOfSpeech;
          const firstDef = entry.meanings[0].definitions?.[0]?.definition;
          if (firstDef) {
            definitionEn = firstDef;
          }
        }
      }
    }
  } catch {}

  // Safe fallback if translation completely offline
  if (!meaningVi) {
    meaningVi = trimmed;
  }

  const suggestedExamples = generateSuggestedExamples(trimmed, meaningVi, partOfSpeech, contextSentence);
  const collocations = findRelatedCollocations(trimmed);

  return {
    word: trimmed,
    phonetic,
    partOfSpeech,
    meaningVi,
    definitionEn,
    example: contextSentence || trimmed,
    suggestedExamples,
    collocations: collocations.length > 0 ? collocations : undefined,
    isOnlineTranslated: true,
  };
}
