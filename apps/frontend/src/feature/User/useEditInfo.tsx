import { useState } from 'react';

interface UserEditInfoProps {
  initialValue: string;
  editValue: (value: string) => void;
}

export function useEditInfo({ initialValue, editValue }: UserEditInfoProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(initialValue);

  const toggleEdit = (edit: boolean) => {
    setIsEdit(edit);
    setValue(initialValue);
  };

  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onSubmitEditValue = (value: string) => {
    editValue(value);
    toggleEdit(false);
  };

  const onEditInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onSubmitEditValue(value);
  };

  return {
    isEdit,
    value,
    toggleEdit,
    onChangeValue,
    onSubmitEditValue,
    onEditInputKeyDown
  };
}
