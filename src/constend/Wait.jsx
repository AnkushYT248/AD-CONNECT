import { auth, onAuthStateChanged } from './firebase.js';
import { db, doc, getDoc, writeBatch, serverTimestamp } from './firebase.js';
import { useState, useEffect } from 'react';

export const Wait = () => {
  const [waitText, setWaitText] = useState("Loading...Checking user login status");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "registred-users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let isProfileComplete = false;
          let isEmailVerified = false;

          if (userDocSnap.exists()) {
            setWaitText("Status: User logged in and account found");

            // Check if the profile is complete and email is verified
            const userInfoRef = doc(db, `registred-users/${user.uid}/user_info`, "info");
            const userInfoSnap = await getDoc(userInfoRef);
            if (userInfoSnap.exists()) {
              const userData = userInfoSnap.data();
              isProfileComplete = userData.isProfileComplete || false;
              isEmailVerified = userData.isEmailVerified || false;
            }
          } else {
            // Create new user data using batch write for atomic creation
            const batch = writeBatch(db);

            const userInfoRef = doc(db, `registred-users/${user.uid}/user_info`, "info");
            const userInfoSnap = await getDoc(userInfoRef);
            if (!userInfoSnap.exists()) {
              batch.set(userInfoRef, {
                username: user.displayName || "Anonymous",
                user_uid: user.uid,
                account_created: serverTimestamp(),
                theme: "dark",
                status: "online",
                profile_picture: user.photoURL || "",
                bio: "No bio yet",
                followers: 0,
                following: 0,
                isProfileComplete: false,
                isEmailVerified: user.emailVerified || false, // Capture email verification status
              });
            }

            // Initialize other collections if they don't exist
            const userFriendsRef = doc(db, `registred-users/${user.uid}/userFriends`, "friends");
            if (!(await getDoc(userFriendsRef)).exists()) {
              batch.set(userFriendsRef, { friends: [] });
            }

            const userChatsRef = doc(db, `registred-users/${user.uid}/userChats`, "chats");
            if (!(await getDoc(userChatsRef)).exists()) {
              batch.set(userChatsRef, {});
            }

            const userDocumentsRef = doc(db, `registred-users/${user.uid}/userDocuments`, "documents");
            if (!(await getDoc(userDocumentsRef)).exists()) {
              batch.set(userDocumentsRef, {});
            }

            await batch.commit();
            setWaitText("Status: User logged in and account created");
            isProfileComplete = false;
            isEmailVerified = user.emailVerified || false;
          }

          // Redirect based on profile completion and email verification status
          if (isProfileComplete && isEmailVerified) {
            setTimeout(() => {
              setWaitText("Redirecting to home page...");
              setTimeout(() => {
                window.location.href = "/home";
              }, 1500);
            }, 1000);
          } else {
            setTimeout(() => {
              setWaitText("Redirecting to onboarding page...");
              setTimeout(() => {
                window.location.href = "/onboard";
              }, 1500);
            }, 1000);
          }
        } catch (error) {
          console.error(`Error: ${error}`);
          setWaitText("Error checking or creating user account");
        } finally {
          setIsLoading(false);
        }
      } else {
        setWaitText("User not logged in... Redirecting to login page");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <main className="flex items-center justify-center w-screen h-screen p-2">
      <div className="flex flex-col items-center justify-center">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
          </div>
        )}
        {waitText && (
          <div className="wait_info text-center mt-3 text-gray-400 text-sm font-bold">
            {waitText}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wait;