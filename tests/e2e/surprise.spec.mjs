import { expect, test } from './fixtures.mjs';

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
