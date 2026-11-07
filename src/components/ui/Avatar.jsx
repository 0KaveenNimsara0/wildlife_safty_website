import React, { useState } from 'react';
import { IMAGE_BASE_URL , imageUrl } from '../../config/constants';
export default function Avatar({ src, name = 'User' }) {
  const [failedSource, setFailedSource] = useState(null);
  const imageSource = src?.startsWith('/uploads') ? imageUrl(src) : src;
  return imageSource && failedSource !== imageSource
    ? <img referrerPolicy="no-referrer" src={imageSource} alt={name} onError={() => setFailedSource(imageSource)} className="w-full h-full object-cover" />
    : <span aria-label={name} className="text-lg font-semibold">{name.trim().charAt(0).toUpperCase() || 'U'}</span>;
}
