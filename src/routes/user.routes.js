import express from 'express'
import { createUser, getUsers,getUserById } from '../controller/user.controller.js';

const router = express.Router();

router.post('/register', createUser);
router.get('/getUsers', getUsers);
router.get('/getUser/:id', getUserById)

export default router;