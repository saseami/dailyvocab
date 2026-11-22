# Coding & Design Standards

## UI / UX Design Standards
- **Design System Alignment**: Follow clean, modern, accessible design inspired by Astryx and modern design tokens (neutral palette, crisp borders, subtle shadows, rounded-2xl cards, fluid typography).
- **Theming**: Support system / dark / light mode seamlessly. All colors must have appropriate contrast ratios meeting WCAG AAA / AA standards.
- **Audio & Pronunciation**: Use the browser's native `window.speechSynthesis` with `en-US` and `en-GB` fallback voices to pronounce vocabulary words naturally, with replay and speed controls.
- **Interactive Feedback**: Provide instant visual and acoustic cues for correct/incorrect answers, streak milestones, and card mastery.

## Code Quality Standards
- **TypeScript**: Strict typing for data models (`Topic`, `DayPlan`, `WordItem`, `QuizQuestion`, `UserProgress`).
- **Performance**: Zero external API dependencies required for core functionality; offline-first architecture with instant initial load.
- **Maintainability**: Separate business logic (spaced repetition, streak calculation, quiz generator) from UI presentation components.
