import { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export type AsyncBoundaryProps = {
  children: React.ReactNode;
  pending: React.ReactNode;
  rejected: (args: { error: unknown; retry: () => void }) => React.ReactNode;
  handleError?: (error: unknown) => void;
};

/**
 * `AsyncBoundary` 컴포넌트는 비동기 작업의 경계(boundary)를 설정하여 에러와 로딩 상태를 처리합니다.
 *
 * @param {React.ReactNode} props.children - 비동기 작업이 완료되었을 때 렌더링할 자식 요소들
 * @param {React.ReactNode} props.pending - 비동기 작업이 진행 중일 때 렌더링할 대기 요소
 * @param {(error: Error, retry: () => void) => React.ReactNode} props.rejected - 비동기 작업이 실패했을 때 렌더링할 에러 처리 요소
 * @param {(error: unknown) => void} [props.handleError] - 에러가 발생했을 때 추가적인 처리를 위한 콜백 함수
 *
 * @returns {JSX.Element} 에러 경계와 서스펜스를 포함한 JSX 요소
 *
 * @example
 * ```tsx
 * <AsyncBoundary
 *   pending={<div>Loading...</div>}
 *   rejected={({ error, retry }) => (
 *     <div>
 *       <p>Error: {error.message}</p>
 *       <button onClick={retry}>Retry</button>
 *     </div>
 *   )}
 * >
 *   <MyAsyncComponent />
 * </AsyncBoundary>
 * ```
 */
export function AsyncBoundary(props: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallback={({ error, reset }) => props.rejected({ error, retry: reset })}>
      <Suspense fallback={props.pending}>{props.children}</Suspense>
    </ErrorBoundary>
  );
}
