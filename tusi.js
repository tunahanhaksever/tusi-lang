#!/usr/bin/env node

/**
 * Tusi Programlama Dili — CLI & Çalıştırıcı (v4.0)
 * Geliştirici: Tunahan Haksever (bitigey.com)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { Interpreter } = require('./interpreter');

function execute(source, interpreter, printAST = false) {
  try {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    if (printAST) {
      console.log('--- AST Yapısı ---');
      console.log(JSON.stringify(ast, null, 2));
      console.log('------------------');
    }

    return interpreter.visit(ast);
  } catch (e) {
    console.error(`\x1b[31m[Tusi Hatası]\x1b[0m ${e.message}`);
  }
}

function startREPL() {
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[33m  🇹🇷 TUSİ PROGRAMLAMA DİLİ v4.0.0 (Ultra Core)\x1b[0m');
  console.log('  Geliştirici: \x1b[35mTunahan Haksever\x1b[0m (bitigey.com)');
  console.log('  Çıkış için "çıkış" veya Ctrl+C | Yardım için "yardım"');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════\n');

  const interpreter = new Interpreter();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[32mtusi>\x1b[0m '
  });

  rl.prompt();

  rl.on('line', (line) => {
    const text = line.trim();
    if (text === 'çıkış' || text === 'cikis' || text === 'exit') {
      console.log('Görüşmek üzere!');
      rl.close();
      return;
    }
    if (text === 'yardım' || text === 'yardim' || text === 'help') {
      console.log(`
  📖 Temel Komutlar:
    değişken x = 10
    yazdır("Merhaba Türkiye!")
    fonksiyon topla(a, b) { döndür a + b }
    yazdır(Matematik.karekök(16))
    için i aralığında 1..5 { yazdır(i) }
      `);
      rl.prompt();
      return;
    }

    if (text) {
      const start = Date.now();
      const res = execute(text, interpreter);
      if (res !== undefined && res !== null && typeof res !== 'function') {
        console.log(`\x1b[90m=> ${interpreter.formatValue(res)} (${Date.now() - start}ms)\x1b[0m`);
      }
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-i') || args.includes('--repl')) {
    startREPL();
    return;
  }

  const printAST = args.includes('--ast');
  const filename = args.find(a => !a.startsWith('-'));

  if (!filename) {
    startREPL();
    return;
  }

  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) {
    console.error(`\x1b[31mHata:\x1b[0m '${filename}' dosyası bulunamadı.`);
    process.exit(1);
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const interpreter = new Interpreter();

  execute(source, interpreter, printAST);
}

if (require.main === module) {
  main();
}

module.exports = { execute, Interpreter, Lexer, Parser };
