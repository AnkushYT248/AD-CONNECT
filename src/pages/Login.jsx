import { Images } from "../constend/Images";
import { FaKey } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useState } from "react";
import { FullScreenPreloader } from "../components/FullScreenPreloader";
import { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from '../constend/firebase'

export const Login = () => {
  const [isChecked, setIsChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [feedback,setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const handleInputChange = (e) => {
    const {name,value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const preloader = document.querySelector('.fullScreenPreloader');
    
    if(!formData.email || !formData.password) {
      setFeedback("Please fill all the fields");
      setFeedbackType("error");
      return;
    }

    try {
      preloader.style.display = 'flex';
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setFeedback("Login successful");
      setFeedbackType("success");
    } catch (error) {
      let message = "An error occurred during login";

      switch (error.code) {
        case "auth/invalid-credential":
          message = "Invalid email or password";
          break;
        case "auth/user-not-found":
          message = "User not found";
          break;
        case "auth/wrong-password":
          message = "Incorrect password";
          break;
        case "auth/invalid-email":
          message = "Invalid email format";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later";
          break;
      }

      setFeedback(message);
      setFeedbackType("error");
    } finally {
      preloader.style.display = 'none';
    }
  }

  const handelGoogleSignIn = async () => {
    try {
       await signInWithPopup(auth, googleProvider);
       setFeedback("Login successful");
       setFeedbackType("success");
    } catch (error) {
       setFeedback("An error occurred during login "+ error.message);
       setFeedbackType("error");
    }
    
  }

  const checkUserLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/home";
      } else {
        console.log(`No user logged in`);
      }
    });
  };

  checkUserLoggedIn();

  return (
    <>
    <FullScreenPreloader />
    <main className="flex items-center justify-center min-h-screen bg-base-100">
      
      <div className="card w-full max-w-4xl shadow-lg bg-base-200 p-6 rounded-xl flex flex-col md:flex-row gap-6">
        {/* Left Card (Image Section) */}
        <div className="w-full md:w-1/2">
          <img
            src={Images.beach_image}
            alt="Beach"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Right Card (Form Section) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-center text-neutral title-text">
            AD CONNECT
          </h1>
          <p className="text-lg text-gray-500 text-center mt-2">
            Welcome back! Sign in to access your account and explore new
            possibilities.
          </p>

          <button className="btn bg-white text-black border-[#e5e5e5] mt-4 rounded google_btn" onClick={handelGoogleSignIn}>
            <img src={Images.google} alt="Google" />
            Login with Google
          </button>

          <p className="text-center text-gray-600 mt-2 w-full">--OR--</p>

          {feedback &&(
          <div class={`text-center feedback p-2 rounded text-center w-full ${feedbackType === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"}`}>
            {feedback}
          </div>
      )}

          <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <MdEmail className="w-4 h-4 opacity-70" />
              |
              <input
                type="text"
                className="grow login_email"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                placeholder="Email"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaKey className="h-4 w-4 opacity-70" />
              |
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                name="password"
                className="grow login_password"
                placeholder="Password"
              />
            </label>

            <fieldset className="flex items-center justify-between p-4 bg-base-100 border border-base-300 rounded-box w-full">
              <legend className="fieldset-legend">Login options</legend>

              <label className="fieldset-label">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                Remember me
              </label>

              <label className="fieldset-label">
                <input 
                  type="checkbox" 
                  className="checkbox" 
                  checked={showPassword} 
                  onChange={() => setShowPassword(!showPassword)}
                />
                {showPassword ? 'Hide Password' : 'Show Password'}
              </label>
            </fieldset>

            <button type="submit" className="btn btn-primary w-full rounded">
              Sign In
            </button>
          </form>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400 text-center mt-4">
              <a href="#" className="text-blue-500 hover:underline">
                Forgot Password
              </a>
            </p>

            <p className="text-sm text-gray-400 text-center mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default Login;