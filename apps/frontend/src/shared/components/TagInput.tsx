import { useRef, useState } from 'react';
import { Badge, Button, Input, Text } from '@froxy/design/components';
import { TiDelete } from 'react-icons/ti';

interface TagInputProp {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange }: TagInputProp) {
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

  return (
    <div>
      <Input
        ref={inputRef}
        className="min-w-80 mr-4"
        onKeyDown={onInputKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => {
          setIsComposing(false);
        }}
      />
      <div className="flex flex-wrap gap-2 my-2 p-0 px-1">
        {value.map((tag, i) => (
          <Badge key={i}>
            <Text size="sm">{tag}</Text>
            <Button type="button" className="ml-2 p-0 h-auto" variant={null} onClick={() => removeTag(i)}>
              <TiDelete />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
