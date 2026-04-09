import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const HotelCard = ({ room, index }) => {

    const { currency } = useAppContext();

    if (!room) return null; // ✅ prevents crash

    return (
        <Link
            to={'/rooms/' + room._id}
            onClick={() => scrollTo(0, 0)}
            className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] card-lift'
        >
            <img
                src={room?.images?.[0] || assets.roomImg1}
                onError={(e) => { e.currentTarget.src = assets.roomImg1 }}
                alt="hotel-img"
                draggable="false"
            />

            {index % 2 === 0 && (
                <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>
                    Best Seller
                </p>
            )}

            <div className='p-4 pt-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-playfair text-xl font-medium text-gray-800'>
                        {room?.hotel?.name || "Hotel Name"}
                    </p>

                    <div className='flex items-center gap-1'>
                        <img src={assets.starIconFilled} alt="star-icon" /> 4.5
                    </div>
                </div>

                <div className='flex items-center gap-1 text-sm'>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{room?.hotel?.address || "Location not available"}</span>
                </div>

                <div className='flex items-center justify-between mt-4'>
                    <p>
                        <span className='text-xl text-gray-800'>
                            {currency}{room?.pricePerNight}
                        </span>/night
                    </p>

                    <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-all cursor-pointer'>
                        Book Now
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard;