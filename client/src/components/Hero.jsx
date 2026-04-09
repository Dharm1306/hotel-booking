import React, { useMemo, useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const Hero = () => {

    const { navigate, getToken, axios, setSearchedCities, rooms } = useAppContext();
    const [destination, setDestination] = useState("");

    const availableCities = useMemo(() => {
        const citiesFromRooms = [...new Set((rooms || []).map((room) => room?.hotel?.city).filter(Boolean))];
        return citiesFromRooms.length > 0 ? citiesFromRooms : cities;
    }, [rooms]);

    const onSearch = async (e) => {
        e.preventDefault();
        navigate(`/rooms?destination=${destination}`);
        try {
            // call api to save recent searched city
            await axios.post('/api/user/store-recent-search', { recentSearchedCity: destination }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            // add destination to searchedCities max 3 recent searched cities
            setSearchedCities((prevSearchedCities) => {
                const updatedSearchedCities = [...prevSearchedCities, destination];
                if (updatedSearchedCities.length > 3) {
                    updatedSearchedCities.shift();
                }
                return updatedSearchedCities;
            });
        } catch {
            // Search should still work even when user-specific recent search storage fails.
        }
    }

    return (
        <div
            className='relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-no-repeat bg-cover bg-center min-h-screen overflow-hidden'
            style={{
                backgroundImage: 'linear-gradient(100deg, rgba(6, 12, 28, 0.76) 0%, rgba(6, 12, 28, 0.46) 45%, rgba(24, 40, 72, 0.56) 100%), url("https://picsum.photos/id/1018/1920/1080")'
            }}
        >
            <div className='absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.20),transparent_45%)]'></div>

            <p className='relative z-10 border border-white/30 bg-white/10 px-3.5 py-1 rounded-full mt-20 backdrop-blur-sm reveal-up delay-1'>The Ultimate Hotel Experience</p>
            <h1 className='relative z-10 font-playfair text-3xl md:text-5xl md:text-[58px] md:leading-[62px] font-bold md:font-extrabold max-w-2xl mt-4 reveal-up delay-2'>Discover Your Perfect Gateway Destination</h1>
            <p className='relative z-10 max-w-2xl mt-3 text-sm md:text-lg text-white/90 reveal-up delay-3'>Unparalleled luxury and comfort await at the world&apos;s most exclusive hotels and resorts. Start your journey today.</p>

            <form onSubmit={onSearch} className='relative z-10 bg-white/95 backdrop-blur-md text-gray-600 rounded-2xl px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto shadow-[0_20px_50px_rgba(2,6,23,0.35)] reveal-up delay-4'>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="destinationInput">Destination</label>
                    </div>
                    <input list='destinations' onChange={e => setDestination(e.target.value)} value={destination} id="destinationInput" type="text" className=" rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none focus:border-blue-400" placeholder="Type here" required />
                    {/* Datalist */}
                    <datalist id="destinations">
                        {availableCities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkIn">Check in</label>
                    </div>
                    <input id="checkIn" type="date" className=" rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none focus:border-blue-400" />
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkOut">Check out</label>
                    </div>
                    <input id="checkOut" type="date" className=" rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none focus:border-blue-400" />
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Guests</label>
                    <input min={1} id="guests" type="number" className=" rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none focus:border-blue-400 max-w-16" placeholder="0" />
                </div>

                <button className='flex items-center justify-center gap-1 rounded-xl bg-slate-900 py-3 px-5 text-white my-auto cursor-pointer max-md:w-full max-md:py-2 hover:bg-slate-800 transition-colors' >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-7' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero