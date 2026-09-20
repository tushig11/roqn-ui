import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import rule from './no-raw-interactive-elements.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-raw-interactive-elements', rule, {
  valid: [
    '<Button>Save</Button>;',
    '<Input label="Email" value={v} onChange={f} />;',
    '<Modal title="x" open={o} onClose={f} />;',
    '<FormGroup legend="x">{children}</FormGroup>;',
    '<input type="checkbox" checked={c} onChange={f} />;',
    '<input type="radio" name="x" />;',
    '<input type={dynamicType} />;',
  ],
  invalid: [
    {
      code: '<button onClick={f}>Save</button>;',
      errors: [{ messageId: 'useComponent', data: { tag: 'button', component: 'Button' } }],
    },
    {
      code: '<input value={v} onChange={f} />;',
      errors: [{ messageId: 'useComponent', data: { tag: 'input', component: 'Input' } }],
    },
    {
      code: '<input type="email" value={v} onChange={f} />;',
      errors: [{ messageId: 'useComponent', data: { tag: 'input', component: 'Input' } }],
    },
    {
      code: '<dialog open>{children}</dialog>;',
      errors: [{ messageId: 'useComponent', data: { tag: 'dialog', component: 'Modal' } }],
    },
    {
      code: '<fieldset>{children}</fieldset>;',
      errors: [{ messageId: 'useComponent', data: { tag: 'fieldset', component: 'FormGroup' } }],
    },
  ],
});
