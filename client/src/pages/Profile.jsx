import {useSelector} from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser?.avatar} alt="profile" className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2'/>
        <input type="text" placeholder="Username" className='border border-slate-300 p-3 rounded-lg' id="username" />
        <input type="email" placeholder="Email" className='border border-slate-300 p-3 rounded-lg' id="email" />
        <input type="password" placeholder="Password" className='border border-slate-300 p-3 rounded-lg' id="password" />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50'>Update </button>
        </form> 
        <div className='flex justify-between mt-5 '>
         <span className='text-red-500 cursor-pointer '>Delete account</span>
         <span className='text-red-500 cursor-pointer '>Sign out</span>
        </div>
    </div>
  )
}