// Optional development check: Playwright + Chromium (or CHROME_CHANNEL=chrome).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({headless:true,...(process.env.CHROME_CHANNEL?{channel:process.env.CHROME_CHANNEL}:{})});
  try {
    for (const [width,height] of [[320,568],[360,640],[736,600],[1440,900],[844,390]]) {
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
      const page=await context.newPage();const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
      const state=()=>page.evaluate(()=>window.partyGarden.snapshot());
      const next=()=>page.locator('#next').click();
      const pick=async ids=>{for(const i of ids)await page.locator(`.guest[data-person="${i}"]`).click()};
      const fits=async label=>{
        const geometry=await page.evaluate(()=>({actions:[...document.querySelectorAll('.actions button')].filter(e=>!e.hidden).map(e=>{const r=e.getBoundingClientRect();return {right:r.right,bottom:r.bottom,left:r.left}}),height:innerHeight,width:innerWidth,scrollHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll('.guest')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}})}));
        assert(geometry.scrollHeight<=height+1,`${label}: vertical scrolling at ${width}x${height}: ${JSON.stringify(geometry)}`);
        assert(geometry.scrollWidth<=width+1,`${label}: horizontal scrolling`);
        geometry.actions.forEach(r=>assert(r.left>=0&&r.right<=width&&r.bottom<=height,`${label}: action clipped: ${JSON.stringify(r)}`));
        geometry.buttons.forEach(r=>{assert(r.x>=-1&&r.right<=width+1,`${label}: guest outside width`);assert(r.y>=0&&r.bottom<=height,`${label}: guest outside height`)});
      };
      assert.equal((await state()).phase,'invitation');
      assert.equal((await state()).matchingTrios.length,0);
      await fits('invitation');await next();
      assert.equal((await state()).phase,'five');
      await pick([0,1,2]);assert.equal((await state()).found,false);
      assert.match(await page.locator('#story-title').innerText(),/mixed/);
      await fits('five guests');await next();
      assert.equal((await state()).count,6);
      await pick([0,2,5]);assert.equal((await state()).found,true);
      assert.match(await page.locator('#story-title').innerText(),/strangers/);
      await fits('six guests');
      if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`ramsey-garden-${width}.png`)});
      if(process.env.SCREENSHOT_DIR&&width===1440)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'ramsey-garden.png')});
      if(process.env.SCREENSHOT_DIR&&width===360)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'ramsey-garden-phone.png')});
      await next();assert.equal((await state()).phase,'majority');await fits('majority');
      assert.equal(await page.locator('.guest-name').first().innerText(),'You');
      await next();let s=await state();assert.equal(s.phase,'pair');assert(s.found);assert.deepEqual(s.selected,[0,1,2]);
      assert.deepEqual([s.colors[0],s.colors[1],s.colors[5]],[1,1,1]);
      await fits('friend proof');await next();s=await state();assert.equal(s.phase,'strangers');assert(s.found);assert.deepEqual(s.selected,[1,2,3]);await fits('stranger proof');
      if(process.env.SCREENSHOT_DIR&&width===1440)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'ramsey-garden-proof.png')});
      await next();assert.equal((await state()).phase,'ending');await fits('ending');
      await next();s=await state();assert(s.randomMode);assert(s.matchingTrios.length>=2);await pick(s.matchingTrios[0]);assert((await state()).found);await fits('new party');
      await page.locator('#rules-open').click();assert(await page.locator('#rules').isVisible());assert.match(await page.locator('#rules').innerText(),/Imagine you invite people/);await page.keyboard.press('Escape');assert(!await page.locator('#rules').isVisible());
      await page.locator('#home').click();assert.equal((await state()).phase,'invitation');
      assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');
      assert.deepEqual(errors,[]);
      console.log(`PASS ${width}x${height}: discovery, both proof cases, random party, rules, and no scrolling.`);
      await context.close();
    }
    const animated=await browser.newPage({viewport:{width:1280,height:800}});
    const runtimeErrors=[];animated.on('pageerror',e=>runtimeErrors.push(e.message));
    await animated.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
    await animated.locator('#next').click();
    await animated.locator('.guest[data-person="0"]').focus();await animated.keyboard.press('Enter');
    assert.deepEqual(await animated.evaluate(()=>window.partyGarden.snapshot().selected),[0]);
    await animated.locator('#sound').click();assert.equal(await animated.locator('#sound').getAttribute('aria-pressed'),'true');
    await animated.waitForTimeout(400);
    await animated.locator('#sound').click();assert.equal(await animated.locator('#sound').getAttribute('aria-pressed'),'false');
    assert.deepEqual(runtimeErrors,[]);await animated.close();
    console.log('PASS: normal animation, keyboard guest selection, and opt-in audio.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
