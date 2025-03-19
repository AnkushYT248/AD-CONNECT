import React, { useState, useEffect, useRef } from 'react';
import { FullScreenPreloader } from "../components/FullScreenPreloader";
import { auth, onAuthStateChanged, db, doc, getDoc, updateDoc, serverTimestamp, signOut } from './firebase.js';

export const OnBoard = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [profile, setProfile] = useState({ name: '', bio: '', profilePic: null, previewUrl: null });
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const preloaderRef = useRef(null);

  const setEmailText = () => {
  onAuthStateChanged(auth, async (user) => {
    if(user) {
      setEmail(user.email);
      console.log(user.email);
    }
  });
  }

  setEmailText();
  const showAlert = (message, isSuccess) => {
    const alertElement = document.querySelector('.alert');
    alertElement.classList.remove('hidden', 'alert-error', 'alert-success');
    alertElement.classList.add(isSuccess ? 'alert-success' : 'alert-error');
    alertElement.textContent = message;

    // Hide the alert after 3 seconds
    setTimeout(() => {
      alertElement.classList.add('hidden');
    }, 3000);
  };

  const verifyCode = async () => {
    try {
      if(preloaderRef.current) preloaderRef.current.classList.remove('hidden');
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCodeVerified(true);
        showAlert('Code verified successfully!', true);
        nextStep();
        if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
      } else {
        showAlert(data.error, false);
        if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showAlert('Failed to verify OTP. Please try again.', false);
      if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      try {
        if(preloaderRef.current) preloaderRef.current.classList.remove('hidden');
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          showAlert(`OTP sent to ${email}`, true);
          if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
          nextStep();
        } else {
          showAlert(data.error, false);
          if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        showAlert('Failed to send OTP. Please try again.', false);
        if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
      }
    } else if (step === 2) {
      if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
      verifyCode();
    } else if (step === 3) {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('No user found');

        let profilePicBase64 = '';
        if (profile.profilePic instanceof File) {
          profilePicBase64 = await getBase64(profile.profilePic);
        }

        const userInfoRef = doc(db, `registred-users/${currentUser.uid}/user_info`, 'info');
        const userInfoSnap = await getDoc(userInfoRef);
        if(preloaderRef.current) preloaderRef.current.classList.remove('hidden');

        if (userInfoSnap.exists()) {
          const existingData = userInfoSnap.data();

          // Update only if fields have default values or are missing
          const updateData = {
            username: existingData.username === 'Anonymous' ? profile.name : existingData.username,
            bio: existingData.bio === 'No bio yet' ? profile.bio : existingData.bio,
            profile_picture: existingData.profile_picture || profilePicBase64 || '',
            isEmailVerified: true,
            isProfileComplete: true,
            account_updated: serverTimestamp(),
          };

          await updateDoc(userInfoRef, updateData);

          showAlert('Profile updated successfully!', true);
          if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
          setTimeout(() => {
            window.location.href = '/home';
          }, 1500);
        } else {
          console.error('User data not found');
          showAlert('Failed to update profile. Please try again.', false);
          if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('Failed to update profile. Please try again.', false);
        if(preloaderRef.current) preloaderRef.current.classList.add('hidden');
      }
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
            const { isProfileComplete } = userInfoSnap.data();

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
      <FullScreenPreloader ref={preloaderRef}/>
      <div className="w-full max-w-lg bg-base-100 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center title-text">AD Connect</h1>

        <div className="alert rounded hidden"></div>

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
              <button type="submit" className="btn btn-primary w-full flex items-center justify-center">
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setProfile({ ...profile, profilePic: file, previewUrl });
                  }
                }}
              />
              {profile.previewUrl && (
                <img
                  src={profile.previewUrl}
                  alt="Profile"
                  className="w-24 h-24 mt-4 rounded-full object-cover profile-preview"
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
        <button className="btn btn-secondary text-white rounded-lg p-2 mt-3 m-auto">Logout</button>
      </div>
    </div>
  );
};

export default OnBoard;