const COLOR_PATTERN = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(|hsla?\(/;

function isColorLiteral(node) {
  return (
    node &&
    node.type === 'Literal' &&
    typeof node.value === 'string' &&
    COLOR_PATTERN.test(node.value)
  );
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow hardcoded color literals in favor of design tokens from src/tokens.css',
    },
    schema: [],
    messages: {
      useToken:
        'Hardcoded color "{{value}}". Reference a design token (e.g. var(--color-interactive)) from src/tokens.css instead.',
    },
  },
  create(context) {
    function check(node, valueNode) {
      if (isColorLiteral(valueNode)) {
        context.report({
          node,
          messageId: 'useToken',
          data: { value: valueNode.value },
        });
      }
    }

    const COLOR_BEARING_KEY = /^(color|background|backgroundColor|border|borderColor|fill|stroke|outline)$/i;

    return {
      // style={{ color: '#fff' }}
      Property(node) {
        const keyName = node.key.type === 'Identifier' ? node.key.name : node.key.value;
        if (
          typeof keyName === 'string' &&
          COLOR_BEARING_KEY.test(keyName) &&
          node.value.type === 'Literal'
        ) {
          check(node, node.value);
        }
      },
      // const errorColor = '#dc2626'
      VariableDeclarator(node) {
        if (
          node.id.type === 'Identifier' &&
          /color/i.test(node.id.name) &&
          node.init
        ) {
          check(node, node.init);
        }
      },
    };
  },
};
