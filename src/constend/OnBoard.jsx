import React, { useState } from 'react';
import { auth, onAuthStateChanged, db, doc, getDoc } from './firebase.js'

export const OnBoard = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [profile, setProfile] = useState({ name: '', bio: '', profilePic: null });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 3) {
      alert('Onboarding complete!');
      console.log({ email, code, profile });
    } else {
      nextStep();
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePic: URL.createObjectURL(file) });
    }
  };


  /*const checkUserStatus = async () => {
    onAuthStateChanged(auth, async (user) => {
      if(user) {
        console.log(`user logged in`);
        const userUid
      }
    })
  }*/
  //checkUserStatus();
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="title-text text-2xl">AD Connect</h1>
      </div>
      <div className="w-full max-w-lg bg-base-100 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-2">
          <p>Few steps away to complete profile!</p>
        </div>

        {/* Step Indicator */}
        <ul className="steps w-full mb-8">
          <li className={`step ${step >= 1 ? 'step-primary' : ''} ${step === 1 ? 'font-bold text-lg' : ''}`}>
            Email Confirmation
          </li>
          <li className={`step ${step >= 2 ? 'step-primary' : ''} ${step === 2 ? 'font-bold text-lg' : ''}`}>
            Complete Profile
          </li>
          <li className={`step ${step >= 3 ? 'step-primary' : ''} ${step === 3 ? 'font-bold text-lg' : ''}`}>
            Finish
          </li>
        </ul>

        {/* Step 1: Email Confirmation */}
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter your email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Send Confirmation Code
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Code Input */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter the confirmation code</span>
              </label>
              <input
                type="text"
                placeholder="Confirmation Code"
                className="input input-bordered w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
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
        {step === 3 && (
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
                  className="w-24 h-24 mt-4 rounded-full object-cover border border-gray-300"
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
              <button type="button" className="btn btn-ghost mr-2" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Complete Onboarding
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  );
};

export default OnBoard;