const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

exports.renderCertificateToBuffers = async (vars) => {
  const templatePath = path.join(__dirname, '../template.html');
  let template = fs.readFileSync(templatePath, 'utf8');

  let html = template
    .replace(/__NAME__/g, vars.name)
    .replace(/__GST__/g, vars.gstNumber)
    .replace(/__BUSINESSNAME__/g, vars.businessName)
    .replace(/__ADDRESS__/g, vars.businessAddress)
    .replace(/__DATE__/g, vars.date);

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    const width = Math.round(210 * 96 / 25.4);
    const height = Math.round(297 * 96 / 25.4);
    await page.setViewport({ width, height });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    const screenshotBuffer = await page.screenshot({ type: 'jpeg', fullPage: true });

    return { pdfBuffer, screenshotBuffer };
  } finally {
    await browser.close();
  }
};
