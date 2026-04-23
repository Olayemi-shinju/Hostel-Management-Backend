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

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    user.lastLogin = new Date();
    user.isOnline = true;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userObj
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

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

    if (await user.comparePassword(password)) return res.status(400).json({ success: false, msg: 'New password cannot be the same as old password' })

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
    const { page, limit, skip } = pagination(req);

    const admins = await User.find({ role: "admin" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const { page, limit, skip } = pagination(req);

    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await User.countDocuments({ role: "user" });

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


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

export const updateData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, nin } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (nin) updateFields.nin = nin;

    if (req.files?.avatar) {
      updateFields.avatar = req.files.avatar[0].path;
    }

    const updatedData = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      msg: 'Data Updated Successfully',
      data: updatedData
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'An error occurred' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      msg: 'User deleted successfully'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'An error occurred' });
  }
};