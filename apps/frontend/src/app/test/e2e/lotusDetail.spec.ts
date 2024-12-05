import test, { expect } from '@playwright/test';

test('Lotus 상세 페이지에서 코드 실행을 하고 결과를 확인할 수 있다.', async ({ page }) => {
  // Given
  await page.goto('/lotus');
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

test('Lotus 상세 페이지에서 제목과 태그를 수정할 수 있다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);
  const lotusLink = page.getByTestId('lotus-link').first();
  await lotusLink.click();
  await page.waitForLoadState('load');

  // When
  await page.getByRole('button', { name: '수정하기' }).click();
  await page.getByPlaceholder('제목을 입력해주세요').click();
  await page.getByPlaceholder('제목을 입력해주세요').fill('New Title');
  await page
    .locator('form div')
    .filter({ hasText: /^JavaScript$/ })
    .getByRole('button')
    .click();
  await page.getByPlaceholder('태그를 입력해주세요').click();
  await page.getByPlaceholder('태그를 입력해주세요').fill('new Tag');
  await page.getByPlaceholder('태그를 입력해주세요').press('Enter');
  await page.locator('form').getByRole('button', { name: '수정하기' }).click();

  // Then
  await expect(page.getByText('New Title')).toBeVisible();
  await expect(page.getByText('JavaScript')).toBeHidden();
  await expect(page.getByText('new Tag')).toBeVisible();
  await expect(page.getByText('Lotus가 수정되었습니다.')).toBeVisible();
});

test('Lotus 상세 페이지에서 삭제할 수 있다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);
  const lotusLink = page.getByTestId('lotus-link').first();
  await lotusLink.click();
  await page.waitForLoadState('load');

  // When
  const deleteButton = page.getByRole('button', { name: '삭제하기' });
  await deleteButton.waitFor({ state: 'visible' });
  const deletedTitle = await page.getByTestId('lotus-title').textContent();
  await deleteButton.click();

  await expect(page.getByText('정말로 삭제하시겠습니까?')).toBeVisible();
  await page.getByRole('button', { name: '삭제하기' }).nth(1).click();

  // Then
  await expect(page.getByText('Lotus는 gist 저장소들을 의미합니다')).toBeVisible();
  await page.waitForSelector('[data-testid="lotus-title"]');

  const lotusTitles = await page.getByTestId('lotus-title').allTextContents();
  const isDelete = lotusTitles.every((value) => value !== deletedTitle);
  expect(isDelete).toBe(true);
  await expect(page.getByText('Lotus가 삭제되었습니다.')).toBeVisible();
});

test('Lotus 상세 페이지에서 public을 Private으로 바꾸면 Lotus 목록 페이지에서 사라진다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);
  const lotusLink = page.getByTestId('lotus-link').first();
  await lotusLink.click();
  await page.waitForLoadState('load');

  // When
  const publicSwitch = page.getByRole('switch');
  await publicSwitch.waitFor({ state: 'visible' });
  await publicSwitch.click();
  await page.waitForTimeout(3000);

  const targetTitle = await page.getByTestId('lotus-title').textContent();
  await page.getByRole('button', { name: '로고 Froxy' }).click();

  // Then
  await expect(page.getByText('Lotus는 gist 저장소들을 의미합니다')).toBeVisible();
  await page.waitForSelector('[data-testid="lotus-title"]');

  const lotusTitles = await page.getByTestId('lotus-title').allTextContents();
  const isHidden = lotusTitles.every((value) => value !== targetTitle);
  expect(isHidden).toBe(true);
});
