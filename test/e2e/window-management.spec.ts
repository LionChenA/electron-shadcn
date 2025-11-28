import {
  type ElectronApplication,
  _electron as electron,
  expect,
  type Page,
  test,
} from '@playwright/test';
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';

/*
 * Using Playwright with Electron:
 * https://www.electronjs.org/pt/docs/latest/tutorial/automated-testing#using-playwright
 */

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  const latestBuild = findLatestBuild();
  const appInfo = parseElectronApp(latestBuild);
  process.env.CI = 'e2e';

  electronApp = await electron.launch({
    args: [appInfo.main],
  });

  electronApp.on('window', async (page) => {
    const filename = page.url()?.split('/').pop();
    console.log(`Window opened: ${filename}`);

    page.on('pageerror', (error) => {
      console.error(error);
    });
    page.on('console', (msg) => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

test.describe('Window Management', () => {
  test('main window opens successfully', async () => {
    const page: Page = await electronApp.firstWindow();

    const title = await page.waitForSelector('h1');
    const text = await title.textContent();
    expect(text).toBe('electron-shadcn');
  });

  test('window has proper title', async () => {
    const page: Page = await electronApp.firstWindow();

    const windowTitle = await page.title();
    expect(windowTitle).toBe('electron-shadcn Template');
  });

  test('can interact with page elements', async () => {
    const page: Page = await electronApp.firstWindow();

    await page.waitForSelector('h1');

    // Verify page content is visible and interactive
    const pageTitle = page.getByTestId('pageTitle');
    const text = await pageTitle.textContent();
    expect(text).toBe('Home Page');
  });

  test('window dimensions are appropriate', async () => {
    const page: Page = await electronApp.firstWindow();

    // Electron window doesn't have viewportSize in the same way as browsers
    const bounds = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }));

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
