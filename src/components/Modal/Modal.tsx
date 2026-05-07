import React, { useEffect, useId, useRef } from 'react';
import './modal.css';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
    el => !el.closest('[hidden]') && !el.closest('[inert]')
  );
}

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /**
   * Use for destructive or irreversible actions. Switches role to "alertdialog",
   * which screen readers announce with urgency. Misusing this for routine dialogs
   * trains users to ignore the urgency cue.
   */
  isAlert?: boolean;
  /**
   * Whether clicking the backdrop closes the modal. Default true.
   * Set to false for destructive or irreversible flows where accidental
   * dismissal could be harmful.
   */
  closeOnBackdropClick?: boolean;
  /**
   * Whether to render the built-in close button. Default true.
   * Set to false when you provide your own dismiss control inside children.
   */
  showCloseButton?: boolean;
  /** Label for the built-in close button. Default "Close". */
  closeLabel?: string;
};

type ModalWithTitle = BaseModalProps & {
  title: string;
  ariaLabel?: never;
};

type ModalWithAriaLabel = BaseModalProps & {
  title?: never;
  ariaLabel: string;
};

export type ModalProps = ModalWithTitle | ModalWithAriaLabel;

export function Modal({
  open,
  onClose,
  children,
  isAlert = false,
  closeOnBackdropClick = true,
  showCloseButton = true,
  closeLabel = 'Close',
  ...rest
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const returnFocusRef = useRef<Element | null>(null);

  const title = 'title' in rest ? rest.title : undefined;
  const ariaLabel = 'ariaLabel' in rest ? rest.ariaLabel : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      returnFocusRef.current = document.activeElement;
      // Simplified scroll lock — breaks if multiple modals/drawers are stacked.
      // A ref-counted approach is needed for production multi-modal usage.
      document.body.style.overflow = 'hidden';
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          // Dialog may already be open or in an invalid state (e.g. not attached to DOM).
        }
      }
      // Prefer first interactive child so the SR announces the dialog title
      // alongside the focused element. Fall back to the dialog itself so focus
      // is never left outside the modal (e.g. text-only content).
      (getFocusable(dialog)[0] ?? dialog).focus();
    } else {
      document.body.style.overflow = '';
      if (dialog.open) dialog.close();
      if (returnFocusRef.current instanceof HTMLElement) {
        returnFocusRef.current.focus();
      }
    }
  }, [open]);

  // Belt-and-suspenders Tab trap alongside showModal()'s native trap.
  // Handles browser/AT combinations where the native trap is incomplete.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable(dialog!);
      if (focusable.length === 0) {
        // Only the dialog itself has focus; keep it trapped there.
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Release scroll lock if the component unmounts while open.
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function handleCancel(e: React.SyntheticEvent) {
    e.preventDefault();
    onClose();
  }

  // Clicks on the ::backdrop fire with the <dialog> itself as the target,
  // not any of its children — so this check safely distinguishes backdrop from content.
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (closeOnBackdropClick && e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      // tabIndex={-1} makes the dialog a focusable fallback when it has no
      // interactive children (e.g. text-only content or image lightboxes).
      tabIndex={-1}
      // aria-modal tells screen readers to treat content outside as inert.
      // Without it, NVDA+Chrome lets the virtual cursor escape the dialog
      // even though keyboard focus is correctly trapped by showModal().
      aria-modal="true"
      role={isAlert ? 'alertdialog' : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-label={ariaLabel}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="modal"
    >
      {title && (
        <h2 id={titleId} className="modal__title">
          {title}
        </h2>
      )}
      <div className="modal__content">{children}</div>
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="modal__close"
        >
          <span aria-hidden="true">✕</span>
          <span className="modal__close-label">{closeLabel}</span>
        </button>
      )}
    </dialog>
  );
}
