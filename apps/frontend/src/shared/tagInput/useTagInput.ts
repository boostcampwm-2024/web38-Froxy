import { useRef, useState } from 'react';

export const useTagInput = (value: string[], onChange: (tags: string[]) => void) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const addTag = (tagValue: string) => {
    if (tagValue.trim()) {
      onChange([...value, tagValue.trim()]);

      if (inputRef.current?.value) inputRef.current.value = '';
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키 입력 시
    if (event.key === 'Enter') {
      event.preventDefault();

      // 입력 중이 아닐 때만 태그 추가
      if (!isComposing && inputRef.current) {
        addTag(inputRef.current.value);
      }
    }
  };

  const removeTag = (index: number) => {
    const updated = value.filter((_, i) => index !== i);
    onChange(updated);
  };

  return { inputRef, setIsComposing, onInputKeyDown, removeTag };
};
