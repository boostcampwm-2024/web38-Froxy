import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { CreateOverlayElement, OverlayControlRef, OverlayController } from './OverlayController';

interface OverlayContextValue {
  id?: string;
  mount?: (id: string, overlay: React.ReactNode) => void;
  unmount?: (id: string) => void;
}

export const OverlayContext = createContext<OverlayContextValue>({});

const useOverlayContext = () => {
  const { mount, unmount } = useContext(OverlayContext);

  const InvalidContext = !(mount && unmount);

  if (InvalidContext) {
    throw new Error('useOverlay는 OverlayProvider 내에서만 사용할 수 있습니다.');
  }

  return useMemo(() => ({ mount, unmount }), [mount, unmount]);
};

const uniqueId = () => Date.now().toString() + Math.random().toString();

const useUniqueIdRef = () => {
  const id = useRef(uniqueId()).current;
  return id;
};

/**
 * 오버레이를 관리하기 위한 커스텀 훅입니다.
 *
 * @param {Object} [options] - 오버레이에 대한 설정 옵션입니다.
 * @param {boolean} [options.isCloseOnUnmount=true] - 컴포넌트가 언마운트될 때 오버레이를 닫을지 여부를 결정합니다.
 * @returns {Object} - 오버레이를 열고 닫는 메서드를 포함하는 객체를 반환합니다.
 * @returns {Function} return.open - 주어진 React 엘리먼트로 오버레이를 여는 함수입니다.
 * @returns {Function} return.close - 오버레이를 닫는 함수입니다.
 *
 * @example
 * const { open } = useOverlay();
 *
 * open(({isOpen, close})=><div>
 *     <h1>오버레이</h1>
 *     <button onClick={close}>닫기</button>
 *   </div>
 * );
 */
export const useOverlay = ({ isCloseOnUnmount = true }: { isCloseOnUnmount?: boolean } = {}) => {
  const { mount, unmount } = useOverlayContext();
  const id = useUniqueIdRef();

  const overlayRef = useRef<OverlayControlRef | null>(null);

  useEffect(() => {
    return () => {
      if (isCloseOnUnmount) unmount(id);
    };
  }, [id, unmount, isCloseOnUnmount]);

  return useMemo(
    () => ({
      open: (overlayElement: CreateOverlayElement) => {
        mount(
          id,
          <OverlayController
            // NOTE: 상태가 변경되어도 새로운 컴포넌트를 렌더링하기 위해 key를 추가합니다.
            key={Date.now()}
            ref={overlayRef}
            overlayElement={overlayElement}
            onExit={() => {
              unmount(id);
            }}
          />
        );
      },
      close: () => {
        overlayRef.current?.close();
      },
      exit: () => {
        unmount(id);
      }
    }),
    [id, mount, unmount]
  );
};
