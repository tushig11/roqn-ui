const VISIBLE_NAME_ATTRS = ['label', 'legend'];
const ARIA_LABEL_ATTRS = ['ariaLabel', 'aria-label'];

function isMeaningful(attr) {
  if (!attr.value) return true; // bare boolean-style JSX attr
  if (attr.value.type === 'Literal') return attr.value.value != null && attr.value.value !== false;
  if (attr.value.type === 'JSXExpressionContainer') {
    const expr = attr.value.expression;
    if (expr.type === 'Identifier' && expr.name === 'undefined') return false;
    if (expr.type === 'Literal') return expr.value != null && expr.value !== false;
    return true; // conservatively treat other expressions as meaningful
  }
  return true;
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow supplying both a visible-name prop (label/legend) and an ariaLabel prop on the same element at once',
    },
    schema: [],
    messages: {
      conflicting:
        'Element has both "{{visibleAttr}}" and "{{ariaAttr}}", pick one accessible name source, not both.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const attrs = node.attributes.filter((a) => a.type === 'JSXAttribute');

        const visible = attrs.find(
          (a) => VISIBLE_NAME_ATTRS.includes(a.name.name) && isMeaningful(a)
        );
        const ariaLabel = attrs.find(
          (a) => ARIA_LABEL_ATTRS.includes(a.name.name) && isMeaningful(a)
        );

        if (visible && ariaLabel) {
          context.report({
            node,
            messageId: 'conflicting',
            data: {
              visibleAttr: visible.name.name,
              ariaAttr: ariaLabel.name.name,
            },
          });
        }
      },
    };
  },
};
