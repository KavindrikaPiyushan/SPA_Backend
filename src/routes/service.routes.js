import express from 'express';
import {createService,getServices, getServiceById} from '../controller/service.controller.js';
const router = express.Router();

router.post('/createService', createService);
router.get('/getServices',getServices);
router.get('/getService/:sid',getServiceById);



export default router;