import { Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

export interface OverlayControlRef {
  close: () => void;
}

export type CreateOverlayElement = (props: { isOpen: boolean; close: () => void; exit: () => void }) => React.ReactNode;

interface Props {
  overlayElement: CreateOverlayElement;
  onExit: () => void;
}

/**
 * OverlayController 컴포넌트는 오버레이 요소의 상태와 동작을 관리합니다.
 *
 * @param {Object} props - 속성 객체입니다.
 * @param {React.ElementType} props.overlayElement - 제어할 오버레이 요소입니다.
 * @param {Function} props.onExit - 오버레이가 종료될 때 호출되는 콜백 함수입니다.
 * @param {React.Ref} ref - 외부에서 오버레이를 제어하기 위한 참조 객체입니다.
 *
 * @returns {JSX.Element} 제어 속성이 포함된 렌더링된 오버레이 요소입니다.
 *
 * @example
 * const overlayRef = useRef<OverlayControlRef>(null);
 *
 * const handleExit = () => {
 *   console.log('오버레이가 종료되었습니다');
 * };
 *
 * <OverlayController
 *   ref={overlayRef}
 *   overlayElement={MyOverlayComponent}
 *   onExit={handleExit}
 * />
 *
 * // 프로그래밍 방식으로 오버레이를 닫으려면
 * overlayRef.current?.close();
 */
export const OverlayController = forwardRef(function OverlayController(
  { overlayElement: OverlayElement, onExit }: Props,
  ref: Ref<OverlayControlRef>
) {
  const [isOpenOverlay, setIsOpenOverlay] = useState(false);

  const handleOverlayClose = useCallback(() => setIsOpenOverlay(false), []);

  useImperativeHandle(
    ref,
    () => {
      return { close: handleOverlayClose };
    },
    [handleOverlayClose]
  );

  useEffect(() => {
    // NOTE: open 에니메이션이 종종 안열리는 문제를 해결하기 위해 requestAnimationFrame을 사용합니다.
    requestAnimationFrame(() => {
      setIsOpenOverlay(true);
    });
  }, []);

  return <OverlayElement isOpen={isOpenOverlay} close={handleOverlayClose} exit={onExit} />;
});
