import React, { useEffect, useState } from 'react'
import { assets, hotelReviewsByHotelId, roomCommonData } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const getInitialReviewForm = () => ({
    name: '',
    address: '',
    rating: 5,
    review: '',
});

const getInitialInquiryForm = () => ({
    name: '',
    email: '',
    message: '',
});

const RoomDetails = () => {
    const { id } = useParams();
    const { facilityIcons, rooms, getToken, axios, navigate, currency, user } = useAppContext();

    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);

    const [isAvailable, setIsAvailable] = useState(false);
    const [bookingMessage, setBookingMessage] = useState("");
    const [submittedReviewsByHotelId, setSubmittedReviewsByHotelId] = useState({});
    const [reviewForm, setReviewForm] = useState(getInitialReviewForm());
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquiryForm, setInquiryForm] = useState(getInitialInquiryForm());

    const openDirections = () => {
        if (!room?.hotel?.address) {
            toast.error('Destination address is unavailable')
            return;
        }

        const destination = encodeURIComponent(`${room.hotel.name}, ${room.hotel.address}`);

        const openMap = (origin) => {
            const baseUrl = 'https://www.google.com/maps/dir/?api=1';
            const mapUrl = origin
                ? `${baseUrl}&origin=${origin}&destination=${destination}&travelmode=driving`
                : `${baseUrl}&destination=${destination}&travelmode=driving`;
            window.open(mapUrl, '_blank', 'noopener,noreferrer');
        };

        if (!navigator.geolocation) {
            openMap('');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                openMap(encodeURIComponent(origin));
            },
            () => {
                // Permission denied or unavailable, still open destination route.
                openMap('');
            },
            { timeout: 7000 }
        );
    }

    // Check if the Room is Available
    const checkAvailability = async () => {
        try {

            //  Check is Check-In Date is greater than Check-Out Date
            if (checkInDate >= checkOutDate) {
                toast.error('Check-In Date should be less than Check-Out Date')
                return;
            }

            const { data } = await axios.post('/api/bookings/check-availability', { room: id, checkInDate, checkOutDate })
            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true)
                    toast.success('Room is available')
                } else {
                    setIsAvailable(false)
                    toast.error('Room is not available')
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const serverMessage = error?.response?.data?.message;
            // Suppress authentication errors for unauthenticated users
            if (!(serverMessage || error.message).includes('not authenticated')) {
                toast.error(serverMessage || error.message || 'Failed to check room availability')
            }
        }
    }

    // onSubmitHandler function to check availability & book the room
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (!isAvailable) {
                await checkAvailability();
                return;
            }

            const response = await axios.post('/api/bookings/book', { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            console.log('createBooking response', response)
            const { data } = response
            if (data.success) {
                setBookingMessage(data.message)
                toast.success(data.message)
                navigate('/my-bookings')
                scrollTo(0, 0)
            } else {
                setBookingMessage(data.message)
                toast.error(data.message)
            }

        } catch (error) {
            const serverMessage = error?.response?.data?.message;
            const finalMessage = serverMessage || error.message || 'Failed to create booking';
            // Check if error is authentication related
            if (finalMessage.includes('not authenticated') || finalMessage.includes('401')) {
                toast.error('Please login to book a room')
            } else {
                toast.error(finalMessage)
            }
        }
    }

    useEffect(() => {
        const room = rooms.find(room => room._id === id);
        room && setRoom(room);
        room && setMainImage(room?.images?.[0] || assets.roomImg1);
    }, [rooms, id]);

    useEffect(() => {
        setReviewForm(getInitialReviewForm());
        setInquiryForm(getInitialInquiryForm());
        setShowInquiryForm(false);
    }, [id]);

    const fallbackReviews = Object.values(hotelReviewsByHotelId)[0] || [];
    const baseHotelReviews = room ? (hotelReviewsByHotelId[room.hotel._id] || fallbackReviews) : [];
    const submittedHotelReviews = room ? (submittedReviewsByHotelId[room.hotel._id] || []) : [];
    const hotelReviews = [...submittedHotelReviews, ...baseHotelReviews];

    const onReviewFieldChange = (field, value) => {
        setReviewForm((prev) => ({ ...prev, [field]: value }));
    };

    const onReviewSubmit = (e) => {
        e.preventDefault();

        if (!room?.hotel?._id) {
            toast.error('Hotel details are unavailable')
            return;
        }

        const reviewText = reviewForm.review.trim();
        if (reviewText.length < 20) {
            toast.error('Review should be at least 20 characters')
            return;
        }

        const rating = Number(reviewForm.rating);
        const safeRating = Number.isFinite(rating) ? Math.max(1, Math.min(5, rating)) : 5;
        const userName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

        const newReview = {
            id: `user-rvw-${Date.now()}`,
            name: reviewForm.name.trim() || userName || 'Guest User',
            address: reviewForm.address.trim() || 'Guest Location',
            image: user?.imageUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            rating: safeRating,
            review: reviewText,
        };

        setSubmittedReviewsByHotelId((prev) => ({
            ...prev,
            [room.hotel._id]: [newReview, ...(prev[room.hotel._id] || [])],
        }));

        setReviewForm(getInitialReviewForm());
        toast.success('Thanks! Your review has been added')
    };

    const hotelContactRaw = room?.hotel?.contact || '';
    const ownerContactRaw = room?.hotel?.ownerContact || room?.hotel?.contact || '';
    const hotelPhone = hotelContactRaw.replace(/[^\d+]/g, '');
    const ownerPhone = ownerContactRaw.replace(/[^\d+]/g, '');
    const hotelName = room?.hotel?.name || 'QuickStay Hotel';
    const emailDomainName = hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18) || 'quickstay';
    const hotelEmail = `reservations@${emailDomainName}.com`;

    const inquiryText = inquiryForm.message.trim() || `Hi ${hotelName} team, I would like to know more about ${room?.roomType || 'this room'}.`;

    const onInquiryFieldChange = (field, value) => {
        setInquiryForm((prev) => ({ ...prev, [field]: value }));
    };

    const copyText = async (value, label) => {
        if (!value) {
            toast.error(`${label} is unavailable`)
            return;
        }

        try {
            await navigator.clipboard.writeText(value);
            toast.success(`${label} copied`)
        } catch {
            toast.error(`Could not copy ${label.toLowerCase()}`)
        }
    };

    const onCallHotel = () => {
        if (!hotelPhone) {
            toast.error('Hotel phone number is unavailable')
            return;
        }
        window.location.href = `tel:${hotelPhone}`;
        toast('If calling app does not open, copy the number below.')
    };

    const onCallOwnerVerify = () => {
        if (!ownerPhone) {
            toast.error('Owner verification number is unavailable')
            return;
        }
        window.location.href = `tel:${ownerPhone}`;
        toast('If calling app does not open, copy the number below.')
    };

    const onEmailHotel = () => {
        const subject = encodeURIComponent(`Room inquiry: ${room?.roomType || 'Stay'} at ${hotelName}`);
        const body = encodeURIComponent(`Hello ${hotelName} team,\n\nI am interested in ${room?.roomType || 'a room'} and would like more details.\n\nThanks.`);
        window.location.href = `mailto:${hotelEmail}?subject=${subject}&body=${body}`;
        toast('If email app does not open, copy the email below.')
    };

    const onWhatsAppHotel = () => {
        if (!hotelPhone) {
            toast.error('Hotel WhatsApp number is unavailable')
            return;
        }

        const waNumber = hotelPhone.replace(/[^\d]/g, '');
        const text = encodeURIComponent(`Hi ${hotelName}, I want to know more about ${room?.roomType || 'your room'} on QuickStay.`);
        window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
        toast('If WhatsApp does not open, copy the number below.')
    };

    const onInquirySubmit = (e) => {
        e.preventDefault();

        const senderName = inquiryForm.name.trim() || user?.fullName || 'Guest';
        const senderEmail = inquiryForm.email.trim() || user?.primaryEmailAddress?.emailAddress || '';

        if (!senderEmail) {
            toast.error('Please enter your email so hotel can contact you')
            return;
        }

        if (inquiryText.length < 15) {
            toast.error('Inquiry message should be at least 15 characters')
            return;
        }

        const subject = encodeURIComponent(`Guest inquiry from ${senderName} - ${hotelName}`);
        const body = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\nRoom: ${room?.roomType || 'N/A'}\n\nMessage:\n${inquiryText}`);
        window.open(`mailto:${hotelEmail}?subject=${subject}&body=${body}`, '_self');

        setInquiryForm(getInitialInquiryForm());
        setShowInquiryForm(false);
        toast.success('Inquiry draft opened in your email app')
    };

    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

            {/* Room Details */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name} <span className='font-inter text-sm'>({room.roomType})</span></h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>{hotelReviews.length || 2}+ reviews</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt='location-icon' />
                <span>{room.hotel.address}</span>
            </div>
            <button
                type='button'
                onClick={openDirections}
                className='mt-3 text-sm px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors'
            >
                Get Directions
            </button>

            {/* Room Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img className='w-full rounded-xl shadow-lg object-cover'
                        src={mainImage || assets.roomImg1}
                        onError={(e) => { e.currentTarget.src = assets.roomImg1 }}
                        alt='Room Image' />
                </div>

                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.images.length > 1 && room.images.map((image, index) => (
                        <img key={index} onClick={() => setMainImage(image)}
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-orange-500'}`}
                            src={image || assets.roomImg1}
                            onError={(e) => { e.currentTarget.src = assets.roomImg1 }}
                            alt='Room Image' />
                    ))}
                </div>
            </div>

            {/* Status message */}
            {bookingMessage && (
                <div className='mt-6 mb-6 p-3 rounded-lg text-sm text-white bg-blue-600'>
                    {bookingMessage}
                </div>
            )}

            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Room Price */}
                <p className='text-2xl font-medium'>{currency}{room.pricePerNight}/night</p>
            </div>

            {/* CheckIn CheckOut Form */}
            <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor='checkInDate' className='font-medium'>Check-In</label>
                        <input onChange={(e) => setCheckInDate(e.target.value)} id='checkInDate' type='date' min={new Date().toISOString().split('T')[0]} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' placeholder='Check-In' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor='checkOutDate' className='font-medium'>Check-Out</label>
                        <input onChange={(e) => setCheckOutDate(e.target.value)} id='checkOutDate' type='date' min={checkInDate} disabled={!checkInDate} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' placeholder='Check-Out' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor='guests' className='font-medium'>Guests</label>
                        <input onChange={(e) => setGuests(e.target.value)} value={guests} id='guests' type='number' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' placeholder='0' required />
                    </div>
                </div>
                <button type='submit' className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>{isAvailable ? "Book Now" : "Check Availability"}</button>
            </form>

            {/* Common Specifications */}
            <div className='mt-25 space-y-4'>                
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img className='w-6.5' src={spec.icon} alt={`${spec.title}-icon`} />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.</p>
            </div>

            <div className='mb-12'>
                <h2 className='text-2xl md:text-3xl font-playfair'>Hotel Reviews</h2>
                <p className='text-gray-500 mt-1'>Real guest feedback from recent stays.</p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
                    {hotelReviews.map((review) => (
                        <div key={review.id} className='rounded-xl border border-gray-200 p-5 bg-white shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <img className='w-11 h-11 rounded-full object-cover' src={review.image} alt={review.name} />
                                <div>
                                    <p className='font-medium text-gray-900'>{review.name}</p>
                                    <p className='text-xs text-gray-500'>{review.address}</p>
                                </div>
                            </div>
                            <div className='flex gap-1 mt-3'>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className='text-sm text-gray-600 mt-3'>"{review.review}"</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={onReviewSubmit} className='mt-8 rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm'>
                    <h3 className='text-xl font-playfair'>Write a Review</h3>
                    <p className='text-sm text-gray-500 mt-1'>Share your experience with future guests.</p>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-5'>
                        <div className='flex flex-col'>
                            <label htmlFor='reviewerName' className='text-sm font-medium text-gray-700'>Name</label>
                            <input
                                id='reviewerName'
                                type='text'
                                value={reviewForm.name}
                                onChange={(e) => onReviewFieldChange('name', e.target.value)}
                                placeholder='Your name'
                                className='mt-1.5 rounded border border-gray-300 px-3 py-2 outline-none'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor='reviewerAddress' className='text-sm font-medium text-gray-700'>City / Country</label>
                            <input
                                id='reviewerAddress'
                                type='text'
                                value={reviewForm.address}
                                onChange={(e) => onReviewFieldChange('address', e.target.value)}
                                placeholder='e.g. Delhi, India'
                                className='mt-1.5 rounded border border-gray-300 px-3 py-2 outline-none'
                            />
                        </div>

                        <div className='flex flex-col md:max-w-40'>
                            <label htmlFor='reviewerRating' className='text-sm font-medium text-gray-700'>Rating</label>
                            <select
                                id='reviewerRating'
                                value={reviewForm.rating}
                                onChange={(e) => onReviewFieldChange('rating', Number(e.target.value))}
                                className='mt-1.5 rounded border border-gray-300 px-3 py-2 outline-none'
                            >
                                <option value={5}>5</option>
                                <option value={4}>4</option>
                                <option value={3}>3</option>
                                <option value={2}>2</option>
                                <option value={1}>1</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col mt-4'>
                        <label htmlFor='reviewText' className='text-sm font-medium text-gray-700'>Review</label>
                        <textarea
                            id='reviewText'
                            value={reviewForm.review}
                            onChange={(e) => onReviewFieldChange('review', e.target.value)}
                            rows={4}
                            placeholder='Tell us what you liked about your stay...'
                            className='mt-1.5 rounded border border-gray-300 px-3 py-2 outline-none resize-none'
                            required
                        />
                    </div>

                    <button type='submit' className='mt-5 px-6 py-2.5 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>
                        Submit Review
                    </button>
                </form>
            </div>

            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4'>
                    <img className='h-14 w-14 md:h-18 md:w-18 rounded-full' src={room.hotel.owner.image} alt='Host' />
                    <div>
                        <p className='text-lg md:text-xl'>Hosted by {room.hotel.name}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating />
                            <p className='ml-2'>{hotelReviews.length || 2}+ reviews</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3 mt-4'>
                    <button type='button' onClick={onCallOwnerVerify} className='px-5 py-2.5 rounded text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer'>
                        Call Owner (Verify)
                    </button>
                    <button type='button' onClick={onCallHotel} className='px-5 py-2.5 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>
                        Call Hotel
                    </button>
                    <button type='button' onClick={onEmailHotel} className='px-5 py-2.5 rounded border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer'>
                        Email
                    </button>
                    <button type='button' onClick={onWhatsAppHotel} className='px-5 py-2.5 rounded border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer'>
                        WhatsApp
                    </button>
                    <button type='button' onClick={() => setShowInquiryForm(true)} className='px-5 py-2.5 rounded border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer'>
                        Inquiry Form
                    </button>
                </div>
                <p className='text-sm text-gray-500'>Use Call Owner (Verify) to confirm hotel listing details before booking.</p>

                <div className='mt-2 rounded-xl border border-gray-200 bg-white p-4 w-full max-w-4xl'>
                    <p className='text-sm font-medium text-gray-800'>Contact details fallback (if buttons do not open apps)</p>
                    <div className='mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm'>
                        <div className='rounded-lg border border-gray-200 p-3'>
                            <p className='text-gray-500'>Owner Verification</p>
                            <p className='font-medium break-all'>{ownerPhone || 'Unavailable'}</p>
                            <button type='button' onClick={() => copyText(ownerPhone, 'Owner number')} className='mt-2 text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50'>Copy</button>
                        </div>
                        <div className='rounded-lg border border-gray-200 p-3'>
                            <p className='text-gray-500'>Hotel Phone</p>
                            <p className='font-medium break-all'>{hotelPhone || 'Unavailable'}</p>
                            <button type='button' onClick={() => copyText(hotelPhone, 'Hotel phone')} className='mt-2 text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50'>Copy</button>
                        </div>
                        <div className='rounded-lg border border-gray-200 p-3'>
                            <p className='text-gray-500'>Hotel Email</p>
                            <p className='font-medium break-all'>{hotelEmail}</p>
                            <button type='button' onClick={() => copyText(hotelEmail, 'Hotel email')} className='mt-2 text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50'>Copy</button>
                        </div>
                    </div>
                </div>

                {showInquiryForm && (
                    <div className='fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4'>
                        <div className='w-full max-w-xl rounded-xl bg-white shadow-2xl p-5 md:p-6'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-2xl font-playfair'>Contact {hotelName}</h3>
                                <button type='button' onClick={() => setShowInquiryForm(false)} className='text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50'>
                                    Close
                                </button>
                            </div>

                            <form onSubmit={onInquirySubmit} className='mt-5 space-y-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex flex-col'>
                                        <label htmlFor='contactName' className='text-sm font-medium text-gray-700'>Your Name</label>
                                        <input
                                            id='contactName'
                                            type='text'
                                            value={inquiryForm.name}
                                            onChange={(e) => onInquiryFieldChange('name', e.target.value)}
                                            placeholder='Your full name'
                                            className='mt-1.5 rounded border border-gray-300 px-3 py-2 outline-none'
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor='contactEmail' className='text-sm font-medium text-gray-700'>Your Email</label>
                                        <input
                                            id='contactEmail'
                                            type='email'
                                            value={inquiryForm.email}
                                            onChange={(e) => onInquiryFieldChange('email', e.target.value)}
                                            placeholder='you@example.com'
                                            className='mt-1.5 rounded border border-gray-300 px-3 py-2 outline-none'
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor='contactMessage' className='text-sm font-medium text-gray-700'>Message</label>
                                    <textarea
                                        id='contactMessage'
                                        rows={5}
                                        value={inquiryForm.message}
                                        onChange={(e) => onInquiryFieldChange('message', e.target.value)}
                                        placeholder='Write your question for the hotel...'
                                        className='mt-1.5 rounded border border-gray-300 px-3 py-2 outline-none resize-none'
                                        required
                                    />
                                </div>

                                <div className='flex gap-3'>
                                    <button type='submit' className='px-6 py-2.5 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>
                                        Send Inquiry
                                    </button>
                                    <button type='button' onClick={() => setShowInquiryForm(false)} className='px-6 py-2.5 rounded border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer'>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoomDetails
