import { auth, signOut, onAuthStateChanged } from '../constend/firebase';

export const Home = () => {
  const handleSignOut = async () => {
    try {
       await signOut(auth);

      console.log(`user signed out`);
    } catch (error) {
       console.log(`error signing out ${error}`);
    }
  }

  const checkUserLoggedIn = () => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          window.location.href = "/";
        } else {
          console.log(`user logged in`);
        }
      });
    } catch (error) {
       console.error(`${error}`);
    }
  };


  checkUserLoggedIn();
  return (
    <>
    <buttton className="btn btn-primary" onClick={handleSignOut}>Sign Out</buttton>
    </>
  );
};

export default Home;