import { HTMLProps } from 'react';
import { cn } from '@froxy/design/utils';

type ModalBoxProps = {
  onClose: () => void;
} & HTMLProps<HTMLDivElement>;

export function ModalBox({ children, className, onClose, ...props }: ModalBoxProps) {
  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleClose}
      className={cn('fixed inset-0 z-50 flex justify-center items-center bg-opacity-40 bg-gray-500', className)}
      {...props}
    >
      {children}
    </div>
  );
}
