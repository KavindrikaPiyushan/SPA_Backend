import express from 'express';
import {createService,getServices, getServiceById,updateService,deleteService} from '../controller/service.controller.js';
const router = express.Router();

router.post('/createService', createService);
router.get('/getServices',getServices);
router.get('/getService/:sid',getServiceById);
router.put('/updateService/:sid',updateService);
router.delete('/deleteService/:sid',deleteService);



export default router;