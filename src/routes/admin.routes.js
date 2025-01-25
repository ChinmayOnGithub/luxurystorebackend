import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { addAdmin, deletePost, logout } from '../controllers/admin.controller.js';

const router = express.Router();


router.route('/delete-post').delete(authenticateToken, deletePost);
router.route('/add-admin').post(authenticateToken, addAdmin);
router.route('/logout').post(authenticateToken, logout);

export default router;
