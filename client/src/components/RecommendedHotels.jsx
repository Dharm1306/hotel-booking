import React, { useMemo } from 'react'
import HotelCard from './HotelCard'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {

  const { rooms } = useAppContext()

  const selectedCity = "Surat" // or dynamic if you have it

  const filteredHotels = useMemo(() => {
    if (!rooms) return []
    return rooms.filter(room => room?.hotel?.city === selectedCity)
  }, [rooms, selectedCity])

  return (
    <div className='flex flex-wrap gap-6 mt-8'>

      {filteredHotels.length > 0 ? (
        filteredHotels.map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))
      ) : (
        <p className='text-gray-500'>No hotels found</p>
      )}

    </div>
  )
}

export default RecommendedHotels