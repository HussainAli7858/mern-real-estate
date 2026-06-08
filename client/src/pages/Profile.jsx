import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import { updateUserStart, updateUserSuccess, updateUserFailure, signInFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [file,setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

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
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };

  const handleDeleteUser = async () => {
    try {
     dispatch(deleteUserStart()); 
     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
     });
     const data = await res.json();
     if(data.success === false){
      dispatch(deleteUserFailure(data.message));
      return;
     }
     await supabase.auth.signOut();
     dispatch(deleteUserSuccess());
    } catch (error) {
     dispatch(deleteUserFailure(error.message)); 
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout")
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      await supabase.auth.signOut();
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={() => fileRef.current.click() } src={formData.avatar || currentUser.avatar} alt="profile" className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center '>
          {fileUploadError ?
           (<span className='text-red-500'>{fileUploadError}</span>) : 
          filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>Uploading: {filePerc}%</span>) :
          filePerc === 100 ? (<span className='text-green-500'>File uploaded successfully</span>) : ('')
        }
          
        </p>
        <input onChange={handleChange} type="text" placeholder="Username" defaultValue={currentUser.username} className='border border-slate-300 p-3 rounded-lg' id="username" />
        <input onChange={handleChange} type="email" placeholder="Email" defaultValue={currentUser.email} className='border border-slate-300 p-3 rounded-lg' id="email" />
        <input onChange={handleChange} type="password" placeholder="Password" className='border border-slate-300 p-3 rounded-lg' id="password" />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50'>{loading ? 'Updating...' : 'Update'}</button>
        <Link to='/create-listing' className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90 disabled:opacity-50'>
          Create Listing
        </Link>
        </form> 
        <div className='flex justify-between mt-5 '>
         <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer '>Delete account</span>
         <span onClick={handleSignOut} className='text-red-700 cursor-pointer '>Sign out</span>
        </div>
        <p className='text-red-500 mt-5'>{error ? error : ""}</p>
        <p className='text-green-500 mt-5'>{updateSuccess ? 'User updated successfully!' : ''}</p>
    </div>
  )
}