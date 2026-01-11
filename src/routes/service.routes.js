import express from 'express';
import {createService,getServices, getServiceById,updateService,deleteService,getInactiveServices} from '../controller/service.controller.js';
import { authenticate } from '../utils/auth.js';
const router = express.Router();

router.post('/createService', createService);
router.get('/getServices', getServices);
router.get('/getInactiveServices', getInactiveServices);
router.get('/getService/:sid', getServiceById);
router.put('/updateService/:sid', updateService);
router.delete('/deleteService/:sid', deleteService);


export default router;