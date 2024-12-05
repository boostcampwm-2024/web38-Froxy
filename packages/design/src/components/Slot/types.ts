import { HTMLProps } from 'react';

export type SlotComponentProps<T> = HTMLProps<T> & { asChild?: true };
