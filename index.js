const fs = require('fs');
const { promisify } = require('util');
const wd = require('selenium-webdriver');

const capabilities = wd.Capabilities.chrome();
capabilities.set('chromeOptions', {
    args: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        `--window-size=1980,1200`
    ]
});

const run = async (url) => {
    const driver = await new wd.Builder().withCapabilities(capabilities).build();

    await driver.get(url);
    await driver.wait(wd.until.elementLocated(wd.By.className('main')), 10000);

    let base64 = await driver.takeScreenshot();
    let buffer = Buffer.from(base64, 'base64');

    await promisify(fs.writeFile)(`./screenshot/${Date.now()}.jpg`, buffer);

    driver.quit();
}

run('https://innersloth.com/gameAmongUs.php');