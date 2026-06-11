import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

export default function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
      const fetchListing = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/listing/get/${params.listingId}`);
          const data = await res.json();
          if(data.success === false){
            setError(true);
            setLoading(false);
            return;
          }
          setListing(data)  
          setLoading(false);
          setError(false);
        } catch (error) {
          setError(true);
          setLoading(false);
        }
        ;
      }
      fetchListing();
    },[params.listingId])

  return (
    <main>
        {loading && <p className="text-center my-7 text-2xl" >Loading...</p> }
        {error && <p className="text-center my-7 text-2xl text-red-500" >Something went wrong.</p> }

        {listing && !loading && !error && 
            <div>
            <Swiper modules={[Navigation]} navigation>
              {
                listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                        <div className='h-[550px] w-full' style={{background:`url(${url}) center/cover no-repeat`}}></div>
                    </SwiperSlide>
                ))
              }
            </Swiper>
            </div>
        } 
        </main>
  )
}
