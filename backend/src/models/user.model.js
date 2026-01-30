import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        default: null
    },
    avatar: {
        type: String
    },
    googleLogin: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("passwordHash") || !this.passwordHash) {
        return ;
    }

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!this.passwordHash) return false;
    return await bcrypt.compare(password, this.passwordHash)
}

export default mongoose.model("User", userSchema);
