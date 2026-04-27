// Input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    value: '',
    error: undefined,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label used as the accessible name.',
      table: {
        type: { summary: 'string' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Required when no visible label is provided.',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'Input value.',
      table: {
        type: { summary: 'string' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Called when the input value changes.',
      table: {
        type: {
          summary: '(e: React.ChangeEvent<HTMLInputElement>) => void',
        },
      },
    },
    error: {
      control: 'text',
      description: 'Error message connected to the input via aria-describedby.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
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
    const [query, setQuery] = useState('');

    return (
      <Input
        ariaLabel="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
    <div className="story-doc">
      <h3>❌ Compile-time enforcement examples</h3>

      <div className="story-doc__section">
        <p className="story-doc__label">Input without accessible name:</p>
        <pre className="story-doc__code">
{`<Input value={email} onChange={handleChange} />`}
        </pre>
      </div>

      <div className="story-doc__section">
        <p className="story-doc__label">
          Input with both label and ariaLabel:
        </p>
        <pre className="story-doc__code">
{`<Input
  label="Email"
  ariaLabel="Email"
  value={email}
  onChange={handleChange}
/>`}
        </pre>
      </div>
    </div>
  ),
};
