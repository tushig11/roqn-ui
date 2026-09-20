import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import rule from './no-hardcoded-color.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-hardcoded-color', rule, {
  valid: [
    'const style = { color: "var(--color-interactive)" };',
    'const style = { color: token.interactive };',
    'const style = { width: "#fff" };', // not a color-bearing key
    'const label = "#fff is a great name";', // unrelated variable name
  ],
  invalid: [
    {
      code: 'const style = { color: "#fff" };',
      errors: [{ messageId: 'useToken', data: { value: '#fff' } }],
    },
    {
      code: 'const style = { backgroundColor: "#f9fafb" };',
      errors: [{ messageId: 'useToken', data: { value: '#f9fafb' } }],
    },
    {
      code: 'const style = { border: "1px solid rgb(209, 213, 219)" };',
      errors: [{ messageId: 'useToken', data: { value: '1px solid rgb(209, 213, 219)' } }],
    },
    {
      code: 'const errorColor = "#dc2626";',
      errors: [{ messageId: 'useToken', data: { value: '#dc2626' } }],
    },
  ],
});
