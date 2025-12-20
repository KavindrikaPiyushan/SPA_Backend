import express from 'express';
import {createService,getServices, getServiceById,updateService,deleteService} from '../controller/service.controller.js';
import { authenticate } from '../utils/auth.js';
const router = express.Router();

router.post('/createService', authenticate, createService);
router.get('/getServices', getServices);
router.get('/getService/:sid', getServiceById);
router.put('/updateService/:sid', authenticate, updateService);
router.delete('/deleteService/:sid', authenticate, deleteService);


export default router;