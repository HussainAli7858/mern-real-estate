import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7 '>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-10'>
          <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' className='border border-slate-300 p-3 rounded-lg' id='name' maxLength='62' minLength='5' required/>
            <textarea type="text" placeholder='Description' className='border border-slate-300 p-3 rounded-lg' id='description' required/>
            <input type="text" placeholder='Address' className='border border-slate-300 p-3 rounded-lg' id='address' required/>
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2 '>
                <input type="checkbox" id="sale" className='w-5'/>
                <span>Sell</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="rent" className='w-5'/>
                <span>Rent</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="parking" className='w-5'/>
                <span>Parking spot</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="furnished" className='w-5'/>
                <span>Furnished</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="offer" className='w-5'/>
                <span>Offer</span>
              </div>
            </div>
            <div className='flex gap-6 flex-wrap'>
              <div className='flex items-center gap-2 '>
                <input type="number" id="bedrooms" min="1" max="10" required className='border border-slate-300 p-3 rounded-lg'/>
                <p>Beds</p>
              </div>  
              <div className='flex items-center gap-2 '>
                <input type="number" id="bathrooms" min="1" max="10" required className='border border-slate-300 p-3 rounded-lg'/>
                <p>Baths</p>
              </div>  
              <div className='flex items-center gap-2 '>
                <input type="number" id="regularPrice" min="1" max="10" required className='border border-slate-300 p-3 rounded-lg'/>
                <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>($/month)</span>
                </div>
              </div>
              <div className='flex items-center gap-2 '>
                <input type="number" id="discountPrice" min="1" max="10" className='border border-slate-300 p-3 rounded-lg'/>
                <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span className='text-xs'>($/month)</span>
                </div>
              </div>    
            </div>
          </div>   
          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
              <span className='font-normal text-gray-600 ml-2 '>The first image will be the cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
              <input className='p-3 border border-slate-300 rounded w-full' type="file" id="images" accept='image/*' multiple />
              <button className= 'font-semibold text-green-700 p-3 border border-green-700 rounded-xl uppercase hover:shadow-lg hover:cursor-pointer disabled:opacity-50'>Upload</button>
            </div>
          <button className='font-semibold text-white p-3 bg-slate-700 rounded-xl uppercase hover:opacity-80 hover:shadow-lg hover:cursor-pointer disabled:opacity-50'>Create Listing</button>
          </div>
        </form>
    </main>
  )
}
