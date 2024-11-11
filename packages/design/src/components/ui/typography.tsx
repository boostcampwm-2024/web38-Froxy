import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

const TypographyVariants = {
  bold: 'font-bold',
  muted: 'text-gray-500',
  destructive: 'text-red-500',
  none: ''
};

const HeadingSize = {
  '2xl': 'text-4xl font-bold',
  xl: 'text-3xl font-bold',
  lg: 'text-2xl font-bold',
  md: 'text-xl font-bold',
  sm: 'text-lg font-bold'
} as const;

type HeadingProps = {
  asChild?: boolean;
  size?: keyof typeof HeadingSize;
  variant?: keyof typeof TypographyVariants;
} & React.HTMLAttributes<HTMLHeadingElement>;

export function Heading({ asChild, size = 'md', variant = 'none', className, ...props }: HeadingProps) {
  const Element = asChild ? Slot : 'h1';

  const tw = cn(HeadingSize[size], TypographyVariants[variant], className);

  return <Element className={tw} {...props} />;
}

const TextSize = {
  xl: 'text-xl',
  lg: 'text-lg',
  md: 'text-base',
  sm: 'text-sm'
} as const;

type TextProps = {
  asChild?: boolean;
  size?: keyof typeof TextSize;
  variant?: keyof typeof TypographyVariants;
} & React.HTMLAttributes<HTMLParagraphElement>;

export function Text({ asChild, size = 'md', variant = 'none', className, ...props }: TextProps) {
  const Element = asChild ? Slot : 'p';

  const tw = cn(TextSize[size], TypographyVariants[variant], className);

  return <Element className={tw} {...props} />;
}
