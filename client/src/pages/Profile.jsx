import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser} = useSelector((state) => state.user);
  const [file,setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = async (file) => {
  try {
    setFileUploadError(false);

    const fileName = `${Date.now()}_${file.name}`;

    setFilePerc(10);

    const { error } = await supabase.storage
      .from('Images')
      .upload(fileName, file);

    if (error) {
      setFileUploadError(true);
      setFilePerc(0);
      return;
    }

    setFilePerc(80);

    const { data } = supabase.storage
      .from('Images')
      .getPublicUrl(fileName);

    setFormData({
      ...formData,
      avatar: data.publicUrl,
    });

    setFilePerc(100);

  } catch (error) {
    console.log(error);
    setFileUploadError(true);
    setFilePerc(0);
  }
};

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={() => fileRef.current.click() } src={formData.avatar || currentUser.avatar} alt="profile" className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center '>
          {fileUploadError ?
           (<span className='text-red-500'>{fileUploadError}</span>) : 
          filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>Uploading: {filePerc}%</span>) :
          filePerc === 100 ? (<span className='text-green-500'>File uploaded successfully</span>) : ('')
        }
          
        </p>
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