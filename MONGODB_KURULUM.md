# MongoDB Kurulum ve Bağlantı Rehberi

## MongoDB Servisini Kontrol Etme

### Windows'ta MongoDB Servisini Başlatma

1. **Servis Yöneticisi ile:**
   - `Win + R` tuşlarına basın
   - `services.msc` yazın ve Enter'a basın
   - "MongoDB" servisini bulun
   - Sağ tıklayıp "Start" seçin (eğer durmuşsa)

2. **Komut Satırı ile:**
   ```powershell
   # MongoDB servisini başlat
   net start MongoDB
   
   # Servis durumunu kontrol et
   sc query MongoDB
   ```

## MongoDB Compass'ta Bağlantı Kurma

### Adım 1: MongoDB Compass'ı Açın
- MongoDB Compass uygulamasını açın

### Adım 2: Yeni Bağlantı Ekleme
1. "Add new connection" butonuna tıklayın
2. Connection string alanına şunu yazın:
   ```
   mongodb://localhost:27017
   ```
3. "Connect" butonuna tıklayın

### Adım 3: Bağlantıyı Test Etme
- Bağlantı başarılı olursa, sol tarafta mevcut database'ler görünecek
- Henüz database yoksa, bu normaldir (ilk veri kaydedildiğinde oluşacak)

## Database'in Otomatik Oluşturulması

MongoDB'de database'ler **otomatik olarak** oluşturulur. İlk veri kaydedildiğinde:
- `e-commerce` database'i oluşturulacak
- `users` collection'ı oluşturulacak (ilk kullanıcı kaydında)
- `products` collection'ı oluşturulacak (ilk ürün eklendiğinde)

## Projeyi Çalıştırma

1. **Backend'i başlatın:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   
   Başarılı bağlantıda terminal'de şunu göreceksiniz:
   ```
   MongoDB bağlantısı başarılı!
   Server 5000 portunda çalışıyor
   ```

2. **Frontend'i başlatın:**
   ```bash
   cd front-end
   npm install
   npm start
   ```

3. **Test edin:**
   - Tarayıcıda `http://localhost:3000` adresine gidin
   - "Sign Up" ile yeni kullanıcı oluşturun
   - MongoDB Compass'ta `e-commerce` database'ini görebilirsiniz

## Sorun Giderme

### MongoDB bağlantı hatası alıyorsanız:

1. **MongoDB servisinin çalıştığından emin olun:**
   ```powershell
   net start MongoDB
   ```

2. **Port 27017'nin kullanılabilir olduğundan emin olun:**
   ```powershell
   netstat -an | findstr 27017
   ```

3. **MongoDB'nin doğru kurulduğundan emin olun:**
   - MongoDB Community Server'ın kurulu olduğundan emin olun
   - Kurulum yolunu kontrol edin (genellikle `C:\Program Files\MongoDB\`)

4. **Manuel bağlantı testi:**
   ```powershell
   # MongoDB shell ile test
   mongosh
   # veya eski versiyonlarda:
   mongo
   ```

## MongoDB Atlas Kullanıyorsanız

Eğer MongoDB Atlas (bulut) kullanmak isterseniz:

1. MongoDB Atlas'ta ücretsiz cluster oluşturun
2. Connection string'i alın
3. `backend/db/config.js` dosyasını güncelleyin:
   ```javascript
   const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kullanici:sifre@cluster.mongodb.net/e-commerce";
   ```

## Önemli Notlar

- ✅ Database'ler otomatik oluşturulur - manuel oluşturmanıza gerek yok
- ✅ Collection'lar (tablolar) da otomatik oluşturulur
- ✅ İlk veri kaydından önce database görünmeyebilir - bu normaldir
- ✅ Backend başlatıldığında bağlantı otomatik kurulur
