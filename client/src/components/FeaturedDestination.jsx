import React from 'react'
import { useAppContext } from '../context/AppContext';
import Title from './Title';
import HotelCard from './HotelCard';


const FeaturedDestination = () => {
    const { rooms, navigate } = useAppContext();
    return rooms.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] py-22'>
            <Title title="Featured Destination" subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences." />
            <div className='flex flex-wrap items-center justify-center gap-6 mt-14'>
                {rooms.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
            <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='mt-14 mb-4 px-5 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm'>
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination