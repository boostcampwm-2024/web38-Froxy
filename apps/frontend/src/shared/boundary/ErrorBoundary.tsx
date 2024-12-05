import { Component } from 'react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (args: { error: unknown; reset: () => void }) => React.ReactNode;
  handleError?: (error: unknown) => void;
}

/**
 * ErrorBoundary는 자식 컴포넌트 트리에서 JavaScript 에러를 감지하는 React 컴포넌트입니다.
 * 에러가 발생하면, 제공된 fallback UI를 렌더링합니다.
 *
 * @property children - 에러가 발생하지 않을 때 렌더링될 자식 컴포넌트들.
 * @property fallback - 선택적인 렌더 함수로, 에러가 발생했을 때 표시할 UI를 반환합니다.
 *   이 함수는 `error`와 `reset` 속성이 포함된 객체를 받습니다:
 *   - `error`: ErrorBoundary에서 잡은 에러 객체.
 *   - `reset`: 에러 상태를 초기화하는 함수.
 * @property handleError - 선택적인 콜백 함수로, 에러 발생 시 컴포넌트 외부에서 로그 기록이나 에러 추적 등의 추가 처리를 할 때 사용됩니다.
 *
 * @example
 * ```typescript
 * <ErrorBoundary
 *   fallback={({ error, reset }) => <ErrorFallback error={error} reset={reset} />}
 *   handleError={(error) => console.error("에러가 감지되었습니다:", error)}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  private resetError() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      this.props.handleError?.(this.state.error);

      return this.props.fallback?.({ error: this.state.error, reset: () => this.resetError() });
    }

    return this.props.children;
  }
}
