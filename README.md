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

## Storybook

Storybook is used to:

- demonstrate valid usage patterns
- surface component states (default, error, loading, disabled)
- document compile-time enforcement through examples
- provide a consistent visual reference with minimal styling

## Roadmap

Planned examples:
- Design tokens for contrast and focus states
- Form group patterns
- Linting and validation examples
- Documentation examples for downstream teams
