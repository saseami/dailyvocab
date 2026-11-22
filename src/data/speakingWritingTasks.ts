import { Word } from '../types';

export interface GrammarPoint {
  pattern: string;
  explanation: string;
  toeicTip: string;
}

export interface PhoneticWord {
  word: string;
  ipa: string;
  meaning: string;
}

export interface SpeakingExample {
  id: string;
  title: string;
  scenario: string;
  sentence: string;
  translationVi: string;
  grammarPoints: GrammarPoint[];
  phoneticBreakdown: PhoneticWord[];
  speechTip: string;
}

export interface SpeakingTask {
  day: number;
  topicTitle: string;
  examples: SpeakingExample[];
}

export interface WritingTask {
  day: number;
  type: 'sentence_builder' | 'email_response';
  title: string;
  scenario: string;
  requiredWords: string[];
  minWords: number;
  hints: string[];
  modelAnswer: string;
  modelExplanation: string;
}

// Curated multi-example speaking tasks for key days
export const CURATED_SPEAKING_TASKS: Record<number, SpeakingTask> = {
  1: {
    day: 1,
    topicTitle: 'Hợp đồng & Cam kết bảo hành (Contracts & Warranties)',
    examples: [
      {
        id: 'd1-ex1',
        title: 'Ví dụ 1: Thông báo hết hạn hợp đồng & bảo hành',
        scenario: 'Đọc thông báo chính thức gửi khách hàng về điều khoản gia hạn bảo hành và thỏa thuận dịch vụ.',
        sentence: 'Please be advised that all service contracts must be formally approved prior to the expiration of the original warranty period.',
        translationVi: 'Xin lưu ý rằng tất cả các hợp đồng dịch vụ phải được phê duyệt chính thức trước khi hết hạn thời gian bảo hành gốc.',
        grammarPoints: [
          {
            pattern: 'Please be advised that + S + V',
            explanation: 'Cấu trúc mở đầu trang trọng trong thư tín thương mại và thông báo hành chính công sở ("Xin lưu ý rằng...").',
            toeicTip: 'Cụm từ này xuất hiện rất nhiều ở phần mở đầu các email trong Part 7.'
          },
          {
            pattern: 'must be formally approved',
            explanation: 'Thể bị động với động từ khuyết thiếu (Modal verb passive: must + be + V3/ed) kết hợp trạng từ "formally".',
            toeicTip: 'TOEIC Part 5 thường xuyên kiểm tra vị trí của trạng từ đứng giữa "be" và "V3/ed".'
          },
          {
            pattern: 'prior to + Noun Phrase',
            explanation: 'Cụm giới từ mang nghĩa "trước khi", đồng nghĩa với "before".',
            toeicTip: 'Trong đề thi TOEIC, "prior to" thường đi kèm danh từ chỉ mốc thời gian hoặc sự kiện.'
          }
        ],
        phoneticBreakdown: [
          { word: 'contracts', ipa: '/ˈkɒn.trækts/', meaning: 'hợp đồng' },
          { word: 'formally', ipa: '/ˈfɔː.məl.i/', meaning: 'chính thức' },
          { word: 'approved', ipa: '/əˈpruːvd/', meaning: 'phê duyệt' },
          { word: 'expiration', ipa: '/ˌek.spəˈreɪ.ʃən/', meaning: 'sự hết hạn' },
          { word: 'warranty', ipa: '/ˈwɒr.ən.ti/', meaning: 'bảo hành' }
        ],
        speechTip: 'Ngắt giọng nhẹ sau cụm "service contracts" và hạ giọng tự nhiên ở cuối câu.'
      },
      {
        id: 'd1-ex2',
        title: 'Ví dụ 2: Đàm phán sửa đổi điều khoản thỏa thuận',
        scenario: 'Trình bày kết quả buổi làm việc pháp lý giữa hai công ty đối tác trước lễ ký kết.',
        sentence: 'Both parties have mutually agreed to modify the non-disclosure agreement before signing the final binding contract.',
        translationVi: 'Cả hai bên đã đồng thuận sửa đổi thỏa thuận bảo mật thông tin trước khi ký kết hợp đồng ràng buộc chính thức.',
        grammarPoints: [
          {
            pattern: 'Both parties have mutually agreed to + V',
            explanation: 'Hiện tại hoàn thành diễn tả thỏa thuận vừa đạt được; trạng từ "mutually" (lẫn nhau/hai chiều) là collocation chuẩn.',
            toeicTip: 'Từ "parties" trong hợp đồng luôn chỉ các bên tham gia ký kết.'
          },
          {
            pattern: 'binding contract',
            explanation: 'Tính từ "binding" mang nghĩa ràng buộc về mặt pháp lý (legally enforceable).',
            toeicTip: 'Từ đồng nghĩa TOEIC hay bẫy: non-binding (không ràng buộc).'
          }
        ],
        phoneticBreakdown: [
          { word: 'mutually', ipa: '/ˈmjuː.tʃu.ə.li/', meaning: 'lẫn nhau, hai chiều' },
          { word: 'modify', ipa: '/ˈmɒd.ɪ.faɪ/', meaning: 'sửa đổi, điều chỉnh' },
          { word: 'binding', ipa: '/ˈbaɪn.dɪŋ/', meaning: 'có tính ràng buộc pháp lý' }
        ],
        speechTip: 'Nhấn mạnh vào "mutually agreed" và đọc rõ âm đuôi /kt/ trong "contract".'
      },
      {
        id: 'd1-ex3',
        title: 'Ví dụ 3: Yêu cầu bồi thường theo chính sách bảo hành',
        scenario: 'Thông báo quyền lợi đổi trả sản phẩm khi phát hiện lỗi từ phía nhà sản xuất.',
        sentence: 'Under the limited warranty, customers are entitled to a full replacement if the merchandise proves to be defective.',
        translationVi: 'Theo điều khoản bảo hành có giới hạn, khách hàng có quyền được đổi mới hoàn toàn nếu hàng hóa bị lỗi.',
        grammarPoints: [
          {
            pattern: 'be entitled to + Noun / V-ing',
            explanation: 'Cấu trúc "có quyền được hưởng / được phép nhận...", cực kỳ phổ biến trong hợp đồng và dịch vụ khách hàng.',
            toeicTip: 'Đáp án đúng thường là "entitled" khi sau chỗ trống là giới từ "to".'
          },
          {
            pattern: 'proves to be + Adj',
            explanation: 'Động từ nối (linking verb) mang nghĩa "chứng minh là / hóa ra là".',
            toeicTip: 'Merchandise là danh từ không đếm được, chia động từ số ít "proves".'
          }
        ],
        phoneticBreakdown: [
          { word: 'entitled', ipa: '/ɪnˈtaɪ.təld/', meaning: 'có quyền được hưởng' },
          { word: 'merchandise', ipa: '/ˈmɜː.tʃən.daɪz/', meaning: 'hàng hóa' },
          { word: 'defective', ipa: '/dɪˈfek.tɪv/', meaning: 'bị lỗi, khiếm khuyết' }
        ],
        speechTip: 'Nối âm giữa "entitled" và "to" (/ɪnˈtaɪ.təld tuː/), lên giọng nhẹ ở mệnh đề if và xuống giọng ở "defective".'
      },
      {
        id: 'd1-ex4',
        title: 'Ví dụ 4: Chấm dứt hợp đồng do vi phạm cam kết',
        scenario: 'Thông báo pháp lý về việc hủy bỏ thỏa thuận hợp tác do nhà thầu không đáp ứng quy chuẩn.',
        sentence: 'The contractor failed to comply with the safety specifications, resulting in immediate termination of the agreement.',
        translationVi: 'Nhà thầu đã không tuân thủ các quy chuẩn an toàn, dẫn đến việc chấm dứt thỏa thuận ngay lập tức.',
        grammarPoints: [
          {
            pattern: 'failed to comply with + Noun',
            explanation: '"comply with" là cụm động từ cố định (tuân thủ theo quy định/hợp đồng), đi kèm "failed to" chỉ sự bất thành.',
            toeicTip: 'Luôn nhớ: comply WITH, conform TO, adhere TO.'
          },
          {
            pattern: 'resulting in + Noun Phrase',
            explanation: 'Mệnh đề phân từ rút gọn (Present participle clause) chỉ hệ quả trực tiếp của hành động đứng trước.',
            toeicTip: 'TOEIC Part 6 & 7 thường dùng "resulting in" để tóm tắt kết quả trong các thông cáo báo chí.'
          }
        ],
        phoneticBreakdown: [
          { word: 'contractor', ipa: '/kənˈtræk.tər/', meaning: 'nhà thầu' },
          { word: 'comply', ipa: '/kəmˈplaɪ/', meaning: 'tuân theo' },
          { word: 'specifications', ipa: '/ˌspes.ɪ.fɪˈkeɪ.ʃənz/', meaning: 'thông số kỹ thuật, quy chuẩn' },
          { word: 'termination', ipa: '/ˌtɜː.mɪˈneɪ.ʃən/', meaning: 'sự chấm dứt' }
        ],
        speechTip: 'Nhấn rõ trọng âm âm tiết 3 của "specifications" (/ˌspes.ɪ.fɪˈkeɪ.ʃənz/).'
      }
    ]
  },
  2: {
    day: 2,
    topicTitle: 'Kế hoạch kinh doanh & Hội nghị (Planning & Conferences)',
    examples: [
      {
        id: 'd2-ex1',
        title: 'Ví dụ 1: Phân bổ ngân sách tổ chức hội nghị quốc tế',
        scenario: 'Trình bày ý kiến trong cuộc họp điều hành về kinh phí tổ chức sự kiện.',
        sentence: 'In accordance with our strategic business plan, we must allocate additional resources to ensure the international conference proceeds smoothly.',
        translationVi: 'Theo đúng kế hoạch kinh doanh chiến lược, chúng ta phải phân bổ thêm nguồn lực để đảm bảo hội nghị quốc tế diễn ra suôn sẻ.',
        grammarPoints: [
          {
            pattern: 'In accordance with + Noun Phrase',
            explanation: 'Cụm giới từ trang trọng mang nghĩa "chiếu theo / phù hợp với / theo đúng...", cực kỳ phổ biến trong văn bản kinh doanh.',
            toeicTip: 'Thường xuất hiện trong phần mở đầu của Part 7 Memo.'
          },
          {
            pattern: 'allocate ... to ensure ...',
            explanation: 'Động từ "allocate" (phân bổ vốn/nhân lực) kết hợp mệnh đề chỉ mục đích với "to ensure".',
            toeicTip: 'Cụm từ hay gặp: "allocate budget/funds".'
          }
        ],
        phoneticBreakdown: [
          { word: 'accordance', ipa: '/əˈkɔː.dəns/', meaning: 'sự phù hợp, theo đúng' },
          { word: 'strategic', ipa: '/strəˈtiː.dʒɪk/', meaning: 'mang tính chiến lược' },
          { word: 'allocate', ipa: '/ˈæl.ə.keɪt/', meaning: 'phân bổ, cấp phát' },
          { word: 'conference', ipa: '/ˈkɒn.fər.əns/', meaning: 'hội nghị' }
        ],
        speechTip: 'Nhấn mạnh các từ khóa "strategic plan" và "allocate resources".'
      },
      {
        id: 'd2-ex2',
        title: 'Ví dụ 2: Lựa chọn địa điểm và thiết bị nghe nhìn',
        scenario: 'Thảo luận với ban quản lý sự kiện về việc thuê trung tâm hội nghị.',
        sentence: 'The committee unanimously selected the downtown convention center due to its state-of-the-art audiovisual facilities.',
        translationVi: 'Hội đồng đã nhất trí lựa chọn trung tâm hội nghị trung tâm thành phố nhờ vào cơ sở vật chất nghe nhìn tối tân.',
        grammarPoints: [
          {
            pattern: 'unanimously selected',
            explanation: 'Trạng từ "unanimously" (nhất trí 100%, không ai phản đối) đứng trước động từ chính.',
            toeicTip: 'Từ vựng Band 850+: "unanimous decision", "unanimously agreed".'
          },
          {
            pattern: 'state-of-the-art',
            explanation: 'Tính từ ghép mang nghĩa "hiện đại nhất, tối tân nhất", đồng nghĩa với "cutting-edge".',
            toeicTip: 'Từ này cực kỳ hay xuất hiện trong quảng cáo thiết bị ở Part 7.'
          }
        ],
        phoneticBreakdown: [
          { word: 'unanimously', ipa: '/juːˈnæn.ɪ.məs.li/', meaning: 'nhất trí, đồng lòng' },
          { word: 'convention', ipa: '/kənˈven.ʃən/', meaning: 'hội nghị lớn' },
          { word: 'audiovisual', ipa: '/ˌɔː.di.əʊˈvɪʒ.u.əl/', meaning: 'nghe nhìn' }
        ],
        speechTip: 'Đọc liền mạch cụm từ ghép "state-of-the-art" (/ˌsteɪt.əv.ðiːˈɑːt/).'
      },
      {
        id: 'd2-ex3',
        title: 'Ví dụ 3: Xác nhận danh sách diễn giả chủ chốt',
        scenario: 'Thông báo lịch trình gửi cho các đại biểu tham dự hội thảo.',
        sentence: 'All keynote speakers are requested to submit their presentation slides no later than three days prior to the opening ceremony.',
        translationVi: 'Tất cả các diễn giả chính được yêu cầu nộp bài trình chiếu chậm nhất là ba ngày trước lễ khai mạc.',
        grammarPoints: [
          {
            pattern: 'be requested to + V',
            explanation: 'Câu yêu cầu lịch sự ở thể bị động ("được trân trọng yêu cầu...").',
            toeicTip: 'Sau "requested", động từ luôn ở dạng "to-V".'
          },
          {
            pattern: 'no later than + Time',
            explanation: 'Cụm giới từ chỉ thời hạn chót: "chậm nhất vào thời điểm...", đồng nghĩa với "by".',
            toeicTip: 'Bẫy câu hỏi thời gian trong TOEIC Part 3 & 4.'
          }
        ],
        phoneticBreakdown: [
          { word: 'keynote', ipa: '/ˈkiː.nəʊt/', meaning: 'chủ chốt, chính' },
          { word: 'presentation', ipa: '/ˌprez.ənˈteɪ.ʃən/', meaning: 'bài thuyết trình' },
          { word: 'ceremony', ipa: '/ˈser.ɪ.mə.ni/', meaning: 'buổi lễ' }
        ],
        speechTip: 'Lưu ý trọng âm của "presentation" ở âm tiết thứ 3 (/teɪ/).'
      }
    ]
  },
  3: {
    day: 3,
    topicTitle: 'Máy tính, Internet & Công nghệ văn phòng (Computers, IT & Office Tech)',
    examples: [
      {
        id: 'd3-ex1',
        title: 'Ví dụ 1: Nâng cấp giao thức bảo mật hệ thống máy chủ',
        scenario: 'Thông báo nội bộ từ phòng IT về việc hoàn tất khắc phục sự cố mạng.',
        sentence: 'Our technical support department has successfully resolved the network outage and upgraded all office computers with advanced security protocols.',
        translationVi: 'Phòng hỗ trợ kỹ thuật của chúng ta đã giải quyết thành công sự cố mất mạng và nâng cấp tất cả máy tính văn phòng bằng các giao thức bảo mật tiên tiến.',
        grammarPoints: [
          {
            pattern: 'has successfully resolved',
            explanation: 'Thì hiện tại hoàn thành kết hợp trạng từ "successfully" nhấn mạnh kết quả tích cực.',
            toeicTip: 'Cụm từ "resolve the outage" (giải quyết sự cố) là cặp từ kinh điển trong đề thi.'
          },
          {
            pattern: 'security protocols',
            explanation: 'Cụm danh từ: các giao thức / quy định bảo mật.',
            toeicTip: 'Trong TOEIC, "protocol" mang nghĩa quy trình chuẩn trong kỹ thuật hoặc ngoại giao.'
          }
        ],
        phoneticBreakdown: [
          { word: 'resolved', ipa: '/rɪˈzɒlvd/', meaning: 'đã giải quyết' },
          { word: 'outage', ipa: '/ˈaʊ.tɪdʒ/', meaning: 'sự cố mất điện/mất mạng' },
          { word: 'protocols', ipa: '/ˈprəʊ.tə.kɒlz/', meaning: 'các giao thức, quy chuẩn' }
        ],
        speechTip: 'Đọc nối âm "has successfully" và giữ nhịp điệu dứt khoát.'
      },
      {
        id: 'd3-ex2',
        title: 'Ví dụ 2: Chính sách sao lưu dữ liệu đám mây bắt buộc',
        scenario: 'Hướng dẫn nhân viên lưu trữ tài liệu bảo mật trên máy chủ đám mây.',
        sentence: 'Employees must regularly back up all confidential files to the cloud server to prevent accidental data loss.',
        translationVi: 'Nhân viên phải thường xuyên sao lưu tất cả các tệp mật lên máy chủ đám mây để ngăn ngừa sự cố mất mát dữ liệu.',
        grammarPoints: [
          {
            pattern: 'back up ... to ...',
            explanation: 'Cụm động từ (Phrasal verb): sao lưu dữ liệu sang thiết bị lưu trữ khác.',
            toeicTip: 'Phân biệt "back up" (động từ có khoảng trắng) và "backup" (danh từ liền nhau).'
          },
          {
            pattern: 'to prevent + Noun',
            explanation: 'Động từ nguyên mẫu có "to" chỉ mục đích hành động.',
            toeicTip: 'Cụm "confidential files" (tài liệu mật) xuất hiện liên tục trong bài đọc TOEIC.'
          }
        ],
        phoneticBreakdown: [
          { word: 'confidential', ipa: '/ˌkɒn.fɪˈden.ʃəl/', meaning: 'bảo mật, tuyệt mật' },
          { word: 'accidental', ipa: '/ˌæk.sɪˈden.təl/', meaning: 'tình cờ, ngẫu nhiên do sự cố' }
        ],
        speechTip: 'Nhấn rõ trọng âm âm tiết 3 của "confidential" (/ˈden/).'
      }
    ]
  }
};

// Smart fallback generator for any day (Day 1 - 30)
export function getSpeakingTaskForDay(day: number, dayWords: Word[]): SpeakingTask {
  if (CURATED_SPEAKING_TASKS[day]) {
    return CURATED_SPEAKING_TASKS[day];
  }

  // Generate 3 rich, contextual examples dynamically from day's words
  const w1 = dayWords[0]?.word || 'policy';
  const w2 = dayWords[1]?.word || 'procedure';
  const w3 = dayWords[2]?.word || 'management';
  const w4 = dayWords[3]?.word || 'requirement';

  return {
    day,
    topicTitle: `Luyện nói thực chiến Ngày ${day}`,
    examples: [
      {
        id: `d${day}-gen1`,
        title: `Ví dụ 1: Thông báo quy định công sở (${w1} & ${w2})`,
        scenario: `Đọc đoạn thông báo điều hành công ty sử dụng các từ vựng trọng tâm của Ngày ${day}.`,
        sentence: `The executive board decided to update our workplace ${w1} in order to streamline the operational ${w2} across all departments.`,
        translationVi: `Hội đồng quản trị đã quyết định cập nhật ${dayWords[0]?.meaningVi || w1} tại nơi làm việc nhằm tinh gọn ${dayWords[1]?.meaningVi || w2} vận hành giữa tất cả các phòng ban.`,
        grammarPoints: [
          {
            pattern: 'decided to update ... in order to + V',
            explanation: 'Cấu trúc diễn đạt quyết định quản trị kết hợp mệnh đề chỉ mục đích (in order to).',
            toeicTip: '"in order to" có thể thay thế bằng "so as to" hoặc "to-V".'
          },
          {
            pattern: 'across all departments',
            explanation: 'Giới từ "across" chỉ phạm vi toàn thể doanh nghiệp.',
            toeicTip: 'Cụm giới từ chỉ phạm vi phổ biến trong bài thi Listening.'
          }
        ],
        phoneticBreakdown: dayWords.slice(0, 3).map(w => ({
          word: w.word,
          ipa: w.phonetic,
          meaning: w.meaningVi
        })),
        speechTip: 'Đọc lưu loát, nhấn mạnh vào các danh từ chính và ngắt nhẹ trước "in order to".'
      },
      {
        id: `d${day}-gen2`,
        title: `Ví dụ 2: Đảm bảo tiêu chuẩn chất lượng (${w3} & ${w4})`,
        scenario: `Trình bày báo cáo giám sát quy trình nghiệp vụ với giám đốc điều hành.`,
        sentence: `Senior ${w3} confirmed that all employees must strictly adhere to each regulatory ${w4} before launching the project.`,
        translationVi: `Ban ${dayWords[2]?.meaningVi || w3} cấp cao xác nhận rằng tất cả nhân viên phải tuân thủ nghiêm ngặt từng ${dayWords[3]?.meaningVi || w4} pháp định trước khi khởi động dự án.`,
        grammarPoints: [
          {
            pattern: 'must strictly adhere to + Noun',
            explanation: '"adhere to" là collocation mang nghĩa "tuân thủ theo quy định", tương đương "comply with".',
            toeicTip: 'Từ "adhere" luôn đi với giới từ "to".'
          },
          {
            pattern: 'before launching + Noun',
            explanation: 'Giới từ "before" đi cùng danh động từ (V-ing) rút gọn chủ ngữ.',
            toeicTip: 'Dạng bài ngữ pháp rút gọn chủ ngữ rất hay gặp ở câu 110-125 Part 5.'
          }
        ],
        phoneticBreakdown: dayWords.slice(2, 5).map(w => ({
          word: w.word,
          ipa: w.phonetic,
          meaning: w.meaningVi
        })),
        speechTip: 'Đọc rõ âm đuôi /li/ trong trạng từ "strictly" và âm /t/ trong "project".'
      },
      {
        id: `d${day}-gen3`,
        title: `Ví dụ 3: Phản hồi đối tác và khách hàng (${w1})`,
        scenario: `Đoạn đối thoại trao đổi với khách hàng qua điện thoại về thời hạn hoàn thành hợp đồng.`,
        sentence: `We are fully committed to delivering the highest service standard and resolving any concerns regarding the ${w1}.`,
        translationVi: `Chúng tôi hoàn toàn cam kết đem đến tiêu chuẩn dịch vụ cao nhất và giải quyết mọi khúc mắc liên quan đến ${dayWords[0]?.meaningVi || w1}.`,
        grammarPoints: [
          {
            pattern: 'be fully committed to + V-ing/Noun',
            explanation: 'Cấu trúc biểu thị sự cam kết tuyệt đối, sau giới từ "to" là V-ing hoặc danh từ.',
            toeicTip: 'Bẫy ngữ pháp Part 5: nhiều người nhầm "to" là to-infinitive nên chia động từ nguyên mẫu, nhưng ở đây "to" là giới từ.'
          },
          {
            pattern: 'regarding + Noun',
            explanation: 'Giới từ mang nghĩa "liên quan đến / về việc...", đồng nghĩa với "concerning" hoặc "about".',
            toeicTip: 'Cụm mở đầu quen thuộc của thư tín thương mại.'
          }
        ],
        phoneticBreakdown: dayWords.slice(0, 2).map(w => ({
          word: w.word,
          ipa: w.phonetic,
          meaning: w.meaningVi
        })),
        speechTip: 'Lên giọng nhẹ ở cuối vế đầu và hạ giọng chắc chắn ở âm tiết cuối cùng.'
      }
    ]
  };
}

export const WRITING_TASKS: Record<number, WritingTask> = {
  1: {
    day: 1,
    type: 'email_response',
    title: 'Hồi đáp email khách hàng về điều khoản hợp đồng (Contracts)',
    scenario: 'Khách hàng gửi email yêu cầu làm rõ điều khoản bồi thường và thời hạn bảo hành trong hợp đồng dịch vụ mới.',
    requiredWords: ['contract', 'warranty', 'agreement'],
    minWords: 25,
    hints: [
      'Bắt đầu bằng lời cảm ơn: "Thank you for contacting us regarding..."',
      'Đề cập rõ điều khoản bảo hành trong hợp đồng: "According to the terms of the contract..."',
      'Cam kết quyền lợi khách hàng: "Our warranty covers all maintenance costs..."'
    ],
    modelAnswer: 'Thank you for your inquiry. In accordance with our signed agreement, the contract guarantees a full two-year warranty covering all necessary equipment replacements.',
    modelExplanation: 'Câu trả lời chuẩn TOEIC Writing Level 8: Sử dụng cấu trúc trang trọng "In accordance with", liên kết tự nhiên 3 từ khóa và đạt độ dài tiêu chuẩn.'
  },
  2: {
    day: 2,
    type: 'sentence_builder',
    title: 'Xây dựng câu chiến lược kinh doanh (Business Planning)',
    scenario: 'Viết một câu báo cáo tóm tắt kế hoạch phân bổ ngân sách cho buổi hội nghị thường niên.',
    requiredWords: ['plan', 'conference', 'allocate'],
    minWords: 20,
    hints: [
      'Dùng cấu trúc bị động hoặc liên từ chỉ mục đích: "In order to ensure..."',
      'Kết hợp từ "allocate" với tân ngữ ngân sách: "allocate budget for..."'
    ],
    modelAnswer: 'The executive committee agreed to allocate a substantial budget to execute the comprehensive marketing plan for the upcoming annual conference.',
    modelExplanation: 'Đạt chuẩn band C1 nhờ sử dụng collocations chuẩn công sở: "allocate a substantial budget", "execute the plan".'
  },
  3: {
    day: 3,
    type: 'email_response',
    title: 'Thông báo nâng cấp phần mềm văn phòng (Office Tech)',
    scenario: 'Viết email ngắn thông báo cho toàn bộ nhân viên về việc bảo trì hệ thống máy tính vào cuối tuần.',
    requiredWords: ['system', 'technology', 'upgrade'],
    minWords: 25,
    hints: [
      'Nêu rõ thời gian và lý do bảo trì: "Please be informed that..."',
      'Nhắc nhở sao lưu dữ liệu cá nhân trước khi hệ thống ngắt kết nối.'
    ],
    modelAnswer: 'Please be advised that our IT department will upgrade the core office technology system this Saturday to enhance security and daily processing speeds.',
    modelExplanation: 'Sử dụng cụm mở đầu trang trọng "Please be advised that" thường xuyên xuất hiện trong Part 7 & Writing TOEIC.'
  }
};
