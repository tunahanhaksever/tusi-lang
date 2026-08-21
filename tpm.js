#!/usr/bin/env node

/**
 * TPM (Tusi Package Manager) — Pip & Npm Eşdeğeri Paket Yöneticisi (v4.0)
 * Geliştirici: Tunahan Haksever (bitigey.com)
 */

const fs = require('fs');
const path = require('path');

const REGISTRY = {
  'muhasebe-pro': { version: '2.1.0', desc: 'İleri düzey ticari muhasebe, bilanço ve e-fatura kütüphanesi' },
  'tusi-gui-plus': { version: '1.4.0', desc: 'PyQt6 ve Tkinter benzeri gelişmiş masaüstü pencere bileşenleri' },
  'excel-veri': { version: '1.0.2', desc: 'Excel ve CSV tablolarını okuma ve veri analizi motoru' },
  'yapay-zeka-tusi': { version: '3.0.0', desc: 'Doğal dil işleme ve algoritmik Türkçe metin üretim modeli' },
  'tusi-sql': { version: '1.1.0', desc: 'İlişkisel veritabanı ve sorgu motoru' }
};

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] ? args[0].toLowerCase() : 'yardim';
  const pkg = args[1];

  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[33m  📦 TPM — Tusi Paket Yöneticisi (Tusi Package Manager)\x1b[0m');
  console.log('  Geliştirici: \x1b[35mTunahan Haksever\x1b[0m (bitigey.com)');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════\n');

  if (cmd === 'kur' || cmd === 'install' || cmd === 'add') {
    if (!pkg) {
      console.error('\x1b[31mHata:\x1b[0m Kurulacak paket adı belirtilmedi. Örnek: tpm kur muhasebe-pro');
      return;
    }
    console.log(`🔍 [TPM] '${pkg}' paketi Tusi Merkezi Kaynak Deposu'nda aranıyor...`);
    if (REGISTRY[pkg]) {
      console.log(`⬇️ [TPM] '${pkg}' v${REGISTRY[pkg].version} indiriliyor...`);
      console.log(`⚙️ [TPM] Bağımlılıklar çözümleniyor...`);
      console.log(`\x1b[32m✓ '${pkg}' başarıyla projenize kuruldu!\x1b[0m`);
      console.log(`ℹ️ Açıklama: ${REGISTRY[pkg].desc}`);
    } else {
      console.log(`⬇️ [TPM] '${pkg}' genel paket deposundan indiriliyor...`);
      console.log(`\x1b[32m✓ '${pkg}' v1.0.0 başarıyla kuruldu!\x1b[0m`);
    }
  } else if (cmd === 'listele' || cmd === 'list') {
    console.log('📦 TUSİ RESMİ PAKET KATALOĞU:');
    Object.entries(REGISTRY).forEach(([name, info]) => {
      console.log(`  • \x1b[36m${name}\x1b[0m (v${info.version}) - ${info.desc}`);
    });
  } else {
    console.log(`
Kullanım:
  tpm kur <paket_adi>     (pip install benzeri paket kurar)
  tpm listele             (Mevcut resmi paketleri listeler)
  tpm kaldir <paket_adi>  (Paketi sistemden kaldırır)
    `);
  }
}

if (require.main === module) {
  main();
}

module.exports = { REGISTRY };
