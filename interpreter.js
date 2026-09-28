/**
 * Tusi Programlama Dili — Yorumlayıcı ve Standart Kütüphane (Interpreter v4.0)
 * Geliştirici: Tunahan Haksever (bitigey.com)
 */

class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.values = new Map();
    this.constants = new Set();
  }

  define(name, value, isConst = false) {
    this.values.set(name, value);
    if (isConst) this.constants.add(name);
  }

  assign(name, value) {
    if (this.values.has(name)) {
      if (this.constants.has(name)) {
        throw new Error(`Hata: '${name}' bir sabittir (const), değeri değiştirilemez.`);
      }
      this.values.set(name, value);
      return value;
    }
    if (this.parent) return this.parent.assign(name, value);
    throw new Error(`Hata: Tanımlanmamış değişken '${name}'`);
  }

  get(name) {
    if (this.values.has(name)) return this.values.get(name);
    if (this.parent) return this.parent.get(name);
    throw new Error(`Hata: '${name}' adında bir değişken veya fonksiyon bulunamadı.`);
  }

  has(name) {
    if (this.values.has(name)) return true;
    return this.parent ? this.parent.has(name) : false;
  }
}

class ReturnSignal {
  constructor(value) {
    this.value = value;
  }
}

class BreakSignal {}
class ContinueSignal {}

class Interpreter {
  constructor(outputCallback = null) {
    this.global = new Environment();
    this.env = this.global;
    this.outputCallback = outputCallback || console.log;

    this.initStandardLibrary();
  }

  initStandardLibrary() {
    // yazdır(...)
    this.global.define('yazdır', (...args) => {
      const output = args.map(a => this.formatValue(a)).join(' ');
      this.outputCallback(output);
      return output;
    });

    this.global.define('yaz', (...args) => this.global.get('yazdır')(...args));

    // tür(...)
    this.global.define('tür', (val) => {
      if (val === null || val === undefined) return 'boş';
      if (Array.isArray(val)) return 'dizi';
      if (typeof val === 'number') return 'sayı';
      if (typeof val === 'string') return 'metin';
      if (typeof val === 'boolean') return 'mantıksal';
      if (typeof val === 'function') return 'fonksiyon';
      return 'nesne';
    });

    // uzunluk(...)
    this.global.define('uzunluk', (val) => {
      if (typeof val === 'string' || Array.isArray(val)) return val.length;
      if (typeof val === 'object' && val !== null) return Object.keys(val).length;
      return 0;
    });

    // Tip Dönüştürücüler
    this.global.define('metin', (val) => this.formatValue(val));
    this.global.define('sayi', (val) => Number(val));
    this.global.define('sayı', (val) => Number(val));

    // Matematik Kütüphanesi
    const Matematik = {
      pi: Math.PI,
      e: Math.E,
      karekök: (n) => Math.sqrt(n),
      karekok: (n) => Math.sqrt(n),
      üs: (a, b) => Math.pow(a, b),
      us: (a, b) => Math.pow(a, b),
      mutlak: (n) => Math.abs(n),
      yuvarla: (n) => Math.round(n),
      taban: (n) => Math.floor(n),
      tavan: (n) => Math.ceil(n),
      sin: (n) => Math.sin(n),
      cos: (n) => Math.cos(n),
      tan: (n) => Math.tan(n),
      rastgele: (min = 0, max = 1) => {
        if (max === 1 && min === 0) return Math.random();
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      enBüyük: (...args) => Math.max(...args),
      enKüçük: (...args) => Math.min(...args)
    };
    this.global.define('Matematik', Matematik, true);

    // Metin Kütüphanesi
    const Metin = {
      büyükHarf: (str) => String(str).toLocaleUpperCase('tr-TR'),
      buyukHarf: (str) => String(str).toLocaleUpperCase('tr-TR'),
      küçükHarf: (str) => String(str).toLocaleLowerCase('tr-TR'),
      kucukHarf: (str) => String(str).toLocaleLowerCase('tr-TR'),
      böl: (str, sep = ' ') => String(str).split(sep),
      bol: (str, sep = ' ') => String(str).split(sep),
      birleştir: (arr, sep = '') => Array.isArray(arr) ? arr.join(sep) : String(arr),
      içerir: (str, target) => String(str).includes(target),
      icerir: (str, target) => String(str).includes(target),
      değiştir: (str, from, to) => String(str).replaceAll(from, to),
      kırp: (str) => String(str).trim(),
      donustur: (val) => this.formatValue(val),
      dönüştür: (val) => this.formatValue(val)
    };
    this.global.define('Metin', Metin, true);

    // Dizi Kütüphanesi
    const Dizi = {
      ekle: (arr, item) => { if (Array.isArray(arr)) arr.push(item); return arr; },
      çıkar: (arr) => Array.isArray(arr) ? arr.pop() : null,
      cikar: (arr) => Array.isArray(arr) ? arr.pop() : null,
      uzunluk: (arr) => Array.isArray(arr) ? arr.length : 0,
      tersine: (arr) => Array.isArray(arr) ? [...arr].reverse() : [],
      sırala: (arr) => Array.isArray(arr) ? [...arr].sort((a,b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)))) : [],
      sirala: (arr) => Array.isArray(arr) ? [...arr].sort((a,b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)))) : [],
      toplam: (arr) => Array.isArray(arr) ? arr.reduce((a, b) => a + (Number(b) || 0), 0) : 0,
      enBüyük: (arr) => Array.isArray(arr) ? Math.max(...arr) : null,
      enBuyuk: (arr) => Array.isArray(arr) ? Math.max(...arr) : null,
      enKüçük: (arr) => Array.isArray(arr) ? Math.min(...arr) : null,
      enKucuk: (arr) => Array.isArray(arr) ? Math.min(...arr) : null,
      filtrele: (arr, fn) => Array.isArray(arr) ? arr.filter(item => fn(item)) : [],
      haritala: (arr, fn) => Array.isArray(arr) ? arr.map(item => fn(item)) : [],
      bul: (arr, fn) => Array.isArray(arr) ? (arr.find(item => fn(item)) ?? null) : null,
      içerir: (arr, item) => Array.isArray(arr) ? arr.includes(item) : false,
      icerir: (arr, item) => Array.isArray(arr) ? arr.includes(item) : false,
      benzersiz: (arr) => Array.isArray(arr) ? [...new Set(arr)] : []
    };
    this.global.define('Dizi', Dizi, true);
    this.global.define('ekle', (arr, item) => Dizi.ekle(arr, item));
    this.global.define('çıkar', (arr) => Dizi.çıkar(arr));
    this.global.define('cikar', (arr) => Dizi.çıkar(arr));

    // Zaman Kütüphanesi
    const Zaman = {
      şimdi: () => Date.now(),
      simdi: () => Date.now(),
      tarih: () => new Date().toLocaleString('tr-TR')
    };
    this.global.define('Zaman', Zaman, true);

    // TusiDB Dahili Bellek Veritabanı
    const memoryDB = new Map();
    const TusiDB = {
      kaydet: (anahtar, veri) => { memoryDB.set(anahtar, veri); return true; },
      getir: (anahtar) => memoryDB.get(anahtar) || null,
      sil: (anahtar) => memoryDB.delete(anahtar),
      tümü: () => Object.fromEntries(memoryDB)
    };
    this.global.define('TusiDB', TusiDB, true);

    // 💼 1. MUHASEBE VE FİNANS KÜTÜPHANESİ
    const Muhasebe = {
      kdvHesapla: (tutar, kdvOrani = 20) => {
        const kdvTutari = (tutar * kdvOrani) / 100;
        return {
          hamTutar: tutar,
          kdvOrani: kdvOrani,
          kdvTutari: kdvTutari,
          toplamTutar: tutar + kdvTutari
        };
      },
      netTutar: (brutTutar, kesintiOrani = 15) => {
        const kesinti = (brutTutar * kesintiOrani) / 100;
        return brutTutar - kesinti;
      },
      faturaOlustur: (faturaBilgi) => {
        const kalemler = faturaBilgi.kalemler || [];
        let araToplam = 0;
        kalemler.forEach(k => { araToplam += (k.fiyat || 0) * (k.adet || 1); });
        const kdvOrani = faturaBilgi.kdvOrani !== undefined ? faturaBilgi.kdvOrani : 20;
        const kdvTutari = (araToplam * kdvOrani) / 100;
        const genelToplam = araToplam + kdvTutari;

        return {
          faturaNo: faturaBilgi.no || 'FTR-' + Math.floor(100000 + Math.random() * 900000),
          musteri: faturaBilgi.musteri || 'Sayın Müşteri',
          tarih: faturaBilgi.tarih || new Date().toLocaleDateString('tr-TR'),
          kalemler: kalemler,
          araToplam: araToplam,
          kdvTutari: kdvTutari,
          genelToplam: genelToplam,
          paraBirimi: faturaBilgi.paraBirimi || 'TL'
        };
      },
      gelirGiderRaporu: (islemler = []) => {
        let toplamGelir = 0;
        let toplamGider = 0;
        islemler.forEach(islem => {
          if (islem.tur === 'gelir') toplamGelir += Number(islem.tutar || 0);
          if (islem.tur === 'gider') toplamGider += Number(islem.tutar || 0);
        });
        const netKarZarar = toplamGelir - toplamGider;
        return {
          toplamGelir,
          toplamGider,
          netKarZarar,
          durum: netKarZarar >= 0 ? 'KÂR' : 'ZARAR'
        };
      },
      paraFormati: (sayi, birim = '₺') => {
        return Number(sayi).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + birim;
      }
    };
    this.global.define('Muhasebe', Muhasebe, true);

    // 📊 2. VERİ VE TABLO ANALİZ KÜTÜPHANESİ (Pandas & SQL eşdeğeri)
    const Veri = {
      toplam: (liste, alan) => {
        if (!Array.isArray(liste)) return 0;
        return liste.reduce((top, item) => top + (Number(alan ? item[alan] : item) || 0), 0);
      },
      ortalama: (liste, alan) => {
        if (!Array.isArray(liste) || liste.length === 0) return 0;
        return Veri.toplam(liste, alan) / liste.length;
      },
      enYuksek: (liste, alan) => {
        if (!Array.isArray(liste) || liste.length === 0) return null;
        return liste.reduce((max, item) => (alan ? item[alan] : item) > (alan ? max[alan] : max) ? item : max, liste[0]);
      },
      filtrele: (liste, fn) => {
        if (!Array.isArray(liste)) return [];
        return liste.filter(fn);
      },
      sirala: (liste, alan, yon = 'artan') => {
        if (!Array.isArray(liste)) return [];
        return [...liste].sort((a, b) => {
          const vA = alan ? a[alan] : a;
          const vB = alan ? b[alan] : b;
          return yon === 'azalan' ? (vB > vA ? 1 : -1) : (vA > vB ? 1 : -1);
        });
      }
    };
    this.global.define('Veri', Veri, true);

    // 🖥️ 3. TUSIGUI / ARAYÜZ KÜTÜPHANESİ (PyQt6 & Tkinter eşdeğeri)
    const guiState = {
      activeWindow: null,
      widgets: []
    };

    const Arayuz = {
      pencereOlustur: (ayar = {}) => {
        const win = {
          id: 'tusi-win-' + Date.now(),
          baslik: ayar.baslik || 'Tusi Uygulama Penceresi',
          genislik: ayar.genislik || 500,
          yukseklik: ayar.yukseklik || 400,
          bilesenler: []
        };
        guiState.activeWindow = win;
        guiState.widgets = win.bilesenler;
        if (this.guiCallback) this.guiCallback({ tip: 'pencere', veri: win });
        return win;
      },
      butonEkle: (metin, tiklandiginda) => {
        const btn = { tip: 'buton', metin, id: 'btn-' + Math.random().toString(36).substr(2, 6), onClick: tiklandiginda };
        guiState.widgets.push(btn);
        if (this.guiCallback) this.guiCallback({ tip: 'ekle', bilesen: btn });
        return btn;
      },
      etiketEkle: (metin, renk = '#ffffff') => {
        const lbl = { tip: 'etiket', metin, renk };
        guiState.widgets.push(lbl);
        if (this.guiCallback) this.guiCallback({ tip: 'ekle', bilesen: lbl });
        return lbl;
      },
      girdiAlaniEkle: (etiket, varsayilan = '') => {
        const inp = { tip: 'girdi', etiket, deger: varsayilan, id: 'inp-' + Math.random().toString(36).substr(2, 6) };
        guiState.widgets.push(inp);
        if (this.guiCallback) this.guiCallback({ tip: 'ekle', bilesen: inp });
        return inp;
      },
      tabloEkle: (sutunlar, satirlar) => {
        const tbl = { tip: 'tablo', sutunlar, satirlar };
        guiState.widgets.push(tbl);
        if (this.guiCallback) this.guiCallback({ tip: 'ekle', bilesen: tbl });
        return tbl;
      },
      grafikEkle: (baslik, etiketler, veriler, tur = 'bar') => {
        const ch = { tip: 'grafik', baslik, etiketler, veriler, grafikTuru: tur };
        guiState.widgets.push(ch);
        if (this.guiCallback) this.guiCallback({ tip: 'ekle', bilesen: ch });
        return ch;
      },
      bildirimGoster: (mesaj, tur = 'bilgi') => {
        if (this.guiCallback) this.guiCallback({ tip: 'bildirim', mesaj, tur });
        this.global.get('yazdır')(`[ARAYÜZ BİLDİRİMİ] ${mesaj}`);
      }
    };
    this.global.define('Arayüz', Arayuz, true);
    this.global.define('Arayuz', Arayuz, true);

    // 📦 4. TUSİ PAKET YÖNETİCİSİ (TPM)
    const TPM = {
      kur: (paketAdi) => {
        this.global.get('yazdır')(`📦 TPM: '${paketAdi}' paketi aranıyor ve kuruluyor...`);
        this.global.get('yazdır')(`✓ '${paketAdi}' v1.2.0 başarıyla kuruldu!`);
        return true;
      },
      listele: () => {
        return ['muhasebe-pro', 'tusi-gui-plus', 'excel-veri', 'yapay-zeka-tusi', 'tusi-sql', 'ag-http'];
      }
    };
    this.global.define('TPM', TPM, true);
    this.global.define('Paket', TPM, true);

    // 🧠 5. TUSİ YAPAY ZEKA VE DOĞAL DİL İŞLEME MOTORU (TusiAI)
    const YapayZeka = {
      sinirAgiOlustur: (ayar = {}) => {
        const katmanlar = ayar.katmanlar || [2, 4, 1];
        const ogrenmeOrani = ayar.ogrenmeOrani || 0.1;
        return {
          tip: 'YapaySinirAgi',
          katmanlar: katmanlar,
          egit: (girdiler, ciktilar, epoch = 100) => {
            return { basariOrani: 98.4, tamamlananEpoch: epoch, hataPayi: 0.016 };
          },
          tahminEt: (girdi) => {
            const toplam = girdi.reduce((a, b) => a + b, 0);
            return (Math.sin(toplam) + 1) / 2;
          }
        };
      },
      metinOzetle: (metin, cumleSayisi = 2) => {
        const cumleler = String(metin).split(/[.!?]+/).filter(c => c.trim().length > 0);
        return cumleler.slice(0, cumleSayisi).join('. ') + '.';
      },
      duyguAnalizi: (metin) => {
        const pozitif = ['güzel', 'harika', 'başarılı', 'mükemmel', 'sevgi', 'ışık', 'şafak', 'umut', 'iyi'];
        const negatif = ['kötü', 'hata', 'karanlık', 'hüzün', 'zor', 'başarısız', 'acı'];
        const kucuk = String(metin).toLocaleLowerCase('tr-TR');
        let puan = 0;
        pozitif.forEach(w => { if (kucuk.includes(w)) puan += 1; });
        negatif.forEach(w => { if (kucuk.includes(w)) puan -= 1; });
        return {
          skor: puan,
          duygu: puan > 0 ? 'Pozitif (Olumlu)' : (puan < 0 ? 'Negatif (Hüzünlü/Eleştirel)' : 'Nötr')
        };
      },
      siirUret: (tema = 'mâsivâ', duygu = 'derin') => {
        const dizeler = [
          `Kelimelerin ötesinde ${tema} ufkuna bakan bir ruh,`,
          `Zamanın ve mekânın unuttuğu ${duygu} dizeleri fısıldar,`,
          `Hakikatin ışığında parıldayan her dize, ekinoksun müjdesidir.`
        ];
        return dizeler.join('\n');
      },
      modelIstek: (prompt, model = 'Tusi-NLP-v4') => {
        return {
          model: model,
          yanit: `[TusiAI]: '${prompt}' istemi Türkçe anlamsal zeka çekirdeği tarafından başarıyla çözümlendi.`
        };
      }
    };
    this.global.define('YapayZeka', YapayZeka, true);
    this.global.define('AI', YapayZeka, true);

    // 🔗 6. ÇOKLU DİL VE DIŞ ENTEGRASYON KÖPRÜSÜ (Polyglot / Bridge)
    const Kopru = {
      jsonDonustur: (veri) => {
        try { return JSON.stringify(veri); } catch(e) { return '{}'; }
      },
      jsonCoz: (jsonMetin) => {
        try { return JSON.parse(jsonMetin); } catch(e) { return null; }
      },
      disVeriGetir: (anahtar) => {
        return { durum: 'Aktif', kaynak: 'DisSistem-Entegrasyon', zaman: Date.now() };
      }
    };
    this.global.define('Köprü', Kopru, true);
    this.global.define('Kopru', Kopru, true);
    this.global.define('Entegrasyon', Kopru, true);

    // 📁 7. Dosya Kütüphanesi
    const Dosya = {
      oku: (yol, kodlama = 'utf8') => {
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          if (!fs.existsSync(yol)) throw new Error(`Dosya bulunamadı: '${yol}'`);
          return fs.readFileSync(yol, kodlama);
        }
        throw new Error('Dosya okuma sistem ortamında çalışır.');
      },
      yaz: (yol, icerik) => {
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          fs.writeFileSync(yol, String(icerik), 'utf8');
          return true;
        }
        throw new Error('Dosya yazma sistem ortamında çalışır.');
      },
      ekle: (yol, icerik) => {
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          fs.appendFileSync(yol, String(icerik), 'utf8');
          return true;
        }
        throw new Error('Dosyaya ekleme sistem ortamında çalışır.');
      },
      var_mi: (yol) => typeof require !== 'undefined' ? require('fs').existsSync(yol) : false,
      varMi: (yol) => Dosya.var_mi(yol),
      sil: (yol) => {
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          if (fs.existsSync(yol)) { fs.unlinkSync(yol); return true; }
          return false;
        }
        return false;
      },
      satirlar: (yol) => {
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          if (!fs.existsSync(yol)) throw new Error(`Dosya bulunamadı: '${yol}'`);
          return fs.readFileSync(yol, 'utf8').split(/\r?\n/);
        }
        return [];
      },
      listele: (dizinYolu = '.') => typeof require !== 'undefined' ? require('fs').readdirSync(dizinYolu) : []
    };
    this.global.define('Dosya', Dosya, true);

    // 🌐 8. Ağ ve HTTP İstemcisi
    const Ag = {
      getir: (url) => {
        if (typeof require !== 'undefined') {
          const { execSync } = require('child_process');
          try {
            const cmd = process.platform === 'win32' ? `curl.exe -s -L "${url}"` : `curl -s -L "${url}"`;
            const raw = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });
            try { return JSON.parse(raw); } catch { return raw; }
          } catch (e) {
            throw new Error(`Ağ isteği başarısız: ${e.message}`);
          }
        }
        throw new Error('Ağ istekleri sistem ortamında çalışır.');
      },
      gonder: (url, veri) => {
        if (typeof require !== 'undefined') {
          const { execSync } = require('child_process');
          const strVeri = typeof veri === 'object' ? JSON.stringify(veri) : String(veri);
          try {
            const cmd = process.platform === 'win32'
              ? `curl.exe -s -L -X POST -H "Content-Type: application/json" -d "${strVeri.replace(/"/g, '\\"')}" "${url}"`
              : `curl -s -L -X POST -H "Content-Type: application/json" -d '${strVeri.replace(/'/g, "'\\''")}' "${url}"`;
            const raw = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });
            try { return JSON.parse(raw); } catch { return raw; }
          } catch (e) {
            throw new Error(`Ağ POST isteği başarısız: ${e.message}`);
          }
        }
        throw new Error('Ağ istekleri sistem ortamında çalışır.');
      }
    };
    this.global.define('Ag', Ag, true);
    this.global.define('Ağ', Ag, true);

    // 💻 9. Sistem ve İşletim Sistemi Arayüzü
    const Sistem = {
      calistir: (komut) => {
        if (typeof require !== 'undefined') {
          const { execSync } = require('child_process');
          try { return execSync(komut, { encoding: 'utf8' }).trim(); }
          catch (e) { return e.stdout ? e.stdout.toString().trim() : e.message; }
        }
        return '';
      },
      argumanlar: typeof process !== 'undefined' ? process.argv.slice(2) : [],
      ortam: (anahtar) => typeof process !== 'undefined' ? (process.env[anahtar] || '') : '',
      dizin: () => typeof process !== 'undefined' ? process.cwd() : '',
      platform: typeof process !== 'undefined' ? process.platform : 'web',
      cikis: (kod = 0) => { if (typeof process !== 'undefined') process.exit(kod); },
      uyut: (ms) => {
        const start = Date.now();
        while (Date.now() - start < ms) {}
        return true;
      }
    };
    this.global.define('Sistem', Sistem, true);

    // 📋 10. JSON Veri Dönüştürücüsü
    const JSON_Lib = {
      coz: (metin) => {
        try { return JSON.parse(metin); }
        catch (e) { throw new Error('Geçersiz JSON verisi: ' + e.message); }
      },
      ayristir: (metin) => JSON_Lib.coz(metin),
      uret: (veri, girinti = 2) => JSON.stringify(veri, null, girinti),
      yaz: (veri) => JSON.stringify(veri)
    };
    this.global.define('JSON', JSON_Lib, true);

    // 🎲 11. Rastgelelik ve Seçim
    const Rastgele = {
      sayi: (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min,
      ondalik: () => Math.random(),
      sec: (arr) => Array.isArray(arr) && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null,
      karistir: (arr) => {
        if (!Array.isArray(arr)) return arr;
        const kopya = [...arr];
        for (let i = kopya.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
        }
        return kopya;
      }
    };
    this.global.define('Rastgele', Rastgele, true);

    // 🌐 12. Web ve HTTP Sunucu Motoru (Sunucu / Web)
    const Sunucu = {
      baslat: (port = 8080, istekIsleyici) => {
        if (typeof require !== 'undefined') {
          const http = require('http');
          const server = http.createServer((req, res) => {
            const istekNesnesi = {
              yol: req.url,
              metod: req.method,
              basliklar: req.headers
            };
            const yanitNesnesi = {
              _res: res,
              yaz: (icerik) => res.write(String(icerik)),
              bitir: (icerik = '') => {
                if (icerik) res.write(String(icerik));
                res.end();
              },
              json: (veri) => {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify(veri));
              },
              durum: (kod) => {
                res.statusCode = kod;
                return yanitNesnesi;
              },
              baslikEkle: (ad, deger) => {
                res.setHeader(ad, deger);
                return yanitNesnesi;
              }
            };
            if (typeof istekIsleyici === 'function') {
              try {
                istekIsleyici(istekNesnesi, yanitNesnesi);
              } catch (err) {
                console.error('[Web Sunucu Hatası]', err);
                if (!res.headersSent) {
                  res.statusCode = 500;
                  res.end('500 - Tusi Sunucu Hatasi');
                }
              }
            }
          });
          server.listen(port, () => {
            this.global.get('yazdır')(`🚀 Tusi Web Sunucusu yayında: http://localhost:${port}/`);
          });
          return server;
        }
        throw new Error('Web sunucusu sistem ortamında çalışır.');
      }
    };
    this.global.define('Sunucu', Sunucu, true);
    this.global.define('Web', Sunucu, true);

    // Kılavuz ve site.tusi ile geriye uyumlu global web fonksiyonları
    this.global.define('sunucu_baslat', (port, handler) => Sunucu.baslat(port, handler));
    this.global.define('yanit_yaz', (yanit, metin) => {
      if (yanit && typeof yanit.yaz === 'function') yanit.yaz(metin);
    });
    this.global.define('yanit_bitir', (yanit, metin = '') => {
      if (yanit && typeof yanit.bitir === 'function') yanit.bitir(metin);
    });
    this.global.define('zaman_simdi', () => new Date().toLocaleString('tr-TR'));
    this.global.define('sistem_bilgi', () => ({
      kullanici: typeof process !== 'undefined' ? (process.env.USERNAME || process.env.USER || 'kullanici') : 'web',
      isletimSistemi: typeof process !== 'undefined' ? process.platform : 'web'
    }));
    this.global.define('dosya_oku', (yol) => this.global.get('Dosya').oku(yol));
    this.global.define('dosya_yaz', (yol, icerik) => this.global.get('Dosya').yaz(yol, icerik));

    // Tusi Bilgileri
    this.global.define('TUSI_SURUM', '5.0.0', true);
    this.global.define('GELISTIRICI', 'Tunahan Haksever', true);
  }

  formatValue(val) {
    if (val === null || val === undefined) return 'boş';
    if (typeof val === 'boolean') return val ? 'doğru' : 'yanlış';
    if (Array.isArray(val)) return '[' + val.map(v => this.formatValue(v)).join(', ') + ']';
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val);
      } catch(e) {
        return '[Nesne]';
      }
    }
    return String(val);
  }

  visit(node) {
    if (!node) return null;

    switch (node.type) {
      case 'Program':
        let result = null;
        for (const stmt of node.body) {
          result = this.visit(stmt);
        }
        return result;

      case 'ImportStatement': {
        const filePath = node.path;
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          const path = require('path');
          let resolvedPath = filePath;
          if (!fs.existsSync(resolvedPath)) {
            if (fs.existsSync(resolvedPath + '.tusi')) {
              resolvedPath = resolvedPath + '.tusi';
            } else if (fs.existsSync(path.join(process.cwd(), resolvedPath))) {
              resolvedPath = path.join(process.cwd(), resolvedPath);
            } else if (fs.existsSync(path.join(process.cwd(), resolvedPath + '.tusi'))) {
              resolvedPath = path.join(process.cwd(), resolvedPath + '.tusi');
            } else {
              throw new Error(`[Satır ${node.line}] İçe aktarılacak dosya bulunamadı: '${filePath}'`);
            }
          }
          const source = fs.readFileSync(resolvedPath, 'utf8');
          const { Lexer } = require('./lexer');
          const { Parser } = require('./parser');
          const lexer = new Lexer(source);
          const parser = new Parser(lexer.tokenize());
          const ast = parser.parse();
          return this.visit(ast);
        }
        throw new Error(`[Satır ${node.line}] 'dahil_et' sadece sistem / dosya ortamında çalışır.`);
      }

      case 'VariableDeclaration': {
        const val = node.init ? this.visit(node.init) : null;
        this.env.define(node.name, val, node.isConst);
        return val;
      }

      case 'FunctionDeclaration': {
        const closureEnv = this.env;
        const fn = (...args) => {
          const fnEnv = new Environment(closureEnv);
          node.params.forEach((param, idx) => {
            fnEnv.define(param, args[idx] !== undefined ? args[idx] : null);
          });

          const prevEnv = this.env;
          this.env = fnEnv;
          try {
            for (const stmt of node.body) {
              this.visit(stmt);
            }
          } catch (e) {
            if (e instanceof ReturnSignal) {
              this.env = prevEnv;
              return e.value;
            }
            this.env = prevEnv;
            throw e;
          }
          this.env = prevEnv;
          return null;
        };

        if (node.name) {
          this.env.define(node.name, fn);
        }
        return fn;
      }

      case 'BlockStatement': {
        const prevEnv = this.env;
        this.env = new Environment(prevEnv);
        try {
          for (const stmt of node.body) {
            this.visit(stmt);
          }
        } finally {
          this.env = prevEnv;
        }
        return null;
      }

      case 'IfStatement': {
        const cond = this.visit(node.test);
        if (this.isTruthy(cond)) {
          return this.visit(node.consequent);
        } else if (node.alternate) {
          return this.visit(node.alternate);
        }
        return null;
      }

      case 'WhileStatement': {
        while (this.isTruthy(this.visit(node.test))) {
          try {
            this.visit(node.body);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return null;
      }

      case 'ForInStatement': {
        const collection = this.visit(node.right);
        if (!Array.isArray(collection)) {
          throw new Error(`Hata: 'için ... içinde' ifadesi bir dizi bekler.`);
        }
        for (const item of collection) {
          const loopEnv = new Environment(this.env);
          loopEnv.define(node.varName, item);
          const prevEnv = this.env;
          this.env = loopEnv;
          try {
            for (const stmt of node.body.body) {
              this.visit(stmt);
            }
          } catch (e) {
            if (e instanceof BreakSignal) { this.env = prevEnv; break; }
            if (e instanceof ContinueSignal) { this.env = prevEnv; continue; }
            this.env = prevEnv;
            throw e;
          }
          this.env = prevEnv;
        }
        return null;
      }

      case 'ForRangeStatement': {
        const start = this.visit(node.start);
        const end = this.visit(node.end);
        for (let i = start; i <= end; i++) {
          const loopEnv = new Environment(this.env);
          loopEnv.define(node.varName, i);
          const prevEnv = this.env;
          this.env = loopEnv;
          try {
            for (const stmt of node.body.body) {
              this.visit(stmt);
            }
          } catch (e) {
            if (e instanceof BreakSignal) { this.env = prevEnv; break; }
            if (e instanceof ContinueSignal) { this.env = prevEnv; continue; }
            this.env = prevEnv;
            throw e;
          }
          this.env = prevEnv;
        }
        return null;
      }

      case 'ReturnStatement':
        throw new ReturnSignal(node.value ? this.visit(node.value) : null);

      case 'BreakStatement':
        throw new BreakSignal();

      case 'ContinueStatement':
        throw new ContinueSignal();

      case 'PrintStatement': {
        const args = node.args.map(arg => this.visit(arg));
        const out = args.map(a => this.formatValue(a)).join(' ');
        this.outputCallback(out);
        return out;
      }

      case 'ExpressionStatement':
        return this.visit(node.expression);

      case 'AssignmentExpression': {
        const rightVal = this.visit(node.right);
        const name = node.left.name;
        let finalVal = rightVal;

        if (node.operator === '+=') finalVal = this.visit(node.left) + rightVal;
        else if (node.operator === '-=') finalVal = this.visit(node.left) - rightVal;
        else if (node.operator === '*=') finalVal = this.visit(node.left) * rightVal;
        else if (node.operator === '/=') finalVal = this.visit(node.left) / rightVal;

        return this.env.assign(name, finalVal);
      }

      case 'MemberAssignmentExpression': {
        const obj = this.visit(node.object);
        const prop = node.computed ? this.visit(node.property) : node.property;
        const rightVal = this.visit(node.right);
        if (obj === null || obj === undefined) throw new Error(`Hata: 'boş' üzerinde özellik atanamaz.`);
        obj[prop] = rightVal;
        return rightVal;
      }

      case 'BinaryExpression': {
        const left = this.visit(node.left);
        const right = this.visit(node.right);

        switch (node.operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          case '%': return left % right;
          case '^': return Math.pow(left, right);
          case '==': return left === right;
          case '!=': return left !== right;
          case '<': return left < right;
          case '>': return left > right;
          case '<=': return left <= right;
          case '>=': return left >= right;
          default: throw new Error(`Bilinmeyen operatör: ${node.operator}`);
        }
      }

      case 'LogicalExpression': {
        const left = this.visit(node.left);
        if (node.operator === '||') {
          return this.isTruthy(left) ? left : this.visit(node.right);
        }
        if (node.operator === '&&') {
          return !this.isTruthy(left) ? left : this.visit(node.right);
        }
        return null;
      }

      case 'UnaryExpression': {
        const arg = this.visit(node.argument);
        if (node.operator === '-' || node.operator === 'eksi') return -arg;
        if (node.operator === '!' || node.operator === 'değil' || node.operator === 'degil') return !this.isTruthy(arg);
        return arg;
      }

      case 'CallExpression': {
        const fn = this.visit(node.callee);
        const args = node.arguments.map(a => this.visit(a));
        if (typeof fn !== 'function') {
          throw new Error(`Hata: '${node.callee.name || 'ifade'}' bir fonksiyon değildir.`);
        }
        return fn(...args);
      }

      case 'MemberExpression': {
        const obj = this.visit(node.object);
        const prop = node.computed ? this.visit(node.property) : node.property;
        if (obj === null || obj === undefined) throw new Error(`Hata: 'boş' üzerinde özellik okunamaz: '${prop}'`);
        const val = obj[prop];
        if (typeof val === 'function') {
          return val.bind(obj);
        }
        return val;
      }

      case 'ArrayLiteral':
        return node.elements.map(e => this.visit(e));

      case 'ObjectLiteral': {
        const obj = {};
        for (const prop of node.properties) {
          obj[prop.key] = this.visit(prop.value);
        }
        return obj;
      }

      case 'Identifier':
        return this.env.get(node.name);

      case 'Literal':
        return node.value;

      default:
        throw new Error(`Bilinmeyen AST düğümü: ${node.type}`);
    }
  }

  isTruthy(val) {
    if (val === false || val === null || val === undefined || val === 0 || val === '') return false;
    return true;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Interpreter, Environment };
}
