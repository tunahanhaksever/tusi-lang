const T_IDENTIFIER = 'IDENTIFIER';
const T_KEYWORD = 'KEYWORD';
const T_NUMBER = 'NUMBER';
const T_STRING = 'STRING';
const T_PLUS = 'PLUS';
const T_MINUS = 'MINUS';
const T_MUL = 'MUL';
const T_DIV = 'DIV';
const T_LPAREN = 'LPAREN';
const T_RPAREN = 'RPAREN';
const T_LBRACE = 'LBRACE';
const T_RBRACE = 'RBRACE';
const T_LBRACKET = 'LBRACKET';
const T_RBRACKET = 'RBRACKET';
const T_EQUALS = 'EQUALS';
const T_EQEQ = 'EQEQ';
const T_LESS = 'LESS';
const T_GREATER = 'GREATER';
const T_COMMA = 'COMMA';
const T_EOF = 'EOF';

const KEYWORDS = [
    'yazdır', 'değişken', 'eğer', 'ise', 'değilse',
    'döngü', 'dur', 'devam', 'fonksiyon', 'döndür',
    'doğru', 'yanlış', 'boş'
];

class Token {
    constructor(type, value = null) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.tokens = [];
    }

    tokenize() {
        while (this.pos < this.text.length) {
            let char = this.text[this.pos];

            if (/\s/.test(char)) {
                this.pos++;
                continue;
            }

            if (/[a-zA-ZçğıöşüÇĞİÖŞÜ_]/.test(char)) {
                this.handleIdentifier();
            } else if (/\d/.test(char)) {
                this.handleNumber();
            } else if (char === '"') {
                this.handleString();
            } else if (char === '+') {
                this.tokens.push(new Token(T_PLUS, '+'));
                this.pos++;
            } else if (char === '-') {
                this.tokens.push(new Token(T_MINUS, '-'));
                this.pos++;
            } else if (char === '*') {
                this.tokens.push(new Token(T_MUL, '*'));
                this.pos++;
            } else if (char === '/') {
                if (this.peek() === '/') {
                    while (this.pos < this.text.length && this.text[this.pos] !== '\n') {
                        this.pos++;
                    }
                } else {
                    this.tokens.push(new Token(T_DIV, '/'));
                    this.pos++;
                }
            } else if (char === '(') {
                this.tokens.push(new Token(T_LPAREN, '('));
                this.pos++;
            } else if (char === ')') {
                this.tokens.push(new Token(T_RPAREN, ')'));
                this.pos++;
            } else if (char === '{') {
                this.tokens.push(new Token(T_LBRACE, '{'));
                this.pos++;
            } else if (char === '}') {
                this.tokens.push(new Token(T_RBRACE, '}'));
                this.pos++;
            } else if (char === '[') {
                this.tokens.push(new Token(T_LBRACKET, '['));
                this.pos++;
            } else if (char === ']') {
                this.tokens.push(new Token(T_RBRACKET, ']'));
                this.pos++;
            } else if (char === '=') {
                if (this.peek() === '=') {
                    this.tokens.push(new Token(T_EQEQ, '=='));
                    this.pos += 2;
                } else {
                    this.tokens.push(new Token(T_EQUALS, '='));
                    this.pos++;
                }
            } else if (char === '<') {
                this.tokens.push(new Token(T_LESS, '<'));
                this.pos++;
            } else if (char === '>') {
                this.tokens.push(new Token(T_GREATER, '>'));
                this.pos++;
            } else if (char === ',') {
                this.tokens.push(new Token(T_COMMA, ','));
                this.pos++;
            } else {
                throw new Error(`Tanınmayan karakter: ${char} konum: ${this.pos}`);
            }
        }

        this.tokens.push(new Token(T_EOF));
        return this.tokens;
    }

    peek() {
        if (this.pos + 1 < this.text.length) {
            return this.text[this.pos + 1];
        }
        return null;
    }

    handleIdentifier() {
        let result = "";
        while (this.pos < this.text.length && /[a-zA-Z0-9çğıöşüÇĞİÖŞÜ_]/.test(this.text[this.pos])) {
            result += this.text[this.pos];
            this.pos++;
        }

        // --- SONDAN EKLEMELI ZEKA (Ek Çözümleyici) ---
        // Eğer kelime tam olarak bir anahtar kelime değilse, kökünü bulmaya çalışıyoruz.
        let core = result;
        
        // Yaygın ekleri (Eğer...sa, Eğer...se, ...dır) kontrol et
        const suffixes = ['sa', 'se', 'dır', 'dir', 'dur', 'dür', 'ı', 'i', 'u', 'ü', 'la', 'le'];
        
        if (!KEYWORDS.includes(result)) {
            for (let suffix of suffixes) {
                if (result.endsWith(suffix) && result.length > suffix.length) {
                    let root = result.slice(0, -suffix.length);
                    if (KEYWORDS.includes(root)) {
                        core = root; // Kök bulundu!
                        break;
                    }
                }
            }
        }

        if (KEYWORDS.includes(core)) {
            this.tokens.push(new Token(T_KEYWORD, core));
        } else {
            this.tokens.push(new Token(T_IDENTIFIER, result));
        }
    }

    handleNumber() {
        let result = "";
        while (this.pos < this.text.length && /[\d.]/.test(this.text[this.pos])) {
            result += this.text[this.pos];
            this.pos++;
        }
        this.tokens.push(new Token(T_NUMBER, result.includes('.') ? parseFloat(result) : parseInt(result)));
    }

    handleString() {
        this.pos++; // Skip starting quote
        let result = "";
        while (this.pos < this.text.length && this.text[this.pos] !== '"') {
            result += this.text[this.pos];
            this.pos++;
        }
        this.pos++; // Skip ending quote
        this.tokens.push(new Token(T_STRING, result));
    }
}

module.exports = { Lexer, Token };
