import React from 'react'
import { supabase } from '../supabase/supabase';

export default function OAuth() {
  const handleGoogleClick = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log("could not sign in with google", error);
  }
};
  return (
    <button onClick={handleGoogleClick} type="button" className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-90'>
      Continue with Google
    </button>
  );
}
