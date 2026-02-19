import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps } from './Modal.types';
import { useModal } from './Modal.hooks';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Body: React.FC<ModalBodyProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  preventScroll = true,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);
  const { modalRef, handleOverlayClick } = useModal({
    isOpen,
    onClose,
    closeOnEsc,
    closeOnClickOutside,
    preventScroll,
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  if (!isOpen) return null;

  // Render header with title if provided
  const renderHeader = () => {
    if (!title && !showCloseButton) return null;
    
    return (
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-medium text-gray-900" id="modal-title">
              {title}
            </h3>
          )}
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleOverlayClick}
        />

        {/* Modal Panel */}
        <div
          ref={modalRef}
          className={`
            relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl
            transition-all sm:my-8 sm:w-full ${sizeClasses[size]} ${className}
          `}
        >
          {renderHeader()}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

const Header: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  showCloseButton,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        {title && (
          <h3 className="text-lg font-medium text-gray-900" id="modal-title">
            {title}
          </h3>
        )}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const Body: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

const Footer: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;