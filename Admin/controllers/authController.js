import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../../models/admin.js';
import Blacklist from '../../models/blacklist.js';
import { BadRequestError, NotFoundError } from '../../utils/error.js';

export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) {
        throw new NotFoundError('User not found');
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        throw new BadRequestError('Incorrect credentials');
      }
  
      const payload = { id: admin._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '20m' });
      let options = {
        maxAge: 20 * 60 * 1000, // would expire in 20minutes
        httpOnly: true, // The cookie is only accessible by the web server
        secure: true,
        sameSite: "None",
    };
    res.cookie("SessionID",token,options)//set token to response header
    res.success({message:'You have been logged in successfully!'})
    } catch (err) {
      console.log(err);
      next(err); // Passes the error to the error-handling middleware
    }
  };

  export const register = async(req,res,next)=>{
    try{
     const {name, email, mobile, password} = req.body;
     const existing_admin = await Admin.findOne({email});
     if(existing_admin){
      throw new BadRequestError('It looks like you are already registered. Please try logging in.')
     }
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password,salt);
     const admin = new Admin({
        name,
        mobile,
        email,
        password:hash,
     })
     await admin.save();
     res.success({message:'You are now registered as an Admin.'});
    }catch(err){
        console.log(err);
        next(err);
    }
  }

  export const logout = async(req,res)=>{
    try {
        const authHeader = req.headers['cookie']; // get the session cookie from request header
        if (!authHeader) return res.sendStatus(204); // No content
        const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
        const accessToken = cookie.split(';')[0];
        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
        // if true, send a no content response.
        if (checkIfBlacklisted) return res.sendStatus(204);
        // otherwise blacklist token
        const newBlacklist = new Blacklist({
          token: accessToken,
        });
        await newBlacklist.save();
        // Also clear request cookie on client
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.success({ message: 'You are logged out!' });
      } catch (err) {
        next();
      }
  }