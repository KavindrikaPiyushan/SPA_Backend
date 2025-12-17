import express from 'express';

import { getLogs } from '../controller/logs.controller.js';

const router = express.Router();

router.get('/getLogs', getLogs);

export default router;