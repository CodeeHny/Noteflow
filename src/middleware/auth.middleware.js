import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyJWT = async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        if(!token) return res.status(404).json({message: "Token not found || Unauthorized access "});

        let decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        let user = await User.findById(decodedToken.userId).select("-password");   
        if(!user) return res.status(400).json({message: "Invalid access token "});

        req.user = user;

        next();

    } catch (error) {
        console.log("Invalid access token ");
        return res.status(404).json({error: "Invalid access token"})
    }
}
