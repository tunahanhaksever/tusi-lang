# Tusi Programming System (v5.0 Core Engine)

<div align="center">

![Tusi Lang Banner](https://img.shields.io/badge/Tusi_System-v5.0.0-e11d48?style=for-the-badge&logo=codeforces&logoColor=white)
![Author](https://img.shields.io/badge/Geli%C5%9Ftirici-Tunahan_Haksever-00f0ff?style=for-the-badge&logo=github&logoColor=white)
![Core Engine](https://img.shields.io/badge/Engine-AST_Interpreter-10b981?style=for-the-badge)
![GUI Engine](https://img.shields.io/badge/Desktop_GUI-TusiGUI_Engine-ff007f?style=for-the-badge)
![Package Manager](https://img.shields.io/badge/Paket_Y%C3%B6netimi-TPM_Hub-fbbf24?style=for-the-badge)

**Diller / Languages / Sprachen:** **[🇹🇷 Türkçe](README.md)** • [🇬🇧 English](README.en.md) • [🇩🇪 Deutsch](README.de.md)

**Tunahan Haksever tarafından geliştirilen; modüler mimariye sahip, dosya I/O, HTTP ağ istemcisi, sistem çağrıları, yerel grafik arayüz (TusiGUI) ve ticari otomasyon araçları sunan bağımsız, yerli ve güçlü programlama dili.**

[🌐 Web Studio & Dokümantasyon](#-web-studio--canlı-laboratuvar) • [📁 Dosya & Ağ Kütüphaneleri](#-yeni-v50-kütüphaneleri) • [🖥️ TusiGUI Görsel Arayüz](#-1-tusigui-görsel-arayüz-motoru) • [💼 Ticari Muhasebe](#-2-ticari-muhasebe-ve-finans-kütüphanesi) • [Kurulum](#-kurulum)

</div>

---

## 🌐 Web Studio & Canlı Laboratuvar
Herhangi bir yükleme yapmadan doğrudan web tarayıcınızda TusiGUI pencereleri tasarlayın, kod yazın ve dokümantasyonu inceleyin:  
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

## 🚀 v5.0 Çekirdek Kütüphaneleri ve Modül Mimarisi

### 🧩 1. Modül Sistemi (`dahil_et`)
Kodlarınızı parçalara ayırıp harici dosyaları projenize kolayca dahil edebilirsiniz:
```tusi
# Harici matematik modülünü yükle
dahil_et "ornekler/modul_matematik.tusi"

değişken sonuc = topla(50, 75)
yazdır("Sonuç:", sonuc)
```

### 📁 2. Dosya Yönetimi (`Dosya`)
Sistem üzerinde kalıcı dosya okuma, satır dökümü alma, yazma ve denetim:
```tusi
Dosya.yaz("kayitlar.txt", "Pardus ve Tusi Ekosistemi")
eğer (Dosya.var_mi("kayitlar.txt")) {
  değişken veri = Dosya.oku("kayitlar.txt")
  yazdır("Dosya Verisi:", veri)
}
```

### 🌐 3. Ağ ve HTTP İstemcisi (`Ag` / `Ağ`)
Harici REST API'lere bağlanma ve web servislerinden veri çekme:
```tusi
değişken yanit = Ag.getir("https://jsonplaceholder.typicode.com/todos/1")
yazdır("Başlık:", yanit.title)
yazdır("Durum :", yanit.completed)
```

### 💻 4. Sistem ve Süreç Yönetimi (`Sistem`)
İşletim sistemi kabuk komutlarını çalıştırma, çevre değişkenleri ve sistem platformu:
```tusi
yazdır("Platform:", Sistem.platform)
yazdır("Dizin   :", Sistem.dizin())
değişken cikti = Sistem.calistir("git --version")
yazdır("Çıktı   :", cikti)
```

### 📋 5. JSON Dönüştürücü (`JSON`)
JSON nesnelerini metne çevirme ve ayrıştırma:
```tusi
değişken profil = { ad: "Tunahan", dil: "Tusi" }
değişken jsonMetni = JSON.uret(profil)
değişken nesne = JSON.coz(jsonMetni)
yazdır("Geliştirici:", nesne.ad)
```

### ⚡ 6. İleri Dizi İşlemleri (`Dizi`)
Modern fonksiyonel programlama desteği (filtreleme, haritalama, tekilleştirme):
```tusi
değişken sayilar = [5, 12, 8, 130, 44, 5]
değişken tekil = Dizi.benzersiz(sayilar)
değişken filtrelenmis = Dizi.filtrele(tekil, fonksiyon(x) { döndür x > 10 })
değişken ikiKati = Dizi.haritala(filtrelenmis, fonksiyon(x) { döndür x * 2 })
yazdır("İşlenmiş Veri:", ikiKati)
```

---

## 🎨 Masaüstü & Ticari Kütüphaneler

### 🖥️ 7. TusiGUI Görsel Arayüz Motoru (`Arayüz`)

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

### 🧠 3. Yapay Zeka & Anlamsal Analiz (`YapayZeka`)

```tusi
değişken analiz = YapayZeka.duyguAnalizi("Bitigey ve Tusi ekosistemi harika bir gelişim gösteriyor.")
yazdır("Duygu Skoru :", analiz.skor)
yazdır("Sonuç       :", analiz.duygu)
```

---

### 📦 4. TPM — Paket Yöneticisi

Modüler kütüphaneleri tek satırla kurun:

```bash
# Paket Kurma
tpm kur muhasebe-pro
tpm kur tusi-gui-plus

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
