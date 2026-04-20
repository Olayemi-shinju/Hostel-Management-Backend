import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, sendRestSuccessEmail } from '../Mail/Email.js';
import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { pagination } from "../utils/pagination.js";

export const Register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ success: false, msg: 'This user alsready exist' })

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    let user = new User({
      name,
      email,
      password,
      phone,
      role,
      verificationToken,
      verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    })

    await sendVerificationEmail(user.email, verificationToken)
    await user.save()
    const userObj = user.toObject()
    delete userObj.password

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' })
    res.status(201).json({ success: true, msg: 'User created successfully', user: userObj, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Server error' })
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(403).json({ success: false, message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email" })
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    user.lastLogin = new Date();
    user.isOnline = true
    await user.save();

    const userObj = user.toObject()
    delete userObj.password

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "User Login successfully",
      user: userObj,
    });
  } catch (error) {
    console.log(error)
    res.send({ success: false, msg: 'Server Error' });
  }
};


export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    })
    return res.status(200).json({ success: true, msg: 'Logged Out Successfully' })
  } catch (error) {
    console.log(error)
    res.send({ success: false, msg: 'Server Error' });
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body
    const user = await User.findOne({
      verificationToken: otp,
      verificationTokenExpireAt: { $gt: Date.now() },

    })


    if (!user) return res.status(400).json({ success: false, msg: 'Invalid or expired otp' })

    user.isVerified = true
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save()
    await sendWelcomeEmail(user.email)
    res.status(200).json({ success: true, msg: 'User verified successfully', user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, msg: 'Server Error' })
  }
}

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: false, msg: 'User not found' })

    if (user.isVerified) return res.status(400).json({ success: false, msg: 'User already verified' })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    verificationTokenExpireAt = Date.now() + 10 * 60 * 1000
    user.verificationToken = otp
    user.verificationTokenExpireAt = verificationTokenExpireAt
    await user.save()
    await sendVerificationEmail(user.email, user.name, otp)
    return res.status(200).json({ success: true, msg: 'Verification Otp Send Successfully', otp, verificationTokenExpireAt })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, msg: 'Server Error' })
  }
}


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: true, msg: 'If an account exists with this email, a password rest link will be sent shortly' })

    const token = crypto.randomBytes(20).toString('hex')
    const resetPasswordTokenExpireAt = Date.now() + 2 * 60 * 1000

    user.resetPasswordToken = token
    user.resetPasswordTokenExpireAt = resetPasswordTokenExpireAt

    await user.save()
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URI}/reset-password/${token}`)
    res.status(200).json({ success: true, message: "If an account exists with this email, a password rest link will be sent shortly" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, msg: 'Server Error' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpireAt: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Inavlid or expired rest token' })
    }

    user.password = password,
      user.resetPasswordToken = undefined,
      user.resetPasswordTokenExpireAt = undefined;

    await user.save()
    await sendRestSuccessEmail(user.email)

    res.status(200).json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const { page, limit, skip } = pagination(req)

    const admin = await User.find({ role: 'admin' }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocument();

    re.status(200).json({ success: true, msg: 'Admin successfully retrived', data: admin, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getAllUser = async (req, res) => {
  try {
    const { page, limit, skip } = pagination(req)

    const user = await User.find({ role: 'user' }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocument();

    re.status(200).json({ success: true, msg: 'User successfully retrived', data: user, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
}


export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select('-password').select('-__v')
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' })

    res.status(200).json({ success: true, msg: 'User found successfuly', data: user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, msg: 'An error occured' })
  }
}