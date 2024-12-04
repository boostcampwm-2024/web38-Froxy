import test, { expect } from '@playwright/test';

test('온보딩 페이지에서 "공개 프로젝트 보러가기" 버튼을 누르면 public Lotus 목록을 볼 수 있다.', async ({ page }) => {
  // Give
  await page.goto('/');

  // When
  await page.getByRole('button', { name: '공개 프로젝트 보러가기' }).click();
  await page.waitForSelector('[data-testid="lotus-title"]');
  const lotusComponents = await page.getByTestId('lotus-title').count();

  // then
  await expect(page.getByText('Lotus는 gist 저장소들을 의미합니다')).toBeVisible();
  expect(lotusComponents).toBeGreaterThan(0);
  await expect(page.getByText('1', { exact: true })).toBeVisible();
});

test('Lotus 목록 페이지에서 제목 검색이 가능해야 한다.', async ({ page }) => {
  // Give
  const searchText = 'test';
  await page.goto('/lotus');

  // When
  await page.getByPlaceholder('제목을 검색해주세요').click();
  await page.getByPlaceholder('제목을 검색해주세요').fill(searchText);
  await page.getByRole('button', { name: '검색하기' }).click();

  await page.waitForSelector('[data-testid="lotus-title"]', { timeout: 3000 }).catch(() => {});
  const lotusTitles = await page.getByTestId('lotus-title').allTextContents();

  // then
  const hasInvalidTitle = lotusTitles?.some((title) => !title.includes(searchText));
  expect(hasInvalidTitle).toBe(false);
});

test('Lotus 목록 페이지에서 Lotus 카드를 클릭하면 Lotus 상세 페이지로 이동한다.', async ({ page }) => {
  // Given
  await page.goto('/lotus');

  // When
  const lotusLink = page.getByTestId('lotus-link').first();
  const expectedUrl = await lotusLink.getAttribute('href');
  await lotusLink.click();
  await page.waitForLoadState('load');

  // Then
  const currentUrl = page.url();
  expect(currentUrl).toBe('http://localhost:5173' + expectedUrl);
});
