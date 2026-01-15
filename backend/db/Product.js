const mongoose = require ('mongoose');

const ProductSchema= new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Ürün ismi zorunludur'],
        trim: true,
        minlength: [2, 'Ürün ismi en az 2 karakter olmalıdır']
    },
    price : {
        type: String,
        required: [true, 'Fiyat zorunludur'],
        trim: true
    },
    category : {
        type: String,
        required: [true, 'Kategori zorunludur'],
        trim: true
    },
    userId : {
        type: String,
        required: [true, 'Kullanıcı ID zorunludur']
    },
    company : {
        type: String,
        required: [true, 'Şirket zorunludur'],
        trim: true
    }
}, {
    timestamps: true // createdAt ve updatedAt otomatik ekler
})

module.exports = mongoose.model("products", ProductSchema);