const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

class ReturnValue {
    constructor(value) {
        this.value = value;
    }
}

class TusiFunction {
    constructor(node, parentInterpreter) {
        this.node = node;
        this.parentInterpreter = parentInterpreter;
    }

    call(args) {
        const interpreter = new Interpreter(this.parentInterpreter.globalVariables, this.parentInterpreter.variables);
        
        for (let i = 0; i < this.node.params.length; i++) {
            interpreter.variables[this.node.params[i]] = args[i];
        }

        try {
            return interpreter.visit(this.node.body);
        } catch (e) {
            if (e instanceof ReturnValue) {
                return e.value;
            }
            throw e;
        }
    }
}

class Interpreter {
    constructor(globalVariables = {}, parentVariables = null) {
        this.globalVariables = globalVariables;
        this.variables = Object.create(parentVariables || globalVariables);
        
        if (Object.keys(this.globalVariables).length === 0 && !parentVariables) {
            this.setupStdLib();
        }
    }

    setupStdLib() {
        // Matematik
        this.globalVariables['mat_sin'] = (args) => Math.sin(args[0]);
        this.globalVariables['mat_cos'] = (args) => Math.cos(args[0]);
        this.globalVariables['mat_kok'] = (args) => Math.sqrt(args[0]);
        this.globalVariables['mat_rastgele'] = (args) => Math.random() * (args[0] || 1);
        this.globalVariables['mat_mutlak'] = (args) => Math.abs(args[0]);
        this.globalVariables['mat_yuvarla'] = (args) => Math.round(args[0]);
        
        // Dizi/Metin
        this.globalVariables['uzunluk'] = (args) => args[0].length;
        this.globalVariables['ekle'] = (args) => {
            if (Array.isArray(args[0])) {
                args[0].push(args[1]);
                return args[0];
            }
            return args[0] + args[1];
        };
        
        // Zaman
        this.globalVariables['zaman_simdi'] = () => Date.now();
        
        // Sistem
        this.globalVariables['tur_ne'] = (args) => typeof args[0];
        this.globalVariables['sistem_bilgi'] = () => {
            return {
                platform: os.platform(),
                islemci: os.arch(),
                bellek_toplam: os.totalmem(),
                bellek_bos: os.freemem(),
                kullanici: os.userInfo().username
            };
        };

        // --- HACK KORUMALI DOSYA SISTEMI ---
        const safePath = (p) => {
            const requested = path.resolve(p);
            if (!requested.startsWith(process.cwd())) {
                throw new Error("GÜVENLİK İHLALİ: Proje klasörü dışına çıkılamaz!");
            }
            return requested;
        };

        this.globalVariables['dosya_oku'] = (args) => fs.readFileSync(safePath(args[0]), 'utf8');
        this.globalVariables['dosya_yaz'] = (args) => {
            fs.writeFileSync(safePath(args[0]), args[1], 'utf8');
            return true;
        };

        // --- VERİTABANI MOTORU (JSON TABANLI) ---
        this.globalVariables['vt_kaydet'] = (args) => {
            const dbPath = safePath(args[0] + ".json");
            const data = args[1];
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
            return true;
        };

        this.globalVariables['vt_oku'] = (args) => {
            const dbPath = safePath(args[0] + ".json");
            if (!fs.existsSync(dbPath)) return null;
            return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        };

        // --- DIŞ DÜNYA ENTEGRASYONU ---
        this.globalVariables['dis_komut'] = (args) => {
            try {
                return execSync(args[0]).toString();
            } catch (e) {
                return "Hata: " + e.message;
            }
        };

        // --- METİN ARAÇLARI ---
        this.globalVariables['metin_buyut'] = (args) => String(args[0]).toLocaleUpperCase('tr-TR');
        this.globalVariables['metin_kucult'] = (args) => String(args[0]).toLocaleLowerCase('tr-TR');
        this.globalVariables['metin_parcala'] = (args) => String(args[0]).split(args[1]);

        this.globalVariables['konsol_satir'] = () => {
            return require('readline-sync').question('');
        };

        // --- WEB MOTORU (PROFESYONEL) ---
        this.globalVariables['sunucu_baslat'] = (args) => {
            const port = args[0];
            const tusiHandler = args[1];

            const server = http.createServer((req, res) => {
                const istek = { yol: req.url, metot: req.method, basliklar: req.headers };
                const yanit = {
                    yaz: (text) => res.write(String(text)),
                    bitir: () => res.end(),
                    durum: (code) => { res.statusCode = code },
                    html: (content) => {
                        res.setHeader('Content-Type', 'text/html; charset=utf-8');
                        res.end(content);
                    }
                };
                tusiHandler.call([istek, yanit]);
            });

            server.listen(port, () => console.log(`Tusi Web Sunucusu http://localhost:${port} adresinde hazır!`));
        };

        this.globalVariables['yanit_html'] = (args) => args[0].html(args[1]);
        this.globalVariables['yanit_yaz'] = (args) => args[0].yaz(args[1]);
        this.globalVariables['yanit_bitir'] = (args) => args[0].bitir();
    }

    visit(node) {
        if (!node) return null;
        const methodName = `visit${node.constructor.name}`;
        if (this[methodName]) {
            return this[methodName](node);
        }
        throw new Error(`Ziyaret yöntemi tanımlanmamış: ${node.constructor.name}`);
    }

    visitBlockNode(node) {
        let result = null;
        for (let statement of node.statements) {
            result = this.visit(statement);
        }
        return result;
    }

    visitNumberNode(node) {
        return node.value;
    }

    visitStringNode(node) {
        return node.value;
    }

    visitBinOpNode(node) {
        let left = this.visit(node.left);
        let right = this.visit(node.right);

        switch (node.op) {
            case 'PLUS': return left + right;
            case 'MINUS': return left - right;
            case 'MUL': return left * right;
            case 'DIV': return left / right;
            case 'EQEQ': return left == right;
            case 'LESS': return left < right;
            case 'GREATER': return left > right;
            default:
                throw new Error(`Bilinmeyen operatör: ${node.op}`);
        }
    }

    visitVarAssignNode(node) {
        let val = this.visit(node.value);
        this.variables[node.name] = val;
        return val;
    }

    visitVarAccessNode(node) {
        if (node.name in this.variables) {
            return this.variables[node.name];
        } else {
            throw new Error(`Tanımlanmamış değişken: ${node.name}`);
        }
    }

    visitPrintNode(node) {
        let val = this.visit(node.expression);
        console.log(val);
        return val;
    }

    visitIfNode(node) {
        let condition = this.visit(node.condition);
        if (condition) {
            return this.visit(node.thenBlock);
        } else if (node.elseBlock) {
            return this.visit(node.elseBlock);
        }
        return null;
    }

    visitWhileNode(node) {
        let result = null;
        while (this.visit(node.condition)) {
            result = this.visit(node.body);
        }
        return result;
    }

    visitFunctionDefNode(node) {
        const func = new TusiFunction(node, this);
        this.variables[node.name] = func;
        return func;
    }

    visitFunctionCallNode(node) {
        const func = this.visitVarAccessNode({ name: node.name });
        const args = node.args.map(arg => this.visit(arg));

        if (typeof func === 'function') {
            return func(args);
        } else if (func instanceof TusiFunction) {
            return func.call(args);
        } else {
            throw new Error(`${node.name} bir fonksiyon değil.`);
        }
    }

    visitReturnNode(node) {
        const value = this.visit(node.expression);
        throw new ReturnValue(value);
    }

    visitArrayNode(node) {
        return node.elements.map(el => this.visit(el));
    }

    visitIndexNode(node) {
        const left = this.visit(node.left);
        const index = this.visit(node.index);
        return left[index];
    }
}

module.exports = { Interpreter };
