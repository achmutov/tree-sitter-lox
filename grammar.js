/**
 * @file lox grammar for tree-sitter
 * @author achmutov
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "lox",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
