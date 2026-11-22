# EnglishLearner Workspace Guidelines

Welcome to the **EnglishLearner** workspace — a modern, interactive web application for learning English vocabulary organized by day and based on thematic topics ("Học từ vựng tiếng Anh theo ngày dựa trên chủ đề").

## Workspace Overview
- **Core Application**: React + TypeScript + Vite + Tailwind CSS + Lucide Icons + Canvas Confetti.
- **Design System Reference**: `astryx-repo` (Meta's open-source Astryx design system) cloned locally at `./astryx-repo`.
  - CLI: `npx @astryxdesign/cli`
  - Skills: `.agents/skills/astryx/SKILL.md`
  - Templates & components reference available in `astryx-repo/packages/core` and `astryx-repo/docs`.
- **Specialized Skills & Rules**:
  - `.agents/skills/autonomous-app-tester/SKILL.md`: Vòng lặp kiểm thử GUI tự động (Playwright E2E Robot), bắt lỗi console và tự sửa lỗi đến khi 100% Pass Rate.
  - `.agents/skills/astryx/SKILL.md`: Astryx design system workflows and scaffolding.
  - `.agents/skills/web-dev/SKILL.md`: Modern web development standards.
  - `.agents/rules/coding-standards.md`: Architecture, accessibility, and theming rules.

## Automated Testing & Self-Healing Loop
- Chạy kiểm thử tự động toàn diện: `npm run test:loop` (Build + E2E GUI Robot Test 10 suites).
- Kiểm tra GUI nhanh: `npm run test:gui`.
- Tiêu chuẩn xuất xưởng: Đạt **100.0% Pass Rate** và **0 Console Errors**.

## App Architecture & Features
1. **Curriculum Engine**:
   - 30-day curriculum grouped into thematic modules (Daily Life, Travel, Career & Tech, Academic IELTS/TOEFL, Social & Values, Advanced Idioms/Collocations).
   - Rich word entries: Word, IPA pronunciation, part of speech, Vietnamese translation, CEFR level, example sentences, collocations, mnemonics.
2. **Interactive Learning Modes**:
   - **Flashcard**: 3D flip card with Web Speech API audio pronunciation, shortcuts (`Space`, `1-4`), and spaced repetition grading.
   - **Quiz**: Multiple-choice testing with instant feedback and score tracking.
   - **Spelling / Dictation**: Audio-driven spelling practice with hint reveals.
   - **Word Match**: Fast-paced card matching game (English word <-> Vietnamese definition).
3. **Gamification & Persistence**:
   - Daily streak tracking with fire badge.
   - SRS (Spaced Repetition System) interval queue.
   - Bookmarked / Saved words collection.
   - Custom vocabulary addition by users.
   - Offline-first storage using `localStorage` with JSON export/import.
