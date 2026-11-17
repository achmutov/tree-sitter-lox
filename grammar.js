/**
 * @file lox grammar for tree-sitter
 * @author achmutov
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  unary: 7,
  multiplicative: 6,
  additive: 5,
  comparative: 4,
  equality: 3,
  and: 2,
  or: 1,
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
    source_file: ($) => seq(repeat($.declaration), optional($.expression)),

    declaration: ($) => choice(
      $.var_decl,
      $.statement
    ),

    var_decl: ($) => seq("var", $.identifier, optional(seq("=", $.expression)), ";"),
    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,

    statement: ($) => choice(
      $.print_stmt,
      $.expression_stmt,
      $.block,
      $.if_stmt,
    ),

    print_stmt: ($) => seq("print", $.expression, ";"),
    expression_stmt: ($) => seq($.expression, ";"),
    block: ($) => seq("{", repeat($.declaration), "}"),
    if_stmt: ($) => prec.right(seq("if", "(", $.expression, ")", $.statement, optional(seq("else", $.statement)))),

    expression: ($) => choice(
      $.grouping,
      $.primary,
      $.ternary_expression,
      $.binary_expression,
      $.unary_expression,
      $.assignment,
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
        [PREC.and, "and"],
        [PREC.or, "or"],
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
    assignment: ($) => prec.right(seq($.identifier, "=", $.expression)),

    primary: ($) => choice(
      $.boolean_literal,
      $.nil,
      $.number,
      $.string,
      $.identifier,
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
