import { Router } from "express";
import { createBlog, deleteBlog, updateBlog } from "../controllers/blog.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route('/create').post(verifyJWT ,createBlog);
router.route('/update/:blogId').post(verifyJWT , updateBlog);
router.route('/delete/:blogId').post(verifyJWT, deleteBlog);


export default router;