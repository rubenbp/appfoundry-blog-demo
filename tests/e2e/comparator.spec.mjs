import { expect, test } from './fixtures.mjs';

test('desde el menú compara cuatro juegos, cambia una columna y abre su ficha', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Comparador' }).click();
	await expect(page).toHaveURL(/\/comparador\/$/);
	const selects = page.locator('[data-compare-select]');
	await expect(selects).toHaveCount(4);
	await expect(selects.nth(0)).toHaveValue('super-mario-world');
	await expect(selects.nth(1)).toHaveValue('sonic-the-hedgehog-2');
	await expect(page.locator('[data-compare-field="platform"] [data-compare-cell="0"]')).toHaveText('Super Nintendo');
	await selects.nth(2).selectOption('tetris');
	await selects.nth(3).selectOption('wipeout');
	await expect(page.locator('[data-compare-field="genre"] [data-compare-cell="2"]')).toHaveText('Puzles');
	await expect(page.locator('[data-compare-field="platform"] [data-compare-cell="3"]')).toHaveText('PlayStation');
	await selects.nth(0).selectOption('chrono-trigger');
	await expect(page.locator('[data-compare-field="platform"] [data-compare-cell="0"]')).toHaveText('Super Nintendo');
	await expect(page.locator('[data-compare-field="genre"] [data-compare-cell="0"]')).toHaveText('Rol japonés');
	await expect(page.locator('[data-compare-field="genre"] [data-compare-cell="2"]')).toHaveText('Puzles');
	await expect(page.locator('[data-compare-game="0"] img')).toHaveAttribute('src', '/art/chrono-trigger.svg');
	await expect.poll(() => page.locator('[data-compare-game="0"] img').evaluate((img) => img instanceof HTMLImageElement ? img.naturalWidth : 0)).toBeGreaterThan(0);
	await page.locator('[data-compare-game="0"] .compare-game__link').click();
	await expect(page).toHaveURL(/\/juegos\/chrono-trigger\/$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chrono Trigger');
});

test('permite dejar un espacio vacío y comparar en móvil sin cortar columnas', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/comparador/');
	const scroll = page.getByRole('region', { name: /Comparación de juegos/ });
	await expect(page.getByText('Desliza la tabla hacia los lados')).toBeVisible();
	await page.getByLabel('Juego 1').selectOption('');
	await expect(page.locator('[data-compare-game="0"]')).toBeHidden();
	await expect(page.locator('[data-compare-empty="0"]')).toBeVisible();
	await expect(page.locator('[data-compare-field="year"] [data-compare-cell="0"]')).toHaveText('—');
	await expect(page.locator('[data-compare-field="year"] [data-compare-cell="1"]')).not.toHaveText('—');
	await page.getByLabel('Juego 1').selectOption('metroid');
	await expect(page.locator('[data-compare-game="0"] .compare-game__link')).toHaveAttribute('href', '/juegos/metroid/');
	const dimensions = await scroll.evaluate((element) => ({ overflow: element.scrollWidth > element.clientWidth, pageOverflow: document.documentElement.scrollWidth > innerWidth }));
	expect(dimensions).toEqual({ overflow: true, pageOverflow: false });
	await scroll.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
	await expect(page.getByLabel('Juego 4')).toBeVisible();
});
