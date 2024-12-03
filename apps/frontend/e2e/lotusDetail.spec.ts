import test, { expect } from '@playwright/test';

test('lotus 상세 페이지에서 코드 실행을 하고 결과를 확인할 수 있다.', async ({ page }) => {
  // Given
  await page.goto('http://localhost:5173/lotus');
  const lotusLink = page.getByTestId('lotus-link').first();
  await lotusLink.click();
  await page.waitForLoadState('load');

  // When
  await page.getByRole('button', { name: '실행하기' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('listbox').click();
  await page.getByRole('button', { name: '새로운 항목 추가' }).click();
  await page.getByPlaceholder('Input').fill('12');
  await page.getByRole('button', { name: '새로운 항목 추가' }).click();
  await page.getByPlaceholder('Input 2').click();
  await page.getByPlaceholder('Input 2').fill('23');
  await page.locator('form').getByRole('paragraph').nth(1).click();
  await page.locator('section').getByRole('button', { name: '실행하기' }).click();

  // Then
  await page.waitForSelector('[data-testid="history-status"]');
  await expect(page.getByText('코드가 실행되었습니다.')).toBeVisible();
  const codeRunStatus = page.getByTestId('history-status').first();
  expect(await codeRunStatus.textContent()).toBe('pending');
});
