import express from 'express';

import { getLogs } from '../controller/logs.controller.js';
import { authenticate } from '../utils/auth.js';
const router = express.Router();

router.get('/getLogs', authenticate, getLogs);

export default router;