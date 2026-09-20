# roqn-ui

Early reference implementation of accessibility-enforced component patterns.

## Purpose

This repository demonstrates how accessibility requirements can be embedded directly into reusable component APIs and system architecture, rather than relying on each developer to manually apply accessibility rules feature by feature.

This is not presented as a completed product. It is an initial implementation artifact supporting a broader methodology for system-level accessibility enforcement.

## Core Idea

Accessibility should be produced by default when reusable components are used correctly.

This approach reduces reliance on post-implementation accessibility audits by shifting responsibility into system design.

Instead of treating accessibility as a post-development audit item, this approach moves key accessibility requirements into:

- component structure
- component interfaces
- type-level constraints
- safe defaults
- validation patterns
- reusable documentation

## Implemented Examples

### Button

The Button component enforces accessible naming at the type level by requiring either:

- visible text, or
- an ARIA label for icon-only buttons

It also demonstrates:

- safe default button type (`button`)
- disabled and loading state handling
- loading-state announcement (`aria-busy`, `role="status"`)

---

### Input

The Input component enforces accessible naming at the type level by requiring either:

- a visible label, or
- an ARIA label

It also demonstrates:

- programmatic error association (`aria-describedby`)
- validation state exposure (`aria-invalid`)
- consistent structure for label, input, and error messaging
- accessible required-field annotation (visible `*` plus a screen-reader-only "(required)" cue, alongside the native `required` attribute)

---

### FormGroup

The FormGroup component provides accessible grouping for related form controls (checkboxes, radios, inputs) using the native `<fieldset>`/`<legend>` primitive.

The component enforces accessible naming at the type level by requiring either:

- a visible legend, or
- an ARIA label

It also demonstrates:

- group-level description and error messaging (`aria-describedby`)
- accessible required-group annotation, matching the pattern used by Input
- native fieldset/legend semantics instead of a `<div role="group">` approximation

---

### Modal

The Modal component demonstrates accessibility-enforced dialog behavior using the native `<dialog>` element combined with API-level accessibility constraints.

The component enforces accessible naming at the type level by requiring either:

- a visible title, or
- an ARIA label

It also demonstrates:

- focus restoration after close
- initial focus management
- keyboard focus trapping fallback behavior
- Escape key handling
- accessible modal semantics (`aria-modal`)
- optional `alertdialog` behavior for destructive flows
- configurable backdrop dismissal behavior
- safe fallback focus behavior for text-only dialogs

The implementation intentionally uses semantic platform behavior (`showModal()`) before introducing custom focus-management abstractions.

This example is intended to demonstrate how accessibility behavior can be embedded directly into reusable component APIs and interaction defaults.

---

### Design Tokens

All color and focus values used across components are defined as CSS custom properties in `src/tokens.css` and referenced by component stylesheets via `@import`.

Tokens are organized by intent, not value:

| Token | Value | Usage |
|---|---|---|
| `--color-interactive` | `#2563eb` | Primary actions, focus rings |
| `--color-interactive-hover` | `#1d4ed8` | Primary action hover |
| `--color-text-on-interactive` | `#ffffff` | Text on primary surfaces |
| `--color-text-primary` | `#111827` | Default body text |
| `--color-text-secondary` | `#374151` | Supporting text |
| `--color-text-muted` | `#6b7280` | De-emphasized text |
| `--color-surface` | `#ffffff` | Default background |
| `--color-surface-subtle` | `#f9fafb` | Slightly elevated surface |
| `--color-surface-hover` | `#f3f4f6` | Hover background |
| `--color-border` | `#d1d5db` | Standard border |
| `--color-border-subtle` | `#e5e7eb` | Subtle border |
| `--color-error` | `#dc2626` | Error and destructive states |
| `--focus-ring` | `2px solid var(--color-interactive)` | Focus outline shorthand |
| `--focus-ring-offset` | `2px` | Focus outline offset |

All contrast pairings meet WCAG AA (4.5:1 for text, 3:1 for UI components).

Tokens can be overridden at the `:root` level in a consuming application to theme the system without modifying component files.

---

## Enforcement Patterns

This repository demonstrates:

- accessible name enforcement (via TypeScript)
- semantic HTML usage
- correct label association
- accessible error association
- safe default behavior
- component-level accessibility rules

## Usage Constraints (Compile-time Enforcement)

The component APIs are designed to prevent incorrect accessibility usage at compile time.

In simple terms, the system does not allow components to be used in ways that would break accessibility requirements.

### Input

#### Accessible name is required

❌ **Invalid usage**: Missing accessible name.

```tsx
<Input value={email} onChange={handleChange} />
```

✅ **Valid usage**: Provide a visible label.

```tsx
<Input label="Email" value={email} onChange={handleChange} />
```

### Avoid conflicting accessible names

❌ **Invalid usage**: Both label and aria-label create a conflict.

```tsx
<Input label="Email" ariaLabel="Email" value={email} onChange={handleChange} />
```

✅ **Valid usage**: Use aria-label only when no visible label is present.

```tsx
<Input ariaLabel="Search" value={query} onChange={handleChange} />
```

## Linting

Type-level enforcement (above) covers this repository's own component APIs. It does not catch accessibility mistakes made with plain HTML/JSX elsewhere in a consuming codebase, so ESLint with [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) is configured in `eslint.config.mjs` as a second, lint-time layer:

```
npm run lint
```

❌ **Caught by lint, not by types**: a raw button with no accessible name.

```tsx
<button onClick={handleSave}><Icon name="save" /></button>
```

✅ Give it a name, or use this repo's `Button`, which requires one at compile time.

```tsx
<button onClick={handleSave} aria-label="Save"><Icon name="save" /></button>
```

### Custom rules (`eslint-plugin-roqn`)

`jsx-a11y` is a generic ruleset. It knows nothing about this repo's own component APIs or design tokens. `eslint-rules/` is a small local ESLint plugin (wired into `eslint.config.mjs` as `roqn/*`) with rules specific to this system, each with unit tests under `eslint-rules/*.test.mjs` (run via `npm run test:lint-rules`).

| Rule | Catches |
|---|---|
| `roqn/no-raw-interactive-elements` | A raw `<button>`, text-like `<input>`, `<dialog>`, or `<fieldset>` where this repo's `Button`/`Input`/`Modal`/`FormGroup` should be used instead. |
| `roqn/no-hardcoded-color` | A hex/rgb/hsl color literal in a `style` prop or a `*color*`-named variable, instead of a token from `src/tokens.css`. |
| `roqn/no-conflicting-accessible-name` | Both a visible-name prop (`label`/`legend`) and `ariaLabel` supplied on the same element, the same conflict the type-level `WithLabel \| WithAriaLabel` unions prevent, but for plain-JS consumers or anywhere the types get bypassed. |
| `roqn/no-placeholder-as-label` | A native `<input>`/`<textarea>` using `placeholder` as its only accessible name. Placeholder text disappears on input and isn't reliably announced. |
| `roqn/require-eslint-disable-justification` | Any `eslint-disable` directive with no explanatory comment directly above it. |

❌ **Caught by `no-raw-interactive-elements`**: reaching for the native element this repo already wraps.

```tsx
<input value={query} onChange={handleChange} />
```

✅ **Valid usage**: use the wrapped component.

```tsx
<Input ariaLabel="Search" value={query} onChange={handleChange} />
```

The four primitives themselves (`Button.tsx`, `Input.tsx`, `Modal.tsx`, `FormGroup.tsx`) are the sanctioned exception. Each disables the rule at its one native element, with a comment saying so. `roqn/require-eslint-disable-justification` enforces that every such disable, including those, carries an explanation.

Rules can still produce false positives against a deliberate pattern. `Modal.tsx` disables `jsx-a11y/click-events-have-key-events` and `jsx-a11y/no-noninteractive-element-interactions` on its backdrop-click handler, with a comment explaining why: dismissal already has a keyboard equivalent (Escape), so the click handler is a mouse-only convenience, not a missing keyboard interaction. Any `eslint-disable` in this codebase should carry that kind of justification, not just suppress the rule.

## Storybook

Storybook is used to:

- demonstrate valid usage patterns
- surface component states (default, error, loading, disabled)
- document compile-time enforcement through examples
- provide a consistent visual reference with minimal styling

## Roadmap

Planned examples:
- Documentation examples for downstream teams
