import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vitest } from 'vitest';
import { useDebounce } from './useDebounce';

const testFn = vitest.fn(() => console.log('executed'));

const delay = 300;

describe('useDebounce', () => {
  beforeEach(() => {
    vitest.useFakeTimers();
    testFn.mockClear();
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  test('delay값만큼 시간이 지나기 전에는 함수가 호출되지 않아야 한다.', () => {
    //Given
    const { result } = renderHook(() => useDebounce(testFn, delay));

    //When
    result.current();
    vitest.advanceTimersByTime(299);

    //Then
    expect(testFn).not.toHaveBeenCalled();
  });

  test('delay값만큼 시간이 지났을 때 함수가 호출되어야 한다.', () => {
    //Given
    const { result } = renderHook(() => useDebounce(testFn, delay));

    //When
    result.current();
    vitest.advanceTimersByTime(300);

    //Then
    expect(testFn).toHaveBeenCalledTimes(1);
  });

  test('연속 호출 시에 이전 타이머가 취소되어 이전 호출은 실행되지 않아야 한다.', () => {
    //Given
    const { result } = renderHook(() => useDebounce(testFn, delay));

    //When
    result.current();
    vitest.advanceTimersByTime(200);

    result.current();
    vitest.advanceTimersByTime(299);

    //Then
    expect(testFn).not.toHaveBeenCalled();
  });

  test('연속 호출 시에 이전 타이머가 취소되고 마지막 호출만 실행되어야 한다.', () => {
    //Given
    const { result } = renderHook(() => useDebounce(testFn, delay));

    //When
    result.current();
    vitest.advanceTimersByTime(200);

    result.current();
    vitest.advanceTimersByTime(300);

    //Then
    expect(testFn).toHaveBeenCalledTimes(1);
  });
});
