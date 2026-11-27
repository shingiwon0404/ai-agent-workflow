const { test, expect } = require('@playwright/test');

test('adds, persists and removes a task', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('아직 적어둔 일이 없어요.')).toBeVisible();
  await page.getByLabel('새 할 일').fill('프로젝트 정리하기');
  await page.getByRole('button', { name: /추가/ }).click();
  await expect(page.getByRole('checkbox', { name: '프로젝트 정리하기' })).not.toBeChecked();
  await expect(page.locator('#task-count')).toHaveText('1개');
  await page.reload();
  await expect(page.getByRole('checkbox', { name: '프로젝트 정리하기' })).not.toBeChecked();
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

test('toggles a legacy task with the keyboard and persists both states', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('small-steps.tasks.v1', JSON.stringify([
      { id: 'legacy', title: '이전 할 일' },
    ]));
  });
  await page.reload();

  const checkbox = page.getByRole('checkbox', { name: '이전 할 일' });
  const title = page.getByText('이전 할 일', { exact: true });
  await expect(checkbox).not.toBeChecked();

  await page.getByRole('button', { name: /추가/ }).focus();
  await page.keyboard.press('Tab');
  await expect(checkbox).toBeFocused();
  await expect(checkbox).toHaveCSS('outline-width', '2px');
  await expect(checkbox).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Space');
  await expect(checkbox).toBeFocused();
  await expect(checkbox).toBeChecked();
  await expect(title).toHaveCSS('text-decoration-line', 'line-through');
  await page.reload();
  await expect(checkbox).toBeChecked();

  await checkbox.press('Space');
  await expect(title).toHaveCSS('text-decoration-line', 'none');
  await page.reload();
  await expect(checkbox).not.toBeChecked();

  await checkbox.check();
  await page.getByRole('button', { name: '이전 할 일 삭제' }).click();
  await page.reload();
  await expect(checkbox).toHaveCount(0);
  await expect(page.getByText('아직 적어둔 일이 없어요.')).toBeVisible();
});
