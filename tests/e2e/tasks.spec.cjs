const { test, expect } = require('@playwright/test');

test('adds, persists and removes a task', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('아직 적어둔 일이 없어요.')).toBeVisible();
  await page.getByLabel('새 할 일').fill('프로젝트 정리하기');
  await page.getByRole('button', { name: /추가/ }).click();
  await expect(page.getByText('프로젝트 정리하기')).toBeVisible();
  await expect(page.locator('#task-count')).toHaveText('1개');
  await page.reload();
  await expect(page.getByText('프로젝트 정리하기')).toBeVisible();
  await page.getByRole('button', { name: '프로젝트 정리하기 삭제' }).click();
  await expect(page.getByText('아직 적어둔 일이 없어요.')).toBeVisible();
});

test('rejects a blank task and displays user text as text', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('새 할 일').fill('   ');
  await page.getByRole('button', { name: /추가/ }).click();
  await expect(page.getByRole('status')).toContainText('1자 이상');
  await page.getByLabel('새 할 일').fill('<img src=x>');
  await page.getByRole('button', { name: /추가/ }).click();
  await expect(page.getByText('<img src=x>')).toBeVisible();
  await expect(page.locator('#task-list img')).toHaveCount(0);
});
