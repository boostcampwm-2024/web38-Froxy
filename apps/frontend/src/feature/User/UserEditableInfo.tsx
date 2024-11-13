import { useState } from 'react';
import { Button, Input, Text } from '@froxy/design/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { GoPencil } from 'react-icons/go';
import { z } from 'zod';

interface UserEditableInfoProps {
  label?: string;
  initialValue: string;
  onEditValue: (value: string) => void;
}

const userInfoInputValue = z.object({
  value: z.string().min(1, { message: '입력값이 존재하지 않습니다.' })
});

export function UserEditableInfo({ label = '', initialValue, onEditValue }: UserEditableInfoProps) {
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<{ value: string }>({
    defaultValues: { value: initialValue },
    resolver: zodResolver(userInfoInputValue)
  });

  const onChangeIsEdit = () => {
    setIsEdit(!isEdit);
    if (!isEdit) reset({ value: initialValue });
  };

  const onSubmit = (data: { value: string }) => {
    onEditValue(data.value);
    setIsEdit(false);
  };

  const onError = () => {
    if (errors.value) alert(errors.value.message);
  };

  return (
    <>
      {isEdit ? (
        <>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="flex items-center gap-2">
            <Input className={'min-w-80 mr-4'} {...register('value')} placeholder={`${label} 입력해주세요.`} />
            <Button type="submit">수정하기</Button>
            <Button type="button" onClick={onChangeIsEdit} variant={'secondary'}>
              취소하기
            </Button>
          </form>
        </>
      ) : (
        <div className="flex items-center gap-10">
          <Text size="3xl" className="font-semibold">
            {initialValue}
          </Text>
          <GoPencil className="w-6 h-6" onClick={onChangeIsEdit} />
        </div>
      )}
    </>
  );
}
