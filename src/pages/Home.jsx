import { auth, signOut, onAuthStateChanged } from '../constend/firebase';
import { Navbar } from '../components/Navbar';

export const Home = () => {
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
      <Navbar />
    </>
  );
};

export default Home;