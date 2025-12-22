import express from 'express';
import { createAdmin ,adminLogin,adminLogout,tokenRefreshing} from '../controller/admin.controller.js'
import { authenticate } from '../utils/auth.js';

const router = express.Router();

router.post('/create', authenticate, createAdmin);
router.post('/login', adminLogin);
router.post('/logout', authenticate, adminLogout);
router.post('/refresh-token', tokenRefreshing);
router.get('/verify', authenticate, (req, res) => {
	res.json({ message: 'Token is valid' });
});
export default router;