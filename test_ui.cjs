// Browser checks. Requires the optional development dependency `playwright`.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {}) });
  try {
    for (const width of [360, 736, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1100 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
      const frame = page.frameLocator('#codex-visualization');
      const root = frame.locator('#ramsey-party');
      await root.waitFor();
      assert.match(await frame.locator('.intro').innerText(), /Imagine you invite people to a party/);
      assert.match(await frame.locator('.intro').innerText(), /How many people must attend/);
      assert.equal(await root.locator('select').count(), 0);
      assert.equal(await root.locator('button').count(), 2);
      const circles = [3, 3, 3, 5, 6, 6, 6, 6, 6];
      for (let step = 0; step < 9; step++) {
        assert.equal(await frame.locator('#rp-step').innerText(), `Step ${step + 1} of 9`);
        assert.equal(await frame.locator('#rp-graph circle').count(), circles[step]);
        assert.notEqual(await frame.locator('#rp-heading').innerText(), '');
        assert.notEqual(await frame.locator('#rp-fact').innerText(), '');
        const overflow = await root.evaluate(el => el.scrollWidth > el.clientWidth + 1);
        assert.equal(overflow, false, `Horizontal overflow at ${width}px, step ${step}`);
        if ([0, 1, 4, 6, 7, 8].includes(step)) {
          // Every highlighted group must be a nondegenerate triangle.
          const doubleArea = await frame.locator('#rp-graph polygon').evaluate(el => {
            const p = el.points;
            return Math.abs((p[1].x-p[0].x)*(p[2].y-p[0].y) - (p[2].x-p[0].x)*(p[1].y-p[0].y));
          });
          assert(doubleArea > 100);
        }
        if (step === 0) {
          assert(await frame.locator('#rp-back').isDisabled());
          assert.equal(await frame.locator('#rp-graph line[stroke-dasharray="none"]').count(), 3);
        }
        if (step === 1) assert.equal(await frame.locator('#rp-graph line[stroke-dasharray="7 5"]').count(), 3);
        if (step === 2) assert.equal(await frame.locator('#rp-graph line[stroke-dasharray="7 5"]').count(), 1);
        if (step === 3) assert.equal(await frame.locator('#rp-graph line').count(), 10);
        if (process.env.SCREENSHOT_DIR && step === 7 && width === 736) await root.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'ramsey-proof-guide.png') });
        if (step < 8) await frame.locator('#rp-next').click();
      }
      if (process.env.SCREENSHOT_DIR && width === 736) await root.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'ramsey-guide.png') });
      await frame.locator('#rp-back').click();
      assert.equal(await frame.locator('#rp-step').innerText(), 'Step 8 of 9');
      await frame.locator('#rp-next').click();
      await frame.locator('#rp-next').click();
      assert.equal(await frame.locator('#rp-step').innerText(), 'Step 1 of 9');
      await page.reload();
      await frame.locator('#ramsey-party').waitFor();
      assert.equal(await frame.locator('#rp-step').innerText(), 'Step 1 of 9');
      assert.deepEqual(errors, []);
      console.log(`PASS: all nine steps, diagrams, navigation, and no overflow at ${width}px`);
      if (process.env.SCREENSHOT_DIR && width === 736) await root.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'ramsey-intro-guide.png') });
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
