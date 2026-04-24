import React from 'react';

type BaseButtonProps = {
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
};

type ButtonWithText = BaseButtonProps & {
  children: React.ReactNode;
  ariaLabel?: never;
};

type IconOnlyButton = BaseButtonProps & {
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
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-label={!children ? ariaLabel : undefined}
      aria-busy={loading || undefined}
      onClick={!isDisabled ? onClick : undefined}
    >
      {loading && (
        <span role="status" aria-live="polite">
          Loading...
        </span>
      )}

      {children}
    </button>
  );
}
