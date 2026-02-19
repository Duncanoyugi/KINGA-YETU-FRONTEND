import { useEffect, useRef, useCallback } from 'react';

interface UseModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnEsc?: boolean;
  closeOnClickOutside?: boolean;
  preventScroll?: boolean;
}

export const useModal = ({
  isOpen,
  onClose,
  closeOnEsc = true,
  closeOnClickOutside = true,
  preventScroll = true,
}: UseModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Prevent body scroll
  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (preventScroll) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, preventScroll]);

  // Handle click outside
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        closeOnClickOutside &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [closeOnClickOutside, onClose]
  );

  return {
    modalRef,
    handleOverlayClick,
  };
};