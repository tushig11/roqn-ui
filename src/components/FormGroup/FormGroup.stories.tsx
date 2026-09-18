// FormGroup.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FormGroup } from './FormGroup';

const meta: Meta<typeof FormGroup> = {
  title: 'Components/FormGroup',
  component: FormGroup,
  tags: ['autodocs'],
  args: {
    legend: 'Notification preferences',
    description: undefined,
    error: undefined,
    required: false,
  },
  argTypes: {
    legend: {
      control: 'text',
      description:
        'Visible legend used as the accessible name for the group.',
      table: {
        type: { summary: 'string' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Required when no visible legend is provided.',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description:
        'Supporting hint text, connected to the group via aria-describedby.',
      table: {
        type: { summary: 'string' },
      },
    },
    error: {
      control: 'text',
      description:
        'Group-level error message, connected via aria-describedby.',
      table: {
        type: { summary: 'string' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Marks the group as required.',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormGroup>;

export const WithVisibleLegend: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['email']);

    function toggle(value: string) {
      setSelected(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    }

    return (
      <FormGroup legend="Notification preferences">
        {['email', 'sms', 'push'].map(channel => (
          <label key={channel} className="story__row">
            <input
              type="checkbox"
              checked={selected.includes(channel)}
              onChange={() => toggle(channel)}
            />
            {channel === 'sms' ? 'SMS' : channel[0].toUpperCase() + channel.slice(1)}
          </label>
        ))}
      </FormGroup>
    );
  },
};

export const WithAriaLabel: Story = {
  render: () => {
    const [value, setValue] = useState('card');

    return (
      <FormGroup ariaLabel="Payment method">
        {['card', 'paypal', 'bank'].map(method => (
          <label key={method} className="story__row">
            <input
              type="radio"
              name="payment-method"
              checked={value === method}
              onChange={() => setValue(method)}
            />
            {method === 'paypal'
              ? 'PayPal'
              : method[0].toUpperCase() + method.slice(1)}
          </label>
        ))}
      </FormGroup>
    );
  },
};

export const WithDescription: Story = {
  render: () => (
    <FormGroup
      legend="Shipping speed"
      description="Delivery estimates apply to domestic orders only."
    >
      <label className="story__row">
        <input type="radio" name="shipping-speed" defaultChecked />
        Standard (5–7 days)
      </label>
      <label className="story__row">
        <input type="radio" name="shipping-speed" />
        Express (1–2 days)
      </label>
    </FormGroup>
  ),
};

export const Required: Story = {
  render: () => (
    <FormGroup legend="Contact method" required>
      <label className="story__row">
        <input type="radio" name="contact-method" />
        Email
      </label>
      <label className="story__row">
        <input type="radio" name="contact-method" />
        Phone
      </label>
    </FormGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormGroup
      legend="Interests"
      required
      error="Select at least one interest."
    >
      <label className="story__row">
        <input type="checkbox" />
        Design
      </label>
      <label className="story__row">
        <input type="checkbox" />
        Engineering
      </label>
      <label className="story__row">
        <input type="checkbox" />
        Product
      </label>
    </FormGroup>
  ),
};

export const CompileErrorExamples: Story = {
  render: () => (
    <div className="story-doc">
      <h3>❌ Compile-time enforcement examples</h3>

      <div className="story-doc__section">
        <p className="story-doc__label">FormGroup without accessible name:</p>
        <pre className="story-doc__code">
{`<FormGroup>
  <input type="checkbox" />
</FormGroup>`}
        </pre>
      </div>

      <div className="story-doc__section">
        <p className="story-doc__label">
          FormGroup with both legend and ariaLabel:
        </p>
        <pre className="story-doc__code">
{`<FormGroup
  legend="Interests"
  ariaLabel="Interests"
>
  <input type="checkbox" />
</FormGroup>`}
        </pre>
      </div>
    </div>
  ),
};
