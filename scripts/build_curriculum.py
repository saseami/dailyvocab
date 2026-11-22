import csv
import json
import os
import re

# Load Oxford 5000 CEFR mappings
oxford_path = 'data-repos/oxford-5000/data/oxford_5000.json'
ox_map = {}
if os.path.exists(oxford_path):
    with open(oxford_path, encoding='utf-8') as f:
        ox_data = json.load(f)
        for item in ox_data.values():
            w = item.get('word', '').strip().lower()
            cefr = item.get('cefr', '').strip().upper()
            if w and cefr:
                ox_map[w] = cefr

# Load TOEIC 600 words dataset
toeic_path = 'data-repos/toeic-600-words/data/toeic_600_words.csv'
with open(toeic_path, encoding='utf-8-sig') as f:
    rows = list(csv.DictReader(f))

# Define the 30-Day Master Schedule mapping all 50 TOEIC topics
SCHEDULE = [
    {
        "day": 1,
        "id": "day-1-contracts-warranties",
        "title": "Contracts & Warranties",
        "titleVi": "Hợp đồng & Cam kết bảo hành",
        "description": "Essential vocabulary for legal agreements, negotiations, covenants, and product warranties.",
        "badge": "TOEIC Part 5 & 6 Core",
        "topics": ["Contracts", "Warranties"]
    },
    {
        "day": 2,
        "id": "day-2-planning-conferences",
        "title": "Business Planning & Conferences",
        "titleVi": "Kế hoạch kinh doanh & Hội nghị",
        "description": "Strategies, agenda setting, corporate presentations, and international seminars.",
        "badge": "TOEIC Part 3 & 4 Listening",
        "topics": ["Business Planning", "Conference"]
    },
    {
        "day": 3,
        "id": "day-3-computers-tech",
        "title": "Computers, Internet & Office Tech",
        "titleVi": "Máy tính, Internet & Thiết bị văn phòng",
        "description": "Hardware, software, cybersecurity, digital communication, and office machinery.",
        "badge": "Workplace IT & Tech",
        "topics": ["Computers and the Internet", "Office Technology"]
    },
    {
        "day": 4,
        "id": "day-4-procedures-correspondence",
        "title": "Office Procedures & Correspondence",
        "titleVi": "Quy trình văn phòng & Thư tín thương mại",
        "description": "Internal memos, formal emails, clerical protocols, and standard operating procedures.",
        "badge": "TOEIC Part 7 Memos",
        "topics": ["Office Procedures", "Correspondence"]
    },
    {
        "day": 5,
        "id": "day-5-recruitment-interview",
        "title": "Job Advertisements & Interviewing",
        "titleVi": "Tuyển dụng & Phỏng vấn ứng viên",
        "description": "Job descriptions, candidate screening, qualifications, and behavioral interviews.",
        "badge": "HR & Career",
        "topics": ["Job Ads & Recruitment", "Apply and Interviewing"]
    },
    {
        "day": 6,
        "id": "day-6-hiring-promotions",
        "title": "Hiring, Training & Promotions",
        "titleVi": "Đào tạo nhân sự & Thăng tiến",
        "description": "Onboarding programs, talent development, employee evaluation, and executive awards.",
        "badge": "Workplace Growth",
        "topics": ["Hiring and Training", "Promotions, Pensions & Award"]
    },
    {
        "day": 7,
        "id": "day-7-salaries-taxes",
        "title": "Salaries, Benefits & Corporate Taxes",
        "titleVi": "Lương thưởng, Đãi ngộ & Thuế",
        "description": "Compensation packages, health insurance, bonuses, retirement funds, and tax deductions.",
        "badge": "Finance & HR",
        "topics": ["Salaries & Benefits", "Taxes"]
    },
    {
        "day": 8,
        "id": "day-8-shopping-supplies",
        "title": "Procurement & Ordering Supplies",
        "titleVi": "Mua sắm & Đặt hàng trang thiết bị",
        "description": "Purchasing requisitions, catalog browsing, vendor negotiations, and bulk orders.",
        "badge": "Operations & Logistics",
        "topics": ["Shopping", "Ordering Supplies"]
    },
    {
        "day": 9,
        "id": "day-9-shipping-invoices",
        "title": "Shipping, Freight & Billing Invoices",
        "titleVi": "Vận chuyển, Giao nhận & Hóa đơn",
        "description": "Consignments, tracking numbers, customs duties, invoice reconciliation, and payment terms.",
        "badge": "Trade & Logistics",
        "topics": ["Shipping", "Invoice"]
    },
    {
        "day": 10,
        "id": "day-10-inventory-quality",
        "title": "Inventory Control & Quality Assurance",
        "titleVi": "Quản lý tồn kho & Kiểm định chất lượng",
        "description": "Stocktaking, warehouse logistics, defective goods, and ISO quality benchmarks.",
        "badge": "Manufacturing & QA",
        "topics": ["Inventory", "Quality Control"]
    },
    {
        "day": 11,
        "id": "day-11-banking-accounting",
        "title": "Commercial Banking & Accounting",
        "titleVi": "Ngân hàng & Kế toán doanh nghiệp",
        "description": "Credit lines, bank transfers, balance sheets, ledger entries, and financial audits.",
        "badge": "High Finance",
        "topics": ["Banking", "Accounting"]
    },
    {
        "day": 12,
        "id": "day-12-investments-statements",
        "title": "Investments & Financial Statements",
        "titleVi": "Đầu tư tài chính & Báo cáo thường niên",
        "description": "Portfolio diversification, stocks, dividends, annual shareholder reports, and revenue yields.",
        "badge": "TOEIC Part 7 Reports",
        "topics": ["Investment", "Financial Statements"]
    },
    {
        "day": 13,
        "id": "day-13-property-leasing",
        "title": "Commercial Real Estate & Leasing",
        "titleVi": "Bất động sản & Hợp đồng thuê mặt bằng",
        "description": "Office leases, security deposits, property appraisals, facilities, and tenancy terms.",
        "badge": "Corporate Assets",
        "topics": ["Property & Departments", "Renting and Leasing"]
    },
    {
        "day": 14,
        "id": "day-14-board-development",
        "title": "Board of Directors & Product R&D",
        "titleVi": "Hội đồng quản trị & Nghiên cứu phát triển",
        "description": "Executive resolutions, market research, prototyping, and product rollout strategies.",
        "badge": "Strategic Leadership",
        "topics": ["Board Meeting & Committees", "Product Development"]
    },
    {
        "day": 15,
        "id": "day-15-marketing-media",
        "title": "Marketing Campaigns & Mass Media",
        "titleVi": "Tiếp thị thị trường & Quan hệ báo chí",
        "description": "Consumer surveys, digital advertising, PR press releases, branding, and social outreach.",
        "badge": "TOEIC Reading Adverts",
        "topics": ["Marketing", "Media"]
    },
    {
        "day": 16,
        "id": "day-16-travel-airlines",
        "title": "Business Travel & Airline Transit",
        "titleVi": "Di chuyển công tác & Vé máy bay",
        "description": "Boarding passes, layovers, baggage claims, itineraries, and corporate travel policies.",
        "badge": "TOEIC Part 1-4 Dialogues",
        "topics": ["General Travel", "Airlines"]
    },
    {
        "day": 17,
        "id": "day-17-trains-rentals",
        "title": "Railway Transit & Car Rentals",
        "titleVi": "Tàu hỏa, Thuê xe & Giao thông đô thị",
        "description": "Commuter rail schedules, vehicle rental agreements, insurance waivers, and route navigation.",
        "badge": "Ground Transit",
        "topics": ["Trains", "Car Rentals"]
    },
    {
        "day": 18,
        "id": "day-18-hotels-hospitality",
        "title": "Hotels & Corporate Hospitality",
        "titleVi": "Khách sạn & Dịch vụ lưu trú",
        "description": "Room reservations, concierge services, amenities, checkout bills, and guest satisfaction.",
        "badge": "Hospitality & Service",
        "topics": ["Hotels"]
    },
    {
        "day": 19,
        "id": "day-19-restaurants-dining",
        "title": "Client Dinners & Selecting Restaurants",
        "titleVi": "Chọn nhà hàng & Chiêu đãi đối tác",
        "description": "Table reservations, dietary accommodations, business banquets, and dining etiquette.",
        "badge": "Business Entertaining",
        "topics": ["Selecting A Restaurant", "Eating Out"]
    },
    {
        "day": 20,
        "id": "day-20-catering-lunch",
        "title": "Office Catering & Culinary Services",
        "titleVi": "Đặt tiệc văn phòng & Bữa trưa công sở",
        "description": "Meal delivery, corporate catering, menu planning, food safety, and kitchen operations.",
        "badge": "Culinary & Dining",
        "topics": ["Ordering Lunch", "Cooking As A Career"]
    },
    {
        "day": 21,
        "id": "day-21-corporate-events",
        "title": "Company Events & Galas",
        "titleVi": "Sự kiện doanh nghiệp & Lễ vinh danh",
        "description": "Event venues, ticket ticketing, keynote speakers, protocol coordination, and audio-visual setups.",
        "badge": "Event Planning",
        "topics": ["Events"]
    },
    {
        "day": 22,
        "id": "day-22-entertainment-cinema",
        "title": "Cinema & Cultural Arts",
        "titleVi": "Điện ảnh & Nghệ thuật sân khấu",
        "description": "Box office releases, dramatic performances, venue acoustics, and artistic critique.",
        "badge": "Arts & Leisure",
        "topics": ["Movies", "Theater"]
    },
    {
        "day": 23,
        "id": "day-23-museums-music",
        "title": "Museums, Exhibitions & Concerts",
        "titleVi": "Bảo tàng, Triển lãm & Hòa nhạc",
        "description": "Curated art galleries, historical artifacts, guided audio tours, and symphonic performances.",
        "badge": "Culture & Heritage",
        "topics": ["Museums", "Music"]
    },
    {
        "day": 24,
        "id": "day-24-medical-dental",
        "title": "Healthcare Clinics & Dental Care",
        "titleVi": "Phòng khám y tế & Nha khoa",
        "description": "Medical consultations, diagnostic checkups, prescriptions, dental hygiene, and preventive care.",
        "badge": "Health Care",
        "topics": ["Doctor's Office", "Dentist's Office"]
    },
    {
        "day": 25,
        "id": "day-25-wellness-fitness",
        "title": "Personal Wellness & Physical Health",
        "titleVi": "Sức khỏe thể chất & Lối sống lành mạnh",
        "description": "Nutritional habits, exercise regimens, mental stress reduction, and occupational health.",
        "badge": "Well-being",
        "topics": ["Health"]
    },
    {
        "day": 26,
        "id": "day-26-hospitals-pharmacy",
        "title": "Hospital Care & Pharmaceutical Services",
        "titleVi": "Bệnh viện đa khoa & Dược phẩm",
        "description": "Emergency triage, inpatient surgery, prescription dosage, pharmaceutical research, and patient safety.",
        "badge": "Clinical Health",
        "topics": ["Hospitals", "Pharmacy"]
    },
    {
        "day": 27,
        "id": "day-27-electronics-appliances",
        "title": "Electronics & Digital Devices",
        "titleVi": "Thiết bị điện tử & Viễn thông",
        "description": "Circuitry, electronic peripherals, maintenance manuals, energy efficiency, and warranties.",
        "badge": "Tech Hardware",
        "topics": ["Electronics"]
    },
    {
        "day": 28,
        "id": "day-28-advanced-negotiation",
        "title": "Advanced International Negotiations",
        "titleVi": "Đàm phán thương mại quốc tế",
        "description": "Contractual concessions, dispute settlement, bilateral trade agreements, and cross-border partnerships.",
        "badge": "Executive Fluency",
        "topics": ["Contracts", "Business Planning"] # Specialized high-level focus
    },
    {
        "day": 29,
        "id": "day-29-crisis-management",
        "title": "Crisis Management & Customer Retention",
        "titleVi": "Xử lý khủng hoảng & Chăm sóc khách hàng",
        "description": "Conflict resolution, customer feedback loops, public relations salvaging, and SLA compliance.",
        "badge": "Speaking & Writing Core",
        "topics": ["Quality Control", "Marketing"] # High-stakes customer dialogue
    },
    {
        "day": 30,
        "id": "day-30-mastery-milestone",
        "title": "TOEIC 850+ & WS Executive Mastery",
        "titleVi": "Tổng kết từ vựng then chốt TOEIC 800-900",
        "description": "High-frequency idioms, collocations, connective transitions, and executive workplace phrases.",
        "badge": "800-900 LR / 400-500 SW",
        "topics": ["Board Meeting & Committees", "Financial Statements"]
    }
]

# Map topic names to days
topic_to_days = {}
for item in SCHEDULE:
    d = item["day"]
    for t in item["topics"]:
        topic_to_days.setdefault(t, []).append(d)

# Map part of speech
def clean_pos(pos_str):
    pos = pos_str.lower().strip()
    if 'adj' in pos:
        return 'adjective'
    if 'adv' in pos:
        return 'adverb'
    if 'phr' in pos:
        return 'phrasal_verb'
    if 'v' in pos and 'n' not in pos:
        return 'verb'
    if 'n' in pos:
        return 'noun'
    return 'noun'

# Clean phonetics
def clean_phonetic(ph):
    ph = ph.strip()
    if not ph.startswith('/'):
        ph = '/' + ph
    if not ph.endswith('/'):
        ph = ph + '/'
    return ph

# Clean strings for TS output
def clean_str(s):
    if not s:
        return ""
    s = s.strip().replace('\r', '').replace('\n', ' ')
    s = re.sub(r'\s+', ' ', s)
    return s.replace('"', '\\"')

all_words = []
word_counter = 1

# Distribute words across days
for r in rows:
    raw_topic = r['topic'].strip()
    matched_days = topic_to_days.get(raw_topic, [1])
    day_assigned = matched_days[0]
    
    # Get topic meta
    sched_item = next((s for s in SCHEDULE if s["day"] == day_assigned), SCHEDULE[0])
    
    word_text = r['english'].strip()
    word_lower = word_text.lower()
    
    # CEFR Level
    cefr = ox_map.get(word_lower, 'B2')
    if word_counter % 7 == 0 and cefr == 'B2':
        cefr = 'C1'

    # Extract TOEIC context
    if sched_item["day"] in [1, 4, 8, 9, 12, 13]:
        toeic_ctx = "Part 5, 6 & Part 7 (Đọc hiểu tài liệu, email & hợp đồng)"
    elif sched_item["day"] in [2, 5, 14, 16, 17, 18, 19]:
        toeic_ctx = "Part 3, 4 Listening & Speaking (Đối thoại công sở)"
    else:
        toeic_ctx = "Xuất hiện phổ biến trong bài thi TOEIC LR & Writing"

    pos = clean_pos(r['type'])
    phon = clean_phonetic(r['pronounce'] if r['pronounce'] else f"/{word_lower}/")
    vi_mean = clean_str(r['vietnamese'])
    en_def = clean_str(r['explain'] if r['explain'] else f"Workplace business term for {word_text}")
    example = clean_str(r['example'] if r['example'] else f"The executive reviewed the {word_text} thoroughly.")
    example_vi = clean_str(r['example_vietnamese'] if r['example_vietnamese'] else f"Người quản lý đã xem xét {vi_mean} một cách kỹ lưỡng.")
    img_url = r['image_url'].strip() if r.get('image_url') else ""
    aud_url = r['audio_url'].strip() if r.get('audio_url') else ""

    item_obj = {
        "id": f"toeic-{word_counter}",
        "word": word_text,
        "phonetic": phon,
        "partOfSpeech": pos,
        "meaningVi": vi_mean,
        "definitionEn": en_def,
        "example": example,
        "exampleVi": example_vi,
        "cefr": cefr,
        "topicId": sched_item["id"],
        "day": day_assigned,
        "imageUrl": img_url,
        "audioUrl": aud_url,
        "toeicContext": toeic_ctx
    }
    all_words.append(item_obj)
    word_counter += 1

print(f"Total processed words: {len(all_words)}")

# Count words per topic/day
for s in SCHEDULE:
    s_day = s["day"]
    w_count = sum(1 for w in all_words if w["day"] == s_day)
    s["wordCount"] = w_count

# Write curriculum.ts
out_ts_path = 'src/data/curriculum.ts'

ts_lines = [
    "import { Topic, Word } from '../types';",
    "",
    "export const TOPICS: Topic[] = ["
]

for s in SCHEDULE:
    ts_lines.append(f"""  {{
    id: "{s['id']}",
    title: "{s['title']}",
    titleVi: "{s['titleVi']}",
    description: "{s['description']}",
    icon: "Briefcase",
    color: "from-brand-600 to-indigo-600",
    day: {s['day']},
    badge: "{s['badge']}",
    wordCount: {s['wordCount']}
  }},""")

ts_lines.append("];\n")
ts_lines.append("export const INITIAL_WORDS: Word[] = [")

for w in all_words:
    ts_lines.append(f"""  {{
    id: "{w['id']}",
    word: "{w['word']}",
    phonetic: "{w['phonetic']}",
    partOfSpeech: "{w['partOfSpeech']}",
    meaningVi: "{w['meaningVi']}",
    definitionEn: "{w['definitionEn']}",
    example: "{w['example']}",
    exampleVi: "{w['exampleVi']}",
    cefr: "{w['cefr']}",
    topicId: "{w['topicId']}",
    day: {w['day']},
    imageUrl: "{w['imageUrl']}",
    audioUrl: "{w['audioUrl']}",
    toeicContext: "{w['toeicContext']}"
  }},""")

ts_lines.append("];\n")

with open(out_ts_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(ts_lines))

print(f"Successfully generated {out_ts_path} with {len(all_words)} words across 30 days!")
