import React, { useId } from 'react';
import './formgroup.css';

type BaseProps = {
  /** Related form controls (checkboxes, radios, inputs) being grouped. */
  children: React.ReactNode;
  /** Group-level error, e.g. "Select at least one option." */
  error?: string;
  /** Supporting hint text rendered below the legend. */
  description?: string;
  required?: boolean;
};

type WithLegend = BaseProps & {
  legend: string;
  ariaLabel?: never;
};

type WithAriaLabel = BaseProps & {
  legend?: never;
  ariaLabel: string;
};

export type FormGroupProps = WithLegend | WithAriaLabel;

export function FormGroup({
  children,
  error,
  description,
  required = false,
  ...rest
}: FormGroupProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const legend = 'legend' in rest ? rest.legend : undefined;
  const ariaLabel = 'ariaLabel' in rest ? rest.ariaLabel : undefined;

  return (
    // <fieldset>/<legend> is the native grouping primitive for related
    // controls — screen readers announce the legend as context for every
    // control inside, which a <div role="group"> + aria-labelledby only
    // approximates. aria-label covers the rare case of a group whose name
    // shouldn't render visually.
    <fieldset
      aria-label={!legend ? ariaLabel : undefined}
      aria-describedby={describedBy}
      className={`form-group ${error ? 'form-group--error' : ''}`}
    >
      {legend && (
        <legend className="form-group__legend">
          {legend}
          {required && (
            <>
              <span aria-hidden="true" className="form-group__required-mark">
                {' '}
                *
              </span>
              <span className="form-group__sr-only"> (required)</span>
            </>
          )}
        </legend>
      )}

      {description && (
        <p id={descriptionId} className="form-group__description">
          {description}
        </p>
      )}

      <div className="form-group__content">{children}</div>

      {error && (
        <span id={errorId} role="alert" className="form-group__error">
          {error}
        </span>
      )}
    </fieldset>
  );
}
