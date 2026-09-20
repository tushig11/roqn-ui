import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import rule from './no-placeholder-as-label.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-placeholder-as-label', rule, {
  valid: [
    '<input placeholder="Search" aria-label="Search" />;',
    '<input placeholder="Search" aria-labelledby="search-label" />;',
    '<input placeholder="Search" id="search" />;',
    '<input value={v} onChange={f} />;', // no placeholder at all
    '<textarea placeholder="Notes" aria-label="Notes" />;',
  ],
  invalid: [
    {
      code: '<input placeholder="Search" />;',
      errors: [{ messageId: 'needsLabel' }],
    },
    {
      code: '<textarea placeholder="Notes" />;',
      errors: [{ messageId: 'needsLabel' }],
    },
  ],
});
