import express from 'express';
import { createAdmin ,adminLogin,adminLogout,tokenRefreshing} from '../controller/admin.controller.js'

const router = express.Router();

router.post('/create', createAdmin);
router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.post('/refresh-token', tokenRefreshing);
export default router;