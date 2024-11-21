import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, test, vitest } from 'vitest';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';

const renderComponent = ({ children, fallback, handleError }: ErrorBoundaryProps) => {
  render(
    <ErrorBoundary fallback={fallback} handleError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

const ErrorComponent = () => {
  throw new Error('Error');
};

describe('ErrorBoundary', () => {
  beforeAll(() => {
    vitest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    vitest.restoreAllMocks();
  });

  test('ErrorBoundary의 자식 컴포넌트에서 에러가 발생하지 않으면 자식 컴포넌트를 렌더링 한다.', () => {
    renderComponent({
      children: <div role="child">test</div>,
      fallback: () => <div>Error</div>
    });

    const child = screen.getByRole('child');

    expect(child).toBeInTheDocument();
  });

  test('ErrorBoundary의 자식 컴포넌트에서 에러가 발생하면 fallback을 렌더링 한다.', () => {
    renderComponent({
      children: <ErrorComponent />,
      fallback: () => <div role="error">Error</div>
    });

    const error = screen.getByRole('error');

    expect(error).toHaveTextContent('Error');
  });

  test('fallback은 error를 전달받는다.', () => {
    renderComponent({
      children: <ErrorComponent />,
      fallback: ({ error }) => <div role="error">{String(error)}</div>
    });

    const error = screen.getByRole('error');

    expect(error).toHaveTextContent('Error');
  });

  test('fallback의 reset을 호출하면 에러를 초기화한다.', () => {
    renderComponent({
      children: <ErrorComponent />,
      fallback: ({ reset }) => <button onClick={reset}>Reset</button>
    });

    const button = screen.getByRole('button');
    const error = screen.queryByRole('error');

    button.click();

    expect(error).not.toBeInTheDocument();
  });

  test('handleError가 주어지면 에러가 발생할 때 호출된다.', () => {
    const handleError = vitest.fn();

    renderComponent({
      children: <ErrorComponent />,
      fallback: () => <div>Error</div>,
      handleError
    });

    expect(handleError).toHaveBeenCalled();
  });
});
