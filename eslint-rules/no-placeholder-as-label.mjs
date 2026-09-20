const NATIVE_FIELD_TAGS = ['input', 'textarea'];
const ACCESSIBLE_NAME_ATTRS = ['aria-label', 'aria-labelledby', 'id'];

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow using placeholder as the only accessible name for a native input/textarea',
    },
    schema: [],
    messages: {
      needsLabel:
        'A placeholder is not an accessible label. Placeholder text disappears on input and is skipped by some screen readers. Add aria-label, aria-labelledby, or associate a <label>.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier' || !NATIVE_FIELD_TAGS.includes(node.name.name)) {
          return;
        }

        const attrs = node.attributes.filter((a) => a.type === 'JSXAttribute');
        const hasPlaceholder = attrs.some((a) => a.name.name === 'placeholder');
        if (!hasPlaceholder) return;

        const hasAccessibleName = attrs.some((a) =>
          ACCESSIBLE_NAME_ATTRS.includes(a.name.name)
        );
        if (hasAccessibleName) return;

        context.report({ node, messageId: 'needsLabel' });
      },
    };
  },
};
