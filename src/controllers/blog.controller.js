import { Blog } from "../models/blog.model.js"
import { User } from "../models/user.model.js";


const createBlog = async (req, res) => {
    try {
        let { title, content, visibility } = req.body;

        if ([title, content, visibility].some((field) => !field?.trim())) return res.status(404).json({ message: "All fileds are required " });

        let user = await User.findById(req.user._id);

        let blog = await Blog.create({
            title,
            visibility,
            content,
            author: user._id,
        });

        if (!blog) return res.status(404).json({ message: "Faoled to create blog" });

        user.blogs.push(blog._id);
        user.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json({
                message: "Blog created successfully",
                blog
            });

    } catch (error) {
        res.status(500).json({ error: "Something went wrong while creating the Blog " });
        console.log("Error : ", error)
    }

}

const updateBlog = async (req, res) => {
    try {
        let { title, content, visibility } = req.body;
        let user = await User.findById(req.user._id);

        if (!user.blogs.includes(req.params.blogId)) return res.status(404).json({ message: "Blog not found" });
        if ([title, content, visibility].some((field) => !field?.trim())) return res.status(401).json({ message: "all fields are required" });

        let blog = await Blog.findOneAndUpdate(
            { _id: req.params.blogId },
            {
                title,
                content,
                visibility
            },
            {
                new: true
            });
        if (!blog) return res.status(404).json({ message: "Failed to update Blog" });

        return res
            .status(200)
            .json({
                message: "Blog updated successfully",
                blog
            })

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Failed to update blog" })
    }
}

const deleteBlog = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);

        if (!user.blogs.includes(req.params.blogId)) return res.status(404).json({ message: "Blog not found " })

        let blog = await Blog.findByIdAndDelete(req.params.blogId);

        let blogIndex = user.blogs.indexOf(req.params.blogId);
        user.blogs.splice(blogIndex, 1);
        user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json({
                message: "Blog deleted successfully",
                deletedBlog: blog,
                array: user.blogs
            })

    } catch (error) {
        res.status(500).json({ error: "Something went wrong while deleting blog" });
        console.log("Error: ", error);
    }


}

export {
    createBlog,
    updateBlog,
    deleteBlog,
}