import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
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
        await user.save({ validateBeforeSave: false });

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

const viewBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found." });

        blog.viewCount += 1;
        await blog.save();

        return res
            .status(200)
            .json({
                message: "Blog fetched successfully",
                blog,
            });

    } catch (error) {
        res.status(500).json({ error: "Something went wrong while adding view " });
        console.log("Error : ", error);
    }
}

const likeBlog = async (req, res) => {
    try {

        let blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (blog.likes.includes(req.user._id)) {
            blog.likes.pull(req.user._id);
            await blog.save()
        }
        else {
            blog.likes.push(req.user._id);
            await blog.save()
        }

        return res
            .status(200)
            .json({
                message: "Blog Liked ",
                likeCount: blog.likes.length,
            })

    } catch (error) {
        res.status(500).json({ error: "Failed to like blog " });
        console.log("Error : ", error);
    }
}

const createComment = async (req, res) => {
    let { content, parentComment } = req.body;
    let blog = await Blog.findById(req.params.blogId);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!content.trim()) return res.status(400).json({ message: "Content is required" });
    parentComment = parentComment?.trim() || null;


    let comment = await Comment.create({
        blogId: blog._id,
        author: req.user._id,
        content,
        parentComment,
    });

    if (!comment) return res.status(400).json({ message: "Something went qrong while commenting on blog" });

    blog.comments.push(comment._id);
    await blog.save();

    return res
        .status(201)
        .json({
            message: "comment successfully",
            comment,
        })
}

export {
    createBlog,
    updateBlog,
    deleteBlog,
    viewBlog,
    likeBlog,
    createComment
}