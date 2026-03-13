class BinOpNode {
    constructor(left, op, right) {
        this.left = left;
        this.op = op;
        this.right = right;
    }
}

class NumberNode {
    constructor(value) {
        this.value = value;
    }
}

class StringNode {
    constructor(value) {
        this.value = value;
    }
}

class VarAssignNode {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class VarAccessNode {
    constructor(name) {
        this.name = name;
    }
}

class PrintNode {
    constructor(expression) {
        this.expression = expression;
    }
}

class IfNode {
    constructor(condition, thenBlock, elseBlock = null) {
        this.condition = condition;
        this.thenBlock = thenBlock;
        this.elseBlock = elseBlock;
    }
}

class WhileNode {
    constructor(condition, body) {
        this.condition = condition;
        this.body = body;
    }
}

class FunctionDefNode {
    constructor(name, params, body) {
        this.name = name;
        this.params = params;
        this.body = body;
    }
}

class FunctionCallNode {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
}

class ReturnNode {
    constructor(expression) {
        this.expression = expression;
    }
}

class ArrayNode {
    constructor(elements) {
        this.elements = elements;
    }
}

class IndexNode {
    constructor(left, index) {
        this.left = left;
        this.index = index;
    }
}

class BlockNode {
    constructor(statements) {
        this.statements = statements;
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    currentToken() {
        return this.tokens[this.pos];
    }

    eat(tokenType) {
        if (this.currentToken().type === tokenType) {
            let token = this.currentToken();
            this.pos++;
            return token;
        } else {
            throw new Error(`Beklenen jeton ${tokenType}, ancak ${this.currentToken().type} bulundu.`);
        }
    }

    parse() {
        let statements = [];
        while (this.currentToken().type !== 'EOF') {
            statements.push(this.statement());
        }
        return new BlockNode(statements);
    }

    statement() {
        let token = this.currentToken();

        if (token.type === 'KEYWORD') {
            if (token.value === 'değişken') {
                this.eat('KEYWORD');
                let name = this.eat('IDENTIFIER').value;
                this.eat('EQUALS');
                let value = this.expression();
                return new VarAssignNode(name, value);
            } else if (token.value === 'yazdır') {
                this.eat('KEYWORD');
                this.eat('LPAREN');
                let expr = this.expression();
                this.eat('RPAREN');
                return new PrintNode(expr);
            } else if (token.value === 'eğer') {
                this.eat('KEYWORD');
                this.eat('LPAREN');
                let condition = this.expression();
                this.eat('RPAREN');
                if (this.currentToken().type === 'KEYWORD' && this.currentToken().value === 'ise') {
                    this.eat('KEYWORD');
                }

                let thenBlock = this.block();

                let elseBlock = null;
                if (this.currentToken().type === 'KEYWORD' && this.currentToken().value === 'değilse') {
                    this.eat('KEYWORD');
                    elseBlock = this.block();
                }

                return new IfNode(condition, thenBlock, elseBlock);
            } else if (token.value === 'döngü') {
                this.eat('KEYWORD');
                this.eat('LPAREN');
                let condition = this.expression();
                this.eat('RPAREN');
                let body = this.block();
                return new WhileNode(condition, body);
            } else if (token.value === 'fonksiyon') {
                this.eat('KEYWORD');
                let name = this.eat('IDENTIFIER').value;
                this.eat('LPAREN');
                let params = [];
                if (this.currentToken().type !== 'RPAREN') {
                    params.push(this.eat('IDENTIFIER').value);
                    while (this.currentToken().type === 'COMMA') {
                        this.eat('COMMA');
                        params.push(this.eat('IDENTIFIER').value);
                    }
                }
                this.eat('RPAREN');
                let body = this.block();
                return new FunctionDefNode(name, params, body);
            } else if (token.value === 'döndür') {
                this.eat('KEYWORD');
                let expr = this.expression();
                return new ReturnNode(expr);
            }
        }

        if (token.type === 'IDENTIFIER' && this.peekToken() && this.peekToken().type === 'EQUALS') {
            let name = this.eat('IDENTIFIER').value;
            this.eat('EQUALS');
            let value = this.expression();
            return new VarAssignNode(name, value);
        }

        return this.expression();
    }

    peekToken() {
        if (this.pos + 1 < this.tokens.length) {
            return this.tokens[this.pos + 1];
        }
        return null;
    }

    block() {
        this.eat('LBRACE');
        let statements = [];
        while (this.currentToken().type !== 'RBRACE' && this.currentToken().type !== 'EOF') {
            statements.push(this.statement());
        }
        this.eat('RBRACE');
        return new BlockNode(statements);
    }

    expression() {
        return this.binaryOp(this.term.bind(this), ['PLUS', 'MINUS', 'EQEQ', 'LESS', 'GREATER']);
    }

    term() {
        return this.binaryOp(this.factor.bind(this), ['MUL', 'DIV']);
    }

    factor() {
        let token = this.currentToken();
        if (token.type === 'NUMBER') {
            this.eat('NUMBER');
            return new NumberNode(token.value);
        } else if (token.type === 'STRING') {
            this.eat('STRING');
            return new StringNode(token.value);
        } else if (token.type === 'IDENTIFIER') {
            let name = this.eat('IDENTIFIER').value;
            if (this.currentToken().type === 'LPAREN') {
                this.eat('LPAREN');
                let args = [];
                if (this.currentToken().type !== 'RPAREN') {
                    args.push(this.expression());
                    while (this.currentToken().type === 'COMMA') {
                        this.eat('COMMA');
                        args.push(this.expression());
                    }
                }
                this.eat('RPAREN');
                return new FunctionCallNode(name, args);
            } else if (this.currentToken().type === 'LBRACKET') {
                this.eat('LBRACKET');
                let index = this.expression();
                this.eat('RBRACKET');
                return new IndexNode(new VarAccessNode(name), index);
            }
            return new VarAccessNode(name);
        } else if (token.type === 'LBRACKET') {
            this.eat('LBRACKET');
            let elements = [];
            if (this.currentToken().type !== 'RBRACKET') {
                elements.push(this.expression());
                while (this.currentToken().type === 'COMMA') {
                    this.eat('COMMA');
                    elements.push(this.expression());
                }
            }
            this.eat('RBRACKET');
            return new ArrayNode(elements);
        } else if (token.type === 'LPAREN') {
            this.eat('LPAREN');
            let expr = this.expression();
            this.eat('RPAREN');
            return expr;
        } else if (token.type === 'KEYWORD') {
            if (token.value === 'doğru') {
                this.eat('KEYWORD');
                return new NumberNode(true);
            } else if (token.value === 'yanlış') {
                this.eat('KEYWORD');
                return new NumberNode(false);
            }
        }

        throw new Error(`Sözdizimi hatası: ${JSON.stringify(token)}`);
    }

    binaryOp(func, ops) {
        let left = func();
        while (ops.includes(this.currentToken().type)) {
            let op = this.currentToken();
            this.eat(op.type);
            let right = func();
            left = new BinOpNode(left, op.type, right);
        }
        return left;
    }
}

module.exports = { Parser, BinOpNode, NumberNode, StringNode, VarAssignNode, VarAccessNode, PrintNode, IfNode, BlockNode };
