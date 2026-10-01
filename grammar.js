/**
 * @file lox grammar for tree-sitter
 * @author achmutov
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  unary: 5,
  multiplicative: 4,
  additive: 3,
  comparative: 2,
  equality: 1,
  ternary: 0,
}

export default grammar({
  name: "lox",

  extras: ($) => [
    /\s/,
    $.comment,
  ],

  externals: ($) => [$._block_comment_content],

  rules: {
    source_file: ($) => $.expression,

    expression: ($) => choice(
      $.grouping,
      $.primary,
      $.ternary_expression,
      $.binary_expression,
      $.unary_expression,
    ),

    comma_expression: ($) => seq(
      $.expression,
      ",",
      choice($.expression, $.comma_expression)
    ),

    ternary_expression: ($) => prec.right(PREC.ternary, seq(
      $.expression,
      "?",
      choice($.expression, $.comma_expression),
      ":",
      $.expression
    )),

    binary_expression: ($) => choice(
      ...[
        [PREC.multiplicative, choice("*", "/")],
        [PREC.additive, choice("+", "-")],
        [PREC.comparative, choice("<", ">", "<=", ">=")],
        [PREC.equality, choice("==", "!=")],
      ].map(
        ([precedence, operator]) => prec.left(
          // @ts-ignore
          precedence,
          seq(
            $.expression,
            // @ts-ignore
            operator,
            $.expression
          )
        )
      )
    ),
    unary_expression: ($) => prec.right(PREC.unary, seq(choice("!", "-"), $.expression)),

    primary: ($) => choice(
      $.boolean_literal,
      $.nil,
      $.number,
      $.string,
    ),
    grouping: ($) => seq("(", choice($.expression, $.comma_expression), ")"),

    boolean_literal: () => choice("true", "false"),
    nil: () => "nil",
    number: () => /\d+(\.\d+)?/,
    string: () => /"[^"]*"/,

    comment: ($) => choice(
      seq("//", /(\\+(.|\r?\n)|[^\\\n])*/),
      seq(
        "/*",
        optional($._block_comment_content),
        "*/",
      ),
    ),
  }
});
