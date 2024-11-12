import { Button, Input, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const lotusCodeInputValue = z.object({
  items: z.array(
    z.object({
      input: z.string().min(1, 'field is required')
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = (data: LotusCodeFormValues) => props.onSubmit?.({ data, reset });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(props.className)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="flex gap-2">
            <Input {...register(`items.${index}.input`)} placeholder={`Input ${index + 1}`} />
            <Button onClick={() => remove(index)}>삭제</Button>
          </div>
          <Text variant="destructive" className="min-h-5 my-2">
            {errors.items?.[index]?.input && errors.items[index].input?.message}
          </Text>
        </div>
      ))}
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
