import { useEffect, useState } from 'react'

export default function Contact({listing}) {

    const [landlord, setLandlord] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                setError(null);
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                setError("Could not message landlord due to an error.");
            }
        }
        fetchLandlord();
    },[listing.userRef])

    const onChange = (e) => {
        setMessage(e.target.value);
    }

        const handleSendMessage = () => {
            const subject = encodeURIComponent(`Regarding ${listing.name}`);
            const body = encodeURIComponent(message);
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(landlord.email)}&su=${subject}&body=${body}`;

            const popup = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

            if (!popup) {
                window.location.href = `mailto:${landlord.email}?subject=${subject}&body=${body}`;
            }
        }

  return (
    <>
    {error && <p className='text-red-500 text-center my-5'>{error}</p>}
    {landlord && (
        <div className='flex flex-col gap-4 mt-5'>
            <p>Contact :<span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
            <textarea name="message" id="message" rows="2" value={message} onChange={onChange} placeholder='Your message here...' className='w-full border border-slate-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200' ></textarea>
                        <button type='button' onClick={handleSendMessage} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 p-3 text-center'>
                            Send Message
                        </button>
        </div>
    )}
    </>
  )
}