import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * 타이머 기능을 제공하는 커스텀 훅입니다.
 *
 * @param callback - 타이머가 완료되었을 때 호출될 함수입니다.
 * @param ms - 타이머의 지속 시간(밀리초)입니다.
 * @returns 현재 시간, 타이머를 일시 중지하는 함수, 타이머를 시작하는 함수를 포함하는 객체를 반환합니다.
 *
 * @example
 * const { time, pauseTimer, startTimer } = useTimer(() => {
 *   console.log('타이머 완료');
 * }, 1000);
 *
 * useEffect(() => {
 *   startTimer();
 *   return () => pauseTimer();
 * }, [startTimer, pauseTimer]);
 */
export const useTimer = (callback: () => void, ms: number) => {
  const [time, setTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pauseTimer = useCallback(() => {
    if (!timerRef.current) return;

    clearInterval(timerRef.current);
  }, []);

  // NOTE: Interval을 사용하여 시간을 증가시키는 로직입니다. 최적화 된 타이머 로직을 고려해봐야 합니다.
  const startTimer = useCallback(() => {
    if (ms === Infinity) return;

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev < ms) return prev + 5;

        clearInterval(timerRef.current!);
        callback();

        return prev;
      });
    }, 5);
  }, [callback, ms]);

  const value = useMemo(() => ({ time, pauseTimer, startTimer }), [time, pauseTimer, startTimer]);

  return value;
};
