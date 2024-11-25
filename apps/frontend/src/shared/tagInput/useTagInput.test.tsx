import { fireEvent, render, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vitest } from 'vitest';
import { useTagInput } from './useTagInput';

const mockOnChange = vitest.fn();

function TagInputComponent({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const { inputRef, onInputKeyDown } = useTagInput(value, onChange);

  return <input ref={inputRef} onKeyDown={onInputKeyDown} aria-label="tag-input" />;
}

describe('useTagInput', () => {
  beforeEach(() => {
    vitest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vitest.restoreAllMocks();
  });

  test('Enter 키 입력으로 태그가 추가되어야 한다.', () => {
    //Given
    const { getByLabelText } = render(<TagInputComponent value={[]} onChange={mockOnChange} />);
    const input = getByLabelText('tag-input');

    //When
    fireEvent.change(input, { target: { value: 'new tag' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    //Then
    expect(mockOnChange).toHaveBeenCalledWith(['new tag']);
    expect(input).toHaveValue('');
  });

  test('공백 문자열은 태그로 추가되지 않아야 한다.', () => {
    //Given
    const { getByLabelText } = render(<TagInputComponent value={[]} onChange={mockOnChange} />);
    const input = getByLabelText('tag-input');

    //When
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    //Then
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('removeTag 함수는 해당 태그를 삭제시켜야한다.', () => {
    //Given
    const initialTags = ['tag1', 'tag2', 'tag3'];
    const { result } = renderHook(() => useTagInput(initialTags, mockOnChange));

    //When
    result.current.removeTag(0);

    //Then
    expect(mockOnChange).toHaveBeenCalledWith(['tag2', 'tag3']);
  });
});
