(comment) @comment
(boolean_literal) @boolean
(nil) @constant.builtin
(number) @number
(string) @string

"(" @punctuation.bracket
")" @punctuation.bracket

"*" @operator
"/" @operator
"+" @operator
"-" @operator
"!" @operator
"==" @operator
"!=" @operator
">=" @operator
"<=" @operator
"<" @operator
">" @operator

"," @punctuation.delimiter

(ternary_expression
  "?" @operator)
(ternary_expression
  ":" @operator)
