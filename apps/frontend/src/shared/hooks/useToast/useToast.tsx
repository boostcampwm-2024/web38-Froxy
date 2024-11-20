import { Toast, ToastProps } from './Toast';
import { useOverlay } from '@/shared/hooks/useOverlay';

export const useToast = () => {
  const { open, close } = useOverlay();

  const toast = ({ ...props }: Partial<ToastProps>) => {
    open(({ isOpen, close }) => <Toast isOpen={isOpen} close={close} {...props} />);
  };

  return { toast, close };
};
