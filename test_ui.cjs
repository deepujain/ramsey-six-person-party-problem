// Browser checks. Requires the optional development dependency `playwright`.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {}) });
  try {
    for (const [width, height] of [[320,568], [360,640], [736,600], [1440,800]]) {
      const context = await browser.newContext({ viewport: { width, height } });
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
      assert(await frame.locator('#rp-back').isDisabled());
      assert(await frame.locator('.picture').isHidden());
      assert(await frame.locator('.legend').isHidden());
      const opening = await page.evaluate(() => ({height: innerHeight, scrollHeight: document.documentElement.scrollHeight}));
      assert(opening.scrollHeight <= opening.height + 1);
      await frame.locator('#rp-next').click();
      assert(await frame.locator('.intro').isHidden());
      const circles = [3, 3, 3, 5, 6, 6, 6, 6, 6];
      for (let step = 0; step < 9; step++) {
        assert.equal(await frame.locator('#rp-step').innerText(), `Step ${step + 1} of 9`);
        assert.equal(await frame.locator('#rp-graph circle').count(), circles[step]);
        assert.notEqual(await frame.locator('#rp-heading').innerText(), '');
        assert.notEqual(await frame.locator('#rp-fact').innerText(), '');
        const overflow = await root.evaluate(el => el.scrollWidth > el.clientWidth + 1);
        assert.equal(overflow, false, `Horizontal overflow at ${width}px, step ${step}`);
        await page.waitForTimeout(100); // Let the standalone host resize its iframe.
        const layout = await root.evaluate(el => ({ bottom: el.getBoundingClientRect().bottom, height: window.innerHeight, scrollHeight: document.documentElement.scrollHeight }));
        assert(layout.bottom <= layout.height + 1, `Content below viewport at ${width}x${height}, step ${step}: ${JSON.stringify(layout)}`);
        assert(layout.scrollHeight <= layout.height + 1, `Vertical scrolling at ${width}x${height}, step ${step}: ${JSON.stringify(layout)}`);
        const outer = await page.evaluate(() => ({height: window.innerHeight, scrollHeight: document.documentElement.scrollHeight}));
        assert(outer.scrollHeight <= outer.height + 1, `Page scrolling at ${width}x${height}, step ${step}: ${JSON.stringify(outer)}`);
        if ([0, 1, 4, 6, 7, 8].includes(step)) {
          // Every highlighted group must be a nondegenerate triangle.
          const doubleArea = await frame.locator('#rp-graph polygon').evaluate(el => {
            const p = el.points;
            return Math.abs((p[1].x-p[0].x)*(p[2].y-p[0].y) - (p[2].x-p[0].x)*(p[1].y-p[0].y));
          });
          assert(doubleArea > 100);
        }
        if (step === 0) {
          const bounds = await frame.locator('#rp-graph').evaluate(el => {
            const r=el.getBoundingClientRect();
            const p=el.querySelector('polygon').getBBox();
            return {width:r.width,height:r.height,triangleWidth:p.width,triangleHeight:p.height};
          });
          assert(bounds.triangleWidth >= bounds.width * .65, `Diagram does not use available width: ${JSON.stringify(bounds)}`);
          if(width>=700) assert(bounds.height>=300, `Desktop diagram too small: ${JSON.stringify(bounds)}`);
          assert(await frame.locator('#rp-back').isEnabled());
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
      assert(await frame.locator('.intro').isVisible());
      assert(await frame.locator('.picture').isHidden());
      await page.reload();
      await frame.locator('#ramsey-party').waitFor();
      assert(await frame.locator('.intro').isVisible());
      assert.deepEqual(errors, []);
      console.log(`PASS: all nine steps, diagrams, navigation, and no scrolling at ${width}x${height}`);
      if (process.env.SCREENSHOT_DIR && width === 736) await root.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'ramsey-intro-guide.png') });
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
