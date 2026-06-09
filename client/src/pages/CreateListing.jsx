import { useState } from 'react'
import { supabase } from '../supabase/supabase';


export default function CreateListing() {
    const [files, setFiles] = useState([]);
    console.log(files);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const handleImageSubmit = (e) => {
      if(files.length > 0 && files.length + formData.imageUrls.length <= 6){
        setUploading(true);
        setImageUploadError(false);
        const promises = [];

        for(let i=0; i<files.length; i++){
          promises.push(storeImage(files[i]));
        }
        Promise.all(promises).then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        }).catch((error) => {
          setImageUploadError(error.message || 'Failed to upload images (2 mb max per image)');
          setUploading(false);
        });
      }else{
        setImageUploadError('You can upload min 1 and max 6 images');
        setUploading(false);
      }
    };
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            if (file.size > 2 * 1024 * 1024) {
              reject(new Error('Failed to upload images (2 mb max per image)'));
              return;
            }

            const fileName = `${Date.now()}-${file.name}`;

            supabase.storage
              .from('Images')
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type,
              })
              .then(({ error }) => {
                if (error) {
                  reject(error);
                  return;
                }

                const { data } = supabase.storage.from('Images').getPublicUrl(fileName);
                resolve(data.publicUrl);
              })
              .catch(reject);
        });
    };
    const handleRemoveImage =(index) => {
       setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index),
       }); 
    }
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
              <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-slate-300 rounded w-full' type="file" id="images" accept='image/*' multiple />
              <button type='button' disabled={uploading} onClick={handleImageSubmit} className= 'font-semibold text-green-700 p-3 border border-green-700 rounded-xl uppercase hover:shadow-lg hover:cursor-pointer disabled:opacity-50'>{uploading ? 'Uploading...' : 'Upload'}</button>
            </div>
            <p className='text-red-500 text-sm'>{imageUploadError && imageUploadError}</p>
            {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className='flex p-3 justify-between items-center border border-hidden' >
                <img src={url} alt="Listing image" className='w-20 h-20 object-contain rounded-lg'/>
                <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-500 rounded-lg uppercase hover:opacity-75'>Delete</button>
              </div>
            ))}
          <button className='font-semibold text-white p-3 bg-slate-700 rounded-xl uppercase hover:opacity-80 hover:shadow-lg hover:cursor-pointer disabled:opacity-50'>Create Listing</button>
          </div>
        </form>
    </main>
  )
}
