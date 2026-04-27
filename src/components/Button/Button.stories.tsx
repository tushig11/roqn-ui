// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Continue',
    type: 'button',
    disabled: false,
    loading: false,
    variant: 'primary',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit'],
      description: 'Native button type.',
      table: {
        type: { summary: `'button' | 'submit'` },
        defaultValue: { summary: `'button'` },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state and disables interaction.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual button style.',
      table: {
        type: { summary: `'primary' | 'secondary'` },
        defaultValue: { summary: `'primary'` },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Required for icon-only buttons.',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: 'text',
      description: 'Visible button content.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const WithText: Story = {
  render: () => <Button>Continue</Button>,
};

export const Secondary: Story = {
  render: () => <Button variant="secondary">Cancel</Button>,
};

export const SubmitButton: Story = {
  render: () => <Button type="submit">Submit</Button>,
};

export const Loading: Story = {
  render: () => <Button loading>Save changes</Button>,
};

export const Disabled: Story = {
  render: () => <Button disabled>Continue</Button>,
};

export const IconOnly: Story = {
  render: () => <Button ariaLabel="Close" icon="x" />,
};

export const CompileErrorExamples: Story = {
  render: () => (
    <div className="story-doc">
      <h3>❌ Compile-time enforcement examples</h3>

      <div className="story-doc__section">
        <p className="story-doc__label">Icon-only button without ariaLabel:</p>
        <pre className="story-doc__code">
{`<Button icon="×" />`}
        </pre>
      </div>

      <div className="story-doc__section">
        <p className="story-doc__label">Text button with unnecessary ariaLabel:</p>
        <pre className="story-doc__code">
{`<Button ariaLabel="Continue">
  Continue
</Button>`}
        </pre>
      </div>
    </div>
  ),
};
