import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, db, doc, getDoc } from './firebase.js';

export const OnBoard = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [profile, setProfile] = useState({ name: '', bio: '', profilePic: null });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const verifyCode = async () => {
      try {
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
              document.querySelector('.alert').classList.remove('hidden', 'alert-error');
              document.querySelector('.alert').classList.add('alert-success');
              document.querySelector('.alert').textContent = 'Code verified successfully!';
              nextStep();
          } else {
              document.querySelector('.alert').classList.remove('hidden', 'alert-success');
              document.querySelector('.alert').classList.add('alert-error');
              document.querySelector('.alert').textContent = data.error;
          }
      } catch (error) {
          console.error('Error verifying OTP:', error);
          document.querySelector('.alert').classList.remove('hidden', 'alert-success');
          document.querySelector('.alert').classList.add('alert-error');
          document.querySelector('.alert').textContent = 'Failed to verify OTP. Please try again.';
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          document.querySelector('.alert').classList.remove('hidden', 'alert-error');
          document.querySelector('.alert').classList.add('alert-success');
          document.querySelector('.alert').textContent = `OTP sent to ${email}`;
          nextStep();
        } else {
          document.querySelector('.alert').classList.remove('hidden', 'alert-success');
          document.querySelector('.alert').classList.add('alert-error');
          document.querySelector('.alert').textContent = data.error;
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        document.querySelector('.alert').classList.remove('hidden', 'alert-success');
        document.querySelector('.alert').classList.add('alert-error');
        document.querySelector('.alert').textContent = 'Failed to send OTP. Please try again.';
      }
    } else if (step === 2) {
      verifyCode();
    } else if (step === 3) {
      document.querySelector('.alert').classList.remove('hidden', 'alert-error');
      document.querySelector('.alert').classList.add('alert-success');
      document.querySelector('.alert').textContent = 'Onboarding complete!';
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
            }else {
              
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
        <h1 className="text-2xl font-bold mb-6 text-center title-text">AD Connect</h1>
        
        <div class="alert rounded hidden">
        </div>
        
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