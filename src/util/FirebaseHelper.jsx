
import { auth, signOut, onAuthStateChanged } from '../constend/firebase';

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

export { handleSignOut, getCurrentUser, listenToAuthChanges };
