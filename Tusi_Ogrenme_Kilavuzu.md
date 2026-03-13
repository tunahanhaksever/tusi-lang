# 🦄 Tusi Programlama Dili: Tam Öğrenme Kılavuzu (v2.0.0)

**Tusi**, modern dünyanın karmaşıklığını Türkçenin sadeliği ile birleştiren profesyonel bir programlama dilidir. Bu kılavuz, sıfırdan başlayarak Tusi ile gelişmiş projeler geliştirmeniz için hazırlanmıştır.

---

## 1. BÖLÜM: TEMELLER

### 1.1 Değişken Tanımlama
Tusi'de verileri saklamak için `değişken` anahtar kelimesini kullanırız.
```tusi
değişken isim = "Tuna"  // Metin (String)
değişken yas = 25       // Sayı (Number)
değişken dogru_mu = doğru // Mantıksal (Boolean)
```

### 1.2 Ekrana Yazdırma
Çıktı almak için `yazdır()` fonksiyonunu kullanırız.
```tusi
yazdır("Merhaba Dünya!")
yazdır(yas)
```

### 1.3 Matematiksel İşlemler
Tusi standart matematik operatörlerini destekler: `+`, `-`, `*`, `/`.
```tusi
değişken sayi1 = 20
değişken sayi2 = 5
yazdır(sayi1 + sayi2) // 25
yazdır(sayi1 * sayi2) // 100
```

---

## 2. BÖLÜM: KONTROL YAPILARI

### 2.1 Koşullu İfadeler (eğer / değilse)
Karar verme mekanizması oldukça basittir.
```tusi
değişken puan = 75

eğer (puan > 50) ise {
    yazdır("Başarılı!")
} değilse {
    yazdır("Başarısız!")
}
```

### 2.2 Döngüler (döngü)
Bir işlemi birden çok kez yapmak için kullanılır.
```tusi
değişken sayac = 1
döngü (sayac < 6) {
    yazdır("Adım: " + sayac)
    sayac = sayac + 1
}
```

---

## 3. BÖLÜM: FONKSİYONLAR VE LİSTELER

### 3.1 Fonksiyon Tanımlama
Kodunuzu parçalara ayırarak düzenli tutmanızı sağlar.
```tusi
fonksiyon selamla(isim) {
    döndür "Selam " + isim + "!"
}

değişken mesaj = selamla("Tuna")
yazdır(mesaj)
```

### 3.2 Diziler (Listeler)
Birden fazla veriyi tek bir yerde tutar.
```tusi
değişken diller = ["Tusi", "Javascript", "Python"]
yazdır(diller[0]) // Tusi
yazdır(uzunluk(diller)) // 3
```

---

## 4. BÖLÜM: STANDART KÜTÜPHANE (PRO KOMUTLAR)

| Komut | Açıklama |
| :--- | :--- |
| `mat_kok(x)` | x'in karekökünü alır. |
| `mat_rastgele(n)` | 0 ile n arası rastgele sayı. |
| `sistem_bilgi()` | Bilgisayar özelliklerini getirir. |
| `zaman_simdi()` | Zaman damgası verir. |
| `dosya_oku(yol)` | Dosyanın içeriğini okur. |
| `dosya_yaz(yol, icerik)` | Dosyaya veri kaydeder. |
| `konsol_satir()` | Kullanıcıdan klavye girdisi bekler. |

---

## 5. BÖLÜM: ÖRNEK PROJELER

### 5.1 Gelişmiş Web Sunucusu
```tusi
fonksiyon sunucu(istek, yanit) {
    eğer (istek["yol"] == "/") ise {
        yanit_yaz(yanit, "<h1>Tusi Ana Sayfası</h1>")
    } değilse {
        yanit_yaz(yanit, "<h1>404 Sayfa Bulunamadı</h1>")
    }
    yanit_bitir(yanit)
}

sunucu_baslat(8080, sunucu)
```

### 5.2 Otomatik Raporlama Sistemi
```tusi
değişken bilgi = sistem_bilgi()
değişken rapor = "Analiz Raporu: " + bilgi["kullanici"] + " - " + zaman_simdi()
dosya_yaz("rapor.log", rapor)
yazdır("Sistem raporu başarıyla oluşturuldu.")
```

---

## 6. BÖLÜM: GÜVENLİK VE ETİK
Tusi, **Güvenli Çekirdek (Secure Kernel)** mimarisiyle çalışır. Yazılan kodlar asla işletim sisteminin kritik dosyalarına zarar veremez. Yol çözümleme (Path Resolution) özelliği sayesinde, kodlar sadece kendi projeniz için ayrılan güvenli alanda çalışır.

---
*Bu belge Tusi Programlama Dili ile uzmanlaşmanız için hazırlanmıştır.*
