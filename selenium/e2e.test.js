const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const SELENIUM_REMOTE_URL =
  process.env.SELENIUM_REMOTE_URL || "http://localhost:4444/wd/hub";

async function runTests() {
  const options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  const driver = await new Builder()
    .forBrowser("chrome")
    .usingServer(SELENIUM_REMOTE_URL)
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(APP_URL);

    await driver.wait(until.elementLocated(By.css("h1")), 10000);
    const heading = await driver.findElement(By.css("h1")).getText();

    assert.strictEqual(heading, "Jenkins DevOps Web App");
    console.log("PASS Test Case 1: Homepage heading is visible.");

    const taskName = `Selenium Test Task ${Date.now()}`;

    await driver.findElement(By.name("task")).sendKeys(taskName);
    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), "${taskName}")]`)),
      10000
    );

    console.log("PASS Test Case 2: Task was added and displayed successfully.");
  } finally {
    await driver.quit();
  }
}

runTests().catch((error) => {
  console.error("Selenium test failed:", error);
  process.exit(1);
});
