// Comprehensive contextual dictionary and collocation analyzer for sentence-based practice
import { INITIAL_WORDS } from '../data/curriculum';
import { Word } from '../types';

export interface CollocationMatch {
  phrase: string;
  meaningVi: string;
  explanation?: string;
}

export interface ContextualWordInfo {
  word: string;
  ipa: string;
  partOfSpeech?: string;
  meaningVi: string;
  collocation?: CollocationMatch;
}

// Curated list of high-frequency business & TOEIC collocations
export const KNOWN_COLLOCATIONS: CollocationMatch[] = [
  {
    phrase: 'warranty period',
    meaningVi: 'thời hạn bảo hành',
    explanation: 'Cụm danh từ ghép chỉ khoảng thời gian người mua được sửa chữa hoặc đổi trả sản phẩm miễn phí.',
  },
  {
    phrase: 'service contracts',
    meaningVi: 'hợp đồng dịch vụ',
    explanation: 'Thỏa thuận pháp lý cam kết các điều khoản bảo trì và dịch vụ định kỳ.',
  },
  {
    phrase: 'service contract',
    meaningVi: 'hợp đồng dịch vụ',
    explanation: 'Thỏa thuận pháp lý cam kết các điều khoản bảo trì và dịch vụ định kỳ.',
  },
  {
    phrase: 'prior to',
    meaningVi: 'trước khi (= before)',
    explanation: 'Cụm giới từ trang trọng, luôn đi kèm danh từ hoặc danh động từ chỉ thời gian / sự kiện.',
  },
  {
    phrase: 'please be advised that',
    meaningVi: 'xin lưu ý rằng / xin thông báo rằng',
    explanation: 'Cụm từ mở đầu trang trọng kinh điển trong thư tín thương mại và email công sở TOEIC.',
  },
  {
    phrase: 'be advised that',
    meaningVi: 'xin lưu ý rằng / xin thông báo rằng',
    explanation: 'Cấu trúc thông báo trang trọng trong môi trường doanh nghiệp.',
  },
  {
    phrase: 'expiration date',
    meaningVi: 'ngày hết hạn, hạn sử dụng',
    explanation: 'Thời điểm hợp đồng, thẻ ngân hàng hoặc thực phẩm hết hiệu lực sử dụng.',
  },
  {
    phrase: 'refund checks',
    meaningVi: 'ngân phiếu / séc hoàn tiền',
    explanation: 'Hình thức hoàn trả lại tiền cho khách hàng bằng séc hoặc hóa đơn tín dụng.',
  },
  {
    phrase: 'binding contract',
    meaningVi: 'hợp đồng ràng buộc pháp lý',
    explanation: 'Hợp đồng có hiệu lực thi hành theo luật (legally binding/enforceable).',
  },
  {
    phrase: 'non-disclosure agreement',
    meaningVi: 'thỏa thuận bảo mật thông tin (NDA)',
    explanation: 'Văn bản pháp lý cam kết không tiết lộ bí mật kinh doanh cho bên thứ ba.',
  },
  {
    phrase: 'both parties',
    meaningVi: 'cả hai bên tham gia',
    explanation: 'Chỉ hai chủ thể cùng tham gia đàm phán hoặc ký kết thỏa thuận.',
  },
  {
    phrase: 'mutually agreed',
    meaningVi: 'đồng thuận hai chiều, cùng nhất trí',
    explanation: 'Collocation thường gặp chỉ sự thống nhất ý chí giữa các đối tác.',
  },
  {
    phrase: 'entitled to',
    meaningVi: 'có quyền được hưởng / được phép nhận',
    explanation: 'Cấu trúc be entitled to + Noun/V-ing thường xuất hiện trong chính sách nhân sự và khách hàng.',
  },
  {
    phrase: 'limited warranty',
    meaningVi: 'bảo hành có giới hạn',
    explanation: 'Chính sách bảo hành chỉ áp dụng cho một số bộ phận hoặc điều kiện nhất định.',
  },
  {
    phrase: 'proves to be',
    meaningVi: 'chứng minh là / hóa ra là',
    explanation: 'Động từ nối miêu tả trạng thái thực tế sau khi kiểm tra.',
  },
  {
    phrase: 'comply with',
    meaningVi: 'tuân thủ, chấp hành',
    explanation: 'Cụm động từ cố định: comply luôn đi với giới từ with (tuân thủ luật lệ, quy chuẩn).',
  },
  {
    phrase: 'safety specifications',
    meaningVi: 'các quy chuẩn an toàn',
    explanation: 'Thông số và tiêu chuẩn kỹ thuật bắt buộc để đảm bảo an toàn lao động.',
  },
  {
    phrase: 'resulting in',
    meaningVi: 'dẫn đến kết quả là',
    explanation: 'Mệnh đề quan hệ rút gọn chỉ hệ quả tất yếu của hành động trước đó.',
  },
];

// Curated vocabulary lexicon for fast lookup
export const LEXICON: Record<string, { ipa: string; pos?: string; meaningVi: string }> = {
  please: { ipa: '/pliːz/', pos: 'adv', meaningVi: 'xin vui lòng, hãy' },
  be: { ipa: '/biː/', pos: 'v', meaningVi: 'thì, là, ở (động từ to-be)' },
  advised: { ipa: '/ədˈvaɪzd/', pos: 'v/adj', meaningVi: 'được lưu ý, được khuyên' },
  that: { ipa: '/ðæt/', pos: 'conj', meaningVi: 'rằng, là' },
  all: { ipa: '/ɔːl/', pos: 'det', meaningVi: 'tất cả, toàn bộ' },
  service: { ipa: '/ˈsɜː.vɪs/', pos: 'n', meaningVi: 'dịch vụ, sự phục vụ' },
  contracts: { ipa: '/ˈkɒn.trækts/', pos: 'n', meaningVi: 'các hợp đồng kinh tế' },
  contract: { ipa: '/ˈkɒn.trækt/', pos: 'n', meaningVi: 'hợp đồng, giao kèo' },
  must: { ipa: '/mʌst/', pos: 'modal', meaningVi: 'phải, bắt buộc phải' },
  formally: { ipa: '/ˈfɔː.məl.i/', pos: 'adv', meaningVi: 'một cách chính thức, trang trọng' },
  approved: { ipa: '/əˈpruːvd/', pos: 'v/adj', meaningVi: 'được phê duyệt, chấp thuận' },
  approve: { ipa: '/əˈpruːv/', pos: 'v', meaningVi: 'phê duyệt, thông qua' },
  prior: { ipa: '/ˈpraɪ.ər/', pos: 'adj', meaningVi: 'trước, ưu tiên hơn' },
  to: { ipa: '/tuː/', pos: 'prep', meaningVi: 'đến, đối với, trước' },
  the: { ipa: '/ðə/', pos: 'art', meaningVi: 'mạo từ xác định' },
  expiration: { ipa: '/ˌek.spəˈreɪ.ʃən/', pos: 'n', meaningVi: 'sự hết hạn, hết hiệu lực' },
  expire: { ipa: '/ɪkˈspaɪər/', pos: 'v', meaningVi: 'hết hạn, mất hiệu lực' },
  of: { ipa: '/ɒv/', pos: 'prep', meaningVi: 'của, về' },
  original: { ipa: '/əˈrɪdʒ.ən.əl/', pos: 'adj', meaningVi: 'gốc, ban đầu, nguyên bản' },
  warranty: { ipa: '/ˈwɒr.ən.ti/', pos: 'n', meaningVi: 'sự bảo hành, giấy cam kết' },
  period: { ipa: '/ˈpɪə.ri.əd/', pos: 'n', meaningVi: 'thời hạn, giai đoạn, thời kỳ' },
  checked: { ipa: '/tʃekt/', pos: 'v', meaningVi: 'đã kiểm tra, rà soát' },
  check: { ipa: '/tʃek/', pos: 'v', meaningVi: 'kiểm tra, đánh dấu' },
  checks: { ipa: '/tʃeks/', pos: 'n', meaningVi: 'ngân phiếu, séc thanh toán' },
  date: { ipa: '/deɪt/', pos: 'n', meaningVi: 'ngày, mốc thời gian' },
  yogurt: { ipa: '/ˈjɒɡ.ət/', pos: 'n', meaningVi: 'món sữa chua' },
  store: { ipa: '/stɔːr/', pos: 'n', meaningVi: 'cửa hàng, tiệm bách hóa' },
  slow: { ipa: '/sləʊ/', pos: 'adj', meaningVi: 'chậm chạp, trễ nải' },
  mailing: { ipa: '/ˈmeɪ.lɪŋ/', pos: 'n/v', meaningVi: 'việc gửi thư / bưu điện' },
  refund: { ipa: '/ˈriː.fʌnd/', pos: 'n/v', meaningVi: 'khoản hoàn tiền, hoàn trả tiền' },
  characteristic: { ipa: '/ˌkær.ək.təˈrɪs.tɪk/', pos: 'n', meaningVi: 'đặc điểm, đặc thù, nét tiêu biểu' },
  consequence: { ipa: '/ˈkɒn.sɪ.kwəns/', pos: 'n', meaningVi: 'hậu quả, hệ quả; tính trọng đại' },
  resolve: { ipa: '/rɪˈzɒlv/', pos: 'v', meaningVi: 'giải quyết, dàn xếp ổn thỏa' },
  establish: { ipa: '/ɪˈstæb.lɪʃ/', pos: 'v', meaningVi: 'thành lập, thiết lập, tạo dựng' },
  reputation: { ipa: '/ˌrep.jəˈteɪ.ʃən/', pos: 'n', meaningVi: 'danh tiếng, uy tín' },
  cancellation: { ipa: '/ˌkæn.səlˈeɪ.ʃən/', pos: 'n', meaningVi: 'sự hủy bỏ, bãi bỏ thỏa thuận' },
  frequently: { ipa: '/ˈfriː.kwənt.li/', pos: 'adv', meaningVi: 'thường xuyên, một cách thường lệ' },
  both: { ipa: '/bəʊθ/', pos: 'det', meaningVi: 'cả hai' },
  parties: { ipa: '/ˈpɑː.tiz/', pos: 'n', meaningVi: 'các bên tham gia ký kết' },
  mutually: { ipa: '/ˈmjuː.tʃu.ə.li/', pos: 'adv', meaningVi: 'lẫn nhau, hai chiều' },
  agreed: { ipa: '/əˈɡriːd/', pos: 'v', meaningVi: 'đã đồng thuận, nhất trí' },
  modify: { ipa: '/ˈmɒd.ɪ.faɪ/', pos: 'v', meaningVi: 'sửa đổi, điều chỉnh điều khoản' },
  agreement: { ipa: '/əˈɡriː.mənt/', pos: 'n', meaningVi: 'thỏa thuận, hợp đồng' },
  binding: { ipa: '/ˈbaɪn.dɪŋ/', pos: 'adj', meaningVi: 'ràng buộc pháp lý' },
  entitled: { ipa: '/ɪnˈtaɪ.təld/', pos: 'adj', meaningVi: 'có quyền được hưởng' },
  merchandise: { ipa: '/ˈmɜː.tʃən.daɪz/', pos: 'n', meaningVi: 'hàng hóa' },
  defective: { ipa: '/dɪˈfek.tɪv/', pos: 'adj', meaningVi: 'bị lỗi, có khiếm khuyết' },
  comply: { ipa: '/kəmˈplaɪ/', pos: 'v', meaningVi: 'tuân thủ, chấp hành' },
  specifications: { ipa: '/ˌspes.ɪ.fɪˈkeɪ.ʃənz/', pos: 'n', meaningVi: 'quy chuẩn, thông số kỹ thuật' },
};

/**
 * Given a word and an optional sentence, resolves the word's pronunciation,
 * definition, and any multi-word collocation in that sentence.
 */
export function getContextualWordInfo(rawWord: string, fullSentence: string = ''): ContextualWordInfo {
  const clean = rawWord.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
  const lowerSentence = fullSentence.toLowerCase();

  // 1. Check if word is part of any known collocation in this sentence
  let foundCollocation: CollocationMatch | undefined;
  for (const c of KNOWN_COLLOCATIONS) {
    if (lowerSentence.includes(c.phrase.toLowerCase())) {
      const wordsInPhrase = c.phrase.toLowerCase().split(/\s+/);
      if (wordsInPhrase.includes(clean)) {
        foundCollocation = c;
        break;
      }
    }
  }

  // 2. Check Curated Lexicon
  if (LEXICON[clean]) {
    const lex = LEXICON[clean];
    return {
      word: rawWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ''),
      ipa: lex.ipa,
      partOfSpeech: lex.pos,
      meaningVi: lex.meaningVi,
      collocation: foundCollocation,
    };
  }

  // 3. Check Curriculum Words
  const fromCurriculum = INITIAL_WORDS.find((w: Word) => w.word.toLowerCase() === clean);
  if (fromCurriculum) {
    return {
      word: fromCurriculum.word,
      ipa: fromCurriculum.phonetic,
      partOfSpeech: fromCurriculum.partOfSpeech,
      meaningVi: fromCurriculum.meaningVi,
      collocation: foundCollocation,
    };
  }

  // 4. Fallback with smart estimation
  return {
    word: clean,
    ipa: `/${clean}/`,
    meaningVi: 'Từ vựng trong câu luyện đọc TOEIC',
    collocation: foundCollocation,
  };
}
