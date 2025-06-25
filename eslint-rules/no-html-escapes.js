module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow HTML escape sequences like &lt;, &gt;, &amp; in code',
    },
    fixable: 'code',
    messages: {
      noEscape:
        'Avoid using HTML escape sequence "{{ escape }}". Use the actual character instead.',
    },
    schema: [],
  },
  create(context) {
    const ESCAPE_MAP = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&apos;': "'",
    };

    const ESCAPE_REGEX = new RegExp(
      Object.keys(ESCAPE_MAP).join('|').replace(/&/g, '&amp;'),
      'g',
    );

    function checkText(value, node) {
      const matches = value.match(ESCAPE_REGEX);
      if (matches) {
        matches.forEach(escape => {
          context.report({
            node,
            messageId: 'noEscape',
            data: { escape },
            fix(fixer) {
              const fixed = value.replace(
                new RegExp(escape.replace(/&/g, '&amp;'), 'g'),
                ESCAPE_MAP[escape.replace(/&amp;/g, '&')],
              );
              return fixer.replaceText(node, JSON.stringify(fixed));
            },
          });
        });
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          checkText(node.raw, node);
        }
      },
      JSXText(node) {
        checkText(node.value, node);
      },
    };
  },
};
