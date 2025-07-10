import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createNotes, deleteNotes, updateNotes } from "../controllers/notes.controller.js";

const router = Router();

router.route('/create').post(verifyJWT, createNotes);
router.route('/update/:notesId').post(verifyJWT, updateNotes);
router.route('/delete/:notesId').post(verifyJWT, deleteNotes);

export default router; 