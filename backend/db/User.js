const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema= new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'İsim zorunludur'],
        trim: true,
        minlength: [2, 'İsim en az 2 karakter olmalıdır']
    },
    email : {
        type: String,
        required: [true, 'Email zorunludur'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
    },
    password : {
        type: String,
        required: [true, 'Şifre zorunludur'],
        minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
        select: false // Varsayılan olarak password alanını getirme
    },
}, {
    timestamps: true // createdAt ve updatedAt otomatik ekler
})

// Şifreyi kaydetmeden önce hash'le
UserSchema.pre('save', async function(next) {
    // Eğer şifre değişmemişse, hash'leme yapma
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Şifreyi hash'le (10 salt rounds)
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("users", UserSchema);