/**
 * Tusi Programlama Dili — AST & Sözdizim Ayrıştırıcı (Parser v4.0)
 * Geliştirici: Tunahan Haksever (bitigey.com)
 */

if (typeof require !== 'undefined') {
  var { TokenType } = require('./lexer');
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens || [];
    this.pos = 0;
  }

  peek(offset = 0) {
    return this.pos + offset < this.tokens.length ? this.tokens[this.pos + offset] : this.tokens[this.tokens.length - 1];
  }

  current() {
    return this.peek();
  }

  isAtEnd() {
    return this.current().type === TokenType.EOF;
  }

  advance() {
    if (!this.isAtEnd()) this.pos++;
    return this.tokens[this.pos - 1];
  }

  match(...types) {
    for (const t of types) {
      if (this.check(t)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.current().type === type;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    const token = this.current();
    throw new Error(`[Satır ${token.line}, Sütun ${token.col}] Sözdizim Hatası: ${message} (Bulunan: '${token.value || token.type}')`);
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      // Ignore stray semicolons
      if (this.match(TokenType.SEMICOLON)) continue;
      const stmt = this.declaration();
      if (stmt) statements.push(stmt);
    }
    return { type: 'Program', body: statements };
  }

  declaration() {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration(false);
      if (this.match(TokenType.CONST)) return this.varDeclaration(true);
      if (this.match(TokenType.FUNCTION)) return this.functionDeclaration();
      return this.statement();
    } catch (e) {
      throw e;
    }
  }

  varDeclaration(isConst) {
    const nameToken = this.consume(TokenType.IDENTIFIER, 'Değişken ismi bekleniyor.');
    let init = null;
    if (this.match(TokenType.ASSIGN)) {
      init = this.expression();
    }
    this.match(TokenType.SEMICOLON);
    return {
      type: 'VariableDeclaration',
      name: nameToken.value,
      init,
      isConst,
      line: nameToken.line
    };
  }

  functionDeclaration() {
    const nameToken = this.consume(TokenType.IDENTIFIER, 'Fonksiyon ismi bekleniyor.');
    this.consume(TokenType.LPAREN, "Fonksiyon parametreleri için '(' bekleniyor.");
    const params = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        params.push(this.consume(TokenType.IDENTIFIER, 'Parametre ismi bekleniyor.').value);
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RPAREN, "Parametre listesinin sonunda ')' bekleniyor.");
    this.consume(TokenType.LBRACE, "Fonksiyon gövdesi için '{' bekleniyor.");
    const body = this.block();

    return {
      type: 'FunctionDeclaration',
      name: nameToken.value,
      params,
      body,
      line: nameToken.line
    };
  }

  statement() {
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.BREAK)) { this.match(TokenType.SEMICOLON); return { type: 'BreakStatement' }; }
    if (this.match(TokenType.CONTINUE)) { this.match(TokenType.SEMICOLON); return { type: 'ContinueStatement' }; }
    if (this.match(TokenType.LBRACE)) return { type: 'BlockStatement', body: this.block() };

    return this.expressionStatement();
  }

  block() {
    const statements = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.SEMICOLON)) continue;
      statements.push(this.declaration());
    }
    this.consume(TokenType.RBRACE, "Blok sonunda '}' bekleniyor.");
    return statements;
  }

  ifStatement() {
    this.match(TokenType.LPAREN);
    const test = this.expression();
    this.match(TokenType.RPAREN);
    this.match(TokenType.THEN); // optional 'ise'

    let consequent;
    if (this.match(TokenType.LBRACE)) {
      consequent = { type: 'BlockStatement', body: this.block() };
    } else {
      consequent = this.statement();
    }

    let alternate = null;
    if (this.match(TokenType.ELSE)) {
      if (this.match(TokenType.LBRACE)) {
        alternate = { type: 'BlockStatement', body: this.block() };
      } else {
        alternate = this.statement();
      }
    }

    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate
    };
  }

  whileStatement() {
    this.match(TokenType.LPAREN);
    const test = this.expression();
    this.match(TokenType.RPAREN);
    this.consume(TokenType.LBRACE, "Döngü gövdesi için '{' bekleniyor.");
    const body = { type: 'BlockStatement', body: this.block() };
    return { type: 'WhileStatement', test, body };
  }

  forStatement() {
    // for i in array OR for i range 1..10
    const varName = this.consume(TokenType.IDENTIFIER, "'için' döngüsünde değişken ismi bekleniyor.").value;
    
    if (this.match(TokenType.IN)) {
      const right = this.expression();
      this.consume(TokenType.LBRACE, "Döngü gövdesi için '{' bekleniyor.");
      const body = { type: 'BlockStatement', body: this.block() };
      return { type: 'ForInStatement', varName, right, body };
    } else if (this.match(TokenType.RANGE)) {
      const start = this.comparison();
      this.consume(TokenType.RANGE_OP, "Aralık belirtimi için '..' bekleniyor.");
      const end = this.comparison();
      this.consume(TokenType.LBRACE, "Döngü gövdesi için '{' bekleniyor.");
      const body = { type: 'BlockStatement', body: this.block() };
      return { type: 'ForRangeStatement', varName, start, end, body };
    } else {
      throw new Error(`[Satır ${this.current().line}] 'için' sonrasında 'içinde' veya 'aralığında' bekleniyor.`);
    }
  }

  returnStatement() {
    let value = null;
    if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RBRACE)) {
      value = this.expression();
    }
    this.match(TokenType.SEMICOLON);
    return { type: 'ReturnStatement', value };
  }

  printStatement() {
    this.consume(TokenType.LPAREN, "'yazdır' fonksiyonu için '(' bekleniyor.");
    const args = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RPAREN, "'yazdır' kapanış parantezi ')' bekleniyor.");
    this.match(TokenType.SEMICOLON);
    return { type: 'PrintStatement', args };
  }

  expressionStatement() {
    const expr = this.expression();
    this.match(TokenType.SEMICOLON);
    return { type: 'ExpressionStatement', expression: expr };
  }

  expression() {
    return this.assignment();
  }

  assignment() {
    const expr = this.logicalOr();

    if (this.match(TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN, TokenType.MUL_ASSIGN, TokenType.DIV_ASSIGN)) {
      const op = this.tokens[this.pos - 1].value;
      const value = this.assignment();

      if (expr.type === 'Identifier') {
        return { type: 'AssignmentExpression', operator: op, left: expr, right: value };
      } else if (expr.type === 'MemberExpression') {
        return { type: 'MemberAssignmentExpression', operator: op, object: expr.object, property: expr.property, computed: expr.computed, right: value };
      }
      throw new Error(`Geçersiz atama hedefi.`);
    }
    return expr;
  }

  logicalOr() {
    let left = this.logicalAnd();
    while (this.match(TokenType.OR, TokenType.KW_OR)) {
      const right = this.logicalAnd();
      left = { type: 'LogicalExpression', operator: '||', left, right };
    }
    return left;
  }

  logicalAnd() {
    let left = this.equality();
    while (this.match(TokenType.AND, TokenType.KW_AND)) {
      const right = this.equality();
      left = { type: 'LogicalExpression', operator: '&&', left, right };
    }
    return left;
  }

  equality() {
    let left = this.comparison();
    while (this.match(TokenType.EQ, TokenType.NEQ)) {
      const op = this.tokens[this.pos - 1].value;
      const right = this.comparison();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  comparison() {
    let left = this.term();
    while (this.match(TokenType.LT, TokenType.GT, TokenType.LTE, TokenType.GTE)) {
      const op = this.tokens[this.pos - 1].value;
      const right = this.term();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  term() {
    let left = this.factor();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const op = this.tokens[this.pos - 1].value;
      const right = this.factor();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  factor() {
    let left = this.power();
    while (this.match(TokenType.MUL, TokenType.DIV, TokenType.MOD)) {
      const op = this.tokens[this.pos - 1].value;
      const right = this.power();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  power() {
    let left = this.unary();
    while (this.match(TokenType.POW)) {
      const right = this.unary();
      left = { type: 'BinaryExpression', operator: '^', left, right };
    }
    return left;
  }

  unary() {
    if (this.match(TokenType.NOT, TokenType.KW_NOT, TokenType.MINUS)) {
      const op = this.tokens[this.pos - 1].value;
      const right = this.unary();
      return { type: 'UnaryExpression', operator: op, argument: right };
    }
    return this.callOrMember();
  }

  callOrMember() {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        // Function Call
        const args = [];
        if (!this.check(TokenType.RPAREN)) {
          do {
            args.push(this.expression());
          } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RPAREN, "Çağrı kapanış parantezi ')' bekleniyor.");
        expr = { type: 'CallExpression', callee: expr, arguments: args };
      } else if (this.match(TokenType.DOT)) {
        // Member Access obj.prop
        const prop = this.consume(TokenType.IDENTIFIER, "Noktadan sonra özellik ismi bekleniyor.");
        expr = { type: 'MemberExpression', object: expr, property: prop.value, computed: false };
      } else if (this.match(TokenType.LBRACKET)) {
        // Index Access arr[idx]
        const prop = this.expression();
        this.consume(TokenType.RBRACKET, "İndeks erişiminde ']' bekleniyor.");
        expr = { type: 'MemberExpression', object: expr, property: prop, computed: true };
      } else {
        break;
      }
    }
    return expr;
  }

  primary() {
    const token = this.current();

    if (this.match(TokenType.NUMBER)) return { type: 'Literal', value: token.value, raw: String(token.value) };
    if (this.match(TokenType.STRING)) return { type: 'Literal', value: token.value, raw: `"${token.value}"` };
    if (this.match(TokenType.BOOLEAN)) return { type: 'Literal', value: token.value, raw: String(token.value) };
    if (this.match(TokenType.NULL)) return { type: 'Literal', value: null, raw: 'boş' };

    if (this.match(TokenType.IDENTIFIER)) {
      return { type: 'Identifier', name: token.value };
    }

    // Array Literal [1, 2, 3]
    if (this.match(TokenType.LBRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACKET, "Dizi kapanışında ']' bekleniyor.");
      return { type: 'ArrayLiteral', elements };
    }

    // Object Literal { a: 1, b: 2 }
    if (this.match(TokenType.LBRACE)) {
      const properties = [];
      if (!this.check(TokenType.RBRACE)) {
        do {
          let key;
          if (this.check(TokenType.IDENTIFIER) || this.check(TokenType.STRING)) {
            key = this.advance().value;
          } else {
            throw new Error(`[Satır ${this.current().line}] Nesne anahtar ismi bekleniyor.`);
          }
          this.consume(TokenType.COLON, "Nesne tanımında ':' bekleniyor.");
          const val = this.expression();
          properties.push({ key, value: val });
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACE, "Nesne kapanışında '}' bekleniyor.");
      return { type: 'ObjectLiteral', properties };
    }

    // Grouping (expr)
    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "Gruplama sonunda ')' bekleniyor.");
      return expr;
    }

    // Anonymous Function Expression: fonksiyon(params) { ... }
    if (this.match(TokenType.FUNCTION)) {
      let name = null;
      if (this.check(TokenType.IDENTIFIER)) {
        name = this.advance().value;
      }
      this.consume(TokenType.LPAREN, "Fonksiyon parametreleri için '(' bekleniyor.");
      const params = [];
      if (!this.check(TokenType.RPAREN)) {
        do {
          params.push(this.consume(TokenType.IDENTIFIER, 'Parametre ismi bekleniyor.').value);
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RPAREN, "Parametre listesinin sonunda ')' bekleniyor.");
      this.consume(TokenType.LBRACE, "Fonksiyon gövdesi için '{' bekleniyor.");
      const body = this.block();
      return { type: 'FunctionDeclaration', name, params, body, isAnonymous: !name };
    }

    throw new Error(`[Satır ${token.line}, Sütun ${token.col}] Beklenmeyen ifade: '${token.value || token.type}'`);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Parser };
}
