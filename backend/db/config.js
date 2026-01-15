const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/e-commerce";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB bağlantısı başarılı!");
    })
    .catch((err) => {
        console.error("MongoDB bağlantı hatası:", err);
    });