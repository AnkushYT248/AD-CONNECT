import { auth, signOut, onAuthStateChanged } from '../constend/firebase';

const handleSignOut = async () => {
  try {
     await signOut(auth);

    console.log(`user signed out`);
  } catch (error) {
     console.log(`error signing out ${error}`);
  }
}

export {handleSignOut};