import express from 'express'
import {createBooking, getBookings, getBookingById, updateBooking, deleteBooking} from '../controller/bookings.controller.js';
import { authenticate } from '../utils/auth.js';

const router = express.Router();

router.post('/createBooking', createBooking);
router.get('/getBookings', getBookings);
router.put('/updateBooking/:bid', authenticate, updateBooking);
router.delete('/deleteBooking/:bid', authenticate, deleteBooking);
router.get('/getBooking/:bid', getBookingById);
export default router;