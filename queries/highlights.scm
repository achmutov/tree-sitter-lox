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
] @operator

(ternary_expression
  "?" @operator)

(ternary_expression
  ":" @operator)

[
  "print"
  "var"
] @keyword
