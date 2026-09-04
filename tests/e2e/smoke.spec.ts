import { expect, test } from '@playwright/test';

test('landing e cardápio demo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /vê o prato antes de pedir/i })).toBeVisible();
  await page.getByRole('link', { name: /experimentar agora/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Casa Fogo' })).toBeVisible();
  await page.getByPlaceholder('Buscar prato').fill('Burger');
  await expect(page.getByRole('link', { name: /Burger Brasa/i })).toBeVisible();
  await page.getByRole('link', { name: /Burger Brasa/i }).click();
  await expect(page.getByRole('heading', { name: 'Burger Brasa' })).toBeVisible();
  await expect(page.getByText(/Modelo 3D ainda não configurado|Explorar em 3D/i)).toBeVisible();
});

test('qr redirect', async ({ page }) => {
  await page.goto('/q/mesa12');
  await expect(page).toHaveURL(/\/r\/casa-fogo/);
});

test('login painel e CRUD básico', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill('owner@casafogo.demo');
  await page.getByLabel('Senha').fill('demo-password');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Casa Fogo')).toBeVisible();

  await page.getByRole('navigation').getByRole('link', { name: 'Produtos' }).click();
  await page.getByPlaceholder('Nome').fill('Item E2E');
  await page.getByPlaceholder('Resumo').fill('Criado no teste');
  await page.getByRole('button', { name: 'Adicionar' }).click();
  await expect(page.getByText('Item E2E')).toBeVisible();

  await page.getByRole('navigation').getByRole('link', { name: 'QR Codes' }).click();
  await expect(page.getByText('/q/mesa12')).toBeVisible();
});

test('admin kanban e assinaturas', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill('admin@menuar.demo');
  await page.getByLabel('Senha').fill('demo-password');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Operação interna')).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Solicitações 3D' }).click();
  await expect(page.getByRole('paragraph').filter({ hasText: 'customer_review' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Assinaturas' }).click();
  await expect(page.getByRole('button', { name: 'active' }).first()).toBeVisible();
});
