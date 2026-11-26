const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_CHANNEL?{channel:process.env.CHROME_CHANNEL}:{})});
 try{
  for(const[width,height]of[[320,568],[360,640],[736,600],[1440,800],[844,390]]){
   const page=await browser.newPage({viewport:{width,height}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
   await page.locator('#six circle').last().waitFor();
   assert.equal(await page.locator('button').count(),0);
   assert.equal(await page.locator('select').count(),0);
   assert.equal(await page.locator('#five circle').count(),5);
   assert.equal(await page.locator('#six circle').count(),6);
   assert.equal(await page.locator('#five line').count(),10);
   assert.equal(await page.locator('#six line').count(),15);
   assert.equal(await page.locator('#six line[data-highlighted="true"]').count(),3);
   for(const id of ['five','six']){
    const monos=await page.locator(`#${id} svg`).evaluate(svg=>{
     const edges=[...svg.querySelectorAll('line')],n=svg.querySelectorAll('circle').length;
     const known=(a,b)=>edges.find(e=>e.dataset.pair===`${a}-${b}`).dataset.known;
     let total=0;for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)for(let c=b+1;c<n;c++)if(known(a,b)===known(a,c)&&known(a,b)===known(b,c))total++;
     return total;
    });
    assert.equal(monos,id==='five'?0:5);
   }
   const size=await page.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}));
   assert(size.w<=width+1&&size.h<=height+1,`Overflow at ${width}x${height}: ${JSON.stringify(size)}`);
   assert.deepEqual(errors,[]);
   if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`ramsey-single-page-${width}.png`)});
   console.log(`PASS ${width}x${height}: both diagrams, correct relationships, no controls, no scrolling.`);
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
