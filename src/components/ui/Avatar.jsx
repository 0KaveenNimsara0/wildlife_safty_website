import React, { useState } from 'react';
export default function Avatar({ src, name = 'User' }) {
  const [failedSource, setFailedSource] = useState(null);
  return src && failedSource !== src
    ? <img referrerPolicy="no-referrer" src={src} alt={name} onError={() => setFailedSource(src)} className="w-full h-full object-cover" />
    : <span aria-label={name} className="text-lg font-semibold">{name.trim().charAt(0).toUpperCase() || 'U'}</span>;
}
