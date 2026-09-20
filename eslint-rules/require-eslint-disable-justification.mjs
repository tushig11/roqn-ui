const DISABLE_DIRECTIVE = /^eslint-disable(-next-line|-line)?\b/;
const DIRECTIVE_COMMENT = /^eslint-(disable|enable)/;

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require an explanatory comment directly above any eslint-disable directive',
    },
    schema: [],
    messages: {
      missingJustification:
        'eslint-disable directives must be preceded by a comment explaining why the rule is being suppressed here.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      Program() {
        const comments = sourceCode.getAllComments();

        comments.forEach((comment, index) => {
          const text = comment.value.trim();
          if (!DISABLE_DIRECTIVE.test(text)) return;

          const previous = comments[index - 1];
          const hasPrecedingExplanation =
            previous &&
            previous.loc.end.line >= comment.loc.start.line - 1 &&
            !DIRECTIVE_COMMENT.test(previous.value.trim());

          if (!hasPrecedingExplanation) {
            context.report({
              loc: comment.loc,
              messageId: 'missingJustification',
            });
          }
        });
      },
    };
  },
};
