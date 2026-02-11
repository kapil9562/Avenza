import { oauth2client } from "../utils/googleConfig.js";
import axios from "axios";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from '../models/user.model.js'
// import { sendOTPEmail } from "../utils/sendEmail.js";

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
            return res.status(400).json({
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
        }

        if (user && !user.googleLogin) {
            await User.updateOne(
                { _id: user._id },
                {
                    googleLogin: true,
                    avatar: picture
                }
            );
        }

        // 4️⃣ Respond
        res.status(200).json({
            message: "Google login successful",
            user,
            tokens
        });

    } catch (err) {
        console.error("❌ GOOGLE LOGIN ERROR:");
        console.error(err.response?.data || err.message || err);

        res.status(500).json({
            message: "Google login failed",
            error: err.message,
        });
    }
};

{/* email sign up */ }
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "All fields required" });

    try {

        const uid = uuidv4();

        let user = await User.findOne({ email });

        if (user && !user.isActive) {
            return res.status(400).json({
                message: "This account has been temporarily frozen",
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
        else {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        res.status(201).json({
            message: "Signup successful",
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                photo: user.avatar
            }
        });

    } catch (err) {
        res.status(500).json({ message: err });
        console.log(err)
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
            return res.status(400).json({
                message: "User not found !",
            });
        } else if (user && !user.isActive) {
            return res.status(400).json({
                message: "This account has been temporarily frozen.",
            });
        } else if (user && !user.passwordHash && user.googleLogin) {
            return res.status(400).json({
                message: "This account uses Google login !",
            });
        } else {
            const isValid = await user.isPasswordCorrect(password);

            if (!isValid) {
                return res.status(400).json({ message: "Invalid credentials !" });
            } else {
                return res.json({
                    message: "Login successful",
                    user: {
                        uid: user.uid,
                        name: user.name,
                        email: user.email,
                        photo: user.avatar
                    }
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


// const loginSendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const pool = await poolPromise;

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpHash = await bcrypt.hash(otp, 10);
//     await pool.request()
//       .input("email", sql.NVarChar, email)
//       .input("otp_hash", sql.NVarChar, otpHash)
//       .execute("sp_login_send_otp");

//     await sendOTPEmail(email, otp);

//     res.json({ message: "OTP sent to email" });

//   } catch (err) {
//     console.log(err)
//     res.status(400).json({
//       message: err.originalError?.info?.message || "Failed to send OTP"
//     });
//   }
// };



// const verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;
//   console.log(email, otp)

//   if (!email || !otp) {
//     return res.status(400).json({ message: "Email and OTP are required" });
//   }

//   try {
//     const pool = await poolPromise;

//     // 1️⃣ Get latest valid OTP from SP
//     const result = await pool.request()
//       .input("email", sql.NVarChar, email)
//       .execute("sp_login_verify_otp");

//       console.log('result ',result)

//     if (!result.recordset.length) {
//       return res.status(400).json({ message: "OTP expired or invalid" });
//     }

//     const otpRow = result.recordset[0];

//     // 2️⃣ Compare OTP (hashed)
//     const isValid = await bcrypt.compare(otp, otpRow.otp_hash);
//     if (!isValid) {
//       return res.status(401).json({ message: "Invalid OTP" });
//     }

//     // 3️⃣ Mark OTP as used
//     const data = await pool.request()
//       .input("id", sql.Int, otpRow.id)
//       .execute("sp_mark_otp_used");

//       const user = data.recordset[0];

//     res.json({
//       message: "Login successful",
//       user
//     });

//   } catch (err) {
//     console.error("verifyOTP error:", err);
//     res.status(500).json({ message: "OTP verification failed" });
//   }
// };

export { googleLogin, signup, emailLogin };