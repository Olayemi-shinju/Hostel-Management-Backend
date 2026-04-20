import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'


export const protect  = async(req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json({msg: 'Not authorized, No token provided'})
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if(!req.user){
            res.status(401).json({success: false, msg: 'User not found'})
        }
        next()
    } catch (error) {
        console.log(error)
       return res.status(401).json({msg: 'Invalid or expired token'})
    }
};

export const authorized = (...role)=>{
    return (req, res, next) =>{
        if(!req.user || !role.includes(req.user.role)){
            return res.status(403).json({msg: 'Access Denied'})
        }
        next();
    };
};