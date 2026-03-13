const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { Interpreter } = require('./interpreter');

function run(text, interpreter) {
    try {
        const lexer = new Lexer(text);
        const tokens = lexer.tokenize();

        const parser = new Parser(tokens);
        const ast = parser.parse();

        return interpreter.visit(ast);
    } catch (e) {
        console.error(`Hata: ${e.message}`);
    }
}

function main() {
    const interpreter = new Interpreter();
    const args = process.argv.slice(2);

    if (args.length > 0) {
        // File mode
        const filename = args[0];
        try {
            const text = fs.readFileSync(filename, 'utf8');
            run(text, interpreter);
        } catch (e) {
            console.error(`Hata: ${filename} dosyası okunamadı veya bulunamadı.`);
        }
    } else {
        // REPL mode
        console.log("Tusi Programlama Dili v2.0.0 (Engine: V8 - JS)");
        console.log("Çıkmak için 'çıkış()' yazın veya Ctrl+C basın.");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'tusi > '
        });

        rl.prompt();

        rl.on('line', (line) => {
            const text = line.trim();
            if (text === 'çıkış()') {
                rl.close();
                return;
            }
            if (text) {
                const result = run(text, interpreter);
                if (result !== undefined && result !== null) {
                    // console.log(result);
                }
            }
            rl.prompt();
        }).on('close', () => {
            process.exit(0);
        });
    }
}

if (require.main === module) {
    main();
}
