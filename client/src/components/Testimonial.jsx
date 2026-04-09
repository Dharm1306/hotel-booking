import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import StarRating from './StarRating';

const Testimonial = () => {
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-22 pb-28'>
            <Title title="What Our Guests Say" subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world." />
            <div className='flex flex-wrap items-stretch gap-6 mt-14'>
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className='bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)] max-w-[420px]'>
                        <div className='flex items-center gap-3'>
                            <img className='w-12 h-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className='font-playfair text-xl'>{testimonial.name}</p>
                                <p className='text-slate-500 text-sm'>{testimonial.address}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mt-4'>
                                    <StarRating rating={testimonial.rating} />
                        </div>
                        <p className='text-slate-600 max-w-90 mt-4 leading-relaxed'>"{testimonial.review}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;