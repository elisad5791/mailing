// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email Email' }).fill('admin1@mail.ru');
  await page.getByRole('textbox', { name: 'Пароль Пароль' }).fill('admin111');
  await page.getByRole('button', { name: 'Войти' }).click();
});

test('cards', async ({ page }) => {
  await expect(page.getByText('Главная панель')).toBeVisible();

  await expect(page.getByText('Всего рассылок')).toBeVisible();
  await expect(page.getByText('145').first()).toBeVisible();

  await expect(page.getByText('Рассылок сегодня')).toBeVisible();
  await expect(page.getByText('5').nth(2)).toBeVisible();

  await expect(page.getByText('Доставлено SMS')).toBeVisible();
  await expect(page.getByText('1280').first()).toBeVisible();

  await expect(page.getByText('Доставлено Email')).toBeVisible();
  await expect(page.getByText('5642').first()).toBeVisible();
});

test('card details', async ({ page }) => {
  await page.getByText('Всего рассылок').click();
  await expect(page.getByText('Успешно:').first()).toBeVisible();
  await expect(page.getByText('102')).toBeVisible();

  await page.getByText('Рассылок сегодня').click();
  await expect(page.getByText('Успешно:').nth(1)).toBeVisible();
  await expect(page.getByText('3', { exact: true })).toBeVisible();

  await page.getByText('Доставлено SMS').click();
  await expect(page.getByText('Текущий месяц:').first()).toBeVisible();
  await expect(page.getByText('281')).toBeVisible();

  await page.getByText('Доставлено Email').click();
  await expect(page.getByText('Текущая неделя:').nth(1)).toBeVisible();
  await expect(page.getByText('154')).toBeVisible();
});

test('charts', async ({ page }) => {
  await expect(page.getByRole('main')).toContainText('Активность рассылок за текущую неделю');
  await expect(page.getByRole('main')).toContainText('Активность рассылок за текущий месяц');

  await expect(page.getByRole('img').first()).toBeVisible();
  await expect(page.getByRole('img').nth(1)).toBeVisible();
});
