import Razorpay from "razorpay";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import crypto from "crypto";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// API to create Razorpay Order
// POST /api/bookings/razorpay-payment
export const razorpayPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId is required" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.isPaid) {
      return res.status(400).json({ success: false, message: "Booking is already paid" });
    }

    // Keep payment flow compatible with legacy bookings where referenced room/hotel
    // might have been deleted (for example after data reseeding).
    let roomData = null;
    if (booking.room) {
      roomData = await Room.findById(booking.room).populate("hotel");
    }

    let hotelName = "QuickStay Hotel";
    if (roomData?.hotel?.name) {
      hotelName = roomData.hotel.name;
    } else if (booking.hotel) {
      const hotelData = await Hotel.findById(booking.hotel).select("name");
      if (hotelData?.name) {
        hotelName = hotelData.name;
      }
    }

    const totalPrice = Number(booking.totalPrice);
    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ success: false, message: "Invalid booking amount" });
    }

    const razorpayInstance = getRazorpayInstance();

    // Create Razorpay Order
    const options = {
      amount: Math.round(totalPrice * 100), // Amount in paise (smallest unit)
      currency: "INR",
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        hotelName,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: bookingId,
    });
  } catch (error) {
    console.error("[razorpayPayment]", error);
    res.status(500).json({ success: false, message: error.message || "Payment initiation failed" });
  }
};

// API to verify Razorpay Payment
// POST /api/bookings/verify-razorpay
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Create signature to verify
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Verify signature
    if (expectedSignature === razorpay_signature) {
      // Payment verified, update booking
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Razorpay",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Verification failed" });
  }
};
