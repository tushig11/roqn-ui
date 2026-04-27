import React, { useId } from 'react';
import './input.css';

type BaseProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

type WithLabel = BaseProps & {
  label: string;
  ariaLabel?: never;
};

type WithAriaLabel = BaseProps & {
  label?: never;
  ariaLabel: string;
};

export type InputProps = WithLabel | WithAriaLabel;

export function Input({
  label,
  ariaLabel,
  value,
  onChange,
  error,
}: InputProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="input-field">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <input
        id={id}
        value={value}
        onChange={onChange}
        aria-label={!label ? ariaLabel : undefined}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`input ${error ? 'input--error' : ''}`}
      />

      {error && (
        <span id={errorId} role="alert" className="input-error">
          {error}
        </span>
      )}
    </div>
  );
}
