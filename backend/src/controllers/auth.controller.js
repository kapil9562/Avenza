import { oauth2client } from "../utils/googleConfig.js";
import axios from "axios";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from '../models/user.model.js'
import Otp from '../models/otp.model.js'
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken }
    } catch (error) {
        throw error;
    }
}

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

{/* google login */ }
const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: "Authorization code missing" });
        }

        // 1️⃣ Exchange code for tokens
        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);
        // 2️⃣ Get user info (CORRECT endpoint)
        const { data } = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            }
        );

        const { id, email, name, picture } = data;

        // 3️⃣ Call Stored Procedure
        let user = await User.findOne({ email });

        if (user && !user.isActive) {
            return res.status(403).json({
                message: "This account has been temporarily frozen",
            });
        }

        if (!user) {
            user = await User.create({
                uid: id,
                name,
                email,
                avatar: picture,
            })
        } else if (!user.googleLogin) {
            await User.updateOne(
                { _id: user._id },
                {
                    googleLogin: true,
                    avatar: picture
                },
                {
                    returnDocument: "after"
                }
            );
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-passwordHash -googleLogin -isActive -refreshToken");

        res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                message: "login successful",
                user: loggedInUser,
            });

    } catch (err) {
        console.error("❌ GOOGLE LOGIN ERROR:");
        console.error(err.response?.data || err.message || err);

        res.status(500).json({
            message: "Google login failed"
        });
    }
};


{/* email  Login */ }
const emailLogin = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required !"
        });
    }

    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Invalid credentials !",
            });
        } else if (user && !user.isActive) {
            return res.status(403).json({
                message: "This account has been temporarily frozen.",
            });
        } else if (user && !user.passwordHash && user.googleLogin) {
            return res.status(403).json({
                message: "This account uses Google login !",
            });
        } else {
            const isValid = await user.isPasswordCorrect(password);

            if (!isValid) {
                return res.status(401).json({ message: "Invalid credentials !" });
            } else {

                const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
                const loggedInUser = await User.findById(user._id).select("-passwordHash -googleLogin -isActive -refreshToken");

                return res
                    .status(200)
                    .cookie('accessToken', accessToken, options)
                    .cookie('refreshToken', refreshToken, options)
                    .json({
                        message: "login successful",
                        user: loggedInUser,
                    });
            }
        }

    } catch (err) {
        console.error("Email Login Error ::", err);

        return res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};


const emailSendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Invalid credentials !"
        });
    }

    try {

        let user = await User.findOne({ email });

        if (user && user.passwordHash) {
            return res.status(403).json({
                message: "Email already registered !"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);

        await Otp.deleteMany({ email })

        await Otp.create({
            email,
            otpHash
        })

        await sendEmail({
            to: email,
            otp: otp,
            subject: "Your Signup OTP"
        });

        res.json({ message: "OTP sent to email" });

    } catch (err) {
        console.log("send otp error ::", err)
        res.status(500).json({
            message: "Failed to send OTP"
        });
    }
};

const verifyOTP = async (req, res) => {
    const { name, email, password, otp } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: "Invalid credentials !" });
    }
    if (!otp) {
        return res.status(400).json({ message: "OTP is required !" });
    }

    try {
        // Find latest OTP for email
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return res.status(401).json({
                message: "OTP expired or not found !"
            });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid OTP !"
            });
        }

        const uid = uuidv4();

        let user = await User.findOne({ email });

        if (user && !user.isActive) {
            return res.status(403).json({
                message: "This account has been temporarily frozen.",
            });
        }

        if (!user) {
            user = await User.create({
                uid,
                name,
                email,
                passwordHash: password,
                googleLogin: false
            });
        }
        else if (user.googleLogin && !user.passwordHash) {
            user.passwordHash = password;
            await user.save();
        }

        await Otp.deleteMany({ email });

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-passwordHash -googleLogin -isActive -refreshToken");

        res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                message: "Signup successful",
                user: loggedInUser,
            });

    } catch (err) {
        console.log("verifyOTP error:", err);
        res.status(500).json({ message: "OTP verification failed" });
    }
};


// POST /auth/forgot-password/send-otp
const sendResetOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Invalid credentials !"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found !"
            });
        }

        if (!user.passwordHash) {
            return res.status(403).json({
                message: "This account uses Google login !"
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);

        // Remove old OTP
        await Otp.deleteMany({ email });

        // Save new OTP
        await Otp.create({
            email,
            otpHash
        });

        // Send email
        await sendEmail({
            to: email,
            otp: otp,
            subject: "Password Reset OTP"
        });

        res.status(200).json({
            message: "OTP sent to your email"
        });

    } catch (err) {
        console.log("Forgot OTP error:", err);
        res.status(500).json({
            message: "Failed to send OTP"
        });
    }
};


const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            message: "Invalid credentials !"
        });
    }

    try {
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP expired or not found !"
            });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid OTP !"
            });
        }

        otpRecord.verified = true;
        await otpRecord.save();

        res.status(200).json({
            message: 'Verified'
        });
    } catch (err) {
        console.log("Verify forgotOTP error:", err);
        res.status(500).json({
            message: "Failed to verify OTP !"
        });
    }
}

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Invalid credentials !"
        });
    }

    try {
        const otpRecord = await Otp.findOne({ email, verified: true });

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP verification required!"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found !",
            });
        } else if (user && !user.isActive) {
            return res.status(403).json({
                message: "This account has been temporarily frozen.",
            });
        } else if (!user.passwordHash) {
            return res.status(403).json({
                message: "This account uses Google login !"
            });
        }

        user.passwordHash = password;
        await user.save();

        await Otp.deleteMany({ email });

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-passwordHash -googleLogin -isActive -refreshToken");

        res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                message: "Password Reset Successfully",
                user: loggedInUser,
            });

    } catch (err) {
        console.log("Reset Password error:", err);
        res.status(500).json({
            message: err?.message || "Failed to reset Password !"
        });
    }

}

const logout = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            returnDocument: "after"
        }
    );

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "logout successfully"
        })

}

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            message: "unauthorized request!"
        });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({
                message: "Invalid refresh token!"
            })
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({
                message: "Refresh token is expired or used!"
            });
        }

        const { refreshToken: newRefreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                message: "Access token refreshed."
            });
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token!"
        });
    }

}

const getCurrentUser = async (req, res) => {
    res.status(200).json({
        user: req.user,
    });
};

export { googleLogin, emailLogin, emailSendOTP, verifyOTP, sendResetOTP, verifyResetOTP, resetPassword, logout, refreshAccessToken, getCurrentUser };