import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import rule from './no-conflicting-accessible-name.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-conflicting-accessible-name', rule, {
  valid: [
    '<Input label="Email" value={v} onChange={f} />;',
    '<Input ariaLabel="Search" value={v} onChange={f} />;',
    '<FormGroup legend="Contact method">{children}</FormGroup>;',
    '<FormGroup ariaLabel="Payment method">{children}</FormGroup>;',
    '<Input label="Email" ariaLabel={undefined} value={v} onChange={f} />;',
  ],
  invalid: [
    {
      code: '<Input label="Email" ariaLabel="Email" value={v} onChange={f} />;',
      errors: [
        {
          messageId: 'conflicting',
          data: { visibleAttr: 'label', ariaAttr: 'ariaLabel' },
        },
      ],
    },
    {
      code: '<FormGroup legend="Contact method" ariaLabel="Contact method">{children}</FormGroup>;',
      errors: [
        {
          messageId: 'conflicting',
          data: { visibleAttr: 'legend', ariaAttr: 'ariaLabel' },
        },
      ],
    },
  ],
});
