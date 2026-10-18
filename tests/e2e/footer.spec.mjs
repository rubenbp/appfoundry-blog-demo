import { expect, test } from '@playwright/test';

for (const path of ['/', '/catalogo/', '/sobre-rebobina/']) {
	test(`footer slogan is present at ${path}`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('.site-footer p')).toHaveText('Clásicos que merecen otra partida.');
	});
}

test('footer brand on about page links back to home', async ({ page }) => {
	await page.goto('/sobre-rebobina/');
	const brand = page.locator('.site-footer .brand');
	await expect(brand).toHaveAttribute('href', '/');
	await brand.click();
	await expect(page).toHaveURL(/\/$/);
});
