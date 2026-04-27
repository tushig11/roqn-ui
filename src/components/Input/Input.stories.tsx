// Input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const WithVisibleLabel: Story = {
  render: () => {
    const [email, setEmail] = useState('');

    return (
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    );
  },
};

export const WithAriaLabel: Story = {
  render: () => {
    const [q, setQ] = useState('');

    return (
      <Input
        ariaLabel="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [email, setEmail] = useState('');

    return (
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error="Email is required."
      />
    );
  },
};

export const CompileErrorExamples: Story = {
  render: () => (
    <div style={{ maxWidth: 640, fontFamily: 'sans-serif' }}>
      <h3 style={{ marginBottom: 12 }}>
        ❌ Compile-time enforcement examples
      </h3>

      <div style={{ marginBottom: 16 }}>
        <p style={{ marginBottom: 6, fontWeight: 600 }}>
          No accessible name:
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
          }}
        >
{`<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>`}
        </pre>
      </div>

      <div>
        <p style={{ marginBottom: 6, fontWeight: 600 }}>
          Both label and ariaLabel provided:
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
          }}
        >
{`<Input
  label="Email"
  ariaLabel="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>`}
        </pre>
      </div>
    </div>
  ),
};
