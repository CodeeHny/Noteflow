import { User } from "../models/user.model.js";
import bcrpt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    try {

        let { username, email, password } = req.body;
        if ([username, email, password].some((field) => !field?.trim())) return res.status(400).json({ messsage: "All fields required" });

        let existedUser = await User.findOne({ email });
        if (existedUser) return res.status(400).json({ message: "Email already in used" });

        let user = await User.create({
            email,
            password,
            username,
        });

        let createdUser = await User.findById({ _id: user._id }).select("-password")
        if (!createdUser) return res.status(400).json({ messgae: "Something went wrong while creating user" });

        return res
            .status(500)
            .json({
                message: "User created successfully",
                user: createdUser,
            });

    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Something went wrong while registerig user" })
    }
}

const loginUser = async (req, res) => {
    // email, password - req.body 
    // check if email exist or not 
    // check password 
    // access user 
    // send token 

    let { email, password } = req.body;

    if ([email, password].some((field) => !field?.trim())) return res.status(400).json({ message: "All field required" });

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found " });

    let isPasswordCorrect = await bcrpt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Password is wrong" });

    let userData = {
        _id: user._id,
        email: user.email
    };

    let token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_TOKEN_SECRET
    );

    return res
    .status(500)
    .cookie("accessToken", token)
    .json({
        message: "User logged in successfully",
        user: userData
    })


}

const logoutUser = async (req, res) => {
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "User logged out successfully" })
}

export {
    registerUser,
    loginUser,
    logoutUser,
}
// change profile 
// change password 
// delete account 