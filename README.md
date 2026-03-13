# 🇹🇷 Tusi Programlama Dili (v3.0 - On Numara)

### Türkiye'nin Yerli ve Milli Programlama Dili: Tam Kullanım Kılavuzu ve Teknik Rehber

**Tusi**, Türkçenin sondan eklemeli matematiksel yapısını dijital dünyaya taşıyan, yüksek performanslı ve tam donanımlı bir programlama ekosistemidir. Bu belge, Tusi'yi sıfırdan öğrenmeniz ve profesyonel projeler geliştirmeniz için bir "Kitap" titizliğiyle hazırlanmıştır.

---

## 📖 İÇİNDEKİLER
1. [Giriş ve Felsefe](#1-giriş-ve-felsefe)
2. [Kurulum Rehberi](#2-kurulum-rehberi)
3. [Temel Dil Bilgisi (Syntax)](#3-temel-dil-bilgisi-syntax)
4. [Sondan Eklemeli Zekâ (Ek Çözümleyici)](#4-sondan-eklemeli-zekâ)
5. [Fonksiyonlar ve Modülerlik](#5-fonksiyonlar-ve-modülerlik)
6. [TusiDB: Dahili Veritabanı](#6-tusidb-dahili-veritabanı)
7. [TusiWeb: Web Sitesi İnşası](#7-tusiweb-web-sitesi-inşası)
8. [Sistem ve Dış Entegrasyon](#8-sistem-ve-dış-entegrasyon)
9. [Güvenlik ve Anti-Hack Shield](#9-güvenlik-ve-anti-hack-shield)

---

## 1. GİRİŞ VE FELSEFE
Tusi, sadece bir kodlama aracı değil; bir "düşünce biçimi"dir. İngilizce bariyerini yıkarak, çocukların ve gençlerin kendi ana dillerinin algoritmasıyla makine gibi düşünmelerini sağlar. Tusi, Amerikan analitik yapısının aksine, Türkçenin kusursuz matematiksel yapısını (ek-kök mantığı) kullanır.

## 2. KURULUM REHBERİ
Tusi'yi tek komutla kurup hemen kodlamaya başlayabilirsiniz:

```powershell
# Windows Terminaline Yapıştırın:
iwr "https://raw.githubusercontent.com/tunahanhaksever/tusi-lang/main/hizli_kur.ps1" | iex
```

## 3. TEMEL DİL BİLGİSİ (SYNTAX)

### 3.1 Değişkenler
```tusi
değişken isim = "Tuna"
değişken yaş = 25
```

### 3.2 Karar Yapıları (eğer / ise / değilse)
```tusi
eğer (yaş > 18) ise {
    yazdır("Yetişkin")
} değilse {
    yazdır("Genç")
}
```

### 3.3 Döngüler
```tusi
değişken i = 1
döngü (i < 5) {
    yazdır(i + ". Adım")
    i = i + 1
}
```

## 4. SONDAN EKLEMELİ ZEKÂ
Tusi'nin en büyük farkı budur. Anahtar kelimelere eklenen Türkçe ekleri çözer.
```tusi
eğerse (puan > 50) ise { ... } // 'eğerse' otomatik olarak 'eğer' köküne çözümlenir.
eğersa (koşul) ise { ... }
```

## 5. FONKSİYONLAR VE MODÜLERLİK
Karmaşık işleri basit parçalara bölün:
```tusi
fonksiyon selamla(ad) {
    döndür "Merhaba " + ad
}
yazdır(selamla("Tuna"))
```

## 6. TusiDB: DAHİLİ VERİTABANI
Verilerinizi JSON formatında anında saklayın ve okuyun.
```tusi
değişken veriler = {"skor": 100, "seviye": 3}
vt_kaydet("oyun_verisi", veriler) // oyun_verisi.json oluşturur

değişken yuklenen = vt_oku("oyun_verisi")
yazdır("Mevcut Skor: " + yuklenen["skor"])
```

## 7. TusiWeb: WEB SİTESİ İNŞASI
Saniyeler içinde web sitesi yayını yapın:
```tusi
fonksiyon motor(istek, yanit) {
    yanit_html(yanit, "<h1>Tusi Portalı</h1><p>Yol: " + istek["yol"] + "</p>")
}
sunucu_baslat(8080, motor)
```

## 8. SİSTEM VE DIŞ ENTEGRASYON
Dış dünyayla konuşun:
- `sistem_bilgi()`: CPU, RAM ve kullanıcı raporu.
- `dis_komut("python --version")`: Python veya diğer dilleri Tusi içinden çalıştırın.
- `dosya_yaz("notlar.txt", "Tusi ile yazıldı")`: Dosya sistemi erişimi.

## 9. GÜVENLİK VE ANTI-HACK SHIELD
Tusi, siber saldırılara karşı **"Path Jail"** teknolojisini kullanır. 
*   **Kural:** Tusi kodları asla proje ana dizini dışına (örneğin `C:/Windows`) erişemez.
*   **Sonuç:** Yazdığınız programlar güvenli bir "sandbox" (kum havuzu) içinde çalışır.

---
### 🤝 Topluluk (İhtilal)
Erenlerin, tünel farelerinin ve yerli teknoloji sevdalılarının buluşma noktası. Katkı sağlamak için `KATKI_SAGLA.md` dosyasını inceleyin.

*"Fakir sahnesinden, dünya sahnesine... Bizim dilimizle, bizim kodumuzla."*

**Geliştiren:** tunahanhaksever
**Lisans:** Milli ve Global Açık Kaynak
