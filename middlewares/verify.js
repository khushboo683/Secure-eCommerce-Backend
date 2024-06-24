import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../utils/error.js";

export async function Verify(req, res, next) {
    try {
        const authHeader = req.headers["cookie"]; // get the session cookie from request header

        if (!authHeader) throw new BadRequestError('Missing authorization headers!'); // if there is no cookie from request header, send an unauthorized response.
        let cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt
        cookie=cookie.split(";")[0];
        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        console.log("cookie",cookie)
        jwt.verify(cookie, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log("errrr",err);
                // if token has been altered or has expired, return an unauthorized error
              throw new UnauthorizedError('Session expired, please login again!')
            }

            const { id } = decoded; // get user id from the decoded token
            console.log("id",id)
            const user = await User.findById(id); 
            const { role } = user; // extract the user role
            // check if user has no advance privileges
            // return an unauthorized response
            if (role !== "0x88") {
                throw new UnauthorizedError('You are not authorized to view this page.');
            }
            const { password, ...data } = user._doc; // return user object without the password
            req.user = data;
            console.log("req.user",req.user) // put the data object into req.user
            next();
        });
    } catch (err) {
      next(err);
    }
}