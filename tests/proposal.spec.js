/**
 * FGC Proposal Generator — Regression Test Suite
 *
 * Each test covers a bug that has actually occurred in production.
 * Run with: npx playwright test
 * Runs against LOCAL server by default; set BASE_URL env var for live site.
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3456';

// ─── helpers ────────────────────────────────────────────────────────────────

async function login(page) {
  await page.goto(BASE_URL);
  await page.waitForSelector('#pw-username', { timeout: 10000 });
  await page.fill('#pw-username', 'claudia@fgcadvisors.com');
  await page.fill('#pw-input', 'Miami.25!');
  await page.click('.pw-btn');
  await page.waitForTimeout(1200);
  // Dismiss device modal if present
  const modal = page.locator('#user-modal-overlay');
  if (await modal.isVisible()) {
    await page.fill('#user-modal-input', 'Test Device');
    await page.click('.user-modal-btn');
    await page.waitForTimeout(400);
  }
}

async function generateBVIProposal(page, { client = 'Test Client', priceOverride = null } = {}) {
  // Set client name
  await page.evaluate((name) => {
    const el = document.querySelector('#f-client');
    el.value = name;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, client);

  // Enable BVI service
  await page.evaluate(() => {
    document.querySelectorAll('label, .service-toggle').forEach(el => {
      if (el.textContent.includes('BVI')) el.click();
    });
  });
  await page.waitForTimeout(300);

  // Set price override if provided
  if (priceOverride !== null) {
    await page.evaluate((price) => {
      const inputs = document.querySelectorAll('.price-override-input');
      if (inputs[0]) {
        inputs[0].value = String(price);
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, priceOverride);
  }

  // Click generate
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.match(/gerar/i)) b.click();
    });
  });
  await page.waitForTimeout(2000);
}

// ─── tests ──────────────────────────────────────────────────────────────────

test.describe('FGC Proposal Generator — Regression Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage so each test starts clean
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('fgc_device', 'Test Device');
    });
  });

  // ── BUG 1: Input boxes visible in generated proposal ──────────────────────
  // Radio buttons (<input type="radio">) were rendered inside the proposal
  // output, appearing as visible form controls to the client.
  test('BUG 1 — No input elements inside generated proposal', async ({ page }) => {
    await login(page);
    await generateBVIProposal(page, { client: 'Marie', priceOverride: 2900 });

    const inputCount = await page.evaluate(() => {
      return document.querySelector('#proposal-doc')?.querySelectorAll('input').length ?? -1;
    });

    expect(inputCount).toBe(0);
  });

  // ── BUG 1b: Signature section must not contain <input> elements ───────────
  // The Sim/Não options in the signature section were real radio inputs.
  test('BUG 1b — Signature section uses CSS circles, not radio inputs', async ({ page }) => {
    await login(page);
    await generateBVIProposal(page, { client: 'Marie' });

    const sigInputs = await page.evaluate(() => {
      const sig = document.querySelector('#proposal-doc .signature-section');
      return sig ? sig.querySelectorAll('input').length : -1;
    });

    expect(sigInputs).toBe(0);
  });

  // ── BUG 2: Manual edits disappear after draft save → reload ───────────────
  // When a user edited the proposal in edit mode, saved a draft, then
  // reloaded it, all manual edits were lost (proposal regenerated fresh).
  test('BUG 2 — Manual edits preserved after draft save and reload', async ({ page }) => {
    await login(page);
    await generateBVIProposal(page, { client: 'Marie', priceOverride: 2900 });

    // Enter edit mode and make a visible text change
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.textContent.match(/editar/i)) b.click();
      });
    });
    await page.waitForTimeout(300);

    await page.evaluate(() => {
      const doc = document.getElementById('proposal-doc');
      const cells = doc.querySelectorAll('td');
      for (const cell of cells) {
        if (cell.textContent.includes('BVI')) {
          cell.textContent = 'Reinstatement + Constituição BVI Company';
          break;
        }
      }
    });

    // Save draft
    await page.evaluate(() => document.querySelector('#btn-save-draft').click());
    await page.waitForTimeout(800);

    const draftId = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('fgc_drafts') || '[]')[0]?.id
    );
    expect(draftId).toBeTruthy();

    // Verify proposalHTML was saved
    const htmlSaved = await page.evaluate(() => {
      const d = JSON.parse(localStorage.getItem('fgc_drafts') || '[]')[0];
      return !!d?.proposalHTML;
    });
    expect(htmlSaved).toBe(true);

    // Reset
    await page.evaluate(() => document.querySelector('#btn-new-proposal')?.click());
    await page.waitForTimeout(500);

    // Reload draft
    await page.evaluate((id) => loadDraft(id), draftId);
    await page.waitForTimeout(1500);

    // Proposal should be visible with the edit intact
    const result = await page.evaluate(() => {
      const doc = document.getElementById('proposal-doc');
      return {
        visible: doc?.style.display !== 'none',
        hasEdit: doc?.textContent?.includes('Reinstatement +'),
        inputCount: doc?.querySelectorAll('input').length,
      };
    });

    expect(result.visible).toBe(true);
    expect(result.hasEdit).toBe(true);
    expect(result.inputCount).toBe(0);
  });

  // ── BUG 2b: Draft reload must not trigger auto-regeneration ───────────────
  // After restoring proposalHTML, debouncedUpdate() was overwriting it
  // 150ms later because _lastTrivaMode was still set.
  test('BUG 2b — Draft reload does not auto-regenerate over restored HTML', async ({ page }) => {
    await login(page);
    await generateBVIProposal(page, { client: 'Marie' });

    // Edit and save
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => { if (b.textContent.match(/editar/i)) b.click(); });
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const cells = document.getElementById('proposal-doc').querySelectorAll('td');
      for (const c of cells) {
        if (c.textContent.includes('BVI')) { c.textContent = 'UNIQUE_MARKER_TEXT'; break; }
      }
    });
    await page.evaluate(() => document.querySelector('#btn-save-draft').click());
    await page.waitForTimeout(600);

    const draftId = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('fgc_drafts') || '[]')[0]?.id
    );

    await page.evaluate(() => document.querySelector('#btn-new-proposal')?.click());
    await page.waitForTimeout(400);
    await page.evaluate((id) => loadDraft(id), draftId);

    // Wait longer than debounce (150ms) + buffer to catch any auto-regeneration
    await page.waitForTimeout(1000);

    const markerPresent = await page.evaluate(() =>
      document.getElementById('proposal-doc')?.textContent?.includes('UNIQUE_MARKER_TEXT')
    );

    expect(markerPresent).toBe(true);
  });

  // ── BUG 3: Price override preserved in draft ───────────────────────────────
  // Custom price overrides set in the sidebar reverted to defaults on reload.
  test('BUG 3 — Price override survives draft save and reload', async ({ page }) => {
    await login(page);
    await generateBVIProposal(page, { client: 'Marie', priceOverride: 9999 });

    await page.evaluate(() => document.querySelector('#btn-save-draft').click());
    await page.waitForTimeout(600);

    const draftId = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('fgc_drafts') || '[]')[0]?.id
    );

    await page.evaluate(() => document.querySelector('#btn-new-proposal')?.click());
    await page.waitForTimeout(400);
    await page.evaluate((id) => loadDraft(id), draftId);
    await page.waitForTimeout(1000);

    // Proposal should show the saved version (with 9999 price)
    const pricePresent = await page.evaluate(() =>
      document.getElementById('proposal-doc')?.textContent?.includes('9,999')
    );

    expect(pricePresent).toBe(true);
  });

  // ── BUG 4: Save PDF button must not be hidden by auto-save banner ────────
  // When an auto-save snapshot exists and the banner is shown at the top of
  // the page, it used to physically cover the topbar, making "Save PDF ↓"
  // unreachable without first clicking Restaurar or Descartar.
  test('BUG 4 — Save PDF button is visible even when auto-save banner is shown', async ({ page }) => {
    // Inject a fake auto-save snapshot so the banner appears on load
    await page.addInitScript(() => {
      localStorage.setItem('fgc_autosave', JSON.stringify({
        client: 'FGC ADVISORS',
        savedAt: new Date().toISOString(),
        lang: 'pt',
        state: {},
      }));
    });

    await login(page);
    // Generate a proposal so the Save PDF button is in the topbar
    await generateBVIProposal(page, { client: 'Piero Contezini' });

    // The auto-save banner should be visible
    const bannerVisible = await page.evaluate(() => {
      const b = document.getElementById('autosave-banner');
      return b && b.style.display !== 'none';
    });
    expect(bannerVisible).toBe(true);

    // The Save PDF button must be visible and not covered
    const pdfBtn = page.locator('#btn-export-pdf');
    await expect(pdfBtn).toBeVisible();

    // It must also be interactable (not obscured by the banner)
    const btnBox = await pdfBtn.boundingBox();
    const bannerBox = await page.locator('#autosave-banner').boundingBox();
    // Button top must be below banner bottom
    expect(btnBox.y).toBeGreaterThanOrEqual(bannerBox.y + bannerBox.height);
  });

  // ── SANITY: Proposal generates without errors ─────────────────────────────
  test('SANITY — Proposal generates and is visible', async ({ page }) => {
    await login(page);
    await generateBVIProposal(page, { client: 'Test Client' });

    const visible = await page.evaluate(() => {
      const doc = document.getElementById('proposal-doc');
      return doc && doc.style.display !== 'none';
    });

    expect(visible).toBe(true);
  });

  // ── SANITY: Login works ───────────────────────────────────────────────────
  test('SANITY — Login with valid credentials succeeds', async ({ page }) => {
    await login(page);
    const gateHidden = await page.evaluate(() =>
      document.getElementById('pw-gate')?.classList.contains('hidden')
    );
    expect(gateHidden).toBe(true);
  });

});
