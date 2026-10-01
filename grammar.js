/**
 * @file lox grammar for tree-sitter
 * @author achmutov
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "lox",

  extras: ($) => [
    /\s/,
    $.comment,
  ],

  externals: ($) => [$._block_comment_content],

  rules: {
    // TODO: add the actual grammar rules
    source_file: () => "hello",

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
