import { auth, onAuthStateChanged } from '../constend/firebase';
import { Navbar } from '../components/Navbar';import { FaSearch } from "react-icons/fa";
import { Groups } from '../components/Groups';

export const Home = () => {
  const checkUserLoggedIn = () => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          window.location.href = "/";
        } else {
          console.log(`user logged in ${user.email}`);
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
      <div className="mt-2 p-2 w-full">
        <label className="input input-bordered flex items-center gap-2 rounded w-full">
          <input type="text" className="grow" placeholder="Search..." />
          <FaSearch />
        </label>
      </div>
      <hr className="ml-4 mr-4"/>
      <Groups />
    </>
  );
};

export default Home;