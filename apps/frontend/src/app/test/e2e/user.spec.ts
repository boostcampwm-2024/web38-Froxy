import test, { expect } from '@playwright/test';

test('로그인을 안하면 헤더에서 로그인 버튼을 볼 수 있다.', async ({ page }) => {
  // Given
  await page.goto(`/lotus`);

  // When
  const loginButton = page.getByRole('button', { name: 'Login' });
  await loginButton.waitFor({ state: 'visible' });

  // Then
  expect(await loginButton.isVisible()).toBe(true);
});

test('로그인 상태이면 헤더에서 Lotus 작성, 로그인, 프로필을 볼 수 있다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);

  // When
  const createLotusButton = page.getByRole('link', { name: 'Create Lotus' });
  const logoutButton = page.getByRole('button', { name: 'Logout' });
  const profile = page.getByTestId('header-profile');
  await profile.waitFor({ state: 'visible' });

  // Then
  expect(await page.getByText('mockUser님 환영합니다!').isVisible()).toBe(true);
  expect(await createLotusButton.isVisible()).toBe(true);
  expect(await logoutButton.isVisible()).toBe(true);
  expect(await profile.isVisible()).toBe(true);
});

test('로그인 상태이면 헤더에서 Lotus를 생성하기를 통해 Lotus를 생성할 수 있다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);

  // When
  await page.getByRole('link', { name: 'Create Lotus' }).click();

  await page.getByPlaceholder('제목을 입력해주세요').click();
  await page.getByPlaceholder('제목을 입력해주세요').fill('테스트 제목');
  await page.getByPlaceholder('태그를 입력해주세요').click();
  await page.getByPlaceholder('태그를 입력해주세요').fill('tag1');
  await page.getByPlaceholder('태그를 입력해주세요').press('Enter');
  await page.getByPlaceholder('태그를 입력해주세요').fill('tag2');
  await page.getByPlaceholder('태그를 입력해주세요').press('Enter');

  await page.getByRole('combobox').click();
  await page.getByLabel('My First Gist').click();
  await page.getByRole('button', { name: '생성하기' }).click();

  // Then
  await expect(page.getByText('테스트 제목')).toBeVisible();
  await expect(page.getByText('tag1')).toBeVisible();
  await expect(page.getByText('tag2')).toBeVisible();
  await expect(page.getByText('Lotus가 생성되었습니다.')).toBeVisible();
});

test('헤더에서 로그아웃 버튼을 누르면 메인 페이지로 이동한다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);

  // When
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForLoadState('load');

  // Then
  const currentUrl = page.url();
  expect(currentUrl).toBe('http://localhost:5173/');
});

test('헤더에서 프로필 버튼을 누르면 사용자 정보 페이지로 이동한다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);

  // When
  await page.getByTestId('header-profile').click();
  await page.waitForLoadState('load');
  await page.waitForSelector('[data-testid="lotus-title"]');

  // Then
  const lotusComponents = await page.getByTestId('lotus-title').count();
  expect(lotusComponents).toBeGreaterThan(0);
  await expect(page.getByTestId('user-profile')).toBeVisible();
  await expect(page.getByTestId('user-nickname')).toBeVisible();
});

test('사용자 정보 페이지에서 자신의 닉네임을 수정할 수 있다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);

  // When
  await page.getByTestId('header-profile').click();
  await page.getByTestId('user-profile').waitFor({ state: 'visible' });
  await page.locator('.flex > svg').first().click();
  await page.getByPlaceholder('값을 입력해주세요').click();
  await page.getByPlaceholder('값을 입력해주세요').fill('new Nickname');
  await page.getByRole('button', { name: '수정하기' }).click();

  // Then
  await page.getByText('new Nickname').waitFor({ state: 'visible' });
  expect(await page.getByText('new Nickname').isVisible()).toBe(true);
  expect(await page.getByText('닉네임이 수정되었습니다.').isVisible()).toBe(true);
});

test('사용자 정보 페이지에서 자신이 작성한 Lotus 카드를 클릭하면 Lotus 상세 페이지로 이동한다.', async ({ page }) => {
  // Given
  const MOCK_CODE = 'mock-code';
  await page.goto(`/login?code=${MOCK_CODE}`);

  // When
  await page.getByTestId('header-profile').click();
  await page.waitForLoadState('load');
  const lotusLink = page.getByTestId('lotus-link').first();
  const expectedUrl = await lotusLink.getAttribute('href');
  await lotusLink.click();
  await page.waitForLoadState('load');

  // Then
  const currentUrl = page.url();
  expect(currentUrl).toBe('http://localhost:5173' + expectedUrl);
});
