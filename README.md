# E-Dashboard

React ve Node.js ile geliştirilmiş tam yığın (full-stack) bir e-ticaret dashboard uygulaması.

## 📋 İçindekiler

- [Proje Yapısı](#proje-yapısı)
- [Kurulum](#kurulum)
- [Özellikler](#özellikler)
- [API Endpoints](#api-endpoints)
- [Güvenlik](#güvenlik)
- [Teknolojiler](#teknolojiler)
- [Geliştirme Notları](#geliştirme-notları)

## 📁 Proje Yapısı

```
e-dashboard/
├── backend/          # Node.js/Express API
│   ├── db/          # MongoDB modelleri
│   ├── middleware/  # JWT authentication
│   └── index.js     # API endpoints
├── front-end/        # React uygulaması
│   ├── src/
│   │   ├── components/  # React component'leri
│   │   ├── contexts/    # Context API (Auth, Product, Theme)
│   │   └── utils/       # Yardımcı fonksiyonlar
└── README.md
```

## 🚀 Kurulum

### Ön Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel veya MongoDB Atlas)
- npm veya yarn

### MongoDB Kurulumu

#### Yerel MongoDB

1. MongoDB Community Server'ı indirin: [MongoDB Download](https://www.mongodb.com/try/download/community)
2. MongoDB servisini başlatın:
   ```powershell
   net start MongoDB
   ```
3. MongoDB Compass ile bağlanın:
   - Connection string: `mongodb://localhost:27017`
   - Database otomatik oluşturulacak (ilk veri kaydında)

#### MongoDB Atlas (Bulut)

1. MongoDB Atlas'ta ücretsiz cluster oluşturun
2. Connection string'i alın
3. `.env` dosyasına ekleyin (aşağıdaki bölüme bakın)

### Backend Kurulumu

```bash
cd backend
npm install
```

**Environment Variables:**

`backend/.env` dosyası oluşturun:

```env
MONGODB_URI=mongodb://localhost:27017/e-commerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
```

**ÖNEMLİ:** Üretim ortamında `JWT_SECRET` değerini mutlaka güçlü bir değerle değiştirin!

Backend'i başlatın:
```bash
npm start
```

Backend varsayılan olarak `http://localhost:5000` portunda çalışır.

### Frontend Kurulumu

```bash
cd front-end
npm install
npm start
```

Frontend varsayılan olarak `http://localhost:3000` portunda çalışır.

## ✨ Özellikler

### ✅ Tamamlanan Özellikler

- **Kullanıcı Yönetimi**
  - ✅ Kullanıcı kaydı (Sign Up)
  - ✅ Kullanıcı girişi (Login)
  - ✅ JWT token authentication
  - ✅ Güvenli şifre saklama (bcrypt)
  - ✅ Kullanıcı profili

- **Ürün Yönetimi**
  - ✅ Ürün ekleme
  - ✅ Ürün listeleme
  - ✅ Ürün güncelleme
  - ✅ Ürün silme
  - ✅ Ürün arama
  - ✅ Gelişmiş filtreleme (kategori, fiyat sıralama)
  - ✅ Pagination (sayfalama)

- **Kategori Yönetimi**
  - ✅ Kategori ekleme
  - ✅ Kategori listeleme
  - ✅ Kategori güncelleme
  - ✅ Kategori silme
  - ✅ Ürün ekleme/güncelleme sayfalarında dropdown

- **Dashboard**
  - ✅ Toplam ürün sayısı
  - ✅ Toplam kategori sayısı
  - ✅ Kategori dağılımı
  - ✅ Son eklenen ürünler

- **Kullanıcı Deneyimi**
  - ✅ Modern UI tasarımı
  - ✅ Toast notification sistemi
  - ✅ Loading states
  - ✅ Dark mode desteği
  - ✅ Responsive tasarım
  - ✅ Form validation

- **Güvenlik**
  - ✅ Bcrypt ile şifre hash'leme
  - ✅ JWT token authentication
  - ✅ Protected routes
  - ✅ Rate limiting (brute force koruması)
  - ✅ Kullanıcı bazlı veri izolasyonu

## 🔌 API Endpoints

### Kullanıcı İşlemleri

- `POST /register` - Yeni kullanıcı kaydı
  - Şifre otomatik hash'lenir
  - JWT token döner
  - Rate limit: 3 kayıt / 1 saat

- `POST /login` - Kullanıcı girişi
  - JWT token döner
  - Rate limit: 5 deneme / 15 dakika

### Ürün İşlemleri (JWT token gerekli)

- `GET /products?page=1&limit=10` - Ürünleri listele (pagination destekli)
- `POST /add-product` - Yeni ürün ekle
- `GET /product/:id` - Belirli bir ürünü getir
- `PUT /product/:id` - Ürün güncelle
- `DELETE /product/:id` - Ürün sil
- `GET /search/:key` - Ürün ara

### Kategori İşlemleri (JWT token gerekli)

- `GET /categories` - Kategorileri listele
- `POST /add-category` - Yeni kategori ekle
- `PUT /category/:id` - Kategori güncelle
- `DELETE /category/:id` - Kategori sil

## 🔒 Güvenlik

### Şifre Güvenliği

- Tüm şifreler **bcrypt** ile hash'lenerek saklanır (10 salt rounds)
- Şifreler veritabanında düz metin olarak görünmez
- Login sırasında hash karşılaştırması yapılır

### JWT Authentication

- Token süresi: **7 gün**
- Token format: `Bearer TOKEN`
- Tüm protected endpoint'ler token gerektirir
- Token süresi dolduğunda otomatik logout

### Rate Limiting

- **Login:** 5 deneme / 15 dakika
- **Register:** 3 kayıt / 1 saat
- Brute force saldırılarına karşı koruma

### Veri İzolasyonu

- Her kullanıcı sadece kendi ürünlerini görür/düzenler/siler
- Kategori yönetimi kullanıcı bazlı
- API endpoint'lerinde otomatik filtreleme

## 🛠️ Teknolojiler

### Frontend
- **React** - UI framework
- **React Router DOM** - Routing
- **Context API** - State management
- **Axios** - HTTP client (hazır, kullanıma hazır)
- **react-toastify** - Toast notifications
- **CSS3** - Modern styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📝 Geliştirme Notları

### Backend

- Backend ve Frontend ayrı portlarda çalışır
- MongoDB bağlantısı için `backend/db/config.js` dosyasını kontrol edin
- JWT token localStorage'da saklanır
- Token süresi dolduğunda otomatik olarak login sayfasına yönlendirilir

### Frontend

- API çağrıları `utils/api.js` üzerinden yapılır
- Token otomatik olarak header'a eklenir
- Context API ile global state yönetimi
- Dark mode tercihi localStorage'da saklanır

### Veritabanı

- Database ve collection'lar otomatik oluşturulur
- İlk veri kaydından önce database görünmeyebilir (normal)
- Schema validation'lar aktif

## 🎯 Gelecek Geliştirmeler

Detaylı geliştirme planı için [GELISTIRME_PLANI.md](./GELISTIRME_PLANI.md) dosyasına bakın.

**Öncelikli Özellikler:**
- [ ] Ürün görselleri (image upload)
- [ ] Şifre sıfırlama (email ile token)
- [ ] Email doğrulama
- [ ] Admin paneli
- [ ] Export/Import (CSV, Excel)
- [ ] Grafikler ve görselleştirmeler

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👤 Geliştirici

Abdullah ESIN

---

**Not:** Bu proje sürekli geliştirilmektedir. Yeni özellikler ve iyileştirmeler eklenmeye devam edecektir.
