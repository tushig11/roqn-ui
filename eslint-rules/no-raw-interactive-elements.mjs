const REPLACEMENTS = {
  button: 'Button',
  dialog: 'Modal',
  fieldset: 'FormGroup',
};

// roqn-ui's <Input> only models these text-like entry types; checkboxes,
// radios, files, etc. have no equivalent component yet, so raw <input> is
// the only option and shouldn't be flagged.
const TEXT_LIKE_INPUT_TYPES = new Set([
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
]);

function isTextLikeInput(node) {
  const typeAttr = node.attributes.find(
    (a) => a.type === 'JSXAttribute' && a.name.name === 'type'
  );
  if (!typeAttr) return true; // <input> defaults to type="text"
  if (!typeAttr.value || typeAttr.value.type !== 'Literal') return false; // dynamic type, don't guess
  return TEXT_LIKE_INPUT_TYPES.has(typeAttr.value.value);
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow raw interactive HTML elements that this design system provides accessible components for',
    },
    schema: [],
    messages: {
      useComponent:
        "Use the roqn-ui <{{component}}> component instead of a raw <{{tag}}>; it enforces accessible naming and behavior at compile time.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const tag = node.name.name;

        if (tag === 'input') {
          if (isTextLikeInput(node)) {
            context.report({
              node,
              messageId: 'useComponent',
              data: { tag, component: 'Input' },
            });
          }
          return;
        }

        const component = REPLACEMENTS[tag];
        if (!component) return;

        context.report({
          node,
          messageId: 'useComponent',
          data: { tag, component },
        });
      },
    };
  },
};
