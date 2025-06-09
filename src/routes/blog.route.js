import { Router } from "express";
import { createBlog, deleteBlog, likeBlog, updateBlog, viewsCount } from "../controllers/blog.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route('/create').post(verifyJWT ,createBlog);
router.route('/update/:blogId').post(verifyJWT , updateBlog);
router.route('/delete/:blogId').post(verifyJWT, deleteBlog);
router.route('/countView/:blogId').post(viewsCount);
router.route('/like/:blogId').post(verifyJWT, likeBlog);


export default router;