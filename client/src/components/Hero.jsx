import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { SiGooglegemini } from "react-icons/si";

const Hero = () => {

    const navigate = useNavigate()

  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center  bg-zinc-50 min-h-screen'>

        <div className='text-center mb-6'>
            <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] text-primary'>Welcome to aiHub<br/> <span className='text-zinc-700'>Ideas Turn Into Real-World Projects</span></h1>
            <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>Generate images, remove unwanted elements, or turn your concepts into beautiful artwork effortlessly with intuitive, integrated AI tools.</p>
        </div>

        <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
            <button onClick={()=> navigate('/ai')} className='bg-blue-400 text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer'>Start creating now</button>  
        </div>
        <div className="flex items-center gap-2 mt-5 mx-auto text-gray-600">
    <SiGooglegemini 
        className="text-2xl" 
        style={{
            fill: 'url(#geminiGradient)'
        }} 
    />
    Powered By Gemini Intelligence

    <svg width="0" height="0">
        <defs>
            <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00B0FF" />
                <stop offset="50%" stopColor="#8A2BE2" />
                <stop offset="100%" stopColor="#FF0080" />
            </linearGradient>
        </defs>
    </svg>
</div>

      
    </div>
  )
}

export default Hero
