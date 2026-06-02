import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Hussain</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form className='bg-slate-100 p-2 rounded-lg items-center flex'>
            <input type="text" placeholder="Search..." className='bg-transparent focus:outline-none w-24 sm:w-64' />
            <FaSearch className='text-slate-600 hover:cursor-pointer'/>
        </form>
        <ul className='flex gap-4 text-sm sm:text-lg'>
            <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
            </Link>
            <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
            </Link>
            
            {currentUser ? (
              <Link to='/profile'>
              <img src={currentUser.avatar} alt="Profile" className='w-7 h-7 rounded-full object-cover' />
              </Link>
            ) : (
              <Link to='/sign-in'>
              <li className='text-slate-700 hover:underline'>Sign in</li>
              </Link>
            )}
            
        </ul>

      </div>
       
    </header>
  )
}
