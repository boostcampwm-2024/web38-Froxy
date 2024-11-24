import { Badge, Button, Input, Text } from '@froxy/design/components';
import { TiDelete } from 'react-icons/ti';
import { useTagInput } from './useTagInput';

interface TagInputProp {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange }: TagInputProp) {
  const { inputRef, setIsComposing, onInputKeyDown, removeTag } = useTagInput(value, onChange);

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
        placeholder="태그를 입력해주세요"
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
