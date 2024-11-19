import { useEffect } from 'react';
import { Heading, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useTimer } from '@/shared/hooks/useTimer';

export interface ToastProps {
  variant?: 'default' | 'success' | 'error';
  title?: string;
  description?: string;
  action?: React.ReactNode;
  isOpen: boolean;
  close: () => void;
  duration?: number;
}

const TOAST_VARIANT_STYLE = {
  default: 'bg-white text-black',
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800'
};

export function Toast({
  variant = 'default',
  title,
  description,
  action,
  isOpen,
  close,
  duration = Infinity
}: ToastProps) {
  const { time, pauseTimer, startTimer } = useTimer(() => close(), duration);

  const progress = ((duration - time) / duration) * 100;

  useEffect(() => {
    if (isOpen) startTimer();

    return () => pauseTimer();

    //NOTE: timer와 startTimer를 deps에 추가하면 무한루프가 발생합니다.
  }, [isOpen, duration, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            TOAST_VARIANT_STYLE[variant],
            'w-96 h-20 rounded-md shadow-lg border-[0.1rem] m-5 p-2 px-4 border-gray-300 fixed bottom-0 right-0'
          )}
          key="toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onMouseEnter={pauseTimer}
          onMouseLeave={startTimer}
        >
          <div className="w-full inline-flex justify-between items-center">
            <div className="grid gap-1">
              {title && <Heading size={'sm'}>{title}</Heading>}
              {description && <Text size={'sm'}>{description}</Text>}
            </div>
            {action}
          </div>

          {duration !== Infinity && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
              <div
                className="h-1 bg-black"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.01s linear'
                }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
