import { HTMLProps } from 'react';
import { Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { CommentViewer } from './Comment';
import { Time } from '@/shared/components/Time';

// Todo : UserFeature 추가 이후 author를 User로 타입 변경
export interface CommentValue {
  id: string;
  comment: string;
  updatedAt: Date;
  author: {
    id: string;
    nickname: string;
    profile: string;
  };
}

type CommentCardProps = {
  comment: CommentValue;
} & HTMLProps<HTMLDivElement>;

export function CommentCard({ comment, className, ...props }: CommentCardProps) {
  const { author, updatedAt, comment: content } = comment;

  const tw = cn('px-6 py-5 m-5 border-2 border-slate-200 rounded-[0.75rem]', className);

  return (
    <div className={tw} {...props}>
      <div className="flex gap-3 items-center">
        <img className="w-10 h-10 rounded-full" src={author.profile} alt={author.nickname} />
        <div className="flex items-baseline gap-4">
          <Text size="lg" className="font-semibold">
            {author.nickname}
          </Text>
          <Text size="sm" variant="muted" asChild>
            <Time date={updatedAt} />
          </Text>
        </div>
      </div>
      <CommentViewer className="github">{content}</CommentViewer>
    </div>
  );
}
