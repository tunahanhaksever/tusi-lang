# 🇹🇷 Tusi Programlama Dili (v4.0 Ultra)

<div align="center">

![Tusi Lang Banner](https://img.shields.io/badge/Tusi_Language-v4.0.0-e11d48?style=for-the-badge&logo=codeforces&logoColor=white)
![Author](https://img.shields.io/badge/Yarat%C4%B1c%C4%B1-Tunahan_Haksever-00f0ff?style=for-the-badge&logo=github&logoColor=white)
![Online Playground](https://img.shields.io/badge/Web_Playground-Canl%C4%B1-10b981?style=for-the-badge&logo=google-chrome&logoColor=white)
![License](https://img.shields.io/badge/Lisans-MIT-fbbf24?style=for-the-badge)

**Tunahan Haksever tarafından geliştirilen; Türkçenin matematiksel yapısını dijital dünyaya taşıyan, Türkçe sözdizimine (syntax) ve zengin standart kütüphaneye sahip açık kaynaklı modern programlama dili.**

[🌐 Web Playground (Tarayıcıda Dene)](#-web-playground) • [Sözdizim Rehberi](#-temel-dil-bilgisi-syntax) • [Standart Kütüphane](#-standart-kütüphane-std) • [Tunahan Haksever Kimdir?](#-tunahan-haksever-kimdir--bitigey-hakkında)

</div>

---

## 🌐 Web Playground
Tusi kodlarını herhangi bir şey yüklemeden doğrudan web tarayıcınızda yazıp çalıştırın:  
👉 **[https://tunahanhaksever.github.io/tusi-lang/](https://tunahanhaksever.github.io/tusi-lang/)**

---

## ⚡ Hızlı Başlangıç & Kurulum

```bash
# 1. Depoyu klonlayın
git clone https://github.com/tunahanhaksever/tusi-lang.git
cd tusi-lang

# 2. Örnek bir Tusi dosyasını çalıştırın
node tusi.js merhaba.tusi

# 3. İnteraktif REPL konsolunu başlatın
node tusi.js --repl
```

---

## 📖 Temel Dil Bilgisi (Syntax)

### 1. Değişkenler ve Sabitler
```tusi
değişken isim = "Tunahan Haksever"
değişken yas = 20
sabit PI = 3.14159
```

### 2. Karar Yapıları (`eğer / ise / değilse`)
```tusi
eğer (yas >= 18) ise {
    yazdır(isim, "Reşit bir bireydir.")
} değilse {
    yazdır(isim, "Henüz gençtir.")
}
```

### 3. Fonksiyonlar ve Özyineleme (Recursion)
```tusi
fonksiyon fibonacci(n) {
    eğer (n <= 1) ise {
        döndür n
    }
    döndür fibonacci(n - 1) + fibonacci(n - 2)
}

yazdır("Fibonacci(10):", fibonacci(10))
```

### 4. Döngüler (`döngü`, `için ... aralığında`, `için ... içinde`)
```tusi
// Aralık Döngüsü
için i aralığında 1..5 {
    yazdır(i + ". Adım Tamamlandı")
}

// Dizi Döngüsü
değişken sehirler = ["İstanbul", "Trabzon", "Ankara"]
için sehir içinde sehirler {
    yazdır("Şehir:", sehir)
}
```

---

## 🧮 Standart Kütüphane (Std)

- **`Matematik`:** `karekök(n)`, `üs(a, b)`, `rastgele(min, max)`, `mutlak(n)`, `yuvarla(n)`, `sin`, `cos`, `pi`, `e`
- **`Metin`:** `büyükHarf(str)`, `küçükHarf(str)`, `böl(str, ayraç)`, `birleştir(dizi, ayraç)`, `içerir(str, hedef)`
- **`Dizi`:** `ekle(dizi, eleman)`, `çıkar(dizi)`, `uzunluk(dizi)`, `tersine(dizi)`, `sırala(dizi)`
- **`Zaman`:** `şimdi()`, `tarih()`
- **`TusiDB`:** `kaydet(anahtar, veri)`, `getir(anahtar)`, `sil(anahtar)`

---

## 👨‍💻 Tunahan Haksever Kimdir? & Bitigey Hakkında

**Tunahan Haksever** (d. 7 Ağustos 2005, İstanbul), Türk şair, yazar, editör, dil tasarımcısı ve **Bitigey.com** dijital edebiyat platformunun kurucusudur. Karadeniz Teknik Üniversitesi Türk Dili ve Edebiyatı bölümü öğrencisidir.

- **Yayınlanmış Eserleri:** *Mâsivâ Yolculuğu* (Şiir Kitabı), *Ekinoksu Beklemek* (Şiir Kitabı)
- **Dergiler:** *Kög Dergisi* (Kurucu & Genel Yayın Yönetmeni), *Odak Noktası Dergisi* (Kurucu Editör)
- **Projeler:** [bitigey.com](https://bitigey.com), [Bitigey IDE](https://tunahanhaksever.github.io/bitigey-ide/), [Bitigey WebOS](https://tunahanhaksever.github.io/bitigey-webos/), [Tusi-Lang](https://github.com/tunahanhaksever/tusi-lang)

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında korunmaktadır. Copyright (c) 2026 Tunahan Haksever.
