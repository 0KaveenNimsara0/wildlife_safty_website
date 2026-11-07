// Cached display identity only. Protected routes separately verify the server session.
export function resolveSession(storage, currentUser, imageBaseUrl, pathname = '/') {
 const normalize = (user, role, source) => ({ ...user, uid: user.uid || user._id || user.id, displayName: user.displayName || user.name || user.email, role, source, photoURL: user.photoURL?.startsWith('/uploads') ? `${imageBaseUrl}${user.photoURL}` : user.photoURL });
 const medical = pathname.startsWith('/medical-officer') || storage.getItem('mainSessionRole') === 'medical';
 if (medical) {
  try { const user = JSON.parse(storage.getItem('medicalOfficerData')); return user && storage.getItem('medicalOfficerToken') ? normalize(user,'medicalOfficer','mongodb') : null; } catch { return null; }
 }
 if (currentUser) return normalize(currentUser,'user',storage.getItem('mongoUser') ? 'mongodb' : 'firebase');
 try { const user = JSON.parse(storage.getItem('mongoUser')); return user && storage.getItem('userToken') ? normalize(user,'user','mongodb') : null; } catch { return null; }
}
