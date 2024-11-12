import { HTMLProps } from 'react';
import { Heading, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { CommentViewer } from './Comment';
import { Time } from '@/shared/components/Time';

// Todo : UserFeature 추가 이후 author를 User로 타입 변경
interface CommentValue {
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

  const tw = cn('p-5 m-5 border-2 border-gray-300 rounded-md', className);

  return (
    <div className={tw} {...props}>
      <div className="flex gap-5 items-center">
        <img className="w-10 h-10 rounded-full" src={author.profile} alt={author.nickname} />
        <div className="flex items-baseline gap-2">
          <Heading>{author.nickname}</Heading>
          <Text size="sm" asChild>
            <Time date={updatedAt} />
          </Text>
        </div>
      </div>
      <CommentViewer className="github">{content}</CommentViewer>
    </div>
  );
}
