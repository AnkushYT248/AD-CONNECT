import React, { useState } from 'react';

export const OnBoard = () => {
  const [step, setStep] = useState(1); // Track the current step
  const [email, setEmail] = useState(''); // Store email input
  const [code, setCode] = useState(''); // Store confirmation code
  const [profile, setProfile] = useState({ name: '', bio: '' }); // Store profile data

  // Handle step progression
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 3) {
      alert('Onboarding complete!');
      console.log({ email, code, profile });
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="w-full max-w-md bg-base-100 p-8 rounded-lg shadow-lg">
        {/* Step Indicator */}
        <ul className="steps w-full mb-8">
          <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Email Confirmation</li>
          <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Complete Profile</li>
          <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Finish</li>
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
  );
};

export default OnBoard;