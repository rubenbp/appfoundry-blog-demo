import { expect, test } from '@playwright/test';

test('busca sin tildes y abre la ficha de Castlevania', async ({ page }) => {
	await page.goto('/catalogo/');
	await page.getByRole('searchbox', { name: 'Busca en el archivo' }).fill('accion');

	const castlevania = page.getByRole('link', { name: 'Ver ficha de Castlevania: Symphony of the Night' });
	await expect(castlevania).toBeVisible();
	await expect(page.locator('[data-game-card]:visible')).toHaveCount(1);
	await castlevania.click();

	await expect(page).toHaveURL(/\/juegos\/castlevania-symphony-of-the-night\/$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Castlevania: Symphony of the Night');
});

test('combina género y consola para abrir la ficha de Sonic', async ({ page }) => {
	await page.goto('/catalogo/');
	await page.getByRole('button', { name: 'Plataformas' }).click();
	await page.getByLabel('Consola').selectOption('mega drive');

	const sonic = page.getByRole('link', { name: 'Ver ficha de Sonic the Hedgehog 2' });
	await expect(sonic).toBeVisible();
	await expect(page.locator('[data-game-card]:visible')).toHaveCount(1);
	await sonic.click();

	await expect(page).toHaveURL(/\/juegos\/sonic-the-hedgehog-2\/$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sonic the Hedgehog 2');
});
