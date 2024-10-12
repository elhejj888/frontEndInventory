import React from 'react';

export default function Avatar({ name,src, alt = 'Profile Image', size = 'w-12 h-12' }) {
  return (
    <div className='flex'>
    <img
      className={`rounded-full object-cover ${size}`}
      src={src}
      alt={alt}
    />
    
    </div>
  );
}