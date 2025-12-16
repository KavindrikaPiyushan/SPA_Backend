import express from 'express'
import {createBooking, getBookings, getBookingById, updateBooking, deleteBooking} from '../controller/bookings.controller.js';

const router = express.Router();

router.post('/createBooking', createBooking);
router.get('/getBookings',getBookings);
router.put('/updateBooking/:bid',updateBooking);
router.delete('/deleteBooking/:bid',deleteBooking);
router.get('/getBooking/:bid',getBookingById);

export default router;