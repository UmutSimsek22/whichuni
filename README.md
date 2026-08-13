# whichuni - İstanbul Üniversiteleri Bilgi Portalı

**whichuni**, İstanbul'daki üniversitelerin YÖK Atlas verilerini temel alarak hazırlanmış; kolay okunabilir, estetik, kullanıcı dostu ve responsive (mobil uyumlu) bir bilgi portalıdır. 

Bu portal sayesinde öğrenciler, İstanbul'daki üniversiteleri ve bölümlerini arayabilir, kontenjan durumlarını inceleyebilir ve geçmiş yılların yerleşme verileriyle kıyaslayabilir.

---

## 🚀 Öne Çıkan Özellikler

- **Gelişmiş Arama ve Filtreleme:** Üniversite adına, bölüm ismine veya program koduna göre anlık arama yapabilme.
- **Üniversite Türü Filtresi:** Devlet veya Vakıf üniversitelerini tek tıkla listeleyebilme.
- **Program Seviyesi Filtresi:** Lisans (4 yıllık) ve Önlisans (2 yıllık) programlarını ayırabilme.
- **Dinamik Detay Paneli (Drawer):** Bir üniversiteye tıklandığında sağdan kayarak açılan şık detay ekranı.
- **Bölüm Akordeonları:** Detay panelinde bölümlere tıklandığında sayfa kaymadan açılan veri pencereleri.
- **Görsel İstatistikler:**
  - **Cinsiyet Dağılım Oranı:** Erkek ve kadın öğrenci dağılımlarını gösteren özel SVG ilerleme çubukları.
  - **Kontenjan Doluluk Göstergesi:** Kontenjanın yüzde kaçının dolduğunu gösteren dinamik renkli bar grafikler.
  - **Son 3 Yıl Kıyaslama Tablosu:** 2025, 2024 ve 2023 yıllarına ait kontenjan ve yerleşen öğrenci sayılarının karşılaştırmalı tabloları.

---

## 🛠️ Kullanılan Teknolojiler

- **Arayüz (Frontend):** React + TypeScript (Vite)
- **Tasarım ve Stil:** CSS3 Custom Properties (Tasarım token'ları ve akademik lacivert/altın sarısı teması)
- **Veri Derleme Hattı (Scraper Pipeline):** Python 3.9+ (YÖK Atlas verilerinin JSON formatına dönüştürülmesi ve doğrulanması)
- **İkon Tasarımları:** SVG inline vektörler

---

## 📁 Proje Dosya Yapısı

```text
uniweb/
├── .agents/                 # Antigravity Yapay Zeka kuralları ve hafıza sistemi
├── scraper/                 # Veri kazıma ve doğrulama betikleri
│   ├── scrape.py            # YÖK Atlas veri derleme kodu
│   ├── validate.py          # Veri şeması doğrulama kodu
│   └── universities.json    # Derlenen İstanbul Üniversiteleri veri tabanı
├── src/                     # React Uygulaması kaynak kodları
│   ├── data/                # Uygulamanın kullandığı veri dizini
│   │   └── universities.json
│   ├── styles/              # Özel stil kütüphaneleri
│   ├── App.tsx              # Ana uygulama koordinatörü ve filtreleme mantığı
│   ├── index.css            # Akademik renk şeması ve genel CSS kuralları
│   └── main.tsx             # React mount dosyası
├── index.html               # Uygulama giriş noktası ve Google Fonts bağlantıları
├── package.json             # npm bağımlılıkları ve komut tanımları
├── tsconfig.json            # TypeScript yapılandırması
└── vite.config.ts           # Vite derleyici yapılandırması
```

---

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v20.19+ veya v22.12+)
- Python 3.9+ (Sadece veri tabanını yeniden derlemek istiyorsanız)

### 1. Bağımlılıkları Yükleme
Proje dizininde terminali açıp bağımlılıkları yükleyin:
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatma
Yerel geliştirme sunucusunu (Hot Module Replacement desteği ile) başlatmak için:
```bash
npm run dev
```
Sunucu hazır olduğunda tarayıcınızda **http://localhost:5173/** adresine giderek uygulamayı test edebilirsiniz.

### 3. Üretim Sürümü Derleme (Build)
Uygulamayı canlı ortama aktarmak üzere statik dosyalara dönüştürmek için:
```bash
npm run build
```
Derleme sonucu `dist/` klasörü altında hazır hale gelecektir.

### 4. Veri Kazıma Hattını Yeniden Çalıştırma
YÖK Atlas veri tabanındaki bilgileri yeniden derlemek veya değiştirmek isterseniz:
```bash
python scraper/scrape.py
python scraper/validate.py
```
Bu komut verileri doğrulayıp otomatik olarak `src/data/universities.json` dosyasına yazacaktır.
