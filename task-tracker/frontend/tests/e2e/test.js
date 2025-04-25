const puppeteer = require("puppeteer");

(async () => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto("http://localhost:5173");
	console.log(await page.title());
	await browser.close();
})();
