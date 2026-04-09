import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'

const NewsLetter = () => {
    return (
        <div className='flex flex-col items-center max-w-5xl lg:w-full rounded-3xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-24 bg-[linear-gradient(120deg,#0f172a,#1e293b)] text-white shadow-[0_24px_60px_rgba(15,23,42,0.35)] border border-slate-700/50'>
            <Title title="Stay Inspired" subTitle="Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration." />
            <div className='flex flex-col md:flex-row items-center justify-center gap-4 mt-6'>
                <input type="text" className='bg-white/10 px-4 py-2.5 border border-white/25 rounded-xl outline-none max-w-72 w-full placeholder:text-white/60 focus:border-cyan-300' placeholder='Enter your email' />
                <button className='flex items-center justify-center gap-2 group bg-white text-slate-900 px-4 md:px-7 py-2.5 rounded-xl active:scale-95 transition-all hover:bg-slate-200'>
                    Subscribe
                    <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 group-hover:translate-x-1 transition-all' />
                </button>
            </div>
            <p className='text-slate-300 mt-6 text-xs text-center'>By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
    )
}

export default NewsLetter