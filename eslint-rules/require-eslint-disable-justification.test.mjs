import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import rule from './require-eslint-disable-justification.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('require-eslint-disable-justification', rule, {
  valid: [
    `
    // Backdrop dismissal already has a keyboard equivalent (Escape).
    // eslint-disable-next-line no-console
    console.log('x');
    `,
    `
    doSomething(); // fine, no directive here at all
    `,
    `
    /* Legacy API requires a callback with this exact signature. */
    // eslint-disable-next-line no-unused-vars
    function f(unused) {}
    `,
  ],
  invalid: [
    {
      code: `
      // eslint-disable-next-line no-console
      console.log('x');
      `,
      errors: [{ messageId: 'missingJustification' }],
    },
    {
      code: `
      // eslint-disable-next-line no-console
      console.log('a');
      // eslint-disable-next-line no-console
      console.log('b');
      `,
      errors: [
        { messageId: 'missingJustification' },
        { messageId: 'missingJustification' },
      ],
    },
  ],
});
