import React from 'react'

const Title = ({ title, subTitle, align, font }) => {
    return (
        <div className={`flex flex-col justify-center items-center text-center ${align === "left" && " md:items-start md:text-left"}`}>
            <h1 className={`text-4xl md:text-[42px] tracking-tight leading-tight ${font || "font-playfair"}`}>{title}</h1>
            <p className='text-sm md:text-base text-slate-500 mt-3 max-w-3xl leading-relaxed'>{subTitle}</p>
        </div>
    )
}

export default Title