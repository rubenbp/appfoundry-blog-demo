import { expect, test } from './fixtures.mjs';

test('los tres accesos de portada se leen sin que el sello tape Conoce el archivo', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	for (const width of [1440, 1100, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		const actions = page.locator('.hero__actions');
		const about = page.getByRole('link', { name: 'Conoce el archivo' });
		for (const name of ['Abrir el catálogo', 'Sorpréndeme', 'Conoce el archivo']) {
			await expect(page.getByRole('link', { name })).toBeVisible();
		}
		const seal = page.locator('.hero__stamp');
		if (await seal.isVisible()) {
			const [actionsBox, sealBox] = await Promise.all([actions.boundingBox(), seal.boundingBox()]);
			if (!actionsBox || !sealBox) throw new Error('Faltan las posiciones de las acciones o del sello');
			expect(sealBox.y).toBeGreaterThanOrEqual(actionsBox.y + actionsBox.height);
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		await about.click();
		await expect(page).toHaveURL('/sobre-rebobina/');
	}
});

test('Sorpréndeme abre una ficha del archivo y permite alcanzar ambos extremos de la selección', async ({ page }) => {
	for (const [random, index] of [[0, 0], [0.999999, -1]]) {
		await page.addInitScript((value) => { Math.random = () => value; }, random);
		await page.goto('/');
		const link = page.getByRole('link', { name: 'Sorpréndeme' });
		const ids = JSON.parse(await link.getAttribute('data-game-ids') ?? '[]');
		expect(ids).toHaveLength(35);
		const id = ids.at(index);
		await link.click();
		await expect(page).toHaveURL(`/juegos/${id}/`);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	}
});

test('sin juegos disponibles, Sorpréndeme lleva al catálogo', async ({ page }) => {
	await page.goto('/');
	const link = page.getByRole('link', { name: 'Sorpréndeme' });
	await link.evaluate((element) => { element.dataset.gameIds = '[]'; });
	await link.click();
	await expect(page).toHaveURL('/catalogo/');
});

test.describe('sin JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('Sorpréndeme sigue siendo un enlace al catálogo', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Sorpréndeme' }).click();
		await expect(page).toHaveURL('/catalogo/');
	});
});
