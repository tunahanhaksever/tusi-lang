/**
 * Tusi Programlama Dili — Gelişmiş Lexer / Sözcük Çözümleyici (v4.0)
 * Geliştirici: Tunahan Haksever (bitigey.com)
 */

const TokenType = {
  // Literals & Identifiers
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  NULL: 'NULL',

  // Keywords
  VAR: 'değişken',
  CONST: 'sabit',
  FUNCTION: 'fonksiyon',
  RETURN: 'döndür',
  IF: 'eğer',
  THEN: 'ise',
  ELSE: 'değilse',
  WHILE: 'döngü',
  FOR: 'için',
  IN: 'içinde',
  RANGE: 'aralığında',
  BREAK: 'dur',
  CONTINUE: 'devam',
  TRY: 'dene',
  CATCH: 'yakala',
  PRINT: 'yazdır',
  INPUT: 'oku',
  CLASS: 'sınıf',
  THIS: 'bu',
  NEW: 'yeni',

  // Operators
  PLUS: '+',
  MINUS: '-',
  MUL: '*',
  DIV: '/',
  MOD: '%',
  POW: '^',
  ASSIGN: '=',
  PLUS_ASSIGN: '+=',
  MINUS_ASSIGN: '-=',
  MUL_ASSIGN: '*=',
  DIV_ASSIGN: '/=',
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  GT: '>',
  LTE: '<=',
  GTE: '>=',
  AND: '&&',
  OR: '||',
  NOT: '!',
  KW_AND: 've',
  KW_OR: 'veya',
  KW_NOT: 'değil',

  // Punctuation
  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',
  LBRACKET: '[',
  RBRACKET: ']',
  COMMA: ',',
  DOT: '.',
  RANGE_OP: '..',
  COLON: ':',
  SEMICOLON: ';',

  EOF: 'EOF'
};

const KEYWORDS = {
  'değişken': TokenType.VAR,
  'degisken': TokenType.VAR,
  'tanımla': TokenType.VAR,
  'sabit': TokenType.CONST,
  'fonksiyon': TokenType.FUNCTION,
  'işlev': TokenType.FUNCTION,
  'döndür': TokenType.RETURN,
  'dondur': TokenType.RETURN,
  'dön': TokenType.RETURN,
  'eğer': TokenType.IF,
  'eger': TokenType.IF,
  'ise': TokenType.THEN,
  'değilse': TokenType.ELSE,
  'degilse': TokenType.ELSE,
  'döngü': TokenType.WHILE,
  'dongu': TokenType.WHILE,
  'için': TokenType.FOR,
  'icin': TokenType.FOR,
  'içinde': TokenType.IN,
  'icinde': TokenType.IN,
  'aralığında': TokenType.RANGE,
  'araliginda': TokenType.RANGE,
  'dur': TokenType.BREAK,
  'kır': TokenType.BREAK,
  'devam': TokenType.CONTINUE,
  'dene': TokenType.TRY,
  'yakala': TokenType.CATCH,
  'yazdır': TokenType.PRINT,
  'yazdir': TokenType.PRINT,
  'yaz': TokenType.PRINT,
  'oku': TokenType.INPUT,
  'doğru': TokenType.BOOLEAN,
  'dogru': TokenType.BOOLEAN,
  'yanlış': TokenType.BOOLEAN,
  'yanlis': TokenType.BOOLEAN,
  'boş': TokenType.NULL,
  'bos': TokenType.NULL,
  'yok': TokenType.NULL,
  've': TokenType.KW_AND,
  'veya': TokenType.KW_OR,
  'değil': TokenType.KW_NOT,
  'degil': TokenType.KW_NOT,
  'sınıf': TokenType.CLASS,
  'sinif': TokenType.CLASS,
  'bu': TokenType.THIS,
  'yeni': TokenType.NEW
};

class Token {
  constructor(type, value, line = 1, col = 1) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.col = col;
  }
}

class Lexer {
  constructor(source) {
    this.source = source || '';
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.tokens = [];
  }

  peek(offset = 0) {
    return this.pos + offset < this.source.length ? this.source[this.pos + offset] : '\0';
  }

  advance() {
    const ch = this.peek();
    this.pos++;
    if (ch === '\n') {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return ch;
  }

  tokenize() {
    while (this.pos < this.source.length) {
      const ch = this.peek();
      const startLine = this.line;
      const startCol = this.col;

      // Skip whitespace
      if (/\s/.test(ch)) {
        this.advance();
        continue;
      }

      // Single-line comment: // or #
      if (ch === '#' || (ch === '/' && this.peek(1) === '/')) {
        while (this.pos < this.source.length && this.peek() !== '\n') {
          this.advance();
        }
        continue;
      }

      // Multi-line comment: /* ... */
      if (ch === '/' && this.peek(1) === '*') {
        this.advance();
        this.advance();
        while (this.pos < this.source.length && !(this.peek() === '*' && this.peek(1) === '/')) {
          this.advance();
        }
        if (this.pos < this.source.length) {
          this.advance(); // *
          this.advance(); // /
        }
        continue;
      }

      // Numbers
      if (/\d/.test(ch)) {
        let numStr = '';
        while (this.pos < this.source.length) {
          if (this.peek() === '.' && this.peek(1) === '.') {
            break; // Stop at range operator '..'
          }
          if (/[\d.]/.test(this.peek())) {
            numStr += this.advance();
          } else {
            break;
          }
        }
        this.tokens.push(new Token(TokenType.NUMBER, parseFloat(numStr), startLine, startCol));
        continue;
      }

      // Strings (double quotes, single quotes, backticks)
      if (ch === '"' || ch === "'" || ch === '`') {
        const quote = this.advance();
        let str = '';
        while (this.pos < this.source.length && this.peek() !== quote) {
          if (this.peek() === '\\') {
            this.advance();
            const esc = this.advance();
            if (esc === 'n') str += '\n';
            else if (esc === 't') str += '\t';
            else if (esc === 'r') str += '\r';
            else str += esc;
          } else {
            str += this.advance();
          }
        }
        if (this.peek() === quote) this.advance();
        this.tokens.push(new Token(TokenType.STRING, str, startLine, startCol));
        continue;
      }

      // Identifiers & Keywords (Turkish Unicode support)
      if (/[a-zA-ZçğıöşüÇĞİÖŞÜ_]/.test(ch)) {
        let ident = '';
        while (this.pos < this.source.length && /[a-zA-ZçğıöşüÇĞİÖŞÜ0-9_]/.test(this.peek())) {
          ident += this.advance();
        }

        const lowerIdent = ident.toLowerCase();
        if (KEYWORDS.hasOwnProperty(lowerIdent)) {
          const type = KEYWORDS[lowerIdent];
          let val = ident;
          if (type === TokenType.BOOLEAN) val = (lowerIdent === 'doğru' || lowerIdent === 'dogru');
          if (type === TokenType.NULL) val = null;
          this.tokens.push(new Token(type, val, startLine, startCol));
        } else {
          this.tokens.push(new Token(TokenType.IDENTIFIER, ident, startLine, startCol));
        }
        continue;
      }

      // Multi-character operators
      const twoChar = ch + this.peek(1);
      if (twoChar === '==') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.EQ, '==', startLine, startCol)); continue; }
      if (twoChar === '!=') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.NEQ, '!=', startLine, startCol)); continue; }
      if (twoChar === '<=') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.LTE, '<=', startLine, startCol)); continue; }
      if (twoChar === '>=') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.GTE, '>=', startLine, startCol)); continue; }
      if (twoChar === '+=') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.PLUS_ASSIGN, '+=', startLine, startCol)); continue; }
      if (twoChar === '-=') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.MINUS_ASSIGN, '-=', startLine, startCol)); continue; }
      if (twoChar === '*=') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.MUL_ASSIGN, '*=', startLine, startCol)); continue; }
      if (twoChar === '/=') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.DIV_ASSIGN, '/=', startLine, startCol)); continue; }
      if (twoChar === '&&') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.AND, '&&', startLine, startCol)); continue; }
      if (twoChar === '||') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.OR, '||', startLine, startCol)); continue; }
      if (twoChar === '..') { this.advance(); this.advance(); this.tokens.push(new Token(TokenType.RANGE_OP, '..', startLine, startCol)); continue; }

      // Single-character tokens
      this.advance();
      switch (ch) {
        case '+': this.tokens.push(new Token(TokenType.PLUS, '+', startLine, startCol)); break;
        case '-': this.tokens.push(new Token(TokenType.MINUS, '-', startLine, startCol)); break;
        case '*': this.tokens.push(new Token(TokenType.MUL, '*', startLine, startCol)); break;
        case '/': this.tokens.push(new Token(TokenType.DIV, '/', startLine, startCol)); break;
        case '%': this.tokens.push(new Token(TokenType.MOD, '%', startLine, startCol)); break;
        case '^': this.tokens.push(new Token(TokenType.POW, '^', startLine, startCol)); break;
        case '=': this.tokens.push(new Token(TokenType.ASSIGN, '=', startLine, startCol)); break;
        case '<': this.tokens.push(new Token(TokenType.LT, '<', startLine, startCol)); break;
        case '>': this.tokens.push(new Token(TokenType.GT, '>', startLine, startCol)); break;
        case '!': this.tokens.push(new Token(TokenType.NOT, '!', startLine, startCol)); break;
        case '(': this.tokens.push(new Token(TokenType.LPAREN, '(', startLine, startCol)); break;
        case ')': this.tokens.push(new Token(TokenType.RPAREN, ')', startLine, startCol)); break;
        case '{': this.tokens.push(new Token(TokenType.LBRACE, '{', startLine, startCol)); break;
        case '}': this.tokens.push(new Token(TokenType.RBRACE, '}', startLine, startCol)); break;
        case '[': this.tokens.push(new Token(TokenType.LBRACKET, '[', startLine, startCol)); break;
        case ']': this.tokens.push(new Token(TokenType.RBRACKET, ']', startLine, startCol)); break;
        case ',': this.tokens.push(new Token(TokenType.COMMA, ',', startLine, startCol)); break;
        case '.': this.tokens.push(new Token(TokenType.DOT, '.', startLine, startCol)); break;
        case ':': this.tokens.push(new Token(TokenType.COLON, ':', startLine, startCol)); break;
        case ';': this.tokens.push(new Token(TokenType.SEMICOLON, ';', startLine, startCol)); break;
        default:
          throw new Error(`[Satır ${startLine}, Sütun ${startCol}] Tanımlanamayan karakter: '${ch}'`);
      }
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line, this.col));
    return this.tokens;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Lexer, Token, TokenType };
}
