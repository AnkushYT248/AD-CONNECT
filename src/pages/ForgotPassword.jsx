import { useState } from 'react';
import { getAuth, sendPasswordResetEmail} from 'firebase/auth';

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setFeedback("Please fill the email field!");
      setFeedbackType("error");
      return;
    }

    const auth = getAuth();

    try {
      // Send password reset link
      await sendPasswordResetEmail(auth, email);
      setFeedback("Password reset link sent! Please check your email.");
      setFeedbackType("success");
    } catch (error) {
      // Check for specific Firebase error codes
      if (error.code === "auth/user-not-found") {
        setFeedback("This email is not registered. Please check and try again.");
      } else if (error.code === "auth/invalid-email") {
        setFeedback("Invalid email format. Please enter a valid email address.");
      } else {
        setFeedback(error.message);
      }
      setFeedbackType("error");
    }
  };

  document.title = "AD Connect | Forgot Password";

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="card bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center title-text text-base-800 mb-3">
          AD CONNECT
        </h1>

        {/* Forgot Password Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <fieldset className="border border-gray-300 p-5 rounded-md">
            <legend className="text-lg font-medium px-2">
              Forgot Password
            </legend>

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`feedback p-2 rounded text-sm text-center w-full ${
                  feedbackType === "success"
                    ? "bg-green-700 text-white"
                    : "bg-red-700 text-white"
                }`}
              >
                {feedback}
              </div>
            )}

            {/* Email Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />

            {/* Info Message */}
            <p className="text-sm text-gray-500 mt-2">
              * Please double-check your email before submitting the form!
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full bg-blue-500 text-white py-3 mt-6 rounded-md hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </fieldset>
        </form>

        {/* Go Back Link */}
        <p className="text-center text-gray-600 mt-6">
          <a href="/" className="text-blue-500 hover:underline">
            Go Back To Login
          </a>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;