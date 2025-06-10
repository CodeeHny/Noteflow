import { Router } from "express";
import { createBlog, createComment, deleteBlog, likeBlog, updateBlog, viewBlog } from "../controllers/blog.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route('/create').post(verifyJWT, createBlog);
router.route('/update/:blogId').post(verifyJWT, updateBlog);
router.route('/delete/:blogId').post(verifyJWT, deleteBlog);
router.route('/view/:blogId').post(viewBlog);
router.route('/like/:blogId').post(verifyJWT, likeBlog);
router.route('/comment/:blogId').post(verifyJWT, createComment);


export default router;