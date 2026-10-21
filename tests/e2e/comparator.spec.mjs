import { expect, test } from './fixtures.mjs';

/** @param {import('@playwright/test').Locator} selects */
const selectedGames = (selects) => selects.evaluateAll((items) => items.map((item) => /** @type {HTMLSelectElement} */ (item).value));

test('desde el menú compara cuatro juegos, cambia una columna y abre su ficha', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Comparador' }).click();
	await expect(page).toHaveURL(/\/comparador\/\?juego1=super-mario-world&juego2=sonic-the-hedgehog-2&juego3=&juego4=$/);
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

test('la URL conserva las cuatro posiciones al recargar, compartir y navegar por el historial', async ({ page }) => {
	await page.goto('/comparador/');
	const selects = page.locator('[data-compare-select]');
	expect([...new URL(page.url()).searchParams.entries()]).toEqual([
		['juego1', 'super-mario-world'], ['juego2', 'sonic-the-hedgehog-2'], ['juego3', ''], ['juego4', ''],
	]);
	await selects.nth(0).selectOption('chrono-trigger');
	await selects.nth(1).selectOption('');
	await selects.nth(2).selectOption('tetris');
	await selects.nth(3).selectOption('wipeout');
	const sharedURL = page.url();
	const params = new URL(sharedURL).searchParams;
	expect([...params.entries()]).toEqual([
		['juego1', 'chrono-trigger'], ['juego2', ''], ['juego3', 'tetris'], ['juego4', 'wipeout'],
	]);
	await page.reload();
	await expect.poll(() => selectedGames(selects)).toEqual(['chrono-trigger', '', 'tetris', 'wipeout']);
	await expect(page.locator('[data-compare-empty="1"]')).toBeVisible();
	await expect(page.locator('[data-compare-field="genre"] [data-compare-cell="2"]')).toHaveText('Puzles');
	await expect(page.locator('[data-compare-game="3"] .compare-game__link')).toHaveAttribute('href', '/juegos/wipeout/');
	await page.goto('/comparador/');
	await expect(selects.nth(0)).toHaveValue('super-mario-world');
	await page.goto(sharedURL);
	await expect.poll(() => selectedGames(selects)).toEqual(['chrono-trigger', '', 'tetris', 'wipeout']);
	await selects.nth(2).selectOption('metroid');
	await page.goBack();
	await expect(selects.nth(2)).toHaveValue('tetris');
	await expect(page.locator('[data-compare-field="genre"] [data-compare-cell="2"]')).toHaveText('Puzles');
	await page.goForward();
	await expect(selects.nth(2)).toHaveValue('metroid');
});

test('acepta comparaciones vacías o parciales y descarta identificadores desconocidos', async ({ page }) => {
	await page.goto('/comparador/?juego1=&juego2=&juego3=&juego4=');
	const selects = page.locator('[data-compare-select]');
	await expect.poll(() => selectedGames(selects)).toEqual(['', '', '', '']);
	await expect(page.locator('[data-compare-empty]')).toHaveCount(4);
	await expect(page.locator('[data-compare-field="year"] [data-compare-cell="0"]')).toHaveText('—');
	await page.goto('/comparador/?origen=amigo&juego3=tetris&juego4=no-existe#compare-title');
	await expect.poll(() => selectedGames(selects)).toEqual(['', '', 'tetris', '']);
	await expect(page.locator('[data-compare-game="2"] .compare-game__link')).toHaveAttribute('href', '/juegos/tetris/');
	await expect(page.locator('[data-compare-empty="3"]')).toBeVisible();
	await selects.nth(2).selectOption('');
	const url = new URL(page.url());
	expect(url.hash).toBe('#compare-title');
	expect(url.searchParams.get('origen')).toBe('amigo');
	expect([1, 2, 3, 4].map((number) => url.searchParams.get(`juego${number}`))).toEqual(['', '', '', '']);
});
