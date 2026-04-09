import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import RecommendedHotels from '../components/RecommendedHotels'

const Home = () => {


    return (
        <>
            <Hero />
            <div className='reveal-up delay-1'>
                <RecommendedHotels />
            </div>
            <div className='reveal-up delay-2'>
                <FeaturedDestination />
            </div>
            <div className='reveal-up delay-3'>
                <ExclusiveOffers />
            </div>
            <div className='reveal-up delay-4'>
                <Testimonial />
            </div>
            <div className='reveal-up'>
                <NewsLetter/>
            </div>
        </>
    )
}

export default Home