import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../utils/error.js";

export async function AdminVerify(req, res, next) {
    try {
        console.log("headers",req.headers)
        const authHeader = req.headers["cookie"]; // get the session cookie from request header
console.log("auth header",authHeader)
        if (!authHeader) throw new BadRequestError('Missing authorization headers!'); // if there is no cookie from request header, send an unauthorized response.
        const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt

        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        console.log("cookie",cookie)
        jwt.verify(cookie, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
              throw new UnauthorizedError('Session expired, please login again!')
            }

            const { id } = decoded; // get user id from the decoded token
            const admin = await Admin.findById(id); 
            const { role } = admin; // extract the user role
            // check if user has no advance privileges
            // return an unauthorized response
            if (role !== "0x99") {
                throw new UnauthorizedError('You are not authorized to view this page.');
            }
            const { password, ...data } = admin._doc; // return user object without the password
            req.admin = data; // put the data object into req.user
            next();
        });
    } catch (err) {
      next(err);
    }
}