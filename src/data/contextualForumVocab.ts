import { Word, CEFRLevel } from '../types';

export interface ContextualItem {
  id: string;
  phrase: string;
  structure: string;
  meaningVi: string;
  definitionEn: string;
  exampleEn: string;
  exampleVi: string;
  nuanceTip?: string;
  phonetic: string;
  partOfSpeech: 'verb' | 'phrasal_verb' | 'idiom' | 'adjective' | 'noun';
  cefr: CEFRLevel;
}

export interface ContextualGroup {
  id: number;
  titleVi: string;
  titleEn: string;
  summary: string;
  nuanceNotes: string;
  items: ContextualItem[];
}

export interface ContextualErrorTrap {
  id: string;
  wrong: string;
  correct: string;
  ruleVi: string;
  explanationVi: string;
}

export interface ContextualPassage {
  id: string;
  title: string;
  passageEn: string;
  passageVi: string;
  analysisVi: string;
  keyPhrases: string[];
}

export const CONTEXTUAL_FORUM_GROUPS: ContextualGroup[] = [
  {
    id: 1,
    titleVi: "1. Mong muốn, sở thích và lựa chọn",
    titleEn: "Desires, Preferences & Choices",
    summary: "Phân biệt muốn làm gì (want to), thích hơn khi so sánh (prefer to), xu hướng hành vi (tend to) và nghiêng về ý kiến (be inclined to).",
    nuanceNotes: "Tend to nói về thói quen/xu hướng hành vi trong thực tế. Be inclined to cho biết người nói nghiêng về một ý kiến/quan điểm. Cấu trúc prefer A to B dùng giới từ 'to', TUYỆT ĐỐI không dùng 'than'.",
    items: [
      {
        id: "ctx-1-1",
        phrase: "want to",
        structure: "want to + V",
        meaningVi: "Muốn làm gì (diễn tả mong muốn trực tiếp)",
        definitionEn: "to have a desire or wish for doing something",
        exampleEn: "I want to learn how to cook.",
        exampleVi: "Tôi muốn học nấu ăn.",
        nuanceTip: "Diễn tả mong muốn cá nhân cơ bản.",
        phonetic: "/wɒnt tuː/",
        partOfSpeech: "verb",
        cefr: "B1"
      },
      {
        id: "ctx-1-2",
        phrase: "prefer A to B",
        structure: "prefer A to B (A, B là danh từ hoặc V-ing)",
        meaningVi: "Thích A hơn B khi so sánh hai lựa chọn",
        definitionEn: "to like one thing or person better than another",
        exampleEn: "I prefer studying alone to studying in a group.",
        exampleVi: "Tôi thích học một mình hơn học nhóm.",
        nuanceTip: "Hai đối tượng nối bằng 'to' (prefer tea to coffee). Tuyệt đối không dùng 'than'.",
        phonetic: "/prɪˈfɜːr/",
        partOfSpeech: "verb",
        cefr: "B1"
      },
      {
        id: "ctx-1-3",
        phrase: "tend to",
        structure: "tend to + V",
        meaningVi: "Có xu hướng làm gì (thường xảy ra nhưng không phải luôn luôn)",
        definitionEn: "to be likely to act or think in a particular way; to have a regular habit",
        exampleEn: "I tend to study late at night.",
        exampleVi: "Tôi thường có xu hướng học vào đêm muộn.",
        nuanceTip: "Nói về thói quen hành vi thường xảy ra trong đời sống.",
        phonetic: "/tend tuː/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-1-4",
        phrase: "opt for",
        structure: "opt for + danh từ",
        meaningVi: "Chọn một phương án trong các lựa chọn có sẵn",
        definitionEn: "to make a choice or decision from a range of possibilities",
        exampleEn: "We opted for a smaller flat to keep the rent down.",
        exampleVi: "Chúng tôi chọn căn hộ nhỏ hơn để giảm tiền thuê.",
        nuanceTip: "Thường dùng khi đưa ra quyết định thực tế giữa các giải pháp.",
        phonetic: "/ɒpt fɔːr/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-1-5",
        phrase: "prioritise",
        structure: "prioritise + danh từ / V-ing",
        meaningVi: "Đặt việc gì ở vị trí ưu tiên hàng đầu",
        definitionEn: "to treat something as being more important than other things",
        exampleEn: "I prioritise getting enough sleep during exam week.",
        exampleVi: "Trong tuần thi, tôi ưu tiên ngủ đủ.",
        nuanceTip: "Dùng danh từ hoặc V-ing theo sau.",
        phonetic: "/praɪˈɒr.ə.taɪz/",
        partOfSpeech: "verb",
        cefr: "B2"
      },
      {
        id: "ctx-1-6",
        phrase: "be inclined to",
        structure: "be inclined to + V",
        meaningVi: "Nghiêng về một cách nghĩ hoặc quan điểm",
        definitionEn: "to tend to hold a particular thought, view, or perspective",
        exampleEn: "I'm inclined to agree with her, but I need more information.",
        exampleVi: "Tôi nghiêng về việc đồng ý với cô ấy nhưng vẫn cần thêm thông tin.",
        nuanceTip: "Khác với tend to (thói quen), be inclined to nói về sự nghiêng về ý kiến/quyết định.",
        phonetic: "/biː ɪnˈklaɪnd tuː/",
        partOfSpeech: "idiom",
        cefr: "C1"
      }
    ]
  },
  {
    id: 2,
    titleVi: "2. Thời gian và khả năng đáp ứng",
    titleEn: "Time & Availability",
    summary: "Phân biệt có sẵn thời gian (have time) với chủ động thu xếp (make time), khả năng chi trả (afford) và quyền sử dụng nguồn lực (have access to).",
    nuanceNotes: "Have time cho biết có thời gian rảnh; make time nhấn mạnh nỗ lực thu xếp. Have access to nói về quyền/khả năng tiếp cận, chưa khẳng định người đó đã thực sự sử dụng.",
    items: [
      {
        id: "ctx-2-1",
        phrase: "have time for",
        structure: "have time for + danh từ / have time to + V",
        meaningVi: "Có thời gian sẵn cho việc gì",
        definitionEn: "to possess sufficient time available to do something",
        exampleEn: "I have time for a short walk before work.",
        exampleVi: "Tôi có thời gian đi bộ một lát trước giờ làm.",
        nuanceTip: "Thể hiện thời gian rảnh có sẵn.",
        phonetic: "/hæv taɪm fɔːr/",
        partOfSpeech: "phrasal_verb",
        cefr: "B1"
      },
      {
        id: "ctx-2-2",
        phrase: "can afford",
        structure: "can afford + danh từ / to + V",
        meaningVi: "Có đủ tiền, thời gian hoặc nguồn lực để làm gì",
        definitionEn: "to have enough money, time, or means to do or purchase something without serious consequences",
        exampleEn: "I can't afford to replace my laptop yet.",
        exampleVi: "Tôi chưa đủ tiền thay máy tính.",
        nuanceTip: "Thường nói về tiền, nhưng cũng dùng cho thời gian: We can't afford to waste another week.",
        phonetic: "/kæn əˈfɔːd/",
        partOfSpeech: "verb",
        cefr: "B1"
      },
      {
        id: "ctx-2-3",
        phrase: "make time for",
        structure: "make time for + danh từ",
        meaningVi: "Chủ động thu xếp thời gian cho việc gì quan trọng",
        definitionEn: "to deliberately create or reserve time in one's schedule for an activity",
        exampleEn: "I make time for reading, even on busy days.",
        exampleVi: "Tôi vẫn dành thời gian đọc sách, kể cả những ngày bận.",
        nuanceTip: "Nhấn mạnh sự chủ động ưu tiên sắp xếp lịch trình.",
        phonetic: "/meɪk taɪm fɔːr/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-2-4",
        phrase: "have access to",
        structure: "have access to + danh từ",
        meaningVi: "Có quyền hoặc khả năng tiếp cận, sử dụng nguồn lực",
        definitionEn: "to have the right, privilege, or physical ability to use a resource or place",
        exampleEn: "Students have access to the computer room after class.",
        exampleVi: "Học sinh có thể sử dụng phòng máy sau giờ học.",
        nuanceTip: "Diễn tả quyền/khả năng sử dụng, không đồng nghĩa là đã vào hay đã dùng.",
        phonetic: "/hæv ˈæk.ses tuː/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-2-5",
        phrase: "be within reach",
        structure: "be within reach (of sb)",
        meaningVi: "Nằm trong tầm với hoặc khả năng chi trả / đạt được",
        definitionEn: "close enough to be attained, achieved, or afforded",
        exampleEn: "With the discount, the course is finally within reach.",
        exampleVi: "Nhờ được giảm giá, cuối cùng tôi cũng có khả năng chi trả cho khoá học.",
        nuanceTip: "Có thể nói về tài chính hoặc khoảng cách vật lý.",
        phonetic: "/biː wɪˈðɪn riːtʃ/",
        partOfSpeech: "idiom",
        cefr: "B2"
      },
      {
        id: "ctx-2-6",
        phrase: "be out of reach",
        structure: "be out of reach (for sb)",
        meaningVi: "Ngoài khả năng đạt được hoặc chi trả / ngoài tầm với",
        definitionEn: "impossible to afford, achieve, or attain",
        exampleEn: "Buying a home is still out of reach for us.",
        exampleVi: "Việc mua nhà vẫn nằm ngoài khả năng của chúng tôi.",
        nuanceTip: "Thường dùng để diễn tả chi phí quá đắt đỏ hoặc mục tiêu quá xa vời.",
        phonetic: "/biː aʊt əv riːtʃ/",
        partOfSpeech: "idiom",
        cefr: "B2"
      }
    ]
  },
  {
    id: 3,
    titleVi: "3. Khó khăn và cách giải quyết",
    titleEn: "Difficulties & Problem Solving",
    summary: "Xử lý vấn đề (address, deal with) và vượt qua rào cản thành công (overcome).",
    nuanceNotes: "Address a problem đi trực tiếp với danh từ (address the issue), TUYỆT ĐỐI không dùng 'address with'. Deal with cần giới từ with. Overcome khẳng định việc giải quyết đã hoàn tất thành công.",
    items: [
      {
        id: "ctx-3-1",
        phrase: "find it difficult to",
        structure: "find it difficult to + V",
        meaningVi: "Thấy khó khăn khi làm việc gì",
        definitionEn: "to experience difficulty or trouble performing an action",
        exampleEn: "I find it difficult to concentrate in a noisy room.",
        exampleVi: "Tôi thấy khó tập trung trong phòng ồn.",
        nuanceTip: "Cấu trúc giả định tân ngữ 'it': S + find it + adj + to V.",
        phonetic: "/faɪnd ɪt ˈdɪf.ɪ.kəlt tuː/",
        partOfSpeech: "idiom",
        cefr: "B1"
      },
      {
        id: "ctx-3-2",
        phrase: "ask for help",
        structure: "ask someone for help",
        meaningVi: "Nhờ hoặc xin sự giúp đỡ từ người khác",
        definitionEn: "to request assistance or support from another person",
        exampleEn: "I asked a colleague for help with the report.",
        exampleVi: "Tôi nhờ một đồng nghiệp giúp làm báo cáo.",
        nuanceTip: "Cấu trúc chuẩn: ask [người] for help.",
        phonetic: "/ɑːsk fɔːr help/",
        partOfSpeech: "phrasal_verb",
        cefr: "A2"
      },
      {
        id: "ctx-3-3",
        phrase: "struggle with / to",
        structure: "struggle with + N / struggle to + V",
        meaningVi: "Gặp nhiều khó khăn và phải chật vật cố gắng",
        definitionEn: "to try very hard to do something when it is difficult or challenging",
        exampleEn: "I still struggle to follow conversations when several people speak at once.",
        exampleVi: "Tôi vẫn khó theo kịp cuộc trò chuyện khi nhiều người nói cùng lúc.",
        nuanceTip: "Nhấn mạnh quá trình phải rất nỗ lực vì độ khó cao.",
        phonetic: "/ˈstrʌɡ.əl/",
        partOfSpeech: "verb",
        cefr: "B2"
      },
      {
        id: "ctx-3-4",
        phrase: "deal with",
        structure: "deal with + danh từ",
        meaningVi: "Xử lý, đối phó hoặc giải quyết một vấn đề",
        definitionEn: "to take action in order to solve a problem or handle a situation",
        exampleEn: "I'm dealing with a problem with my booking.",
        exampleVi: "Tôi đang xử lý một trục trặc với đơn đặt chỗ.",
        nuanceTip: "Bắt buộc phải có giới từ 'with'.",
        phonetic: "/diːl wɪð/",
        partOfSpeech: "phrasal_verb",
        cefr: "B1"
      },
      {
        id: "ctx-3-5",
        phrase: "address",
        structure: "address + a problem / an issue (KHÔNG có with)",
        meaningVi: "Chú ý đến và tìm giải pháp xử lý một vấn đề",
        definitionEn: "to give attention to and begin to deal with a matter or problem",
        exampleEn: "The new schedule is intended to address the problem of long waiting times.",
        exampleVi: "Lịch mới nhằm xử lý vấn đề thời gian chờ quá lâu.",
        nuanceTip: "LƯU Ý ETS: Đi trực tiếp với danh từ (address the problem). Dùng 'address with' là sai ngữ pháp.",
        phonetic: "/əˈdres/",
        partOfSpeech: "verb",
        cefr: "B2"
      },
      {
        id: "ctx-3-6",
        phrase: "overcome",
        structure: "overcome + an obstacle / a difficulty / fear",
        meaningVi: "Vượt qua thành công một trở ngại, khó khăn hoặc nỗi sợ",
        definitionEn: "to defeat or succeed in controlling or dealing with a problem",
        exampleEn: "With regular practice, she overcame her fear of speaking in public.",
        exampleVi: "Nhờ luyện tập đều đặn, cô ấy đã vượt qua nỗi sợ nói trước đám đông.",
        nuanceTip: "Khẳng định đã vượt qua trọn vẹn, khác với address (đang tìm cách xử lý).",
        phonetic: "/ˌəʊ.vəˈkʌm/",
        partOfSpeech: "verb",
        cefr: "B2"
      }
    ]
  },
  {
    id: 4,
    titleVi: "4. Nguyên nhân và kết quả",
    titleEn: "Causes & Results",
    summary: "Phân biệt dẫn đến kết quả (result in, lead to) với bắt nguồn từ nguyên nhân (result from), yếu tố đóng góp (contribute to) và liên hệ tương quan (be associated with).",
    nuanceNotes: "A resulted in B = A gây ra B. B resulted from A = B bắt nguồn từ A. Contribute to chỉ là một yếu tố góp phần. Be associated with chỉ là mối liên hệ, chưa thể kết luận nhân quả.",
    items: [
      {
        id: "ctx-4-1",
        phrase: "because of",
        structure: "because of + danh từ / V-ing",
        meaningVi: "Vì điều gì (nêu nguyên nhân)",
        definitionEn: "as a result of somebody or something",
        exampleEn: "The match was cancelled because of heavy rain.",
        exampleVi: "Trận đấu bị huỷ vì mưa lớn.",
        nuanceTip: "Sau because of là N/V-ing. Sau because là mệnh đề hoàn chỉnh (S + V).",
        phonetic: "/bɪˈkɒz əv/",
        partOfSpeech: "idiom",
        cefr: "A2"
      },
      {
        id: "ctx-4-2",
        phrase: "make sb/sth + adj",
        structure: "make + người/vật + tính từ",
        meaningVi: "Làm cho ai hoặc cái gì ở một trạng thái",
        definitionEn: "to cause somebody or something to be in a particular state",
        exampleEn: "The clear instructions made the task easier.",
        exampleVi: "Hướng dẫn rõ ràng giúp nhiệm vụ trở nên dễ hơn.",
        nuanceTip: "Tính từ theo sau tân ngữ, không dùng trạng từ.",
        phonetic: "/meɪk/",
        partOfSpeech: "verb",
        cefr: "B1"
      },
      {
        id: "ctx-4-3",
        phrase: "lead to",
        structure: "lead to + danh từ / V-ing",
        meaningVi: "Dẫn đến một kết quả hoặc hậu quả",
        definitionEn: "to have something as a consequence or final result",
        exampleEn: "A missed delivery can lead to delays in production.",
        exampleVi: "Một đợt giao hàng bị lỡ có thể dẫn đến chậm trễ trong sản xuất.",
        nuanceTip: "To là giới từ, sau đó dùng N hoặc V-ing.",
        phonetic: "/liːd tuː/",
        partOfSpeech: "phrasal_verb",
        cefr: "B1"
      },
      {
        id: "ctx-4-4",
        phrase: "result from",
        structure: "result from + danh từ / V-ing",
        meaningVi: "Bắt nguồn từ, là kết quả của điều gì (nêu nguyên nhân phía sau)",
        definitionEn: "to be caused by something; to happen as an outcome of something",
        exampleEn: "The delay resulted from a technical fault.",
        exampleVi: "Việc chậm trễ bắt nguồn từ một lỗi kỹ thuật.",
        nuanceTip: "B resulted from A = B là hậu quả, A là nguyên nhân.",
        phonetic: "/rɪˈzʌlt frɒm/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-4-5",
        phrase: "result in",
        structure: "result in + danh từ / V-ing",
        meaningVi: "Dẫn đến, gây ra kết quả gì (nêu kết quả phía sau)",
        definitionEn: "to cause a particular situation or outcome to happen",
        exampleEn: "A technical fault resulted in a delay.",
        exampleVi: "Một lỗi kỹ thuật đã gây ra sự chậm trễ.",
        nuanceTip: "A resulted in B = A là nguyên nhân, B là kết quả.",
        phonetic: "/rɪˈzʌlt ɪn/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-4-6",
        phrase: "contribute to",
        structure: "contribute to + danh từ / V-ing",
        meaningVi: "Góp phần tạo ra kết quả (không phải nguyên nhân duy nhất)",
        definitionEn: "to be one of the causes of an event or outcome",
        exampleEn: "Poor lighting can contribute to accidents.",
        exampleVi: "Ánh sáng kém có thể góp phần gây tai nạn.",
        nuanceTip: "To là giới từ, do đó phải là 'contribute to reducing' chứ không phải 'to reduce'.",
        phonetic: "/kənˈtrɪb.juːt tuː/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-4-7",
        phrase: "be associated with",
        structure: "be associated with + danh từ",
        meaningVi: "Có mối liên hệ với điều gì (quan hệ tương quan, chưa chắc nhân quả)",
        definitionEn: "to be connected with something in people's minds or statistical data",
        exampleEn: "Longer working hours are associated with lower job satisfaction.",
        exampleVi: "Thời gian làm việc dài hơn có liên hệ với mức độ hài lòng về công việc thấp hơn.",
        nuanceTip: "Chỉ nêu mối tương quan, không khẳng định X trực tiếp sinh ra Y.",
        phonetic: "/biː əˈsəʊ.si.eɪ.tɪd wɪð/",
        partOfSpeech: "idiom",
        cefr: "C1"
      }
    ]
  },
  {
    id: 5,
    titleVi: "5. Sự thay đổi",
    titleEn: "Changes & Trends",
    summary: "Diễn tả xu hướng tăng giảm (increase from... to), chững lại ổn định (level off) và sự thay thế nhường chỗ (give way to).",
    nuanceNotes: "Phí tăng từ £20 lên £25 là 'increased to £25' (đích đến) hoặc 'by £5' (độ tăng), không phải 'by £25'. Level off là xu hướng đi ngang sau tăng/giảm. Give way to là sự thay thế giải pháp mới cho cái cũ.",
    items: [
      {
        id: "ctx-5-1",
        phrase: "get better",
        structure: "get better",
        meaningVi: "Tốt lên, khá hơn hoặc hồi phục",
        definitionEn: "to improve in quality, health, or condition",
        exampleEn: "My listening is getting better, but I still miss some details.",
        exampleVi: "Kỹ năng nghe của tôi đang khá hơn nhưng tôi vẫn bị sót vài chi tiết.",
        nuanceTip: "Dùng cho kỹ năng, sức khỏe hoặc tình hình chung.",
        phonetic: "/ɡet ˈbet.ər/",
        partOfSpeech: "phrasal_verb",
        cefr: "A2"
      },
      {
        id: "ctx-5-2",
        phrase: "get worse",
        structure: "get worse",
        meaningVi: "Tệ đi, xấu đi hoặc trở nên nghiêm trọng hơn",
        definitionEn: "to deteriorate or become more severe",
        exampleEn: "The traffic gets worse after five.",
        exampleVi: "Tình trạng giao thông trở nên tệ hơn sau năm giờ.",
        nuanceTip: "Dùng cho thời tiết, giao thông, sức khỏe hoặc khủng hoảng.",
        phonetic: "/ɡet wɜːs/",
        partOfSpeech: "phrasal_verb",
        cefr: "A2"
      },
      {
        id: "ctx-5-3",
        phrase: "increase from A to B",
        structure: "increase from A to B / increase by X",
        meaningVi: "Tăng từ mức A lên mức B (by X = tăng thêm một lượng X)",
        definitionEn: "to rise from an initial figure to a higher figure",
        exampleEn: "The monthly fee increased from £20 to £25.",
        exampleVi: "Phí hàng tháng tăng từ 20 lên 25 bảng.",
        nuanceTip: "Tăng từ 20 lên 25 = increased by £5, KHÔNG PHẢI increased by £25.",
        phonetic: "/ɪnˈkriːs/",
        partOfSpeech: "verb",
        cefr: "B1"
      },
      {
        id: "ctx-5-4",
        phrase: "fall from A to B",
        structure: "fall from A to B / fall by X",
        meaningVi: "Giảm từ mức A xuống mức B",
        definitionEn: "to drop from an initial level to a lower level",
        exampleEn: "The number of complaints fell from 40 to 25.",
        exampleVi: "Số khiếu nại giảm từ 40 xuống 25.",
        nuanceTip: "By chỉ lượng giảm; to chỉ mốc đích đến sau khi giảm.",
        phonetic: "/fɔːl/",
        partOfSpeech: "verb",
        cefr: "B1"
      },
      {
        id: "ctx-5-5",
        phrase: "level off",
        structure: "level off",
        meaningVi: "Chững lại và duy trì ổn định quanh một mức",
        definitionEn: "to stop rising or falling and stay at a steady level",
        exampleEn: "After rising for three months, sales levelled off.",
        exampleVi: "Sau khi tăng trong ba tháng, doanh số chững lại và ổn định.",
        nuanceTip: "Mô tả xu hướng chuyển sang tương đối ổn định trên biểu đồ.",
        phonetic: "/ˈlev.əl ɒf/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-5-6",
        phrase: "give way to",
        structure: "give way to + danh từ",
        meaningVi: "Nhường chỗ cho, được thay thế dần bởi",
        definitionEn: "to be replaced by something newer, better, or more popular",
        exampleEn: "Printed notices have gradually given way to messages in the residents' chat group.",
        exampleVi: "Thông báo in đã dần nhường chỗ cho tin nhắn trong nhóm chat của cư dân.",
        nuanceTip: "Khác với giảm đơn thuần, give way to nói về sự thay thế phương thức/công nghệ.",
        phonetic: "/ɡɪv weɪ tuː/",
        partOfSpeech: "idiom",
        cefr: "C1"
      }
    ]
  },
  {
    id: 6,
    titleVi: "6. So sánh và cân nhắc lựa chọn",
    titleEn: "Comparison & Evaluation",
    summary: "So sánh tương đương (the same as, on a par with), đối lập (different from, unlike) và nặng ký hơn (outweigh).",
    nuanceNotes: "Khi dùng compared with, hai đối tượng so sánh phải tương đương về bản chất (so sánh điện thoại với điện thoại, không so điện thoại với thời lượng pin). Outweigh dùng khi cân nhắc lợi ích vượt trội hơn chi phí.",
    items: [
      {
        id: "ctx-6-1",
        phrase: "the same as",
        structure: "the same as + danh từ",
        meaningVi: "Giống hoặc bằng với đối tượng đang xét",
        definitionEn: "identical to or not different from something",
        exampleEn: "My answer is the same as yours.",
        exampleVi: "Câu trả lời của tôi giống của bạn.",
        nuanceTip: "Dùng để khẳng định sự tương đồng chính xác.",
        phonetic: "/ðə seɪm æz/",
        partOfSpeech: "idiom",
        cefr: "A2"
      },
      {
        id: "ctx-6-2",
        phrase: "different from",
        structure: "different from + danh từ",
        meaningVi: "Khác với điều gì hoặc ai đó",
        definitionEn: "not like something or someone else",
        exampleEn: "The job is different from what I expected.",
        exampleVi: "Công việc khác với những gì tôi hình dung.",
        nuanceTip: "Trong văn phong chuẩn, dùng different from (ít khuyến khích different than trong bài thi chuẩn).",
        phonetic: "/ˈdɪf.ər.ənt frɒm/",
        partOfSpeech: "idiom",
        cefr: "A2"
      },
      {
        id: "ctx-6-3",
        phrase: "compared with",
        structure: "compared with + danh từ",
        meaningVi: "So với một đối tượng được lấy làm mốc",
        definitionEn: "when examined in relation to another object or standard",
        exampleEn: "Compared with the old model, this phone has a longer battery life.",
        exampleVi: "So với mẫu cũ, điện thoại này có thời lượng pin dài hơn.",
        nuanceTip: "Chú ý hai vế so sánh phải cùng loại để tránh lỗi so sánh khập khiễng.",
        phonetic: "/kəmˈpeəd wɪð/",
        partOfSpeech: "idiom",
        cefr: "B1"
      },
      {
        id: "ctx-6-4",
        phrase: "unlike",
        structure: "unlike + danh từ / đại từ",
        meaningVi: "Khác với; làm rõ một điểm đối lập nổi bật",
        definitionEn: "different from somebody or something; not typical of",
        exampleEn: "Unlike her brother, Mai enjoys cooking.",
        exampleVi: "Khác với anh trai, Mai thích nấu ăn.",
        nuanceTip: "Đặt ở đầu mệnh đề để tạo sự tương phản rõ nét.",
        phonetic: "/ʌnˈlaɪk/",
        partOfSpeech: "adjective",
        cefr: "B1"
      },
      {
        id: "ctx-6-5",
        phrase: "outweigh",
        structure: "outweigh + danh từ",
        meaningVi: "Có sức nặng, giá trị hoặc tầm quan trọng lớn hơn",
        definitionEn: "to be greater or more important than something else",
        exampleEn: "For me, the shorter commute outweighs the higher rent.",
        exampleVi: "Với tôi, lợi ích đi làm gần hơn đáng giá hơn khoản tiền thuê tăng thêm.",
        nuanceTip: "Từ vựng 'vàng' trong TOEIC & IELTS khi viết luận về ưu điểm vs nhược điểm.",
        phonetic: "/ˌaʊtˈweɪ/",
        partOfSpeech: "verb",
        cefr: "B2"
      },
      {
        id: "ctx-6-6",
        phrase: "be on a par with",
        structure: "be on a par with + danh từ",
        meaningVi: "Ngang hàng, tương đương về mức độ hoặc chất lượng",
        definitionEn: "equal in importance, quality, or standard to somebody or something",
        exampleEn: "The food here is on a par with what we had at the more expensive restaurant.",
        exampleVi: "Đồ ăn ở đây có chất lượng ngang với những món chúng tôi đã ăn ở nhà hàng đắt hơn.",
        nuanceTip: "Không tự mang nghĩa 'xuất sắc', mà chỉ nhấn mạnh sự ngang bằng theo tiêu chí xét.",
        phonetic: "/biː ɒn ə pɑːr wɪð/",
        partOfSpeech: "idiom",
        cefr: "C1"
      }
    ]
  },
  {
    id: 7,
    titleVi: "7. Học tập và làm việc",
    titleEn: "Learning & Professional Practice",
    summary: "Học kỹ năng (learn to), thích nghi (get used to), bắt kịp khối lượng (keep up with) và vận dụng thực tiễn (put into practice).",
    nuanceNotes: "Phân biệt 3 cấu trúc cốt lõi: Used to + V (thói quen quá khứ đã bỏ), Be used to + V-ing (đã quen với việc gì), Get used to + V-ing (đang dần thích nghi làm quen).",
    items: [
      {
        id: "ctx-7-1",
        phrase: "learn to",
        structure: "learn to + V",
        meaningVi: "Học để làm được một kỹ năng mới",
        definitionEn: "to acquire knowledge or skill in doing something",
        exampleEn: "I'm learning to drive.",
        exampleVi: "Tôi đang học lái xe.",
        nuanceTip: "Nói về việc tiếp thu một kỹ năng cụ thể.",
        phonetic: "/lɜːn tuː/",
        partOfSpeech: "verb",
        cefr: "A1"
      },
      {
        id: "ctx-7-2",
        phrase: "get used to",
        structure: "get used to + danh từ / V-ing",
        meaningVi: "Dần quen với một điều mới mẻ hoặc môi trường mới",
        definitionEn: "to become familiar with something through experience over time",
        exampleEn: "I'm getting used to speaking English at work.",
        exampleVi: "Tôi đang dần quen với việc nói tiếng Anh ở chỗ làm.",
        nuanceTip: "Sau get used to là V-ing: 'getting used to working', KHÔNG dùng 'work'.",
        phonetic: "/ɡet juːst tuː/",
        partOfSpeech: "idiom",
        cefr: "B1"
      },
      {
        id: "ctx-7-3",
        phrase: "be used to",
        structure: "be used to + danh từ / V-ing",
        meaningVi: "Đã quen thuộc với việc gì (không còn thấy lạ lẫm hay khó chịu)",
        definitionEn: "to be accustomed to something so that it seems normal",
        exampleEn: "I'm used to working at night.",
        exampleVi: "Tôi đã quen với việc làm ban đêm.",
        nuanceTip: "Khác với used to + V (thói quen quá khứ).",
        phonetic: "/biː juːst tuː/",
        partOfSpeech: "idiom",
        cefr: "B1"
      },
      {
        id: "ctx-7-4",
        phrase: "keep up with",
        structure: "keep up with + danh từ",
        meaningVi: "Theo kịp tốc độ, khối lượng công việc hoặc tiến độ",
        definitionEn: "to manage to do work or read material as fast as it is produced or assigned",
        exampleEn: "I find it hard to keep up with all the reading for this course.",
        exampleVi: "Tôi thấy khó theo kịp khối lượng bài đọc của khoá học này.",
        nuanceTip: "Thường dùng khi đối mặt với lượng tài liệu hoặc tiến độ dồn dập.",
        phonetic: "/kiːp ʌp wɪð/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      },
      {
        id: "ctx-7-5",
        phrase: "put into practice",
        structure: "put something into practice",
        meaningVi: "Đem điều đã học hoặc lý thuyết vào thực tế",
        definitionEn: "to apply an idea, method, or knowledge to real-life situations",
        exampleEn: "I tried to put the teacher's advice into practice in my next essay.",
        exampleVi: "Tôi thử áp dụng lời khuyên của giáo viên vào bài luận tiếp theo.",
        nuanceTip: "Biến lý thuyết thành hành động cụ thể.",
        phonetic: "/pʊt ˈɪn.tuː ˈpræk.tɪs/",
        partOfSpeech: "idiom",
        cefr: "B2"
      },
      {
        id: "ctx-7-6",
        phrase: "develop an understanding of",
        structure: "develop an understanding of + danh từ",
        meaningVi: "Dần hình thành sự hiểu biết sâu sắc về điều gì",
        definitionEn: "to gradually acquire deep knowledge or insight about something",
        exampleEn: "The project helped me develop an understanding of how small businesses operate.",
        exampleVi: "Dự án giúp tôi hiểu dần cách các doanh nghiệp nhỏ hoạt động.",
        nuanceTip: "Diễn tả quá trình thấu hiểu qua trải nghiệm công việc.",
        phonetic: "/dɪˈvel.əp ən ˌʌn.dəˈstæn.dɪŋ/",
        partOfSpeech: "idiom",
        cefr: "C1"
      },
      {
        id: "ctx-7-7",
        phrase: "build on",
        structure: "build on + danh từ",
        meaningVi: "Phát triển tiếp dựa trên nền tảng sẵn có",
        definitionEn: "to use existing success or knowledge as a base for further development",
        exampleEn: "This course builds on the skills you learnt in the first term.",
        exampleVi: "Khoá học này phát triển tiếp những kỹ năng bạn đã học ở học kỳ đầu.",
        nuanceTip: "Nói về sự phát triển mang tính kế thừa.",
        phonetic: "/bɪld ɒn/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      }
    ]
  },
  {
    id: 8,
    titleVi: "8. Các mối quan hệ và trách nhiệm",
    titleEn: "Relationships & Accountability",
    summary: "Quan tâm (care about), hòa thuận (get on with), trông cậy (rely on), gánh vác trách nhiệm (be responsible for) và coi là hiển nhiên (take for granted).",
    nuanceNotes: "Care about là sự quan tâm cảm xúc; take care of là hành động chăm sóc. Responsible for đi với for (KHÔNG DÙNG responsible of). Get on with work là bắt tay làm việc, khác với get on with someone là hòa thuận.",
    items: [
      {
        id: "ctx-8-1",
        phrase: "care about",
        structure: "care about + danh từ",
        meaningVi: "Quan tâm, coi ai hoặc điều gì là quan trọng",
        definitionEn: "to feel that something or someone is important and worth worrying about",
        exampleEn: "She cares about how her students feel.",
        exampleVi: "Cô ấy quan tâm đến cảm nhận của học sinh.",
        nuanceTip: "Phân biệt với take care of (chăm sóc thể chất / trông nom).",
        phonetic: "/keər əˈbaʊt/",
        partOfSpeech: "phrasal_verb",
        cefr: "B1"
      },
      {
        id: "ctx-8-2",
        phrase: "get on with",
        structure: "get on with + người",
        meaningVi: "Có quan hệ hòa thuận, tốt đẹp với ai",
        definitionEn: "to have a harmonious and friendly relationship with someone",
        exampleEn: "I get on well with my neighbours.",
        exampleVi: "Tôi có quan hệ tốt với hàng xóm.",
        nuanceTip: "Thành ngữ phổ biến trong tiếng Anh Anh. Khác với 'get on with your work' (bắt tay làm việc).",
        phonetic: "/ɡet ɒn wɪð/",
        partOfSpeech: "phrasal_verb",
        cefr: "B1"
      },
      {
        id: "ctx-8-3",
        phrase: "rely on",
        structure: "rely on + người/vật",
        meaningVi: "Dựa vào, trông cậy hoặc tin cậy vào ai/cái gì",
        definitionEn: "to depend on or trust somebody or something with confidence",
        exampleEn: "I rely on my phone to remind me of appointments.",
        exampleVi: "Tôi dựa vào điện thoại để được nhắc lịch hẹn.",
        nuanceTip: "Thể hiện sự phụ thuộc tin cậy vào công cụ hoặc đồng nghiệp.",
        phonetic: "/rɪˈlaɪ ɒn/",
        partOfSpeech: "phrasal_verb",
        cefr: "B1"
      },
      {
        id: "ctx-8-4",
        phrase: "be responsible for",
        structure: "be responsible for + danh từ / V-ing",
        meaningVi: "Chịu trách nhiệm về một công việc hoặc nhiệm vụ",
        definitionEn: "having an obligation to do something as part of one's job or role",
        exampleEn: "I'm responsible for checking the final version.",
        exampleVi: "Tôi chịu trách nhiệm kiểm tra bản cuối.",
        nuanceTip: "BẮT BUỘC là responsible for. 'Responsible of' là lỗi sai nghiêm trọng.",
        phonetic: "/biː rɪˈspɒn.sə.bəl fɔːr/",
        partOfSpeech: "idiom",
        cefr: "B1"
      },
      {
        id: "ctx-8-5",
        phrase: "take for granted",
        structure: "take someone/something for granted",
        meaningVi: "Mặc nhiên coi là điều hiển nhiên nên không trân trọng đúng mức",
        definitionEn: "to expect someone or something to always be there without appreciating them",
        exampleEn: "I took my parents' support for granted until I moved away.",
        exampleVi: "Trước khi chuyển đi, tôi cứ mặc nhiên xem sự hỗ trợ của bố mẹ là điều luôn có.",
        nuanceTip: "Thành ngữ rất hay gặp trong các bài đọc tâm lý xã hội và nhân sự.",
        phonetic: "/teɪk fɔːr ˈɡrɑːn.tɪd/",
        partOfSpeech: "idiom",
        cefr: "B2"
      },
      {
        id: "ctx-8-6",
        phrase: "take into account",
        structure: "take someone's needs / sth into account",
        meaningVi: "Cân nhắc, tính đến một yếu tố khi đưa ra quyết định",
        definitionEn: "to consider or remember something when assessing a situation",
        exampleEn: "The timetable should take working students' needs into account.",
        exampleVi: "Thời khoá biểu nên tính đến nhu cầu của những sinh viên đang đi làm.",
        nuanceTip: "Đồng nghĩa với take into consideration.",
        phonetic: "/teɪk ˈɪn.tuː əˈkaʊnt/",
        partOfSpeech: "idiom",
        cefr: "B2"
      }
    ]
  },
  {
    id: 9,
    titleVi: "9. Công dụng và hiệu quả",
    titleEn: "Utility, Value & Effectiveness",
    summary: "Hữu ích (useful for), xứng đáng chi phí (worth), đáp ứng nhu cầu (meet needs) và phân biệt đạt kết quả (effective) vs tối ưu chi phí nguồn lực (efficient).",
    nuanceNotes: "Worth đi với V-ing (worth reading), KHÔNG dùng 'worth to read'. Effective là làm được việc đạt mục tiêu; efficient là tiết kiệm thời gian, công sức và tiền bạc.",
    items: [
      {
        id: "ctx-9-1",
        phrase: "be useful for",
        structure: "be useful for + danh từ / V-ing",
        meaningVi: "Hữu ích, mang lại giá trị thực tế cho việc gì",
        definitionEn: "effective or helpful in doing or achieving something",
        exampleEn: "This app is useful for keeping track of expenses.",
        exampleVi: "Ứng dụng này hữu ích cho việc theo dõi chi tiêu.",
        nuanceTip: "Nêu công dụng trực tiếp của công cụ hoặc phương pháp.",
        phonetic: "/biː ˈjuːs.fəl fɔːr/",
        partOfSpeech: "idiom",
        cefr: "A2"
      },
      {
        id: "ctx-9-2",
        phrase: "be worth",
        structure: "be worth + danh từ / V-ing",
        meaningVi: "Đáng giá, xứng đáng với chi phí, công sức hoặc thời gian",
        definitionEn: "enjoyable, useful, or satisfying enough to justify the effort or cost",
        exampleEn: "The article is worth reading if you're choosing your first camera.",
        exampleVi: "Bài viết đáng đọc nếu bạn đang chọn chiếc máy ảnh đầu tiên.",
        nuanceTip: "BẮT BUỘC dùng worth + V-ing ('worth reading'). Không dùng 'worth to read'.",
        phonetic: "/biː wɜːθ/",
        partOfSpeech: "idiom",
        cefr: "B1"
      },
      {
        id: "ctx-9-3",
        phrase: "benefit from",
        structure: "benefit from + danh từ / V-ing",
        meaningVi: "Hưởng lợi ích từ điều gì",
        definitionEn: "to be helped by something or receive an advantage",
        exampleEn: "I benefited from getting feedback on each draft.",
        exampleVi: "Việc được góp ý cho từng bản nháp đã giúp ích cho tôi.",
        nuanceTip: "Nhận được sự tiến bộ hoặc thuận lợi từ sự kiện/góp ý.",
        phonetic: "/ˈben.ɪ.fɪt frɒm/",
        partOfSpeech: "phrasal_verb",
        cefr: "B1"
      },
      {
        id: "ctx-9-4",
        phrase: "meet someone's needs",
        structure: "meet someone's needs",
        meaningVi: "Đáp ứng đầy đủ nhu cầu của ai đó",
        definitionEn: "to satisfy the requirements or expectations of somebody",
        exampleEn: "A basic laptop meets my needs because I mainly write and browse the web.",
        exampleVi: "Máy tính cơ bản đáp ứng nhu cầu của tôi vì tôi chủ yếu viết và duyệt web.",
        nuanceTip: "Cụm collocation cốt lõi trong giao thương và chăm sóc khách hàng.",
        phonetic: "/miːt niːdz/",
        partOfSpeech: "idiom",
        cefr: "B2"
      },
      {
        id: "ctx-9-5",
        phrase: "be effective in",
        structure: "be effective in + V-ing",
        meaningVi: "Có tác dụng đạt được kết quả mong muốn",
        definitionEn: "successful in producing a desired or intended result",
        exampleEn: "The reminders were effective in reducing missed appointments.",
        exampleVi: "Những lời nhắc có tác dụng làm giảm số cuộc hẹn bị bỏ lỡ.",
        nuanceTip: "Nhấn mạnh vào khả năng ĐẠT ĐƯỢC MỤC TIÊU thành công.",
        phonetic: "/biː ɪˈfek.tɪv ɪn/",
        partOfSpeech: "idiom",
        cefr: "B2"
      },
      {
        id: "ctx-9-6",
        phrase: "efficient",
        structure: "an efficient way to + V / be efficient",
        meaningVi: "Cách làm tối ưu, sử dụng ít thời gian, công sức và chi phí mà vẫn tốt",
        definitionEn: "working in a well-organized and competent way without wasting materials, time, or energy",
        exampleEn: "Batch cooking is an efficient way to prepare meals for the week.",
        exampleVi: "Nấu nhiều phần trong một lần là cách tiết kiệm thời gian và công sức khi chuẩn bị bữa ăn cho cả tuần.",
        nuanceTip: "Phân biệt với effective: một phương pháp có thể effective (đạt kết quả) nhưng chưa chắc efficient (nếu tốn quá nhiều tiền hoặc thời gian).",
        phonetic: "/ɪˈfɪʃ.ənt/",
        partOfSpeech: "adjective",
        cefr: "B2"
      }
    ]
  },
  {
    id: 10,
    titleVi: "10. Ý kiến và bằng chứng",
    titleEn: "Opinions, Inferences & Evidence",
    summary: "Nêu ý kiến (I think), suy luận từ dấu hiệu (suggest that), cung cấp bằng chứng (provide evidence for) và loại trừ khả năng (rule out).",
    nuanceNotes: "Evidence là danh từ không đếm được (dùng some evidence hoặc a piece of evidence). Cannot rule out cho biết một khả năng vẫn chưa bị gạch bỏ. Suggest that diễn tả nhận định rút ra từ thực tế quan sát.",
    items: [
      {
        id: "ctx-10-1",
        phrase: "I think (that)",
        structure: "I think (that) + mệnh đề",
        meaningVi: "Tôi nghĩ rằng (nêu suy nghĩ hoặc ý kiến cá nhân)",
        definitionEn: "used to state one's personal opinion or belief",
        exampleEn: "I think we should leave earlier.",
        exampleVi: "Tôi nghĩ chúng tôi nên đi sớm hơn.",
        nuanceTip: "Cách diễn đạt ý kiến trực tiếp phổ biến nhất.",
        phonetic: "/aɪ θɪŋk/",
        partOfSpeech: "idiom",
        cefr: "A1"
      },
      {
        id: "ctx-10-2",
        phrase: "not be sure whether",
        structure: "not be sure whether + mệnh đề",
        meaningVi: "Chưa chắc chắn một điều có đúng hoặc xảy ra hay không",
        definitionEn: "to be uncertain if something is true or will take place",
        exampleEn: "I'm not sure whether the shop is open on Sundays.",
        exampleVi: "Tôi chưa chắc cửa hàng có mở Chủ nhật không.",
        nuanceTip: "Dùng để biểu đạt sự dè dặt, khách quan khi chưa có đủ thông tin.",
        phonetic: "/nɒt biː ʃɔːr ˈweð.ər/",
        partOfSpeech: "idiom",
        cefr: "B1"
      },
      {
        id: "ctx-10-3",
        phrase: "seem to",
        structure: "seem to + V",
        meaningVi: "Có vẻ như (nêu nhận định từ điều quan sát được)",
        definitionEn: "to appear to be true based on observed evidence",
        exampleEn: "The new timetable seems to work better for evening students.",
        exampleVi: "Thời khoá biểu mới có vẻ phù hợp hơn với học viên buổi tối.",
        nuanceTip: "Nhận định khách quan từ hiện tượng thực tế.",
        phonetic: "/siːm tuː/",
        partOfSpeech: "verb",
        cefr: "B1"
      },
      {
        id: "ctx-10-4",
        phrase: "suggest that",
        structure: "suggest that + mệnh đề",
        meaningVi: "Cho thấy, gợi ra nhận định từ dấu hiệu quan sát",
        definitionEn: "to indicate or show a likely possibility based on signs",
        exampleEn: "The empty shelves suggest that the shop has been busy.",
        exampleVi: "Những kệ hàng trống cho thấy có thể cửa hàng vừa có nhiều khách.",
        nuanceTip: "Khác với suggest mang nghĩa 'đề xuất' (I suggest that we leave earlier). Ở đây mang nghĩa 'dấu hiệu cho thấy'.",
        phonetic: "/səˈdʒest ðæt/",
        partOfSpeech: "verb",
        cefr: "B2"
      },
      {
        id: "ctx-10-5",
        phrase: "provide evidence for",
        structure: "provide evidence for + danh từ",
        meaningVi: "Cung cấp bằng chứng ủng hộ một nhận định hoặc giả thuyết",
        definitionEn: "to give factual support or verification for a claim or theory",
        exampleEn: "These results provide evidence for the idea that regular feedback helps learners revise their work more effectively.",
        exampleVi: "Những kết quả này cung cấp bằng chứng ủng hộ nhận định rằng góp ý thường xuyên giúp người học sửa bài hiệu quả hơn.",
        nuanceTip: "Evidence là danh từ không đếm được. Kết hợp đúng: some evidence, a piece of evidence.",
        phonetic: "/prəˈvaɪd ˈev.ɪ.dəns fɔːr/",
        partOfSpeech: "idiom",
        cefr: "C1"
      },
      {
        id: "ctx-10-6",
        phrase: "rule out",
        structure: "rule out + danh từ / V-ing",
        meaningVi: "Loại trừ một khả năng hoặc phương án",
        definitionEn: "to exclude something as a possibility",
        exampleEn: "We can't rule out a technical problem yet.",
        exampleVi: "Chúng tôi vẫn chưa thể loại trừ khả năng có vấn đề kỹ thuật.",
        nuanceTip: "'Can't rule out X' có nghĩa là X vẫn còn khả năng xảy ra, chưa khẳng định chắc chắn.",
        phonetic: "/ruːl aʊt/",
        partOfSpeech: "phrasal_verb",
        cefr: "B2"
      }
    ]
  }
];

export const CONTEXTUAL_ERROR_TRAPS: ContextualErrorTrap[] = [
  {
    id: "trap-1",
    wrong: "I can't afford buying a new phone.",
    correct: "I can't afford to buy a new phone.",
    ruleVi: "Cấu trúc chuẩn là can afford to + V.",
    explanationVi: "Afford đi với động từ nguyên mẫu có to (to-infinitive), không đi trực tiếp với danh động từ V-ing."
  },
  {
    id: "trap-2",
    wrong: "This book is worth to read.",
    correct: "This book is worth reading.",
    ruleVi: "Cấu trúc chuẩn là be worth + V-ing.",
    explanationVi: "Worth đóng vai trò như giới từ/tính từ đặc biệt đòi hỏi một danh từ hoặc V-ing theo sau. Ví dụ: It's worth spending ten minutes checking your work."
  },
  {
    id: "trap-3",
    wrong: "I'm getting used to work here.",
    correct: "I'm getting used to working here.",
    ruleVi: "Cấu trúc get used to + V-ing (dần thích nghi với việc gì).",
    explanationVi: "Trong get used to / be used to, 'to' là giới từ nên bắt buộc theo sau là V-ing. Khác với used to + V (thói quen quá khứ)."
  },
  {
    id: "trap-4",
    wrong: "The change contributed to reduce costs.",
    correct: "The change contributed to reducing costs.",
    ruleVi: "Contribute to + V-ing / Danh từ ('to' là giới từ).",
    explanationVi: "Rất nhiều người nhầm 'to' trong contribute to là to-infinitive. Trong tiếng Anh chuẩn, to ở đây là preposition chỉ hướng dẫn đến kết quả."
  },
  {
    id: "trap-5",
    wrong: "I'm responsible of checking the figures.",
    correct: "I'm responsible for checking the figures.",
    ruleVi: "Tính từ responsible luôn đi kèm giới từ for.",
    explanationVi: "Diễn tả trách nhiệm gánh vác công việc: responsible for sth/doing sth. Không dùng 'responsible of'."
  },
  {
    id: "trap-6",
    wrong: "The price increased by £25. (khi định nói giá tăng từ £20 lên £25)",
    correct: "The price increased to £25 (hoặc increased by £5, from £20 to £25).",
    ruleVi: "Giới từ TO chỉ mốc cuối; giới từ BY chỉ biên độ chênh lệch tăng/giảm.",
    explanationVi: "Nếu nói 'increased by £25' thì nghĩa là giá mới = £20 + £25 = £45. Muốn nói mốc £25 phải dùng 'increased to £25'."
  },
  {
    id: "trap-7",
    wrong: "The new system is efficient. (khi chỉ mới thấy hệ thống giúp giảm lỗi)",
    correct: "The new system is effective in reducing errors.",
    ruleVi: "Effective = đạt kết quả mong muốn; Efficient = tối ưu thời gian/nguồn lực.",
    explanationVi: "Nếu chưa có dữ liệu chứng minh hệ thống tiết kiệm thời gian hoặc chi phí, chỉ được kết luận là effective (có hiệu lực/kết quả)."
  },
  {
    id: "trap-8",
    wrong: "The results prove that X causes Y. (khi nghiên cứu chỉ thấy X và Y cùng biến thiên)",
    correct: "The results show an association between X and Y.",
    ruleVi: "Không đánh đồng mối quan hệ tương quan (association) với quan hệ nhân quả (causation).",
    explanationVi: "Trong văn phong học thuật và báo cáo công sở, khi dữ liệu chỉ cho thấy 2 yếu tố đi cùng nhau, phải dùng be associated with hoặc show an association."
  }
];

export const CONTEXTUAL_PRACTICE_PASSAGES: ContextualPassage[] = [
  {
    id: "passage-1",
    title: "1. Quyết định cá nhân: Thuê nhà gần văn phòng",
    passageEn: "I opted for a flat near the office. The rent is higher, but I can afford it, and the shorter journey gives me more time to cook. For me, that extra time outweighs the extra cost.",
    passageVi: "Tôi chọn căn hộ gần văn phòng. Tiền thuê cao hơn nhưng tôi trả được và quãng đường đi làm ngắn hơn giúp tôi có thêm thời gian nấu ăn. Với tôi, phần thời gian có thêm đáng giá hơn phần chi phí tăng thêm.",
    analysisVi: "Sử dụng linh hoạt 'opted for' (chọn phương án), 'can afford it' (khả năng chi trả), và 'outweighs the extra cost' (lợi ích thời gian vượt trội hơn chi phí tiền bạc). Cụm 'For me' giới hạn nhận định trong hoàn cảnh cá nhân.",
    keyPhrases: ["opted for", "afford it", "gives me more time", "outweighs the extra cost"]
  },
  {
    id: "passage-2",
    title: "2. Nhận định chính sách: Khoảng cách chỗ ở của nhân viên",
    passageEn: "Living closer to work can make it easier to cook at home and rest after work. However, higher rents may put this option out of reach for some employees. Whether the time saved outweighs the extra cost depends partly on their income and working hours.",
    passageVi: "Sống gần chỗ làm có thể giúp việc nấu ăn ở nhà và nghỉ ngơi sau giờ làm dễ dàng hơn. Tuy nhiên, giá thuê cao hơn có thể khiến một số nhân viên không đủ khả năng chọn phương án này. Thời gian tiết kiệm được có đáng hơn phần chi phí tăng thêm hay không còn phần nào phụ thuộc vào thu nhập và giờ làm của họ.",
    analysisVi: "Kết hợp 'make it easier' (giúp dễ dàng hơn), 'put this option out of reach' (ngoài tầm với/khả năng của nhân viên), 'whether the time saved outweighs...' (cân nhắc đa chiều dựa trên thu nhập).",
    keyPhrases: ["make it easier", "out of reach", "outweighs the extra cost", "depends partly on"]
  },
  {
    id: "passage-3",
    title: "3. Thay đổi kế hoạch học tập thực tế",
    passageEn: "I wanted to join the morning class, but I couldn't afford to lose a day's pay. At first, I thought the evening class would meet my needs. Actually, the late finish would make it difficult to get home, so I opted for the weekend class instead.",
    passageVi: "Tôi muốn học lớp buổi sáng nhưng không thể mất một ngày lương. Ban đầu tôi nghĩ lớp buổi tối sẽ đáp ứng nhu cầu. Thực ra, giờ tan học muộn sẽ khiến việc về nhà khó khăn, nên tôi chọn lớp cuối tuần.",
    analysisVi: "Diễn tả quá trình suy nghĩ logic: 'wanted to' (mong muốn ban đầu) -> 'couldn't afford to lose' (rào cản tài chính) -> 'meet my needs' (đáp ứng nhu cầu) -> 'make it difficult' (khó khăn phát sinh) -> 'opted for ... instead' (lựa chọn thay thế cuối cùng).",
    keyPhrases: ["wanted to", "couldn't afford to", "meet my needs", "make it difficult", "opted for ... instead"]
  }
];

// Flat list of Word objects for global search & study integration
export const FORUM_CONTEXTUAL_WORDS: Word[] = CONTEXTUAL_FORUM_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    id: `forum-${item.id}`,
    word: item.phrase,
    phonetic: item.phonetic,
    partOfSpeech: item.partOfSpeech,
    meaningVi: item.meaningVi,
    definitionEn: item.definitionEn,
    example: item.exampleEn,
    exampleVi: item.exampleVi,
    collocations: [item.structure],
    cefr: item.cefr,
    topicId: "contextual-forum-vocab",
    day: 1,
    toeicContext: `${group.titleVi} • Lưu ý ngữ cảnh: ${item.nuanceTip || group.nuanceNotes}`
  }))
);
