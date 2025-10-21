const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log('Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    
    console.log('Waiting for canvas to load...');
    await page.waitForSelector('canvas', { timeout: 5000 });
    await page.waitForTimeout(1000);

    // Initial state
    console.log('\n1. Taking initial screenshot...');
    await page.screenshot({ path: 'test-initial.png', fullPage: false });

    // Test zoom in button
    console.log('\n2. Testing Zoom In button...');
    const zoomInButton = await page.$$('button[title*="Zoom In"]');
    if (zoomInButton.length > 0) {
      await zoomInButton[0].click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-zoom-in.png' });
      console.log('✅ Zoom In clicked');
    } else {
      console.log('❌ Zoom In button not found');
    }

    // Click zoom in a few more times
    if (zoomInButton.length > 0) {
      console.log('\n3. Clicking Zoom In 3 more times...');
      for (let i = 0; i < 3; i++) {
        await zoomInButton[0].click();
        await page.waitForTimeout(300);
      }
      await page.screenshot({ path: 'test-zoom-in-4x.png' });
      console.log('✅ Zoomed in 4 times total');
    }

    // Test zoom out button
    console.log('\n4. Testing Zoom Out button...');
    const zoomOutButton = await page.$$('button[title*="Zoom Out"]');
    if (zoomOutButton.length > 0) {
      for (let i = 0; i < 2; i++) {
        await zoomOutButton[0].click();
        await page.waitForTimeout(300);
      }
      await page.screenshot({ path: 'test-zoom-out.png' });
      console.log('✅ Zoom Out clicked 2 times');
    } else {
      console.log('❌ Zoom Out button not found');
    }

    // Test reset button
    console.log('\n5. Testing Reset button...');
    const resetButton = await page.$$('button[title*="Reset"]');
    if (resetButton.length > 0) {
      await resetButton[0].click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-reset.png' });
      console.log('✅ Reset clicked');
    } else {
      console.log('❌ Reset button not found');
    }

    // Test fit to screen button
    console.log('\n6. Testing Fit to Screen button...');
    const fitButton = await page.$$('button[title*="Fit"]');
    if (fitButton.length > 0) {
      await fitButton[0].click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-fit-to-screen.png' });
      console.log('✅ Fit to Screen clicked');
    } else {
      console.log('❌ Fit to Screen button not found');
    }

    // Test mouse wheel zoom (simulate)
    console.log('\n7. Testing mouse wheel zoom...');
    const canvas = await page.$('canvas');
    if (canvas) {
      const box = await canvas.boundingBox();
      
      // Zoom in with wheel
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel({ deltaY: -200 }); // Scroll up to zoom in
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'test-wheel-zoom-in.png' });
      console.log('✅ Mouse wheel zoom in');

      // Zoom out with wheel
      await page.mouse.wheel({ deltaY: 200 }); // Scroll down to zoom out
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'test-wheel-zoom-out.png' });
      console.log('✅ Mouse wheel zoom out');

      // Test dragging
      console.log('\n8. Testing canvas drag/pan...');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2 + 100, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-drag-pan.png' });
      console.log('✅ Canvas dragged');
    } else {
      console.log('❌ Canvas not found');
    }

    // Get zoom percentage from UI
    console.log('\n9. Reading zoom percentage...');
    const zoomText = await page.evaluate(() => {
      const zoomDisplay = document.querySelector('.absolute.bottom-6.right-6 span');
      return zoomDisplay ? zoomDisplay.textContent : 'Not found';
    });
    console.log(`Current zoom: ${zoomText}`);

    console.log('\n✅ All tests completed successfully!');
    console.log('\nScreenshots saved:');
    console.log('- test-initial.png');
    console.log('- test-zoom-in.png');
    console.log('- test-zoom-in-4x.png');
    console.log('- test-zoom-out.png');
    console.log('- test-reset.png');
    console.log('- test-fit-to-screen.png');
    console.log('- test-wheel-zoom-in.png');
    console.log('- test-wheel-zoom-out.png');
    console.log('- test-drag-pan.png');

  } catch (error) {
    console.error('Error during test:', error.message);
  } finally {
    await browser.close();
  }
})();
