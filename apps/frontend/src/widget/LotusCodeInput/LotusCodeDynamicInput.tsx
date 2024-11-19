import { useEffect } from 'react';
import { Button, Input, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Reorder } from 'framer-motion';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

export const lotusCodeInputValue = z.object({
  items: z.array(
    z.object({
      input: z.string().min(1, '입력값은 필수 항목입니다.')
    })
  )
});

export type LotusCodeDynamicInputValue = z.infer<typeof lotusCodeInputValue>;

interface LotusCodeDynamicInputProps {
  className?: string;
  onChangeValue?: (data: LotusCodeDynamicInputValue) => void;
  isDisabled?: boolean;
}

export function LotusCodeDynamicInput(props: LotusCodeDynamicInputProps) {
  const {
    register,
    control,
    watch,
    formState: { errors }
  } = useForm<LotusCodeDynamicInputValue>({
    defaultValues: lotusCodeInputValue.parse({ items: [] }),
    resolver: zodResolver(lotusCodeInputValue)
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'items'
  });

  const values = watch();

  const handleReorder = (newFields: typeof fields) => {
    const firstDiffIndex = fields.findIndex((field, index) => field.id !== newFields[index].id);

    if (firstDiffIndex === -1) return;

    const newIndex = newFields.findIndex((field) => field.id === fields[firstDiffIndex].id);

    swap(firstDiffIndex, newIndex);
  };

  useEffect(() => {
    props.onChangeValue?.(values);
  }, [values, props]);

  return (
    <form className={cn(props.className)}>
      <Reorder.Group drag="y" values={fields} onReorder={handleReorder}>
        {fields.map((field, index) => (
          <Reorder.Item key={field.id} value={field} className="hover:cursor-move">
            <div className="flex gap-2 items-center">
              <Text size="lg" className="w-10">
                {index + 1}번
              </Text>
              <Input {...register(`items.${index}.input`)} placeholder={`Input ${index + 1}`} />
              <Button type="button" onClick={() => remove(index)}>
                삭제
              </Button>
            </div>

            <Text variant="destructive" className="min-h-5 my-2 pl-12">
              {errors.items?.[index]?.input && errors.items[index].input?.message}
            </Text>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button type="button" variant={'outline'} className="block w-full my-5" onClick={() => append({ input: '' })}>
        새로운 항목 추가
      </Button>
    </form>
  );
}
