import React from 'react'

const Experience = () => {
    const experiences = [
        {
            id: 1,
            title: "Luxury Stays",
            description: "Experience world-class hospitality in our premium properties.",
            icon: "🏨",
            features: ["5-Star Amenities", "Personalized Service", "Exclusive Access"]
        },
        {
            id: 2,
            title: "Culinary Delights",
            description: "Savor gourmet cuisine prepared by award-winning chefs.",
            icon: "🍽️",
            features: ["Michelin-Starred Restaurants", "Local Cuisine", "Customized Menus"]
        },
        {
            id: 3,
            title: "Wellness & Spa",
            description: "Rejuvenate your mind, body, and soul with our world-class spa services.",
            icon: "🧘",
            features: ["Spa Treatments", "Yoga Classes", "Fitness Center"]
        },
        {
            id: 4,
            title: "Adventure Activities",
            description: "Explore thrilling adventures and unforgettable experiences.",
            icon: "🚴",
            features: ["Water Sports", "Mountain Hiking", "Guided Tours"]
        },
        {
            id: 5,
            title: "Cultural Tours",
            description: "Immerse yourself in the rich heritage and culture of our destinations.",
            icon: "🎭",
            features: ["Historical Sites", "Local Markets", "Cultural Events"]
        },
        {
            id: 6,
            title: "Family Fun",
            description: "Create unforgettable memories with your loved ones.",
            icon: "👨‍👩‍👧‍👦",
            features: ["Kids Activity Center", "Family Rooms", "Entertainment"]
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            rating: 5,
            text: "The experience was absolutely phenomenal! Every detail was perfectly planned and executed.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop"
        },
        {
            id: 2,
            name: "Michael Chen",
            rating: 5,
            text: "Best vacation ever! The staff went above and beyond to make our stay memorable.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop"
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            rating: 5,
            text: "Incredible luxury combined with genuine hospitality. Highly recommended!",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop"
        }
    ];

    return (
        <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* Hero Section */}
            <div className='mb-20'>
                <div className='text-center mb-12'>
                    <h1 className='font-playfair text-4xl md:text-5xl font-bold mb-4'>
                        Unforgettable Experiences Await
                    </h1>
                    <p className='text-gray-600 text-lg max-w-3xl mx-auto'>
                        At QuickStay, we don't just offer rooms – we craft extraordinary moments that transform ordinary travels into extraordinary memories.
                    </p>
                </div>
            </div>

            {/* Experience Grid */}
            <div className='mb-20'>
                <h2 className='font-playfair text-3xl md:text-4xl font-bold mb-12 text-center'>
                    Our Exclusive Experiences
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {experiences.map((exp) => (
                        <div key={exp.id} className='bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300'>
                            <div className='text-5xl mb-4'>{exp.icon}</div>
                            <h3 className='font-playfair text-2xl font-bold mb-2 text-gray-800'>
                                {exp.title}
                            </h3>
                            <p className='text-gray-600 mb-6'>
                                {exp.description}
                            </p>
                            <ul className='space-y-2'>
                                {exp.features.map((feature, idx) => (
                                    <li key={idx} className='flex items-center text-sm text-gray-700'>
                                        <span className='w-2 h-2 bg-orange-500 rounded-full mr-3'></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className='mb-20 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-12'>
                <h2 className='font-playfair text-3xl md:text-4xl font-bold mb-12 text-center'>
                    Why Choose QuickStay Experiences?
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    <div className='flex gap-4'>
                        <div className='text-4xl'>✓</div>
                        <div>
                            <h3 className='font-bold text-lg mb-2'>Curated Selection</h3>
                            <p className='text-gray-700'>Every property is hand-picked for quality and authenticity.</p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='text-4xl'>✓</div>
                        <div>
                            <h3 className='font-bold text-lg mb-2'>Expert Local Guides</h3>
                            <p className='text-gray-700'>Insider knowledge to show you the hidden gems of each destination.</p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='text-4xl'>✓</div>
                        <div>
                            <h3 className='font-bold text-lg mb-2'>24/7 Support</h3>
                            <p className='text-gray-700'>Round-the-clock assistance to ensure your comfort and satisfaction.</p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='text-4xl'>✓</div>
                        <div>
                            <h3 className='font-bold text-lg mb-2'>Best Price Guarantee</h3>
                            <p className='text-gray-700'>Competitive rates with exclusive deals and seasonal offers.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guest Testimonials */}
            <div className='mb-20'>
                <h2 className='font-playfair text-3xl md:text-4xl font-bold mb-12 text-center'>
                    Guest Experiences
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className='bg-white border border-gray-200 rounded-xl p-8'>
                            <div className='flex items-center gap-4 mb-4'>
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className='w-12 h-12 rounded-full object-cover'
                                />
                                <div>
                                    <h4 className='font-bold text-gray-800'>{testimonial.name}</h4>
                                    <div className='text-orange-500'>
                                        {"⭐".repeat(testimonial.rating)}
                                    </div>
                                </div>
                            </div>
                            <p className='text-gray-600 italic'>"{testimonial.text}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className='mb-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center'>
                <h2 className='font-playfair text-3xl md:text-4xl font-bold mb-4'>
                    Ready to Create Your Perfect Experience?
                </h2>
                <p className='text-blue-100 text-lg mb-8 max-w-2xl mx-auto'>
                    Start your journey with QuickStay today and discover why thousands of travelers choose us for their unforgettable experiences.
                </p>
                <button className='bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors'>
                    Explore Our Properties
                </button>
            </div>
        </div>
    )
}

export default Experience
