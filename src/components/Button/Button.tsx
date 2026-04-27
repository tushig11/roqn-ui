import React from 'react';
import './button.css';

type BaseButtonProps = {
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

type ButtonWithText = BaseButtonProps & {
  children: React.ReactNode;
  ariaLabel?: never;
};

type IconOnlyButton = BaseButtonProps & {
  icon: React.ReactNode;
  children?: never;
  ariaLabel: string;
};

export type ButtonProps = ButtonWithText | IconOnlyButton;

export function Button({
  children,
  ariaLabel,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-label={!children ? ariaLabel : undefined}
      aria-busy={loading || undefined}
      onClick={!isDisabled ? onClick : undefined}
      className={`btn btn--${variant} ${isDisabled ? 'btn--disabled' : ''}`}
    >
      {loading && (
        <span role="status" aria-live="polite" className="btn__loader">
          Loading...
        </span>
      )}

      {children && <span className="btn__content">{children}</span>}
    </button>
  );
}
