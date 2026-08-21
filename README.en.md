# 🇹🇷 Tusi Programming Language (v4.0 Ultra Core)

<div align="center">

![Tusi Lang Banner](https://img.shields.io/badge/Tusi_Language-v4.0.0-e11d48?style=for-the-badge&logo=codeforces&logoColor=white)
![Author](https://img.shields.io/badge/Creator-Tunahan_Haksever-00f0ff?style=for-the-badge&logo=github&logoColor=white)
![GUI Engine](https://img.shields.io/badge/Desktop_GUI-TusiGUI_Engine-ff007f?style=for-the-badge)
![Package Manager](https://img.shields.io/badge/Packages-TPM_Hub-fbbf24?style=for-the-badge)
![Online Studio](https://img.shields.io/badge/Web_Studio-Live-10b981?style=for-the-badge&logo=google-chrome&logoColor=white)

**Languages:** [🇹🇷 Türkçe](README.md) • **[🇬🇧 English](README.en.md)** • [🇩🇪 Deutsch](README.de.md)

**An independent, high-level open-source programming language designed by Tunahan Haksever featuring intuitive structured syntax, native desktop GUI support (TusiGUI), commercial accounting & invoicing engines, and an integrated package ecosystem (TPM).**

[🌐 Web Studio (Try Online)](https://tunahanhaksever.github.io/tusi-lang/en.html) • [🖥️ TusiGUI Desktop Engine](#-1-tusigui-desktop-gui-engine) • [💼 Commercial Accounting](#-2-commercial-accounting--invoicing) • [📦 TPM Package Manager](#-3-tpm-package-manager) • [Installation](#-installation)

</div>

---

## 🌐 Web Studio & Online Playground
Run Tusi scripts and build interactive desktop windows directly inside your web browser with zero installation:  
👉 **[https://tunahanhaksever.github.io/tusi-lang/en.html](https://tunahanhaksever.github.io/tusi-lang/en.html)**

---

## 📦 Installation

### Global CLI Installation:
```bash
npm install -g tusi-lang
```

Once installed, use the global command tools:
- `tusi script.tusi`
- `tusi --repl`
- `tpm kur muhasebe-pro`

---

## 🚀 Key Libraries & Features

### 🖥️ 1. TusiGUI Desktop GUI Engine (`Arayüz`)

Create real desktop windows, forms, tables, and buttons:

```tusi
Arayüz.pencereOlustur({
  baslik: "Client & Accounting Dashboard",
  genislik: 600,
  yukseklik: 450
})

Arayüz.etiketEkle("🏢 Company Accounting System", "#00f0ff")

değişken client = Arayüz.girdiAlaniEkle("Client Name:", "Bitigey Corp.")
değişken amount = Arayüz.girdiAlaniEkle("Fee Amount ($):", "25000")

Arayüz.tabloEkle(
  ["Item Code", "Service", "Tax", "Amount"],
  [
    ["ISL-01", "Web Software License", "%20", "$ 15,000"],
    ["ISL-02", "Cloud Hosting Support", "%20", "$ 10,000"]
  ]
)

Arayüz.butonEkle("💳 Approve & Issue Invoice", fonksiyon() {
  değişken tax = Muhasebe.kdvHesapla(25000, 20)
  Arayüz.bildirimGoster("Invoice issued! Total: " + Muhasebe.paraFormati(tax.toplamTutar, "$"), "basarili")
})
```

---

### 💼 2. Commercial Accounting & Invoicing (`Muhasebe`)

```tusi
değişken invoice = Muhasebe.faturaOlustur({
  no: "INV-2026-0099",
  musteri: "Bitigey Ltd.",
  kdvOrani: 20,
  kalemler: [
    { baslik: "Software Engineering", adet: 1, fiyat: 40000 },
    { baslik: "Database Maintenance", adet: 12, fiyat: 1500 }
  ]
})

yazdır("Invoice No :", invoice.faturaNo)
yazdır("Subtotal   :", Muhasebe.paraFormati(invoice.araToplam))
yazdır("%20 Tax    :", Muhasebe.paraFormati(invoice.kdvTutari))
yazdır("GRAND TOTAL:", Muhasebe.paraFormati(invoice.genelToplam))
```

---

### 📦 3. TPM Package Manager

```bash
# Install modular packages
tpm kur muhasebe-pro
tpm kur tusi-gui-plus
tpm kur yapay-zeka-tusi

# List official registry
tpm listele
```

---

## 👨‍💻 About Tunahan Haksever

**Tunahan Haksever** (b. August 7, 2005, Istanbul) is a Turkish poet, author, editor, language designer, and the founder of the digital literature platform **Bitigey.com**. He studies Turkish Language and Literature at Karadeniz Technical University.

- **Published Works:** *Mâsivâ Yolculuğu* (Poetry Book), *Ekinoksu Beklemek* (Poetry Book)
- **Periodicals:** *Kög Magazine* (Editor-in-Chief), *Odak Noktası Magazine*
- **Ecosystem:** [bitigey.com](https://bitigey.com) • [Bitigey IDE](https://tunahanhaksever.github.io/bitigey-ide/) • [Bitigey WebOS](https://tunahanhaksever.github.io/bitigey-webos/) • [Tusi-Lang](https://tunahanhaksever.github.io/tusi-lang/)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE). Copyright (c) 2026 Tunahan Haksever.
