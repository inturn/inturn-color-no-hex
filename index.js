"use strict";

const styleSearch = require('style-search');
const stylelint = require('stylelint');
const findColor = require('happytree').findColor;

const { report, ruleMessages, validateOptions } = stylelint.utils;
const ruleName = "inturn/inturn-color-no-hex";

const messages = ruleMessages(ruleName, {
  rejected: hex => `Unexpected hex color "${hex}"`
});

const rule = function(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });
    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const declString = decl.toString();

      styleSearch({ source: declString, target: "#" }, match => {
        // If there's not a colon, comma, or whitespace character before, we'll assume this is
        // not intended to be a hex color, but is instead something like the
        // hash in a url() argument
        if (!/[:,\s]/.test(declString[match.startIndex - 1])) {
          return;
        }

        const hexMatch = /^#[0-9A-Za-z]+/.exec(
          declString.substr(match.startIndex)
        );
        if (!hexMatch) {
          return;
        }
        const hexValue = hexMatch[0];
        const happyTreeValue = findColor(hexValue);
        const message = Array.isArray(happyTreeValue)
          ? `Expected getColor('${happyTreeValue[0]}', ${Number(happyTreeValue[1])}) in ${hexValue}`
          : `Expected getColor in ${hexValue}.  There is no match.
            Please consult specs or check with design for a color within our palette.`;

        report({
          message: messages.rejected(message),
          node: decl,
          index: match.startIndex,
          result,
          ruleName
        });
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = {
  default: stylelint.createPlugin(rule),
  rule,
};

