const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kategori ismi zorunludur'],
        trim: true,
        unique: true,
        minlength: [2, 'Kategori ismi en az 2 karakter olmalıdır']
    },
    userId: {
        type: String,
        required: [true, 'Kullanıcı ID zorunludur']
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("categories", CategorySchema);
