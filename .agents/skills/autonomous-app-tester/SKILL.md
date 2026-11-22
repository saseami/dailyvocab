---
name: autonomous-app-tester
description: Tự động hóa kiểm thử điều khiển ứng dụng (Web & Desktop), phát hiện lỗi UI/logic và tự sửa lỗi theo vòng lặp (Self-Healing Loop) cho đến khi đạt 100% Pass Rate.
---

# Autonomous App Tester & Self-Healing Loop Skill

Skill này cung cấp quy trình, mã mẫu và chiến lược để AI Agent có thể **tự điều khiển ứng dụng như người dùng thật**, tự động ghi nhận lỗi (console, UI, state, crash) và **lặp lại chu trình Sửa Code -> Chạy lại Test** cho đến khi tất cả các bài kiểm thử đạt **100% Pass Rate**.

## 1. Triết lý hoạt động (The Self-Healing Loop)

```
        ┌────────────────────────────────────────────────┐
        │  1. Khởi động App (Local Dev Server / EXE / UI)│
        └───────────────────────┬────────────────────────┘
                                │
                                ▼
        ┌────────────────────────────────────────────────┐
        │  2. Chạy kịch bản tương tác (Robot / Tester)   │
        │     - Click nút, gõ phím, chuyển tab, điền form │
        │     - Lắng nghe Console Errors & Uncaught Panic│
        └───────────────────────┬────────────────────────┘
                                │
                                ▼
        ┌────────────────────────────────────────────────┐
        │  3. Đánh giá kết quả (Assertions & Metrics)    │
        │     - Tỷ lệ Pass: (Số test pass / Tổng) * 100% │
        └───────────────────────┬────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
            [Pass Rate < 100%]       [Pass Rate = 100%]
                   │                         │
                   ▼                         ▼
   ┌───────────────────────────────┐     ┌───────────────┐
   │ 4. Chẩn đoán & Sửa Code       │     │ Hoàn thành    │
   │    - Đọc stacktrace / console │     │ Báo cáo kết   │
   │    - Dùng edit_file sửa file  │     │ quả thành công│
   │    - Quay lại Bước 1          │     └───────────────┘
   └───────────────────────────────┘
```

---

## 2. Các phương thức điều khiển ứng dụng

### A. Dành cho Ứng dụng Web / SPA (React, Vite, Next.js, Extension)
Sử dụng **Playwright** tích hợp sẵn:
- Chạy headless hoặc headed với browser Chromium / WebKit / Firefox.
- Bắt mọi lỗi runtime qua:
  ```javascript
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => unhandledExceptions.push(err.message));
  ```
- Thao tác tự nhiên:
  ```javascript
  await page.click('button:has-text("Bắt đầu")');
  await page.fill('input[placeholder="Nhập từ vựng"]', 'hello');
  await page.screenshot({ path: 'test-artifacts/screenshot.png' });
  ```

### B. Dành cho Ứng dụng Desktop Native (WPF, WinForms, Electron, EXE, Game)
Sử dụng **Python + PyAutoGUI / PyWinAuto / PyGetWindow**:
- Tìm kiếm cửa sổ ứng dụng theo tiêu đề (`pygetwindow.getWindowsWithTitle`).
- Mô phỏng chuột: `pyautogui.click(x, y)`, `pyautogui.moveTo(x, y)`.
- Mô phỏng phím: `pyautogui.typewrite('text')`, `pyautogui.hotkey('ctrl', 's')`.
- Bắt hình ảnh giao diện: `pyautogui.screenshot('screen.png')` kết hợp so sánh ảnh mẫu hoặc đọc OCR.

---

## 3. Quy chuẩn kiểm thử "100% Pass" cho EnglishLearner

Khi kiểm thử dự án **EnglishLearner**, bộ test tự động phải duyệt qua toàn bộ các mode học tập và tính năng:
1. **Kiểm tra TypeScript & Build:** `npm run build` không có lỗi Type hay Build.
2. **Flashcard Mode:** Lật thẻ 3D, next/prev từ vựng, nút phát âm audio Web Speech API không gây crash.
3. **Quiz Mode:** Chọn đáp án đúng/sai, hiển thị thanh tiến độ, tính điểm chính xác.
4. **Spelling Mode:** Nghe audio, nhập đáp án, bấm kiểm tra, hiện gợi ý chữ cái.
5. **Match Mode:** Ghép cặp từ vựng - nghĩa tiếng Việt, xử lý hiệu ứng biến mất khi đúng.
6. **Hub Kỹ năng (Listening, Reading, Speaking, Writing):** Tải bài đọc, bộ lọc chủ đề, công cụ tra cứu từ vựng nổi (TextSelectionLearner).
7. **Khả năng lưu trữ (Persistence):** Lưu trạng thái học vào LocalStorage và phục hồi nguyên vẹn khi tải lại trang.
8. **Không có bất kỳ Console Error nào:** Bắt buộc 0 unhandled errors trong suốt phiên tương tác.

---

## 4. Lệnh chạy nhanh chu trình Self-Healing
Mỗi khi phát hiện bài test thất bại:
1. Trích xuất chính xác file và dòng code gây lỗi từ console logs hoặc test runner.
2. Sử dụng công cụ `edit_file` để sửa lỗi.
3. Chạy lại bộ test runner ngay lập tức.
4. Lặp lại cho đến khi bộ test thông báo `ALL TESTS PASSED (100%)`.
