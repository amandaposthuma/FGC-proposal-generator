const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'test-results/html' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3456',
    headless: true,
    launchOptions: {
      args: ['--no-sandbox'],
      executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    },
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npx --yes serve . -p 3456',
    port: 3456,
    reuseExistingServer: true,
    timeout: 15000,
  },
});
