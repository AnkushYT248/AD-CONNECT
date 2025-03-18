import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, db, doc, getDoc } from './firebase.js';
import { sendSignInLinkToEmail } from 'firebase/auth';

export const OnBoard = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [profile, setProfile] = useState({ name: '', bio: '', profilePic: null });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Generate a 6-digit random code
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationCode = async () => {
    const newCode = generateCode();
    setGeneratedCode(newCode);
    alert(`Your verification code is: ${newCode}`); // For development; use an email service in production
  };

  const verifyCode = () => {
    if (code === generatedCode) {
      setIsCodeVerified(true);
      nextStep();
    } else {
      alert('Invalid code. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      sendVerificationCode();
      nextStep();
    } else if (step === 2) {
      verifyCode();
    } else if (step === 3) {
      alert('Onboarding complete!');
      console.log({ email, code, profile });
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePic: URL.createObjectURL(file) });
    }
  };

  useEffect(() => {
    const checkUserResult = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          setEmail(user.email);
          try {
            const userInfoRef = doc(db, `registred-users/${userId}/user_info`, 'info');
            const userInfoSnap = await getDoc(userInfoRef);

            if (!userInfoSnap.exists()) throw new Error('User data not found');
            const { username, isProfileComplete } = userInfoSnap.data();

            if (isProfileComplete) {
              window.location.href = '/home';
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });
    };

    checkUserResult();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="w-full max-w-lg bg-base-100 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">AD Connect</h1>

        <ul className="steps w-full mb-8">
          <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>
            Email Confirmation
          </li>
          <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>
            Code Verification
          </li>
          <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>
            Complete Profile
          </li>
        </ul>

        {/* Step 1: Email Confirmation */}
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                disabled
              />
            </div>
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Send Verification Code
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Code Verification */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter the verification code</span>
              </label>
              <input
                type="text"
                placeholder="6-digit code"
                className="input input-bordered w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-4">
              <button type="button" className="btn btn-ghost mr-2" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Verify Code
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Complete Profile */}
        {step === 3 && isCodeVerified && (
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Picture</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="input input-bordered w-full"
                onChange={handleProfilePicChange}
              />
              {profile.profilePic && (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-24 h-24 mt-4 rounded-full object-cover"
                />
              )}
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                placeholder="Tell us about yourself"
                className="textarea textarea-bordered w-full"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Complete Onboarding
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OnBoard;