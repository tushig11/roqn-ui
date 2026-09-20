import React, { useId } from 'react';
import './input.css';

type BaseProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
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
  required = false,
}: InputProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="input-field">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="input-label__required-mark"> *</span>
              <span className="input__sr-only"> (required)</span>
            </>
          )}
        </label>
      )}

      {/* This is the sanctioned primitive implementation the roqn/no-raw-interactive-elements rule steers consumers toward. */}
      {/* eslint-disable-next-line roqn/no-raw-interactive-elements -- this is that primitive */}
      <input
        id={id}
        value={value}
        onChange={onChange}
        aria-label={!label ? ariaLabel : undefined}
        aria-invalid={!!error}
        aria-describedby={errorId}
        required={required}
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
