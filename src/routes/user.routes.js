import express from 'express'
import { createUser, getUsers } from '../controller/user.controller.js';

const router = express.Router();

router.post('/register', createUser);
router.get('/users', getUsers);

export default router;