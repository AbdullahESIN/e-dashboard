# E-Dashboard

React ve Node.js ile geliştirilmiş tam yığın (full-stack) bir e-ticaret dashboard uygulaması.

## Proje Yapısı

- `front-end/` - React uygulaması
- `backend/` - Node.js/Express sunucusu
- `backend/db/` - MongoDB modelleri ve yapılandırması

## Kurulum Talimatları

### Ön Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel olarak kurulu veya MongoDB Atlas)
- npm veya yarn

### MongoDB Kurulumu

1. MongoDB'yi bilgisayarınıza kurun: [MongoDB Download](https://www.mongodb.com/try/download/community)
2. MongoDB servisini başlatın (Windows'ta genellikle otomatik başlar)
3. Alternatif olarak MongoDB Atlas kullanabilirsiniz (bulut veritabanı)

### Backend Kurulumu

```bash
cd backend
npm install
```

MongoDB bağlantısını yapılandırmak için:
- Yerel MongoDB kullanıyorsanız: `backend/db/config.js` dosyasındaki varsayılan bağlantı string'i kullanılır (`mongodb://localhost:27017/e-commerce`)
- MongoDB Atlas kullanıyorsanız: `.env` dosyası oluşturup `MONGODB_URI` değişkenini ekleyin

Backend'i başlatmak için:
```bash
npm start
# veya geliştirme modu için:
npm run dev
```

Backend varsayılan olarak `http://localhost:5000` portunda çalışır.

### Frontend Kurulumu

```bash
cd front-end
npm install
npm start
```

Frontend varsayılan olarak `http://localhost:3000` portunda çalışır.

## Kullanılan Teknolojiler

- **Frontend**: React, React Router DOM
- **Backend**: Node.js, Express.js
- **Veritabanı**: MongoDB (Mongoose ODM)
- **Güvenlik**: bcryptjs (şifre şifreleme), jsonwebtoken (JWT authentication)
- **Diğer**: CORS, Nodemon, dotenv

## Özellikler

- ✅ Kullanıcı kimlik doğrulama (Kayıt/Giriş)
- ✅ **Şifre şifreleme (bcrypt)** - Güvenli şifre saklama
- ✅ **JWT Token Authentication** - Güvenli oturum yönetimi
- ✅ Ürün yönetimi (Ekleme, Listeleme, Güncelleme, Silme)
- ✅ Ürün arama özelliği
- ✅ Kullanıcı profili
- ✅ Özel route koruması (Private Routes)
- ✅ API endpoint koruması (Token doğrulama)
- ✅ Kullanıcı bazlı veri izolasyonu (her kullanıcı sadece kendi ürünlerini görür)
- ✅ Responsive tasarım

## API Endpoints

### Kullanıcı İşlemleri
- `POST /register` - Yeni kullanıcı kaydı (şifre otomatik hash'lenir, JWT token döner)
- `POST /login` - Kullanıcı girişi (JWT token döner)

### Ürün İşlemleri (Tüm endpoint'ler JWT token gerektirir)
- `GET /products` - Kullanıcının kendi ürünlerini listele
- `POST /add-product` - Yeni ürün ekle
- `GET /product/:id` - Belirli bir ürünü getir (sadece kendi ürünü)
- `PUT /product/:id` - Ürün güncelle (sadece kendi ürünü)
- `DELETE /product/:id` - Ürün sil (sadece kendi ürünü)
- `GET /search/:key` - Ürün ara (sadece kendi ürünlerinde)

## Güvenlik Özellikleri

- ✅ **Şifre Şifreleme**: Tüm şifreler bcrypt ile hash'lenerek saklanır
- ✅ **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- ✅ **Protected Routes**: Tüm ürün endpoint'leri token doğrulama gerektirir
- ✅ **Veri İzolasyonu**: Her kullanıcı sadece kendi ürünlerini görür/düzenler
- ✅ **Token Expiration**: Token'lar 7 gün sonra otomatik geçersiz olur

## Yapılandırma

### Backend Environment Variables

Backend klasöründe `.env` dosyası oluşturun:

```env
MONGODB_URI=mongodb://localhost:27017/e-commerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
```

**ÖNEMLİ**: Üretim ortamında `JWT_SECRET` değerini mutlaka değiştirin!

### Frontend Environment Variables (Opsiyonel)

Frontend klasöründe `.env` dosyası oluşturun:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Geliştirme Notları

- Backend ve Frontend ayrı portlarda çalışır
- MongoDB bağlantısı için `backend/db/config.js` dosyasını kontrol edin
- JWT token localStorage'da saklanır
- Token süresi dolduğunda otomatik olarak login sayfasına yönlendirilir

## Gelecek Geliştirmeler

- [ ] Rate limiting (API saldırı koruması)
- [ ] Şifre sıfırlama özelliği
- [ ] Ürün görselleri
- [ ] Kategori yönetimi
- [ ] Sipariş yönetimi
- [ ] Admin paneli
- [ ] Email doğrulama