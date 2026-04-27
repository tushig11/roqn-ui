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

❌ Invalid  
An input without an accessible name is not allowed.

```tsx
<Input value={email} onChange={handleChange} />
```

✅ Valid
A visible label provides an accessible name.

```tsx
<Input label="Email" value={email} onChange={handleChange} />
```

❌ Invalid
Providing both a visible label and an ARIA label creates conflicting definitions.

```tsx
<Input label="Email" ariaLabel="Email" value={email} onChange={handleChange} />
```

✅ Valid
An ARIA label can be used when no visible label is present.

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

- Modal / Dialog with focus management
- Design tokens for contrast and focus states
- Form group patterns
- Linting and validation examples
- Documentation examples for downstream teams
