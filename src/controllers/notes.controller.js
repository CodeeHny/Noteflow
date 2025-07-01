import { Notes } from "../models/notes.model.js";
import { User } from "../models/user.model.js";

const createNotes = async (req, res) => {
    try {
        const { title, content, isArchived } = req.body;

        if ([title, content, isArchived].some((field) => !field?.trim())) return res.status(404).json({ message: "All fileds are required " });

        let user = await User.findById(req.user._id);

        let notes = await Notes.create({
            title,
            content,
            archived: isArchived,
            owner: user._id,
        });

        if (!notes) return res.status(400).json({ message: "Failed to create notes" });

        return res
            .status(200)
            .json({
                message: "Notes created successfully",
                notes,
            })
    } catch (error) {
        res.status(400).json({message: "Something went wrong while craeting notes"});
        console.log("Error : ", error.message)
    }

}

export {
    createNotes,
}

// create -----
// update 
// delete 