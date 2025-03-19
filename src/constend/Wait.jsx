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

          if (userDocSnap.exists()) {
            setWaitText("Status: User logged in and account found");
          } else {
            // Create new user data using batch write for atomic creation
            const batch = writeBatch(db);

            let isNewUser = false;

            // Create user_info only if it doesn't exist
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
                isEmailVerified: false,
              });
              isNewUser = true;
            }

            // Initialize empty userFriends collection if it doesn't exist
            const userFriendsRef = doc(db, `registred-users/${user.uid}/userFriends`, "friends");
            const userFriendsSnap = await getDoc(userFriendsRef);
            if (!userFriendsSnap.exists()) {
              batch.set(userFriendsRef, {
                friends: [], // Initialize as empty array
              });
              isNewUser = true;
            }

            // Initialize empty userChats collection if it doesn't exist
            const userChatsRef = doc(db, `registred-users/${user.uid}/userChats`, "chats");
            const userChatsSnap = await getDoc(userChatsRef);
            if (!userChatsSnap.exists()) {
              batch.set(userChatsRef, {});
              isNewUser = true;
            }

            // Initialize empty userDocuments collection if it doesn't exist
            const userDocumentsRef = doc(db, `registred-users/${user.uid}/userDocuments`, "documents");
            const userDocumentsSnap = await getDoc(userDocumentsRef);
            if (!userDocumentsSnap.exists()) {
              batch.set(userDocumentsRef, {});
              isNewUser = true;
            }

            if (isNewUser) {
              await batch.commit(); // Commit only if new data is created
              setWaitText("Status: User logged in and account created");
              setTimeout(() => {
                setIsLoading(true);
                setWaitText("Redirecting to next page ")
                setTimeout(() => {
                  window.location.href = "/onboard";
                },1500)
              }, 1000)
            } else {
              setWaitText("Status: User logged in and account found");
              setTimeout(()=> {
                setIsLoading(true);
                setWaitText("Redirecting to home page ")
                setTimeout(() => {
                  window.location.href = "/home";
                },1500)
              })
            }
          }
        } catch (error) {
          console.error(`${error}`);
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