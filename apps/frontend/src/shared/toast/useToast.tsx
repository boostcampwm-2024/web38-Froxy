import { Toast, ToastProps } from './Toast';
import { useOverlay } from '@/shared/overlay/useOverlay';

export const useToast = ({ isCloseOnUnmount = true }: { isCloseOnUnmount?: boolean } = {}) => {
  const { open, close, exit } = useOverlay({ isCloseOnUnmount });

  //NOTE: Navigation이 발생할 때 컴포넌트가 언마운트된 이후 자동으로 exit를 실행하지 않는 경우 setTimeout을 사용합니다.
  const closeAndExit = () => {
    close();
    if (!isCloseOnUnmount) setTimeout(exit, 300);
  };

  const toast = ({ ...props }: Partial<ToastProps>) => {
    open(({ isOpen }) => <Toast isOpen={isOpen} close={closeAndExit} {...props} />);
  };

  return { toast, close, exit };
};
