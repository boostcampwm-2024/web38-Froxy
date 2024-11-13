import { Button, Input } from '@froxy/design/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface UserEditableInfoProps {
  value: string;
  onToggleIsEdit: () => void;
  onEditValue: (value: string) => void;
}

const userInfoInputValue = z.object({
  value: z.string().min(1, { message: '입력값이 존재하지 않습니다.' })
});

export function UserInfoInputForm({ value, onToggleIsEdit, onEditValue }: UserEditableInfoProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<{ value: string }>({
    defaultValues: { value: value },
    resolver: zodResolver(userInfoInputValue)
  });

  const onSubmit = (data: { value: string }) => {
    onEditValue(data.value);
    reset();
    onToggleIsEdit();
  };

  const onError = () => {
    if (errors.value) alert(errors.value.message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex items-center gap-2">
      <Input className={'min-w-80 mr-4'} {...register('value')} placeholder={`값을 입력해주세요.`} />
      <Button type="submit">수정하기</Button>
      <Button type="button" onClick={onToggleIsEdit} variant={'secondary'}>
        취소하기
      </Button>
    </form>
  );
}
