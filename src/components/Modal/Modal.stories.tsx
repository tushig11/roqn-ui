import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'Components/Modal',
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description:
        'Visible heading linked to the dialog via aria-labelledby. Mutually exclusive with ariaLabel — TypeScript enforces that exactly one is provided.',
      table: {
        type: { summary: 'string' },
      },
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name when no visible title is present (e.g. image lightbox). Mutually exclusive with title.',
      table: {
        type: { summary: 'string' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Controls whether the dialog is open.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onClose: {
      action: 'onClose',
      description:
        'Called when the user dismisses the dialog via Escape, backdrop click, or the close button.',
      table: {
        type: { summary: '() => void' },
      },
    },
    isAlert: {
      control: 'boolean',
      description:
        'Switches role to "alertdialog". Reserve for destructive or irreversible actions — misuse trains users to ignore the urgency cue.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description:
        'Whether clicking the backdrop closes the modal. Set to false for destructive flows to prevent accidental dismissal.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description:
        'Renders the built-in close button. Set to false when children provide their own dismiss control.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeLabel: {
      control: 'text',
      description: 'Label text for the built-in close button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: `'Close'` },
      },
    },
    children: {
      control: false,
      description: 'Dialog content.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

// --- WithTitle ---
// Enforcement: TypeScript requires either `title` or `ariaLabel` — never both, never neither.
// The visible <h2> is linked to the dialog via aria-labelledby at compile time; no runtime
// guess needed.
// Focus behavior: focus returns to the trigger button when the modal closes.
function WithTitleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal title="Confirm action" open={open} onClose={() => setOpen(false)}>
        <p>Are you sure you want to continue?</p>
        <Button onClick={() => setOpen(false)}>Confirm</Button>
      </Modal>
    </>
  );
}

export const WithTitle: Story = {
  render: () => <WithTitleDemo />,
};

// --- WithAriaLabel ---
// Enforcement: when there is no visible title (e.g. a media lightbox), `ariaLabel` is the
// only accepted alternative. Passing neither — or passing both — is a TypeScript error.
// Focus fallback: the dialog itself receives focus since there are no interactive children
// before the built-in close button. tabIndex={-1} on <dialog> makes this possible.
//
// Blocked at compile time:
//   <Modal open onClose={fn}>…</Modal>              // ✗ no label of any kind
//   <Modal title="X" ariaLabel="Y" …>…</Modal>      // ✗ ambiguous label source
function LabelOnlyDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>View image</Button>
      <Modal ariaLabel="Image preview" open={open} onClose={() => setOpen(false)}>
        <img src="https://placecats.com/300/200" alt="A placeholder cat" />
      </Modal>
    </>
  );
}

export const WithAriaLabel: Story = {
  render: () => <LabelOnlyDemo />,
};

// --- AlertDialog ---
// Enforcement: `isAlert` switches role to "alertdialog". Screen readers announce this
// role with elevated urgency and may immediately read the dialog content.
// Reserve for actions that are destructive or irreversible — misusing it on routine
// dialogs trains users to dismiss the urgency cue.
//
// closeOnBackdropClick defaults to true, but destructive flows often set it to false
// to prevent accidental dismissal — see the NoBackdropClose story.
function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete account</Button>
      <Modal
        isAlert
        title="Permanently delete account?"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p>This action cannot be undone. All data will be permanently removed.</p>
        <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => setOpen(false)}>Delete</Button>
      </Modal>
    </>
  );
}

export const AlertDialog: Story = {
  render: () => <AlertDialogDemo />,
};

// --- BackdropDismiss ---
// Demonstrates backdrop-click-to-close (default behavior).
// Clicking outside the dialog content area calls onClose — the same handler
// as Escape and the built-in close button.
function BackdropDismissDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal title="Click outside to close" open={open} onClose={() => setOpen(false)}>
        <p>Try clicking the darkened backdrop area around this dialog.</p>
      </Modal>
    </>
  );
}

export const BackdropDismiss: Story = {
  render: () => <BackdropDismissDemo />,
};

// --- NoBackdropClose ---
// closeOnBackdropClick={false} prevents accidental dismissal via the backdrop.
// Recommended for destructive or multi-step flows where losing state would be harmful.
// Escape and the built-in close button still work.
function NoBackdropCloseDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open protected modal</Button>
      <Modal
        title="Backdrop click disabled"
        open={open}
        onClose={() => setOpen(false)}
        closeOnBackdropClick={false}
      >
        <p>Clicking outside this dialog will not close it. Use the Close button or Escape.</p>
      </Modal>
    </>
  );
}

export const NoBackdropClose: Story = {
  render: () => <NoBackdropCloseDemo />,
};

// --- CustomCloseButton ---
// showCloseButton={false} hides the built-in close control when the consumer
// provides their own dismiss action inside children (e.g. a full button row).
function CustomCloseButtonDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        title="Custom close control"
        open={open}
        onClose={() => setOpen(false)}
        showCloseButton={false}
      >
        <p>The built-in close button is hidden. Dismiss is handled by the button below.</p>
        <Button variant="secondary" onClick={() => setOpen(false)}>Dismiss</Button>
      </Modal>
    </>
  );
}

export const CustomCloseButton: Story = {
  render: () => <CustomCloseButtonDemo />,
};

// --- CompileErrorExamples ---
// TypeScript enforces that every Modal has exactly one accessible name source.
// The discriminated union (ModalWithTitle | ModalWithAriaLabel) makes the
// two invalid states below compile errors — no runtime check needed.
export const CompileErrorExamples: Story = {
  render: () => (
    <div className="story-doc">
      <h3>❌ Compile-time enforcement examples</h3>

      <div className="story-doc__section">
        <p className="story-doc__label">Modal without an accessible name:</p>
        <pre className="story-doc__code">
{`<Modal open={open} onClose={handleClose}>
  <p>Content here.</p>
</Modal>`}
        </pre>
      </div>

      <div className="story-doc__section">
        <p className="story-doc__label">Modal with both title and ariaLabel:</p>
        <pre className="story-doc__code">
{`<Modal
  title="Confirm action"
  ariaLabel="Confirm action"
  open={open}
  onClose={handleClose}
>
  <p>Content here.</p>
</Modal>`}
        </pre>
      </div>
    </div>
  ),
};
