# whichuni - Türkiye Üniversiteleri ve YÖK Atlas Tercih Bilgi Portalı

<div align="center">

[![Live Demo](https://img.shields.io/badge/Demo-Canlı%20Siteyi%20Aç-0b2240?style=for-the-badge&logo=githubpages&logoColor=white)](https://umutsimsek22.github.io/whichuni/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![YÖK Atlas](https://img.shields.io/badge/Veri%20Kaynağı-YÖK%20Atlas%202025-b8860b?style=for-the-badge)](https://yokatlas.yok.gov.tr/)

**Türkiye'deki 228 devlet ve vakıf üniversitesinin resmi YÖK Atlas verilerini, gerçek kontenjan/öğrenci dağılımlarını ve akademik iletişim bilgilerini sunan modern, hızlı ve görsel tercih portalı.**

[🌐 Canlı Sitede İncele](https://umutsimsek22.github.io/whichuni/) • [✨ Özellikler](#-öne-çıkan-özellikler) • [⚙️ Kurulum](#️-kurulum-ve-çalıştırma) • [📊 Veri Seti](#-veri-hattı-scraper-pipeline)

</div>

---

## 🚀 Öne Çıkan Özellikler

### 🏛️ Kapsamlı ve Gerçek Üniversite Veritabanı
- **228 Üniversite:** Türkiye'nin 87 il ve bölgesindeki tüm Devlet ve Vakıf üniversiteleri.
- **21.493 Akademik Program:** Tüm lisans ve önlisans bölümleri resmi YÖK kodlarıyla eksiksiz listelenir.
- **Resmi İletişim Bilgileri:** Her üniversitenin açık adresi, rektörlük telefon numarası ve web sitesi entegre edilmiştir.

### 👥 Gerçek Öğrenci ve Kontenjan İstatistikleri (YÖK Atlas)
- **Gerçek Cinsiyet Dağılımı:** Tahmini algoritmalar yerine doğrudan resmi YÖK Atlas program verileri kullanılarak her bölümün kız/erkek öğrenci sayıları ve oranları gösterilir.
- **Kontenjan ve Doluluk Oranları:** 2025 yılı genel kontenjanı, yerleşen sayısı ve anlık doluluk yüzdesi indikatörü.
- **3 Yıllık Karşılaştırma:** Son 3 yılın (2025, 2024, 2023) kontenjan ve yerleşen değişimlerini içeren geçmiş tablosu.

### 🎨 Çift Tema (Dark Mode & Göz Dostu Açık Tema)
- **Akademik Koyu Tema:** Gece kullanımları için derin gece mavisi ve altın sarısı vurgulu şık koyu mod.
- **Yumuşak Açık Tema:** Gözü yormayan, parlamayı önleyen sıcak akademik kağıt tonları.
- **Kalıcı Tercih:** Tema tercihi tarayıcı hafızasında (`localStorage`) otomatik saklanır.

### 🔍 Akıllı ve Kapsayıcı Filtreleme
- **Dinamik İl Seçimi Dropdown'ı:** 87 il ve bölge, bünyelerindeki üniversite sayılarıyla birlikte (örn: *İstanbul (61 Üni)*, *Ankara (23 Üni)*) Türkçe alfabetik sırada listelenir.
- **Fakülte Kümeleri:** 1.000'den fazla karmaşık fakülte ismi yerine Tıp, Mühendislik, Hukuk, İİBF, Eğitim, Mimarlık gibi standart akademik kümeler üzerinden anında arama.
- **12 Bölüm Alanı:** Mühendislik & Bilişim, Tıp & Sağlık, İşletme & Finans, Hukuk, İletişim, Havacılık vb. alanlara göre Türkçe imla uyumlu (`trLower`) filtreleme.
- **Program Seviyesi & Tür:** Lisans / Önlisans ve Devlet / Vakıf filtreleri.
- **Filtreleri Temizle:** Aktif filtreleri tek tıkla ilk durumuna sıfırlama düğmesi.

### 📊 İnteraktif Görsel Paneller
- Üniversite detay sayfasında saf SVG ile çizilen **Cinsiyet Dağılımı Donut Grafiği**.
- Fakülte öğrenci yoğunluklarını kıyaslayan **Yatay Bar Grafikleri**.
- **Lisans vs Önlisans Dağılım İndikatörü**.

---

## 🛠️ Teknoloji Yığını

| Alan | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Yüksek performanslı bileşen mimarisi ve tip güvenliği |
| **Derleyici / Build** | Vite 8 + Rolldown | Hızlı HMR (Hot Module Replacement) ve optimize üretim paketi |
| **Stil & Tasarım** | CSS3 Custom Properties | Saf CSS tasarım token'ları, sıfır harici UI kütüphanesi bağımlılığı |
| **Linter & Kalite** | Oxlint | Rust tabanlı ultra hızlı statik kod analizi |
| **CI / CD Dağıtım** | GitHub Actions | `main` branch'ine yapılan her push'ta GitHub Pages'e otomatik dağıtım |
| **Veri Kazıma (Scraper)** | Python 3.13 | YÖK Atlas JSON API'lerini işleyen, normalize eden ve doğrulayan veri hattı |

---

## 📁 Proje Dizin Yapısı

```text
whichuni/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Otomatik GitHub Pages CI/CD iş akışı
├── scraper/
│   ├── scrape.py                 # YÖK Atlas verilerini işleyen ana Python betiği
│   ├── validate.py               # 0-hata veri doğrulama ve şema kontrol betiği
│   ├── universities.json         # Derlenmiş 228 üniversite ve 21.493 bölüm veri tabanı
│   ├── yokatlas.json             # Ham YÖK Atlas program veri kütüğü
│   ├── api_programs_cache.json   # Canlı kontenjan ve yerleşen önbelleği
│   └── real_gender_data.json     # Gerçek program bazlı cinsiyet istatistikleri
├── src/
│   ├── data/
│   │   └── universities.json     # Frontend tarafından kullanılan güncel veri tabanı
│   ├── App.tsx                   # Ana uygulama, filtreleme motoru ve dashboard bileşenleri
│   ├── index.css                 # Açık/Koyu tema token'ları ve responsive stiller
│   └── main.tsx                  # React DOM başlangıç noktası
├── index.html                    # HTML şablonu ve Plus Jakarta Sans font tanımları
├── vite.config.ts                # Vite yapılandırması (base: /whichuni/)
├── package.json                  # Proje bağımlılıkları ve çalıştırma komutları
└── tsconfig.json                 # TypeScript yapılandırması
```

---

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js:** v20.18+ veya v22+
- **Python:** 3.10+ *(Yalnızca veri tabanını sıfırdan yeniden derlemek isterseniz)*

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/UmutSimsek22/whichuni.git
cd whichuni
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda açılan **http://localhost:5173/whichuni/** adresinden portalı yerel ortamda anında kullanabilirsiniz.

### 4. Üretim Sürümünü Derleyin (Production Build)
```bash
npm run build
```
Oluşturulan optimize statik dosyalar `dist/` dizinine çıkarılacaktır. Yerel önizleme için:
```bash
npm run preview
```

### 5. Kod Kalitesi ve Linter Kontrolü
```bash
npm run lint
```

---

## 📊 Veri Hattı (Scraper Pipeline)

YÖK Atlas üzerindeki verileri yeniden çekmek, güncellemek veya doğrulamak için:

```bash
# Verileri derler ve src/data/universities.json'a yazar:
python scraper/scrape.py

# Veri bütünlüğünü doğrular (228 üniversite, 87 il, 0 hata):
python scraper/validate.py
```

---

## 🌐 Canlı Yayın (GitHub Pages)

Proje GitHub Actions ile otomatik olarak GitHub Pages üzerinde barındırılmaktadır:  
👉 **[https://umutsimsek22.github.io/whichuni/](https://umutsimsek22.github.io/whichuni/)**

---

## 📄 Lisans

Bu proje açık kaynaklıdır ve eğitim/tercih rehberliği amaçlı kullanıma uygundur.
Veriler [YÖK Atlas](https://yokatlas.yok.gov.tr/) açık verilerinden derlenmiştir.

