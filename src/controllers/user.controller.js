import { User } from "../models/user.model.js"

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



export {
    registerUser,
}