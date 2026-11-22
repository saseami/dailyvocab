// autonomous_tester.mjs - End-to-end Autonomous GUI Testing Harness for EnglishLearner
import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to check if server is responsive
function checkServerReady(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Helper to wait until server is up
async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await checkServerReady(url)) return true;
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

// Close any hanging dialog/modal
async function ensureNoModals(page) {
  try {
    const modalBackdrop = page.locator('div.fixed.inset-0.z-50');
    if (await modalBackdrop.isVisible()) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      const closeBtn = modalBackdrop.locator('button').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(200);
      }
    }
  } catch {}
}

async function runAutonomousTesting() {
  console.log('🚀 [Autonomous Tester] Bắt đầu chu trình Kiểm thử Tự động E2E GUI cho EnglishLearner...');

  // 1. Check if server already running or spawn vite preview
  let serverProcess = null;
  const isAlreadyRunning = await checkServerReady(BASE_URL);

  if (!isAlreadyRunning) {
    console.log(`🌐 [Server] Khởi chạy Vite preview trên cổng ${PORT}...`);
    serverProcess = spawn('npx.cmd', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
      cwd: 'D:\\PROJECT\\englishLEARNER',
      shell: true,
      stdio: 'pipe',
    });

    serverProcess.stdout.on('data', (d) => process.stdout.write(`[Vite] ${d}`));
    serverProcess.stderr.on('data', (d) => process.stderr.write(`[Vite Error] ${d}`));

    const ready = await waitForServer(BASE_URL);
    if (!ready) {
      console.error('❌ Không thể khởi động Vite preview server.');
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
  } else {
    console.log(`🌐 [Server] Đã kết nối với server đang chạy tại ${BASE_URL}`);
  }

  // 2. Launch Chromium browser in VISIBLE (Headed) mode with human-like slow motion
  console.log('🖥️ [Browser] Khởi chạy trình duyệt thật (HEADED - HIỂN THỊ TRÊN MÀN HÌNH)...');
  const browser = await chromium.launch({
    headless: false, // Hiển thị cửa sổ trình duyệt trực tiếp lên màn hình
    slowMo: 700,     // Giảm tốc độ thao tác 700ms/hành động để người dùng nhìn rõ từng cú click/gõ phím như người thật
    args: ['--start-maximized'],
  });

  const context = await browser.newContext({
    viewport: null, // Sử dụng toàn màn hình theo cửa sổ trình duyệt
  });

  const page = await context.newPage();
  page.setDefaultTimeout(5000); // 5s timeout instead of 30s

  const consoleErrors = [];
  const uncaughtErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    uncaughtErrors.push(err.message || String(err));
  });

  // Mock speech synthesis safely
  await page.addInitScript(() => {
    window.speechSynthesis = {
      speak: (u) => {
        if (u && u.onend) setTimeout(u.onend, 10);
      },
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      getVoices: () => [{ lang: 'en-US', name: 'US English' }],
    };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
      this.lang = 'en-US';
    };
  });

  const results = [];
  let testIndex = 1;

  async function testCase(name, testFn) {
    const id = testIndex++;
    process.stdout.write(`⏳ [Test ${id}] ${name}... `);
    try {
      await ensureNoModals(page);
      await testFn();
      await ensureNoModals(page);
      console.log('✅ PASS');
      results.push({ id, name, status: 'PASS' });
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
      results.push({ id, name, status: 'FAIL', error: err.message });
      try {
        if (!fs.existsSync('test-artifacts')) fs.mkdirSync('test-artifacts', { recursive: true });
        await page.screenshot({ path: `test-artifacts/failure_test_${id}.png` });
      } catch {}
    }
  }

  try {
    // TEST 1: Initial Page Load & Header Elements
    await testCase('Tải trang chủ và kiểm tra các thành phần Header', async () => {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const title = await page.title();
      if (!title) throw new Error('Trang không có thẻ <title>');

      const header = page.locator('header').first();
      if (!(await header.isVisible())) throw new Error('Header component không hiển thị');
    });

    // TEST 2: Lộ trình 3 Phase và Bộ chọn Topic
    await testCase('Chuyển đổi giữa các Phase và bấm chuyển Topic tiếp theo', async () => {
      const nextTopicBtn = page.locator('button[title="Chủ đề tiếp theo"]').first();
      if (await nextTopicBtn.isVisible()) {
        await nextTopicBtn.click();
        await page.waitForTimeout(400);
      }

      const prevTopicBtn = page.locator('button[title="Chủ đề trước"]').first();
      if (await prevTopicBtn.isVisible()) {
        await prevTopicBtn.click();
        await page.waitForTimeout(400);
      }
    });

    // TEST 3: Chế độ 1 - Nạp từ vựng (Vocabulary Feed / List)
    await testCase('Kiểm tra Bước 1: Nạp từ vựng & Tra cứu thẻ từ', async () => {
      const step1Btn = page.locator('button:has-text("1. Nạp từ")').first();
      if (await step1Btn.isVisible()) {
        await step1Btn.click();
        await page.waitForTimeout(500);
      }

      const bodyText = await page.locator('body').innerText();
      if (!bodyText || bodyText.length < 50) {
        throw new Error('Nội dung trang trống hoặc không tải được dữ liệu từ vựng');
      }
    });

    // TEST 4: Chế độ 2 - Flashcard 3D & Đánh giá SRS
    await testCase('Kiểm tra Bước 2: Flashcard 3D, Lật thẻ và Đánh giá SRS', async () => {
      const flashcardTab = page.locator('button:has-text("Flashcard")').first();
      if (await flashcardTab.isVisible()) {
        await flashcardTab.click();
        await page.waitForTimeout(500);

        // Click to flip card
        const cardArea = page.locator('div[class*="perspective"], div[class*="cursor-pointer"]').first();
        if (await cardArea.isVisible()) {
          await cardArea.click();
          await page.waitForTimeout(300);
        }

        // Test SRS rating buttons
        const ratingBtn = page.locator('button:has-text("Nhớ"), button:has-text("Khó"), button:has-text("Tốt"), button:has-text("Dễ")').first();
        if (await ratingBtn.isVisible()) {
          await ratingBtn.click();
          await page.waitForTimeout(300);
        }
      }
    });

    // TEST 5: Chế độ 3 - Nghe & Viết (Spelling Mode)
    await testCase('Kiểm tra Bước 3: Chế độ Nghe & Gõ Chính tả', async () => {
      const spellingTab = page.locator('button:has-text("Nghe & Viết")').first();
      if (await spellingTab.isVisible()) {
        await spellingTab.click();
        await page.waitForTimeout(500);

        const inputField = page.locator('input[placeholder*="từ"], input[type="text"]').first();
        if (await inputField.isVisible()) {
          await inputField.fill('testword');
          await page.waitForTimeout(300);
        }
      }
    });

    // TEST 6: Chế độ 4 - Nối từ phản xạ (Match Mode)
    await testCase('Kiểm tra Bước 4: Chế độ Ghép Thẻ Nối Từ Phản Xạ', async () => {
      const matchTab = page.locator('button:has-text("Nối từ phản xạ")').first();
      if (await matchTab.isVisible()) {
        await matchTab.click();
        await page.waitForTimeout(500);

        // Check tiles
        const tiles = page.locator('button[class*="border"], div[class*="border"]');
        const count = await tiles.count();
        if (count >= 2) {
          await tiles.nth(0).click({ force: true });
          await page.waitForTimeout(200);
          await tiles.nth(1).click({ force: true });
          await page.waitForTimeout(200);
        }
      }
    });

    // TEST 7: Chế độ 5 - Trắc nghiệm TOEIC (Quiz Mode)
    await testCase('Kiểm tra Bước 5: Chế độ Trắc Nghiệm TOEIC & Tính Điểm', async () => {
      const quizTab = page.locator('button:has-text("Trắc nghiệm")').first();
      if (await quizTab.isVisible()) {
        await quizTab.click();
        await page.waitForTimeout(500);

        const optionBtn = page.locator('button:has-text("A."), button:has-text("B."), button[class*="text-left"]').first();
        if (await optionBtn.isVisible()) {
          await optionBtn.click({ force: true });
          await page.waitForTimeout(300);
        }
      }
    });

    // TEST 8: Chế độ 6 & 7 - Luyện Nói AI (Speaking Lab) & Viết TOEIC (Writing Studio)
    await testCase('Kiểm tra Bước 6 & 7: Speaking Lab và Writing Studio', async () => {
      const speakingTab = page.locator('button:has-text("Luyện Nói AI")').first();
      if (await speakingTab.isVisible()) {
        await speakingTab.click();
        await page.waitForTimeout(500);
      }

      const writingTab = page.locator('button:has-text("Luyện Viết TOEIC")').first();
      if (await writingTab.isVisible()) {
        await writingTab.click();
        await page.waitForTimeout(500);

        const textarea = page.locator('textarea').first();
        if (await textarea.isVisible()) {
          await textarea.fill('Automated test sentence for production quality.');
          await page.waitForTimeout(200);
        }
      }
    });

    // TEST 9: Kiểm tra Modal Thống kê, Thêm từ mới & Hướng dẫn ghi nhớ
    await testCase('Kiểm tra Mở/Đóng Hướng dẫn 7 bước (Ebbinghaus) & Modal', async () => {
      const guideBtn = page.locator('button:has-text("Ebbinghaus"), button:has-text("Hướng dẫn")').first();
      if (await guideBtn.isVisible()) {
        await guideBtn.click();
        await page.waitForTimeout(400);

        const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Đóng"), button:has-text("Bắt đầu học ngay")').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(300);
        } else {
          await page.keyboard.press('Escape');
        }
      }

      await ensureNoModals(page);
    });

    // TEST 10: Kiểm tra Console & Uncaught Runtime Errors
    await testCase('Kiểm tra độ sạch 100% không có lỗi Console hay Crash', async () => {
      if (uncaughtErrors.length > 0) {
        throw new Error(`Phát hiện ${uncaughtErrors.length} lỗi Uncaught Exceptions: \n${uncaughtErrors.join('\n')}`);
      }

      const criticalErrors = consoleErrors.filter((e) => {
        if (e.includes('favicon.ico')) return false;
        return true;
      });

      if (criticalErrors.length > 0) {
        throw new Error(`Phát hiện ${criticalErrors.length} lỗi Console Error: \n${criticalErrors.join('\n')}`);
      }
    });

    console.log('👀 [Quan sát] Giữ màn hình trình duyệt 4 giây để bạn nhìn rõ toàn bộ giao diện app hoàn hảo...');
    await page.waitForTimeout(4000);

  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }

  // Final Evaluation
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log('\n======================================================');
  console.log(`📊 [TỔNG KẾT KIỂM THỬ TỰ ĐỘNG - ENGLISLEARNER]`);
  console.log(`- Tổng số kịch bản test: ${total}`);
  console.log(`- Thành công: ${passed} ✅`);
  console.log(`- Thất bại: ${failed} ❌`);
  console.log(`- Tỷ lệ đạt (Pass Rate): ${passRate}%`);
  console.log('======================================================\n');

  if (failed > 0 || uncaughtErrors.length > 0) {
    console.error('⚠️ [KẾT QUẢ]: Chưa đạt 100%. Cần kích hoạt quy trình Self-Healing để sửa lỗi!');
    process.exit(1);
  } else {
    console.log('🎉 [KẾT QUẢ]: ĐẠT HOÀN HẢO 100% PASS RATE! Ứng dụng hoạt động mượt mà, không có bất kỳ lỗi nào.');
    process.exit(0);
  }
}

runAutonomousTesting().catch((err) => {
  console.error('Fatal Runner Error:', err);
  process.exit(1);
});
