import useMobile from '@/hooks/useMobile'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

function Notification() {
  const [isMobile] = useMobile();
  const navigate = useNavigate();
  return (
    <>
    {
      isMobile && (
      <div className='p-4 border-b flex items-center gap-4'>
        <button onClick={() => navigate(-1)}>
        <FaArrowLeft />
        </button>
        
        </div>
    )
    }

    <div>Notification</div>
    </>
  )
}

export default Notification