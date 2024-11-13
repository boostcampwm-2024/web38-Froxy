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

export type LotusCodeFormValues = z.infer<typeof lotusCodeInputValue>;

interface LotusCodeInputFormProps {
  className?: string;
  onSubmit?: (args: { data: LotusCodeFormValues; reset: () => void }) => void;
}

export function LotusCodeInputForm(props: LotusCodeInputFormProps) {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LotusCodeFormValues>({
    defaultValues: lotusCodeInputValue.parse({ items: [] }),
    resolver: zodResolver(lotusCodeInputValue)
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = (data: LotusCodeFormValues) => props.onSubmit?.({ data, reset });

  const handleReorder = (newFields: typeof fields) => {
    const firstDiffIndex = fields.findIndex((field, index) => field.id !== newFields[index].id);

    if (firstDiffIndex === -1) return;

    const newIndex = newFields.findIndex((field) => field.id === fields[firstDiffIndex].id);

    swap(firstDiffIndex, newIndex);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(props.className)}>
      <Reorder.Group drag="y" values={fields} onReorder={handleReorder}>
        {fields.map((field, index) => (
          <Reorder.Item key={field.id} value={field} className="hover:cursor-move">
            <div className="flex gap-2 items-center">
              <Text size="lg" className="w-10">
                {index + 1}번
              </Text>
              <Input {...register(`items.${index}.input`)} placeholder={`Input ${index + 1}`} />
              <Button onClick={() => remove(index)}>삭제</Button>
            </div>

            <Text variant="destructive" className="min-h-5 my-2 pl-12">
              {errors.items?.[index]?.input && errors.items[index].input?.message}
            </Text>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button variant={'outline'} className="block w-full my-5" onClick={() => append({ input: '' })}>
        새로운 항목 추가
      </Button>
      <div className="flex gap-2">
        <Button className="w-full" variant={'secondary'} onClick={() => reset()}>
          취소하기
        </Button>
        <Button className="w-full" type="submit">
          완료하기
        </Button>
      </div>
    </form>
  );
}
