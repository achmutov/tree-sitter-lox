(comment) @comment

(boolean_literal) @boolean

(nil) @constant.builtin

(number) @number

(string) @string

[
  "("
  ")"
] @punctuation.bracket

[
  ","
  ";"
] @punctuation.delimiter

[
  "*"
  "/"
  "+"
  "-"
  "!"
  "=="
  "!="
  ">="
  "<="
  "<"
  ">"
  "="
  "and"
  "or"
] @operator

(ternary_expression
  "?" @operator)

(ternary_expression
  ":" @operator)

[
  "print"
  "var"
  "break"
] @keyword

[
  "if"
  "else"
] @keyword.conditional

[
  "while"
  "for"
] @keyword.repeat

(call_expression
  name: (expression) @function.call)

(fun_decl
  name: (identifier) @function)

"fun" @keyword.function

(builtin_fun_name) @function.builtin
