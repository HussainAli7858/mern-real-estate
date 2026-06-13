import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


export default function UpdateListing() {
    const {currentUser} = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
        
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchListing = async () => {
          const lstingId = params.listingId;
          const res = await fetch(`/api/listing/get/${lstingId}`);
          const data = await res.json();
          setFormData(data);
          if (data.success === false) {
            connsole.log(data.message);
          }
        };
        fetchListing();
    },[]);

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

    const handleChange = (e) => {

      if(e.target.id === "sell" || e.target.id === "rent"){
        setFormData({
          ...formData,
          type: e.target.id,
        });
      }

      if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked,
        });
      }

      if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea" ){
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           if(formData.imageUrls.length < 1){
            setError('Please upload at least one image');
            setLoading(false);
            return;
           }
           if(+formData.discountPrice >= +formData.regularPrice){
            setError('Discounted price must be less than regular price');
            setLoading(false);
            return; 
           }

           setLoading(true);
           setError(false);
           const res = await fetch(`/api/listing/update/${params.listingId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                userRef: currentUser._id,
            }),
           });
           const data = await res.json();
           setLoading(false);
           if(data.success === false){
            setError(data.message);
           }
           navigate(`/listing/${data._id}`);
        } catch (error) {
           setError(error.message);
           setLoading(false);
        }
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7 '>Update a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-10'>
          <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' className='border border-slate-300 p-3 rounded-lg' id='name' maxLength='62' minLength='1' required onChange={handleChange} value={formData.name} />
            <textarea type="text" placeholder='Description' className='whitespace-pre-wrap border border-slate-300 p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description} />
            <input type="text" placeholder='Address' className='border border-slate-300 p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address} />
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2 '>
                <input type="checkbox" id="sell" className='w-5' onChange={handleChange} checked={formData.type === "sell"} />
                <span>Sell</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={formData.type === "rent"} />
                <span>Rent</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={formData.parking} />
                <span>Parking spot</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={formData.furnished} />
                <span>Furnished</span>
              </div>
              <div className='flex gap-2 '>
                <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={formData.offer} />
                <span>Offer</span>
              </div>
            </div>
            <div className='flex gap-6 flex-wrap'>
              <div className='flex items-center gap-2 '>
                <input type="number" id="bedrooms" min="1" max="10" required className='border border-slate-300 p-3 rounded-lg' onChange={handleChange} value={formData.bedrooms} />
                <p>Beds</p>
              </div>  
              <div className='flex items-center gap-2 '>
                <input type="number" id="bathrooms" min="1" max="10" required className='border border-slate-300 p-3 rounded-lg' onChange={handleChange} value={formData.bathrooms} />
                <p>Baths</p>
              </div>  
              <div className='flex items-center gap-2 '>
                <input type="number" id="regularPrice" min="1" max="10" required className='border border-slate-300 p-3 rounded-lg' min="50" max="1000000" onChange={handleChange} value={formData.regularPrice} />
                <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
                </div>
              </div>
              {formData.offer && (
              <div className='flex items-center gap-2 '>
                <input type="number" id="discountPrice" className='border border-slate-300 p-3 rounded-lg' min="0" max="1000000" onChange={handleChange} value={formData.discountPrice} />
                <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div> ) }   
            </div>
          </div>   
          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
              <span className='font-normal text-gray-600 ml-2 '>The first image will be the cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
              <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-slate-300 rounded w-full hover:cursor-pointer' type="file" id="images" accept='image/*' multiple />
              <button type='button' disabled={uploading} onClick={handleImageSubmit} className= 'font-semibold text-green-700 p-3 border border-green-700 rounded-xl uppercase hover:shadow-lg hover:cursor-pointer disabled:opacity-50'>{uploading ? 'Uploading...' : 'Upload'}</button>
            </div>
            <p className='text-red-500 text-sm'>{imageUploadError && imageUploadError}</p>
            {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className='flex p-3 justify-between items-center border border-hidden' >
                <img src={url} alt="Listing image" className='w-20 h-20 object-contain rounded-lg'/>
                <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-500 rounded-lg uppercase hover:opacity-75'>Delete</button>
              </div>
            ))}
          <button disabled={loading || uploading} className='font-semibold text-white p-3 bg-slate-700 rounded-xl uppercase hover:opacity-80 hover:shadow-lg hover:cursor-pointer disabled:opacity-50'>{loading ? "Updating..." : "Update Listing"}</button>
          {error && <p className='text-red-500 text-sm'>{error}</p>}
          </div>
        </form>
    </main>
  )
}
