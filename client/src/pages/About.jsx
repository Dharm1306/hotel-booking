import React from 'react'

const values = [
    {
        title: 'Trust First',
        description: 'Every listing is reviewed for quality, safety, and hospitality standards before going live.',
    },
    {
        title: 'Local Soul',
        description: 'We partner with hotels that reflect the culture, food, and stories of each destination.',
    },
    {
        title: 'Smooth Booking',
        description: 'Fast search, transparent prices, and reliable support so your plans stay stress free.',
    },
]

const stats = [
    { label: 'Cities Covered', value: '120+' },
    { label: 'Verified Properties', value: '2,500+' },
    { label: 'Happy Travelers', value: '180K+' },
    { label: 'Avg. Rating', value: '4.8/5' },
]

const About = () => {
    return (
        <div className='pt-28 md:pt-34 px-4 md:px-16 lg:px-24 xl:px-32 text-slate-800'>
            <section className='relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-8 md:p-12'>
                <div className='absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl'></div>
                <div className='absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-amber-300/20 blur-2xl'></div>
                <p className='inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/90'>
                    Who We Are
                </p>
                <h1 className='mt-5 font-playfair text-4xl md:text-6xl text-white leading-tight max-w-3xl'>
                    We design stays that feel memorable before you even check in.
                </h1>
                <p className='mt-5 max-w-2xl text-sm md:text-base text-slate-200'>
                    QuickStay started with one simple belief: finding a great hotel should feel exciting, not exhausting. From boutique city escapes to oceanfront resorts, we combine curated properties with a seamless booking experience.
                </p>
            </section>

            <section className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-10'>
                {stats.map((item) => (
                    <div key={item.label} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                        <p className='font-playfair text-3xl md:text-4xl text-slate-900'>{item.value}</p>
                        <p className='mt-1 text-sm text-slate-500'>{item.label}</p>
                    </div>
                ))}
            </section>

            <section className='grid md:grid-cols-2 gap-8 mt-12 items-stretch'>
                <div className='rounded-3xl border border-slate-200 bg-white p-7 md:p-9 shadow-sm'>
                    <h2 className='font-playfair text-3xl md:text-4xl'>What makes QuickStay different</h2>
                    <p className='mt-3 text-slate-600'>
                        We focus on real travel outcomes: cleaner rooms, faster check-ins, and fewer booking surprises. Our team blends technology with hospitality insight so every stay feels intentionally selected.
                    </p>
                    <div className='mt-6 space-y-4'>
                        {values.map((value, idx) => (
                            <div key={value.title} className='flex gap-4'>
                                <div className='mt-1 h-7 w-7 rounded-full bg-slate-900 text-white text-sm flex items-center justify-center'>
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className='font-semibold text-slate-900'>{value.title}</h3>
                                    <p className='text-sm text-slate-600'>{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#e2e8f0,#f8fafc)] border border-slate-200 p-7 md:p-9'>
                    <div className='absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#38bdf8_0%,transparent_45%),radial-gradient(circle_at_80%_80%,#f59e0b_0%,transparent_45%)]'></div>
                    <div className='relative'>
                        <h2 className='font-playfair text-3xl md:text-4xl text-slate-900'>Our journey</h2>
                        <div className='mt-6 space-y-5'>
                            <div>
                                <p className='text-xs uppercase tracking-wider text-slate-500'>2022</p>
                                <p className='font-medium text-slate-800'>QuickStay launched with 50 curated city hotels.</p>
                            </div>
                            <div>
                                <p className='text-xs uppercase tracking-wider text-slate-500'>2024</p>
                                <p className='font-medium text-slate-800'>Expanded to international stays and owner dashboard tools.</p>
                            </div>
                            <div>
                                <p className='text-xs uppercase tracking-wider text-slate-500'>Today</p>
                                <p className='font-medium text-slate-800'>Building smarter recommendations and better post-booking support.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mt-12 mb-12 rounded-3xl border border-slate-200 bg-white p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm'>
                <div>
                    <h3 className='font-playfair text-3xl text-slate-900'>Ready to plan your next stay?</h3>
                    <p className='text-slate-600 mt-2'>Explore handpicked rooms and book with confidence.</p>
                </div>
                <a href='/rooms' className='inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 transition-colors'>
                    Browse Rooms
                </a>
            </section>
        </div>
    )
}

export default About