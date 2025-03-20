
import { auth, signOut, onAuthStateChanged,db,doc,getDoc } from '../constend/firebase';

const handleSignOut = async () => {
  try {
    await signOut(auth);
    window.location.href = '/';
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

const getCurrentUser = () => {
  return auth.currentUser;
};

const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

const getUserInfoRef = async (userId, callBack) => {
  const userInfoRef = doc(
    db,
    `registred-users/${userId}/user_info`,
    'info',
  );

  try {
    const userInfoSnap = await getDoc(userInfoRef);

    if (!userInfoSnap.exists()) {
      throw new Error('No user document found!');
    } else {
      // Pass the retrieved data to the callback
      callBack(userInfoSnap.data());
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    callBack(null, error); // Pass error to the callback if needed
  }
};

export { handleSignOut, getCurrentUser, listenToAuthChanges, getUserInfoRef };
