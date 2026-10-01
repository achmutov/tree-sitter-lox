#include "tree_sitter/parser.h"

enum TokenType { BLOCK_COMMENT_CONTENT };

void *tree_sitter_lox_external_scanner_create() { return NULL; }
void tree_sitter_lox_external_scanner_destroy(void *payload) {}
unsigned tree_sitter_lox_external_scanner_serialize(void *payload,
                                                    char *buffer) {
  return 0;
}
void tree_sitter_lox_external_scanner_deserialize(void *payload, char *buffer,
                                                  unsigned length) {}

static inline void advance(TSLexer *lexer) { lexer->advance(lexer, false); }
static inline void mark_end(TSLexer *lexer) { lexer->mark_end(lexer); }

#define u8 uint8_t

typedef enum {
  ForwardSlash,
  Asterisk,
  Continuing,
} BlockCommentState;

typedef struct {
  BlockCommentState state;
  u8 nested;
} BlockComment;

bool tree_sitter_lox_external_scanner_scan(void *payload, TSLexer *lexer,
                                           const bool *valid_symbols) {
  if (!valid_symbols[BLOCK_COMMENT_CONTENT]) {
    return false;
  }

  char first = lexer->lookahead;
  advance(lexer);

  BlockCommentState state;
  switch (first) {
  case '*':
    if (lexer->lookahead == '/') {
      // empty content
      return false;
    }
    state = Asterisk;
    break;
  case '/':
    state = ForwardSlash;
    break;
  default:
    state = Continuing;
    break;
  }

  BlockComment block_comment = {.state = state, .nested = 1};
  while (!lexer->eof(lexer) && block_comment.nested != 0) {
    first = (char)lexer->lookahead;
    switch (block_comment.state) {
    case ForwardSlash:
      if (first == '*')
        block_comment.nested++;
      block_comment.state = Continuing;
      break;

    case Asterisk:
      switch (first) {
      case '*':
        mark_end(lexer);
        // keep LeftAsterisk
        break;
      case '/':
        block_comment.nested--;
        block_comment.state = Continuing;
        break;
      default:
        block_comment.state = Continuing;
        break;
      }
      break;

    case Continuing:
      mark_end(lexer);
      switch (first) {
      case '*':
        block_comment.state = Asterisk;
        break;
      case '/':
        block_comment.state = ForwardSlash;
        break;
      }
      break;
    }
    advance(lexer);
    if (first == '/' && block_comment.nested != 0)
      mark_end(lexer);
  }
  lexer->result_symbol = BLOCK_COMMENT_CONTENT;
  return true;
}
