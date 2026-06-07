import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase/supabase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OAuth({ successRedirect = '/' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const processedUserIdRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const getGoogleAvatarUrl = (supabaseUser) => {
    return (
      supabaseUser?.user_metadata?.avatar_url ||
      supabaseUser?.user_metadata?.picture ||
      supabaseUser?.user_metadata?.picture_url ||
      supabaseUser?.identities?.[0]?.identity_data?.avatar_url ||
      supabaseUser?.identities?.[0]?.identity_data?.picture ||
      supabaseUser?.identities?.[0]?.identity_data?.picture_url ||
      supabaseUser?.identities?.[0]?.identity_data?.image_url ||
      supabaseUser?.identities?.[0]?.identity_data?.avatar ||
      ''
    );
  };

  const syncGoogleUser = async (supabaseUser, providerToken = null) => {
    if (!supabaseUser?.email || processedUserIdRef.current === supabaseUser.id) {
      return;
    }

    setLoading(true);

    try {
      const displayName =
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.name ||
        supabaseUser.user_metadata?.display_name ||
        supabaseUser.email.split('@')[0];
      const photo = getGoogleAvatarUrl(supabaseUser);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: displayName,
          email: supabaseUser.email,
          ...(photo ? { photo, avatar: photo } : {}),
          providerToken,
          user_metadata: supabaseUser.user_metadata,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Could not sync Google user');
      }

      dispatch(signInSuccess(data));
      processedUserIdRef.current = supabaseUser.id;
      navigate(successRedirect,{ replace: true });
    } catch (error) {
      console.log('could not sync google user', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const restoreGoogleSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await syncGoogleUser(session.user, session.provider_token);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncGoogleUser(session.user, session.provider_token);
      }
    });

    restoreGoogleSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname]);

  const handleGoogleClick = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${location.pathname}`,
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
    <button onClick={handleGoogleClick} type="button" disabled={loading} className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50'>
      {loading ? 'Connecting...' : 'Continue with Google'}
    </button>
  );
}
