const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require ("./db/config");
const User = require ("./db/User");
const Product = require ("./db/Product");
const Category = require ("./db/Category");
const { generateToken, verifyToken } = require("./middleware/auth");
const app = express();

app.use(express.json());
app.use(cors());

// Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5, // 5 deneme
    message: { error: "Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin." }
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 3, // 3 kayıt
    message: { error: "Çok fazla kayıt denemesi. Lütfen 1 saat sonra tekrar deneyin." }
});

app.post("/register", registerLimiter, async (req,resp)=>{
    try {
        // Email zaten kayıtlı mı kontrol et
        const existingUser = await User.findOne({ email: req.body.email?.toLowerCase() });
        if (existingUser) {
            return resp.status(400).send({error: "Kayıt başarısız", message: "Bu email adresi zaten kullanılıyor"});
        }

        let user = new User(req.body);
        let result = await user.save();
        
        // Şifreyi response'dan çıkar
        result = result.toObject();
        delete result.password;
        
        // JWT token oluştur
        const token = generateToken(result._id);
        
        // Token ve kullanıcı bilgilerini gönder
        resp.status(201).send({
            ...result,
            token
        });
    } catch (error) {
        // Mongoose validation hatalarını daha anlaşılır hale getir
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return resp.status(400).send({error: "Kayıt başarısız", message: messages.join(', ')});
        }
        if (error.code === 11000) {
            return resp.status(400).send({error: "Kayıt başarısız", message: "Bu email adresi zaten kullanılıyor"});
        }
        resp.status(400).send({error: "Kayıt başarısız", message: error.message});
    }
})

app.post("/login", loginLimiter, async (req,resp)=>{
    try {
        if(req.body.password && req.body.email){
            const email = req.body.email.toLowerCase();
            
            // Email ile kullanıcıyı bul (password dahil)
            let user = await User.findOne({
                email: email
            }).select("+password"); // Password alanını dahil et
            
            if(!user){
                return resp.status(401).send({result : "Email veya şifre hatalı"});
            }
            
            // Şifreyi karşılaştır
            const isPasswordValid = await user.comparePassword(req.body.password);
            
            if(!isPasswordValid){
                return resp.status(401).send({result : "Email veya şifre hatalı"});
            }

            // Şifreyi response'dan çıkar
            const userObj = user.toObject();
            delete userObj.password;
            
            // JWT token oluştur
            const token = generateToken(user._id);
            
            resp.send({
                ...userObj,
                token
            });
        }
        else{
            resp.status(400).send({result : "Email ve şifre gereklidir"});
        }
    } catch (error) {
        console.error("Login error:", error);
        resp.status(500).send({error: "Giriş başarısız", message: error.message});
    }
})

app.post("/add-product", verifyToken, async (req,resp)=>{
    try {
        // userId'yi token'dan al (middleware'den geliyor)
        const productData = {
            ...req.body,
            userId: req.userId
        };
        let product = new Product(productData);
        let result = await product.save();
        resp.send(result);
    } catch (error) {
        resp.status(400).send({error: "Ürün ekleme başarısız", message: error.message});
    }
})

app.get("/products", verifyToken, async (req,resp)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sadece kendi ürünlerini görsün (userId string veya ObjectId olabilir)
        const query = {
            $or: [
                {userId: req.userId},
                {userId: req.userId.toString()}
            ]
        };

        const total = await Product.countDocuments(query);
        let products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // En yeni önce

        // Eğer pagination parametreleri yoksa eski formatı döndür (geriye uyumluluk)
        if(!req.query.page && !req.query.limit){
            resp.send(products.length > 0 ? products : []);
        } else {
            resp.send({
                products,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        }
    } catch (error) {
        console.error("Products fetch error:", error);
        resp.status(500).send({error: "Ürünler getirilemedi", message: error.message});
    }
})

app.delete("/product/:id", verifyToken, async (req,resp)=>{
    try {
        // Sadece kendi ürününü silebilsin
        const product = await Product.findOne({_id: req.params.id, userId: req.userId});
        if(!product){
            return resp.status(403).send({error: "Yetkisiz işlem", message: "Bu ürünü silme yetkiniz yok"});
        }
        let result = await Product.deleteOne({_id: req.params.id, userId: req.userId});
        resp.send(result);
    } catch (error) {
        resp.status(500).send({error: "Silme başarısız", message: error.message});
    }
})

app.get("/product/:id", verifyToken, async (req,resp)=>{
    try {
        // Sadece kendi ürününü görsün
        let result = await Product.findOne({_id: req.params.id, userId: req.userId});
        if(result){
            resp.send(result);
        }
        else{
            resp.status(404).send({result: "Ürün bulunamadı"});
        }
    } catch (error) {
        resp.status(500).send({error: "Ürün getirilemedi", message: error.message});
    }
})

app.put("/product/:id", verifyToken, async (req,resp)=>{
    try {
        // Sadece kendi ürününü güncelleyebilsin
        const product = await Product.findOne({_id: req.params.id, userId: req.userId});
        if(!product){
            return resp.status(403).send({error: "Yetkisiz işlem", message: "Bu ürünü güncelleme yetkiniz yok"});
        }
        let result = await Product.updateOne(
            {_id: req.params.id, userId: req.userId},
            {$set: req.body}
        );
        resp.send(result);
    } catch (error) {
        resp.status(500).send({error: "Güncelleme başarısız", message: error.message});
    }
})

app.get("/search/:key", verifyToken, async (req,resp)=>{
    try {
        // Sadece kendi ürünlerinde ara
        let result = await Product.find({
            userId: req.userId,
            "$or": [
                {name: {$regex: req.params.key, $options: 'i'}},
                {company: {$regex: req.params.key, $options: 'i'}},
                {category: {$regex: req.params.key, $options: 'i'}}
            ]
        });
        resp.send(result);
    } catch (error) {
        resp.status(500).send({error: "Arama başarısız", message: error.message});
    }
})

// Kategori Endpoint'leri
app.get("/categories", verifyToken, async (req,resp)=>{
    try {
        let categories = await Category.find({userId: req.userId});
        resp.send(categories);
    } catch (error) {
        resp.status(500).send({error: "Kategoriler getirilemedi", message: error.message});
    }
})

app.post("/add-category", verifyToken, async (req,resp)=>{
    try {
        const categoryData = {
            ...req.body,
            userId: req.userId
        };
        let category = new Category(categoryData);
        let result = await category.save();
        resp.send(result);
    } catch (error) {
        if (error.code === 11000) {
            return resp.status(400).send({error: "Kategori ekleme başarısız", message: "Bu kategori zaten mevcut"});
        }
        resp.status(400).send({error: "Kategori ekleme başarısız", message: error.message});
    }
})

app.delete("/category/:id", verifyToken, async (req,resp)=>{
    try {
        const category = await Category.findOne({_id: req.params.id, userId: req.userId});
        if(!category){
            return resp.status(403).send({error: "Yetkisiz işlem", message: "Bu kategoriyi silme yetkiniz yok"});
        }
        let result = await Category.deleteOne({_id: req.params.id, userId: req.userId});
        resp.send(result);
    } catch (error) {
        resp.status(500).send({error: "Kategori silinemedi", message: error.message});
    }
})

app.put("/category/:id", verifyToken, async (req,resp)=>{
    try {
        const category = await Category.findOne({_id: req.params.id, userId: req.userId});
        if(!category){
            return resp.status(403).send({error: "Yetkisiz işlem", message: "Bu kategoriyi güncelleme yetkiniz yok"});
        }
        let result = await Category.updateOne(
            {_id: req.params.id, userId: req.userId},
            {$set: req.body}
        );
        resp.send(result);
    } catch (error) {
        resp.status(500).send({error: "Kategori güncellenemedi", message: error.message});
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});   