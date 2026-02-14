// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email Email' }).fill('admin1@mail.ru');
  await page.getByRole('textbox', { name: 'Пароль Пароль' }).fill('admin111');
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('link', { name: 'Шаблоны' }).click();
});

test('list', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Управление шаблонами' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Создать' })).toBeVisible();
  await expect(page.getByText('Приветственное письмо')).toBeVisible();
  await expect(page.getByText('SMS-напоминание')).toBeVisible();
});

test('view', async ({ page }) => {
  await page.getByRole('link', { name: 'Просмотр' }).first().click();
  await expect(page.getByRole('link', { name: 'Назад к списку' })).toBeVisible();
  await expect(page.getByText('Шаблон', { exact: true })).toBeVisible();
  await expect(page.getByText('Email - подтверждение')).toBeVisible();
  await expect(page.getByText('Подтверждение действия')).toBeVisible();
  await page.getByRole('link', { name: 'Назад к списку' }).click();
  await expect(page.getByRole('heading', { name: 'Управление шаблонами' })).toBeVisible();
});

test('edit', async ({ page }) => {
  await page.getByRole('link', { name: 'Редактировать' }).first().click();
  await page.getByRole('textbox', { name: 'Название шаблона Название шаблона' }).fill('Email - подтверждение111');
  await page.locator('form').click();
  await page.getByRole('textbox', { name: 'Название шаблона Название шаблона' }).fill('Email - подтверждение');
  await page.locator('form').click();
  await page.getByRole('button', { name: 'Обновить' }).click();
  await expect(page.getByRole('heading', { name: 'Управление шаблонами' })).toBeVisible();
});

test('create and delete', async ({ page }) => {
  await page.getByRole('link', { name: 'Создать' }).click();
  await page.getByRole('textbox', { name: 'Название шаблона Название шаблона' }).fill('тестовый шаблон');
  await page.getByRole('radio', { name: 'СМС' }).check();
  await page.getByRole('textbox', { name: 'Содержание Содержание' }).fill('qqq');
  await page.locator('form').click();
  await page.getByRole('button', { name: 'Создать' }).click();
  await expect(page.getByRole('heading', { name: 'Управление шаблонами' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'тестовый шаблон' })).toBeVisible();
  await page.getByRole('button', { name: 'Удалить' }).first().click();
  await expect(page.getByText('Шаблон удален')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'тестовый шаблон' })).not.toBeVisible();
});
