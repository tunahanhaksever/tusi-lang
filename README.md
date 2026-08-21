# 🇹🇷 Tusi Programlama Dili (v4.0 Ultra Core)

<div align="center">

![Tusi Lang Banner](https://img.shields.io/badge/Tusi_Language-v4.0.0-e11d48?style=for-the-badge&logo=codeforces&logoColor=white)
![Author](https://img.shields.io/badge/Yarat%C4%B1c%C4%B1-Tunahan_Haksever-00f0ff?style=for-the-badge&logo=github&logoColor=white)
![GUI Engine](https://img.shields.io/badge/G%C3%B6rsel_Aray%C3%BCz-TusiGUI_Engine-ff007f?style=for-the-badge)
![Package Manager](https://img.shields.io/badge/Paket_Y%C3%B6netimi-TPM_Hub-fbbf24?style=for-the-badge)
![Online Studio](https://img.shields.io/badge/Web_Studio-Canl%C4%B1-10b981?style=for-the-badge&logo=google-chrome&logoColor=white)

**Tunahan Haksever tarafından geliştirilen; Türkçenin zengin matematiksel ve mantıksal yapısını dijital dünyaya taşıyan, bağımsız sözdizimine, TusiGUI görsel arayüz motoruna ve TPM paket yöneticisine sahip modern açık kaynak programlama dili.**

[🌐 Web Studio & 3 Dilde Dokümantasyon](#-web-studio--canlı-laboratuvar) • [🖥️ TusiGUI Görsel Arayüz](#-1-tusigui-görsel-arayüz-motoru) • [💼 Ticari Muhasebe & E-Fatura](#-2-ticari-muhasebe-ve-finans-kütüphanesi) • [📦 TPM Paket Yöneticisi](#-3-tpm-tusi-paket-yöneticisi) • [Kurulum](#-kurulum)

</div>

---

## 🌐 Web Studio & Canlı Laboratuvar
Herhangi bir kurulum yapmadan doğrudan web tarayıcınızda TusiGUI pencereleri tasarlayın, kod yazın ve **Türkçe, İngilizce ve Almanca (Deutsch)** dillerinde resmî dokümantasyonu inceleyin:  
👉 **[https://tunahanhaksever.github.io/tusi-lang/](https://tunahanhaksever.github.io/tusi-lang/)**

---

## 📦 Kurulum ve Çalıştırma

### 1. Global Kurulum:
```bash
npm install -g tusi-lang
```

Kurulum tamamlandıktan sonra terminalinizde doğrudan:
- `tusi dosya.tusi`
- `tusi --repl`
- `tpm kur muhasebe-pro`

komutlarını kullanabilirsiniz.

---

## 🚀 Temel Kütüphaneler ve Mimariler

### 🖥️ 1. TusiGUI Görsel Arayüz Motoru (`Arayüz`)

Masaüstü ve web ortamında görsel pencereler, formlar, tablolar ve butonlar oluşturabilirsiniz:

```tusi
// Ana Pencereyi Tanımla
Arayüz.pencereOlustur({
  baslik: "Müşteri & Muhasebe Yönetim Paneli",
  genislik: 600,
  yukseklik: 450
})

Arayüz.etiketEkle("🏢 Şirket Muhasebe Sistemi", "#00f0ff")

değişken musteri = Arayüz.girdiAlaniEkle("Müşteri Adı:", "Bitigey Edebiyat A.Ş.")
değişken tutar = Arayüz.girdiAlaniEkle("İşlem Tutarı (TL):", "25000")

Arayüz.tabloEkle(
  ["İşlem Kodu", "Açıklama", "KDV", "Tutar"],
  [
    ["ISL-01", "WebOS Lisansı", "%20", "15.000 TL"],
    ["ISL-02", "Sunucu Hizmeti", "%20", "10.000 TL"]
  ]
)

Arayüz.butonEkle("💳 Faturayı Onayla", fonksiyon() {
  değişken kdv = Muhasebe.kdvHesapla(25000, 20)
  Arayüz.bildirimGoster("Fatura kesildi: " + Muhasebe.paraFormati(kdv.toplamTutar), "basarili")
})
```

---

### 💼 2. Ticari Muhasebe ve Finans Kütüphanesi (`Muhasebe`)

Faturalama, KDV hesaplamaları, gelir-gider dökümleri ve kâr/zarar analizi:

```tusi
değişken fatura = Muhasebe.faturaOlustur({
  no: "FTR-2026-0099",
  musteri: "Bitigey Ltd.",
  kdvOrani: 20,
  kalemler: [
    { baslik: "Yazılım Geliştirme", adet: 1, fiyat: 40000 },
    { baslik: "Veritabanı Bakımı", adet: 12, fiyat: 1500 }
  ]
})

yazdır("Fatura No   :", fatura.faturaNo)
yazdır("Ara Toplam  :", Muhasebe.paraFormati(fatura.araToplam))
yazdır("%20 KDV     :", Muhasebe.paraFormati(fatura.kdvTutari))
yazdır("GENEL TOPLAM:", Muhasebe.paraFormati(fatura.genelToplam))
```

---

### 📊 3. Veri ve Tablo Analizi (`Veri`)

```tusi
değişken satislar = [
  { urun: "Tusi-Lang Pro", adet: 20, tutar: 60000 },
  { urun: "Bitigey WebOS", adet: 35, tutar: 105000 }
]

değişken toplamCiro = Veri.toplam(satislar, "tutar")
değişken enCokSatan = Veri.enYuksek(satislar, "adet")

yazdır("Toplam Ciro:", Muhasebe.paraFormati(toplamCiro))
yazdır("En Çok Satan:", enCokSatan.urun)
```

---

### 📦 4. TPM — Tusi Paket Yöneticisi

Topluluk kütüphanelerini tek satırla kurun:

```bash
# Paket Kurma
tpm kur muhasebe-pro
tpm kur tusi-gui-plus
tpm kur yapay-zeka-tusi

# Mevcut Paketleri Listeleme
tpm listele
```

---

## 👨‍💻 Tunahan Haksever Kimdir? & Bitigey Hakkında

**Tunahan Haksever** (d. 7 Ağustos 2005, İstanbul), Türk şair, yazar, editör, dil tasarımcısı ve **Bitigey.com** kurucusudur. Karadeniz Teknik Üniversitesi Türk Dili ve Edebiyatı öğrencisidir.

- **Edebi Eserleri:** *Mâsivâ Yolculuğu* (Şiir Kitabı), *Ekinoksu Beklemek* (Şiir Kitabı)
- **Yayıncılık:** *Kög Dergisi* (Genel Yayın Yönetmeni), *Odak Noktası Dergisi*
- **Dijital Ekosistem:** [bitigey.com](https://bitigey.com) • [Bitigey IDE](https://tunahanhaksever.github.io/bitigey-ide/) • [Bitigey WebOS](https://tunahanhaksever.github.io/bitigey-webos/) • [Tusi-Lang](https://tunahanhaksever.github.io/tusi-lang/)

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında korunmaktadır. Copyright (c) 2026 Tunahan Haksever.
