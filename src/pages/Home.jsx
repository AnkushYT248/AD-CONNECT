import { auth, signOut } from '../constend/firebase';

export const Home = () => {
  const handleSignOut = async () => {
    try {
       await signOut(auth);

      console.log(`user signed out`);
    } catch (error) {
       console.log(`error signing out ${error}`);
    }
    
  }
  return (
    <>
    <button onClick={handleSignOut}>Sign Out</button>
    </>
  );
};

export default Home;