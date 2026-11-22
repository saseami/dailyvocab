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
      return {
        word: c.phrase,
        phonetic: `/${c.phrase}/`,
        partOfSpeech: 'phrase',
        meaningVi: c.meaningVi,
        definitionEn: c.explanation || `Thành ngữ/Collocation thường gặp: "${c.phrase}"`,
        example: contextSentence || c.phrase,
        exampleVi: c.meaningVi,
      };
    }
  }

  // 2. Check Curated Local TOEIC Dictionary
  if (TOEIC_LOCAL_DICTIONARY[clean]) {
    const item = TOEIC_LOCAL_DICTIONARY[clean];
    return {
      word: rawText.trim(),
      phonetic: item.ipa,
      partOfSpeech: item.pos,
      meaningVi: item.vi,
      definitionEn: item.defEn || `TOEIC core vocabulary: "${rawText.trim()}"`,
      example: contextSentence || rawText.trim(),
    };
  }

  // 3. Check LEXICON
  if (LEXICON[clean]) {
    const item = LEXICON[clean];
    return {
      word: rawText.trim(),
      phonetic: item.ipa,
      partOfSpeech: item.pos || 'noun',
      meaningVi: item.meaningVi,
      definitionEn: `Thuật ngữ kinh doanh & bài thi TOEIC: "${rawText.trim()}"`,
      example: contextSentence || rawText.trim(),
    };
  }

  // 4. Check Curriculum Words
  const allKnown = [...INITIAL_WORDS, ...SUPPLEMENTAL_WORDS];
  const fromCurriculum = allKnown.find(
    (w: Word) => w.word.toLowerCase() === clean || w.word.toLowerCase() === rawText.toLowerCase().trim()
  );
  if (fromCurriculum) {
    return {
      word: fromCurriculum.word,
      phonetic: fromCurriculum.phonetic,
      partOfSpeech: fromCurriculum.partOfSpeech,
      meaningVi: fromCurriculum.meaningVi,
      definitionEn: fromCurriculum.definitionEn,
      example: contextSentence || fromCurriculum.example,
      exampleVi: fromCurriculum.exampleVi,
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

  return {
    word: trimmed,
    phonetic,
    partOfSpeech,
    meaningVi,
    definitionEn,
    example: contextSentence || trimmed,
    isOnlineTranslated: true,
  };
}
