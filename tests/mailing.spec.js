// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email Email' }).fill('admin1@mail.ru');
  await page.getByRole('textbox', { name: 'Пароль Пароль' }).fill('admin111');
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('link', { name: 'Рассылки' }).click();
});

test('list', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Управление рассылками' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Создать' })).toBeVisible();
  await expect(page.getByText('Напоминание SMS')).toBeVisible();
  await expect(page.getByText('Акция октября')).toBeVisible();
});

test('view', async ({ page }) => {
  await page.getByRole('link', { name: 'Просмотр' }).first().click();
  await expect(page.getByRole('link', { name: 'Назад к списку' })).toBeVisible();
  await expect(page.getByText('Рассылка')).toBeVisible();
  await expect(page.getByText('Напоминание SMS')).toBeVisible();
  await expect(page.getByText('Шаблон: SMS-напоминание')).toBeVisible();
  await page.getByRole('link', { name: 'Назад к списку' }).click();
  await expect(page.getByRole('heading', { name: 'Управление рассылками' })).toBeVisible();
});

test('edit', async ({ page }) => {
  await page.getByRole('link', { name: 'Редактировать' }).first().click();
  await expect(page.getByRole('heading', { name: 'Редактирование рассылки' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Назад к списку' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Название рассылки Название рассылки' })).toHaveValue('Напоминание SMS');
  await expect(page.locator('form')).toContainText('SMS-напоминание');
  await page.getByRole('link', { name: 'Планировщик' }).click();
  await expect(page.getByText('Отправить немедленно')).toBeVisible();
  await expect(page.getByText('Запланировать')).toBeVisible();
  await expect(page.getByText('Повторяющаяся')).toBeVisible();
  await expect(page.getByText('Выбор даты')).toBeVisible();
  await expect(page.getByText('Выберите время')).toBeVisible();
  await page.locator('div').filter({ hasText: /^Запланировать$/ }).click();
  await page.getByRole('radio', { name: 'Повторяющаяся' }).check();
  await expect(page.getByText('Ежедневно')).toBeVisible();
  await page.getByRole('radio', { name: 'Запланировать' }).check();
  await expect(page.getByText('Выбор даты')).toBeVisible();
  await expect(page.getByText('Выберите время')).toBeVisible();
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByRole('heading', { name: 'Редактирование рассылки' })).toBeVisible();
  await page.getByRole('link', { name: 'Назад к списку' }).click();
  await expect(page.getByRole('heading', { name: 'Управление рассылками' })).toBeVisible();
});

test('create and delete', async ({ page }) => {
  await page.getByRole('link', { name: 'Создать' }).click();
  await page.getByRole('textbox', { name: 'Название рассылки Название рассылки' }).fill('тестовая рассылка');
  await page.locator('.v-input.v-input--horizontal.v-input--center-affix.v-input--density-default.v-theme--light.v-locale--is-ltr.v-text-field.v-select > .v-input__control > .v-field > .v-field__field > .v-field__input').click();
  await page.getByText('Email - подтверждение').click();
  await page.getByRole('textbox', { name: 'Получатели (через запятую) Получатели (через запятую)' }).fill('qqq@mail.ru');
  await page.getByRole('button', { name: 'Создать' }).click();
  await expect(page.getByRole('heading', { name: 'Управление рассылками' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'тестовая рассылка' })).toBeVisible();
  await page.getByRole('button', { name: 'Удалить' }).first().click();
  await expect(page.getByText('Рассылка удалена')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'тестовая рассылка' })).not.toBeVisible();
});
