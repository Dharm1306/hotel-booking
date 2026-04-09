import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className='bg-[#F6F9FC] text-slate-600 pt-12 px-6 md:px-16 lg:px-24 xl:px-32 border-t border-slate-200'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert opacity-80' />
                    <p className='text-sm leading-relaxed'>
                        Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        <img src={assets.instagramIcon} alt="instagram-icon" className='w-6 opacity-80 hover:opacity-100 transition-opacity' />
                        <img src={assets.facebookIcon} alt="facebook-icon" className='w-6 opacity-80 hover:opacity-100 transition-opacity' />
                        <img src={assets.twitterIcon} alt="twitter-icon" className='w-6 opacity-80 hover:opacity-100 transition-opacity' />
                        <img src={assets.linkendinIcon} alt="linkedin-icon" className='w-6 opacity-80 hover:opacity-100 transition-opacity' />
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-slate-900'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-slate-900'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='font-playfair text-lg text-slate-900'>STAY UPDATED</p>
                    <p className='mt-3 text-sm'>
                        Subscribe to our newsletter for travel inspiration and special offers.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="text" className='bg-white rounded-l-xl border border-slate-300 h-10 px-3 outline-none w-full' placeholder='Your email' />
                        <button className='flex items-center justify-center bg-slate-900 h-10 w-10 aspect-square rounded-r-xl'>
                            <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert' />
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-slate-300 mt-10' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} QuickStay. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;