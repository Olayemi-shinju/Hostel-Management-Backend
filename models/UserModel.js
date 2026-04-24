import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    phone: { type: String, required: true },

    password: { type: String, required: true },

    nin: { type: String },

    avatar: { type: String },

    role: {
        type: String,
        enum: ['super-admin', 'admin', 'user'],
        default: 'user',
        index: true
    },

    lastLogin: { type: Date },

    isVerified: { type: Boolean, default: false },

    resetPasswordToken: {
        type: String,
        index: true
    },

    resetPasswordTokenExpireAt: Date,

    verificationToken: {
        type: String,
        index: true
    },

    verificationTokenExpireAt: Date,

    isOnline: { type: Boolean, default: false },

    idImage: { type: String },

    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
        index: true
    }

}, { timestamps: true })

UserSchema.pre("save", async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', UserSchema)