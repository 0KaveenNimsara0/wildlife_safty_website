// Pure session normalization, shared by initial hydration and later refreshes.
export function resolveSession(storage, currentUser, imageBaseUrl) {
 const normalize = (user, role, source) => ({
  ...user,
  uid: user.uid || user._id || user.id,
  displayName: user.displayName || user.name || user.email,
  role, source,
  photoURL: user.photoURL?.startsWith('/uploads') ? `${imageBaseUrl}${user.photoURL}` : user.photoURL,
 });
 for (const [key,role] of [['adminData','admin'],['medicalOfficerData','medicalOfficer']]) {
  try { const user=JSON.parse(storage.getItem(key)); if(user && typeof user==='object') return normalize(user,role,'mongodb'); } catch { /* Ignore corrupt persisted entries individually. */ }
 }
 if(currentUser) return normalize(currentUser,currentUser.role || 'user',storage.getItem('mongoUser')?'mongodb':'firebase');
 try { const user=JSON.parse(storage.getItem('mongoUser')); if(user && typeof user==='object') return normalize(user,'user','mongodb'); } catch { /* Invalid stored user is treated as signed out. */ }
 return null;
}
