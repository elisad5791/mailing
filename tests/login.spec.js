// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle('Рассылки');
});

test('login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('heading', { name: 'Вход в кабинет' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Email Email' }).click();
  await page.getByRole('textbox', { name: 'Email Email' }).fill('admin1@mail.ru');
  await page.getByRole('textbox', { name: 'Пароль Пароль' }).click();
  await page.getByRole('textbox', { name: 'Пароль Пароль' }).fill('admin111');
  await page.getByRole('button', { name: 'Войти' }).click();

  await expect(page.getByText('Главная панель')).toBeVisible();
});
