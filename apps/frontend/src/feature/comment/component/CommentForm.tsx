import { HTMLProps, useState } from 'react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { CommentEditor, CommentViewer } from './Comment';

type CommentProps = {
  children?: string;
  onSubmit?: (comment: string) => void;
} & HTMLProps<HTMLDivElement>;

export function CommentForm({ className, onSubmit, ...props }: CommentProps) {
  const [comment, setComment] = useState<string>(props.children || '');

  const tw = cn('rounded-md', className);

  return (
    <Tabs defaultValue="Write" className={tw}>
      <TabsList className="grid w-1/4 grid-cols-2">
        <TabsTrigger value="Write">Write</TabsTrigger>
        <TabsTrigger value="Preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="Write">
        <CommentEditor
          className="min-h-40 comment-editor"
          placeholder="Leave a Comment"
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
        />
      </TabsContent>
      <TabsContent value="Preview">
        <CommentViewer className="github rounded-md border-[1px] border-gray-300 min-h-40" children={comment} />
      </TabsContent>
      <div className="flex justify-end">
        <Button className="my-1" disabled={comment === ''} onClick={() => onSubmit?.(comment)}>
          Comment
        </Button>
      </div>
    </Tabs>
  );
}
