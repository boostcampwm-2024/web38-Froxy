import { Button, Input, Text } from '@froxy/design/components';
import { GoPencil } from 'react-icons/go';
import { useEditInfo } from './useEditInfo';

interface UserEditableInfoProps {
  label?: string;
  initialValue: string;
  editValue: (value: string) => void;
}

export function UserEditableInfo({ label = '', initialValue, editValue }: UserEditableInfoProps) {
  const { isEdit, value, toggleEdit, onChangeValue, onSubmitEditValue, onEditInputKeyDown } = useEditInfo({
    initialValue,
    editValue
  });

  return (
    <>
      {isEdit ? (
        <div className="flex items-center gap-2">
          <Input
            className={'min-w-[21rem] mr-4'}
            value={value}
            onChange={onChangeValue}
            placeholder={`${label} 입력해주세요.`}
            onKeyDown={onEditInputKeyDown}
          />
          <Button onClick={() => onSubmitEditValue(value)}>수정하기</Button>
          <Button onClick={() => toggleEdit(false)} variant={'secondary'}>
            취소하기
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-10">
          <Text size="3xl" variant="semiBold">
            {initialValue}
          </Text>
          <GoPencil className="w-6 h-6" onClick={() => toggleEdit(true)} />
        </div>
      )}
    </>
  );
}
