import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("passwordHash") || !this.passwordHash) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!this.passwordHash) return false;
    return await bcrypt.compare(password, this.passwordHash)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default mongoose.model("User", userSchema);
