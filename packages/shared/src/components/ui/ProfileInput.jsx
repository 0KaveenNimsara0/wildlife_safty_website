import React from 'react';
export default function ProfileInput({className = '', ...props}) {
 return <input {...props} className={`profile-input ${className}`} />;
}
