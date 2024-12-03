import test, { expect } from '@playwright/test';

// 근데 깃허브 소셜 로그인인데 어떻게 테스트해...?
test('온보딩 페이지에서 로그인 버튼을 누르면 로그인된다.', async ({ page }) => {
  // Given
  await page.goto('http://localhost:5173');

  // When
  await page.getByRole('button', { name: 'GitHub로 로그인하기' }).click();

  const createLotusButton = page.getByRole('button', { name: 'Create Lotus' });
  const logoutButton = page.getByRole('button', { name: 'Logout' });
  await createLotusButton.waitFor();

  // Then: 버튼이 존재하는지 확인
  expect(await createLotusButton.isVisible()).toBe(true);
  expect(await logoutButton.isVisible()).toBe(true);
});
