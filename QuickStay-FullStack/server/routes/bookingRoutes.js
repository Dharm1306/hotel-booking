import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import { razorpayPayment, verifyRazorpayPayment } from '../controllers/razorpayController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);
bookingRouter.post('/razorpay-payment', protect, razorpayPayment);
bookingRouter.post('/verify-razorpay', protect, verifyRazorpayPayment);

export default bookingRouter;