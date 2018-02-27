"use strict";

const ava = require('ava');
const testRule = require('stylelint-test-rule-ava');
const rule = require('./index').rule;

const { ruleName, messages } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "a { color: rgba(0, 0, 0, 0); }"
    },
    {
      code: "a { something: black, white, gray; }"
    },
    {
      code: "a { padding: 000; }"
    },
    {
      code: 'a::before { content: "#ababa"; }'
    },
    {
      code: "a { border-#$side: 0; }",
      description: "ignore sass-like interpolation"
    },
    {
      code: "a { box-sizing: #$type-box; }",
      description: "ignore sass-like interpolation"
    },
    {
      code:
        "@font-face {\n" +
        "font-family: dashicons;\n" +
        'src: url(data:application/font-woff;charset=utf-8;base64, ABCDEF==) format("woff"),\n' +
        'url(../fonts/dashicons.ttf) format("truetype"),\n' +
        'url(../fonts/dashicons.svg#dashicons) format("svg");\n' +
        "font-weight: normal;\n" +
        "font-style: normal;\n" +
        "}"
    }
  ],

  reject: [
    {
      code: "a { color: #12345; }",
			message: messages.rejected(
				`Expected getColor in #12345.  There is no match.
            Please consult specs or check with design for a color within our palette.`
			),
      line: 1,
      column: 12
    },
    {
      code: "a { color: #123456a; }",
			message: messages.rejected(
				`Expected getColor in #123456a.  There is no match.
            Please consult specs or check with design for a color within our palette.`
			),
      line: 1,
      column: 12
    },
    {
      code: "a { color: #cccccc; }",
			message: messages.rejected(
				`Expected getColor in #cccccc.  There is no match.
            Please consult specs or check with design for a color within our palette.`
			),
      line: 1,
      column: 12
    },
    {
      code: "a { something: #00c, red, white; }",
			message: messages.rejected(
				`Expected getColor in #00c.  There is no match.
            Please consult specs or check with design for a color within our palette.`
			),
      line: 1,
      column: 16
    },
    {
      code: "a { something: black, #fff1a1, rgb(250, 250, 0); }",
    	message: messages.rejected(
				`Expected getColor in #fff1a1.  There is no match.
            Please consult specs or check with design for a color within our palette.`
			),
      line: 1,
      column: 23
    },
    {
      code: "a { something:black,white,#12345a; }",
			message: messages.rejected(
				`Expected getColor in #12345a.  There is no match.
            Please consult specs or check with design for a color within our palette.`
			),
      line: 1,
      column: 27
    },
    {
      code: "a { color: #fff; }",
			message: messages.rejected(
        `Expected getColor('background', 0) in #fff`
			),
      line: 1,
      column: 12
    },
    {
      code: "a { color: #ffffffaa; }",
			message: messages.rejected(
				`Expected getColor in #ffffffaa.  There is no match.
            Please consult specs or check with design for a color within our palette.`
			),
      line: 1,
      column: 12
    }
  ]
});
