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

        user.notes.push(notes._id);
        user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json({
                message: "Notes created successfully",
                notes,
            })
    } catch (error) {
        res.status(400).json({ message: "Something went wrong while craeting notes" });
        console.log("Error : ", error.message)
    }
}

const updateNotes = async (req, res) => {
    try {
        let { title, content, archived, collaborators } = req.body;

        const updateObject = {};

        if (title !== undefined && title.trim()) updateObject.title = title.trim();
        if (content !== undefined && content.trim()) updateObject.content = content;
        if (archived !== undefined && typeof archived !== 'boolean') updateObject.archived = archived;
        if (collaborators !== undefined) updateObject.collaborators = collaborators;

        let notes = await Notes.findOneAndUpdate(
            { _id: req.params.notesId },
            updateObject,
            {
                new: true
            }
        );
        if (!notes) return res.status(404).json({ message: "Notes not found" });

        return res.status(200).json({
            message: "Notes updated successfully",
            notes,
        });

    } catch (error) {
        res.status(500).send("Something went wrong while updating notes");
        console.log('Error : ', error.message);
    }
}

const deleteNotes = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);

        if (!user.notes.includes(req.params.notesId)) return res.status(404).json({ message: "Notes not found " })

        let notes = await Notes.findByIdAndDelete(req.params.notesId);

        let notesIndex = user.notes.indexOf(req.params.notesId);
        user.notes.splice(notesIndex, 1);
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json({
                message: "Notes deleted successfully",
                deletedBlog: notes,
                array: user.blogs
            })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while deleting notes" });
        console.log("Error: ", error.message);
    }
}

export {
    createNotes,
    updateNotes,
    deleteNotes
}