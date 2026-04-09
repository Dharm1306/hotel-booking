import React, { useCallback, useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const loadRazorpayScript = () => {
    if (window.Razorpay) return Promise.resolve(true)

    return new Promise((resolve) => {
        const existingScript = document.querySelector('script[data-razorpay="checkout"]')
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(true), { once: true })
            existingScript.addEventListener('error', () => resolve(false), { once: true })
            return
        }

        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.dataset.razorpay = 'checkout'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

const MyBookings = () => {

    const { axios, getToken, user, currency } = useAppContext();
    const [bookings, setBookings] = useState([]);


    const fetchUserBookings = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/bookings/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setBookings(data.bookings)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios, getToken])

    const handlePayment = async (bookingId) => {
        try {
            if (!bookingId) {
                toast.error('Invalid booking. Please refresh and try again.')
                return
            }

            const isRazorpayLoaded = await loadRazorpayScript()

            if (!isRazorpayLoaded) {
                toast.error('Unable to load payment gateway. Please try again.')
                return
            }

            // First, create Razorpay order
            const { data } = await axios.post('/api/bookings/razorpay-payment', { bookingId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                // Initialize Razorpay Checkout
                const options = {
                    key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: data.currency,
                    name: "QuickStay",
                    description: "Hotel Booking Payment",
                    order_id: data.orderId,
                    handler: async (response) => {
                        // Verify payment on backend
                        try {
                            const verifyRes = await axios.post(
                                '/api/bookings/verify-razorpay',
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    bookingId: bookingId,
                                },
                                { headers: { Authorization: `Bearer ${await getToken()}` } }
                            );
                            if (verifyRes.data.success) {
                                toast.success("Payment successful!");
                                // Refresh bookings
                                fetchUserBookings();
                            } else {
                                toast.error(verifyRes.data.message || "Payment verification failed");
                            }
                        } catch (error) {
                            toast.error("Error verifying payment: " + error.message);
                        }
                    },
                    prefill: {
                        name: user?.attributes?.first_name || "",
                        email: user?.primaryEmailAddress?.emailAddress || "",
                        contact: user?.attributes?.phone_number || "",
                    },
                    theme: {
                        color: "#FF6B35",
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const serverMessage = error?.response?.data?.message
            toast.error(serverMessage || error.message || 'Payment initiation failed')
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user, fetchUserBookings]);

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />
            <div className="max-w-6xl mt-8 w-full text-gray-800">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
                    <div className="w-1/3">Hotels</div>
                    <div className="w-1/3">Date & Timings</div>
                    <div className="w-1/3">Payment</div>
                </div>

                {bookings.map((booking) => (
                    <div key={booking._id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t">
                        <div className="flex flex-col md:flex-row">
                            <img
                                className="min-md:w-44 rounded shadow object-cover"
                                src={booking?.room?.images?.[0] || assets.roomImg1}
                                onError={(e) => { e.currentTarget.src = assets.roomImg1 }}
                                alt="hotel-img"
                            />
                            <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                                <p className="font-playfair text-2xl">
                                    {booking?.hotel?.name || 'Hotel details unavailable'}
                                    <span className="font-inter text-sm"> ({booking?.room?.roomType || 'Room unavailable'})</span>
                                </p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <img src={assets.locationIcon} alt="location-icon" />
                                    <span>{booking?.hotel?.address || 'Address unavailable'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <img src={assets.guestsIcon} alt="guests-icon" />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <p className="text-base">Total: {currency}{booking.totalPrice}</p>
                            </div>
                        </div>

                        <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                            <div>
                                <p>Check-In:</p>
                                <p className="text-gray-500 text-sm">{booking?.checkInDate ? new Date(booking.checkInDate).toDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p>Check-Out:</p>
                                <p className="text-gray-500 text-sm">{booking?.checkOutDate ? new Date(booking.checkOutDate).toDateString() : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-center pt-3">
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                                <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                                    {booking.isPaid ? "Paid" : "Unpaid"}
                                </p>
                            </div>
                            {!booking.isPaid && (
                                <button onClick={()=> handlePayment(booking._id)} className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings
