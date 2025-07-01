import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createNotes } from "../controllers/notes.controller.js";

const router = Router();

router.route('/create').post(verifyJWT, createNotes);

export default router; 