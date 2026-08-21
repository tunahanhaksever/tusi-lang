# 🇹🇷 Tusi Programmiersprache (v4.0 Ultra Core)

<div align="center">

![Tusi Lang Banner](https://img.shields.io/badge/Tusi_Language-v4.0.0-e11d48?style=for-the-badge&logo=codeforces&logoColor=white)
![Author](https://img.shields.io/badge/Sch%C3%B6pfer-Tunahan_Haksever-00f0ff?style=for-the-badge&logo=github&logoColor=white)
![GUI Engine](https://img.shields.io/badge/Desktop_GUI-TusiGUI_Engine-ff007f?style=for-the-badge)
![Package Manager](https://img.shields.io/badge/Paketmanager-TPM_Hub-fbbf24?style=for-the-badge)
![Online Studio](https://img.shields.io/badge/Web_Studio-Live-10b981?style=for-the-badge&logo=google-chrome&logoColor=white)

**Sprachen:** [🇹🇷 Türkçe](README.md) • [🇬🇧 English](README.en.md) • **[🇩🇪 Deutsch](README.de.md)**

**Eine unabhängige, moderne Open-Source-Programmiersprache von Tunahan Haksever mit strukturierter Syntax, nativer visueller Desktop-Oberfläche (TusiGUI), kaufmännischen Buchhaltungsmodulen und integriertem Paketmanager (TPM).**

[🌐 Web Studio (Online testen)](https://tunahanhaksever.github.io/tusi-lang/de.html) • [🖥️ TusiGUI Desktop-Engine](#-1-tusigui-grafische-benutzeroberfläche) • [💼 Kaufmännische Buchhaltung](#-2-kaufmännische-buchhaltung--e-rechnung) • [📦 TPM Paketmanager](#-3-tpm-paketmanager) • [Installation](#-installation)

</div>

---

## 🌐 Web Studio & Online-Labor
Führen Sie Tusi-Skripte aus und gestalten Sie interaktive Desktop-Fenster direkt im Webbrowser ohne Installation:  
👉 **[https://tunahanhaksever.github.io/tusi-lang/de.html](https://tunahanhaksever.github.io/tusi-lang/de.html)**

---

## 📦 Installation

### Globale CLI-Installation:
```bash
npm install -g tusi-lang
```

Nach der Installation können folgende Befehle ausgeführt werden:
- `tusi skript.tusi`
- `tusi --repl`
- `tpm kur muhasebe-pro`

---

## 🚀 Wichtige Bibliotheken & Funktionen

### 🖥️ 1. TusiGUI Grafische Benutzeroberfläche (`Arayüz`)

Erstellen Sie Desktop-Fenster, Eingabeformulare, Tabellen und Schaltflächen:

```tusi
Arayüz.pencereOlustur({
  baslik: "Kunden- & Buchhaltungs-Dashboard",
  genislik: 600,
  yukseklik: 450
})

Arayüz.etiketEkle("🏢 Firmen-Buchhaltungssystem", "#00f0ff")

değişken kunde = Arayüz.girdiAlaniEkle("Kundenname:", "Bitigey GmbH")
değişken betrag = Arayüz.girdiAlaniEkle("Rechnungsbetrag (€):", "25000")

Arayüz.tabloEkle(
  ["Code", "Dienstleistung", "Steuer", "Betrag"],
  [
    ["ISL-01", "Software-Lizenz", "%20", "15.000 €"],
    ["ISL-02", "Cloud-Support", "%20", "10.000 €"]
  ]
)

Arayüz.butonEkle("💳 Rechnung bestätigen", fonksiyon() {
  değişken steuer = Muhasebe.kdvHesapla(25000, 20)
  Arayüz.bildirimGoster("Rechnung erstellt! Gesamtbetrag: " + Muhasebe.paraFormati(steuer.toplamTutar, "€"), "basarili")
})
```

---

### 💼 2. Kaufmännische Buchhaltung & E-Rechnung (`Muhasebe`)

```tusi
değişken rechnung = Muhasebe.faturaOlustur({
  no: "RE-2026-0099",
  musteri: "Bitigey GmbH",
  kdvOrani: 20,
  kalemler: [
    { baslik: "Softwareentwicklung", adet: 1, fiyat: 40000 },
    { baslik: "Datenbankwartung", adet: 12, fiyat: 1500 }
  ]
})

yazdır("Rechnungs-Nr :", rechnung.faturaNo)
yazdır("Zwischensumme:", Muhasebe.paraFormati(rechnung.araToplam))
yazdır("%20 Steuer   :", Muhasebe.paraFormati(rechnung.kdvTutari))
yazdır("GESAMTSUMME  :", Muhasebe.paraFormati(rechnung.genelToplam))
```

---

### 📦 3. TPM Paketmanager

```bash
# Modulare Pakete installieren
tpm kur muhasebe-pro
tpm kur tusi-gui-plus
tpm kur yapay-zeka-tusi

# Verfügbare Pakete auflisten
tpm listele
```

---

## 👨‍💻 Über Tunahan Haksever

**Tunahan Haksever** (geb. 7. August 2005, Istanbul) ist ein türkischer Dichter, Autor, Herausgeber, Sprachdesigner und Gründer der digitalen Literaturplattform **Bitigey.com**. Er studiert Türkische Sprache und Literatur an der Technischen Universität Karadeniz.

- **Veröffentlichte Werke:** *Mâsivâ Yolculuğu* (Gedichtband), *Ekinoksu Beklemek* (Gedichtband)
- **Zeitschriften:** *Kög Magazin* (Chefredakteur), *Odak Noktası Magazin*
- **Ökosystem:** [bitigey.com](https://bitigey.com) • [Bitigey IDE](https://tunahanhaksever.github.io/bitigey-ide/) • [Bitigey WebOS](https://tunahanhaksever.github.io/bitigey-webos/) • [Tusi-Lang](https://tunahanhaksever.github.io/tusi-lang/)

---

## 📄 Lizenz
Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert. Copyright (c) 2026 Tunahan Haksever.
