import { BsThreeDotsVertical } from "react-icons/bs";
import { GiTalk } from "react-icons/gi";
import { TiMessages } from "react-icons/ti";
import { IoMdArchive, IoMdSettings } from "react-icons/io";
import { FcInvite } from "react-icons/fc";
import { useEffect, useState } from "react";
import { RiProfileLine } from "react-icons/ri";
import { SiGnuprivacyguard, SiAltiumdesigner } from "react-icons/si";
import { IoIosHelpCircle } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { handleSignOut } from "../util/FirebaseHelper.jsx";
import { FaPlus, FaUserPlus } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { FaSun } from "react-icons/fa";
import { CgDarkMode } from "react-icons/cg";
import { FaAffiliatetheme } from "react-icons/fa6";
import { GrRadialSelected } from "react-icons/gr";
import { Dialog } from "../components/Dialog.jsx";
import {
  getUserInfoRef,
  listenToAuthChanges,
} from "../util/FirebaseHelper.jsx";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  onSnapshot
} from "../constend/firebase";
import { FaCodePullRequest } from "react-icons/fa6";

export const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "black");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState([]);
  const [hasFriendRequests, setHasFriendRequests] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const listenForFriendRequests = () => {
      listenToAuthChanges((user) => {
        if (user) {
          const friendReqCollection = collection(
            db,
            `registred-users/${user.uid}/friendRequests`
          );

          // Real-time listener
          unsubscribe = onSnapshot(friendReqCollection, (snapshot) => {
            const requests = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFriendRequests(requests);
            setHasFriendRequests(requests.length > 0);
          });
        }
      });
    };

    listenForFriendRequests();

    // Cleanup the listener when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe;

    const fetchFriendRequests = () => {
      listenToAuthChanges((user) => {
        if (user) {
          const friendReqCollection = collection(
            db,
            `registred-users/${user.uid}/friendRequests`
          );

          // Real-time listener
          unsubscribe = onSnapshot(friendReqCollection, (snapshot) => {
            const requests = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFriendRequests(requests);
            setHasFriendRequests(requests.length > 0);
          });
        }
      });
    };

    fetchFriendRequests();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAcceptRequest = async (requestId, senderId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userFriendsRef = doc(db, `registred-users/${user.uid}/userFriends`, "friends");
        const senderFriendsRef = doc(db, `registred-users/${senderId}/userFriends`, "friends");

        // Get sender info
        const senderInfoRef = doc(db, `registred-users/${senderId}/user_info/info`);
        const senderInfoSnap = await getDoc(senderInfoRef);
        const senderInfo = senderInfoSnap.data();

        // Get receiver info (current user)
        const receiverInfoRef = doc(db, `registred-users/${user.uid}/user_info/info`);
        const receiverInfoSnap = await getDoc(receiverInfoRef);
        const receiverInfo = receiverInfoSnap.data();

        if (senderInfo && receiverInfo) {
          // Update receiver's friend list
          await updateDoc(userFriendsRef, {
            friends: arrayUnion({
              id: senderId,
              name: senderInfo.username || "Unknown",
              profileImage: senderInfo.profile_picture || "",
              status: 'accepted',
              addedAt: new Date(),
            }),
          });

          // Update sender's friend list
          await updateDoc(senderFriendsRef, {
            friends: arrayUnion({
              id: user.uid,
              name: receiverInfo.username || "Unknown",
              profileImage: receiverInfo.profile_picture || "",
              status: 'accepted',
              addedAt: new Date(),
            }),
          });

          // Delete the friend request
          await deleteDoc(doc(db, `registred-users/${user.uid}/friendRequests`, requestId));

          // Update state to reflect changes
          setFriendRequests((prev) => prev.filter((request) => request.id !== requestId));
          setHasFriendRequests(friendRequests.length - 1 > 0);
        }
      }
    } catch (error) {
      console.log(`Error accepting friend request: ${error}`);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, `registred-users/${user.uid}/friendRequests`, requestId));
        setFriendRequests((prev) => prev.filter((request) => request.id !== requestId));
        setHasFriendRequests(friendRequests.length - 1 > 0);
      }
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };
  
  useEffect(() => {
    const unsubscribe = listenToAuthChanges((user) => {
      if (user) {
        setIsLoading(true);
        const userUid = user.uid;

        getUserInfoRef(userUid, (userInfo) => {
          if (userInfo) {
            const { profile_picture } = userInfo;
            if (profile_picture) {
              setProfileImage(profile_picture);
            }
          }
          setIsLoading(false);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <h3 className="font-bold text-lg">Add Friend</h3>
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter user UID"
              className="input input-bordered w-full"
              id="searchInput"
            />
            <button
              className="btn btn-primary"
              onClick={async () => {
                const uid = document.getElementById("searchInput").value;
                if (!uid) return;

                try {
                  const currentUser = auth.currentUser;
                  if (!currentUser) throw new Error("Not authenticated");

                  if (uid === currentUser.uid) {
                    document.getElementById("searchResult").innerHTML = `
                      <div class="alert alert-warning mt-2">
                        You can't send a friend request to yourself!
                      </div>
                    `;
                    return;
                  }

                  const userInfoRef = doc(db, `registred-users/${uid}/user_info/info`);
                  const userInfoSnap = await getDoc(userInfoRef);

                  if (userInfoSnap.exists()) {
                    const userData = userInfoSnap.data();

                    // Check if already friends
                    const userFriendsRef = doc(db, `registred-users/${currentUser.uid}/userFriends`, "friends");
                    const userFriendsSnap = await getDoc(userFriendsRef);
                    const userFriends = userFriendsSnap.exists() ? userFriendsSnap.data().friends || [] : [];

                    const isAlreadyFriend = userFriends.some(friend => friend.id === uid);

                    document.getElementById("searchResult").innerHTML = `
                      <div class="flex items-center gap-4 bg-base-200 p-4 rounded-lg">
                        <div class="avatar">
                          <div class="w-16 rounded-full">
                            <img src="${userData.profile_picture || "https://via.placeholder.com/150"}" alt="User" />
                          </div>
                        </div>
                        <div class="flex-1">
                          <h3 class="font-bold">${userData.username}</h3>
                          <p class="text-sm">${userData.bio || "No bio"}</p>
                          ${
                            isAlreadyFriend
                              ? `<span class="badge badge-success mt-2">Already Friend</span>`
                              : `<button class="btn btn-primary btn-sm mt-2" id="sendRequestBtn">
                                  Send Friend Request
                                </button>`
                          }
                        </div>
                      </div>
                    `;

                    if (!isAlreadyFriend) {
                      document
                        .getElementById("sendRequestBtn")
                        .addEventListener("click", async () => {
                          try {
                            const userInfoRef = doc(db, `registred-users/${currentUser.uid}/user_info/info`);
                            const currentUserInfoSnap = await getDoc(userInfoRef);

                            if (currentUserInfoSnap.exists()) {
                              const currentUserData = currentUserInfoSnap.data();

                              const requestId = `${currentUser.uid}_${new Date().getTime()}`;
                              const friendReqRef = doc(
                                db,
                                `registred-users/${uid}/friendRequests/${requestId}`
                              );

                              await setDoc(friendReqRef, {
                                senderId: currentUser.uid,
                                senderName: currentUserData.username, // Fix: Use current user's info
                                senderProfileImage: currentUserData.profile_picture, // Fix: Use current user's profile picture
                                status: "pending",
                                timestamp: new Date().toISOString(),
                                receiverId: uid,
                              });

                              document.getElementById("searchResult").innerHTML += `
                                <div class='alert alert-success mt-2 rounded'>
                                  Friend request sent successfully!
                                </div>
                              `;
                            } else {
                              console.error("Current user info not found");
                            }
                          } catch (error) {
                            console.error("Error sending friend request:", error);
                            document.getElementById("searchResult").innerHTML += `
                              <div class='alert alert-error mt-2'>
                                Failed to send friend request !
                              </div>
                            `;
                          }
                        });
                    }
                  } else {
                    document.getElementById("searchResult").innerHTML = `
                      <div class="alert alert-error text-white rounded">
                        User not found !
                      </div>
                    `;
                  }
                } catch (error) {
                  console.error("Error searching user:", error);
                  document.getElementById("searchResult").innerHTML = `
                    <div class="alert alert-error text-white rounded">
                      Error searching user
                    </div>
                  `;
                }
              }}
            >
              Search User
            </button>
            <div id="searchResult" className="mt-4"></div>
          </div>
        </div>
      </Dialog>

      <dialog id="friendReqModel" className="modal">
        <div className="modal-box bg-base-300 rounded-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {friendRequests.length > 0 ? (
            <div className="flex flex-col gap-4">
              {friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold">{request.senderName}</h3>
                    <div class="avatar">
                    <div class="w-24 rounded-xl">
                      <img src={request.senderProfileImage} alt="User" />
                    </div>
                    </div>
                    <p className="text-sm">Request from {request.senderId}</p>
                  </div>
                  <div className="flex gap-2 flex-col md:flex-row">
                    <button
                      className="btn btn-success rounded btn-sm"
                      onClick={() =>
                        handleAcceptRequest(request.id, request.senderId)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-error rounded text-white btn-sm"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4">No Friend Requests Found!</p>
          )}
        </div>
      </dialog>

      <div className="navbar bg-base-200 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl title-text">AD CONNECT</a>
        </div>
        <div className="flex flex-row gap-3 items-center">
          {/* Options Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <BsThreeDotsVertical className="w-6 h-6" />
            </div>
            <ul
              tabIndex={0}
              className="menu rounded-lg flex flex-col gap-3 menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <div className="dropdown dropdown-end">
                <li tabIndex={0}>
                  <a>
                    <FaAffiliatetheme /> Theme
                  </a>
                </li>
                <ul
                  tabIndex={0}
                  className="menu rounded-lg flex flex-col gap-3 menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li onClick={() => setTheme("dark")}>
                    <a>
                      <CgDarkMode /> Dark{" "}
                      {theme === "dark" && (
                        <GrRadialSelected className="inline ml-2" />
                      )}
                    </a>
                  </li>
                  <li onClick={() => setTheme("winter")}>
                    <a>
                      <FaSun /> Light{" "}
                      {theme === "winter" && (
                        <GrRadialSelected className="inline ml-2" />
                      )}
                    </a>
                  </li>
                  <li onClick={() => setTheme("black")}>
                    <a>
                      <MdDarkMode /> Default (Black){" "}
                      {theme === "black" && (
                        <GrRadialSelected className="inline ml-2" />
                      )}
                    </a>
                  </li>
                </ul>
              </div>
              <hr />
              <li>
                <a>
                  <FaPlus /> New Group
                </a>
              </li>
              <li>
                <a onClick={() => setIsDialogOpen(true)}>
                  <FaUserPlus /> Add Friend
                </a>
              </li>
              <li
                onClick={() =>
                  document.getElementById("friendReqModel").showModal()
                }
              >
                <a>
                  <FaCodePullRequest /> Friend Requests
                  {hasFriendRequests && (
                    <span className="badge badge-error badge-sm rounded text-[12px] text-white absolute top-1 right-1">
                      {friendRequests.length}
                    </span>
                  )}
                </a>
              </li>
              <li>
                <a>
                  <GiTalk /> Communications
                </a>
              </li>
              <hr />
              <li>
                <a>
                  <TiMessages /> Starred Messages
                </a>
              </li>
              <li>
                <a>
                  <IoMdArchive /> Archived Chats
                </a>
              </li>
              <li>
                <a>
                  <FcInvite /> Invite Friends
                </a>
              </li>
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              {isLoading ? (
                <div className="skeleton h-8 w-8 rounded-full"></div>
              ) : (
                <div className="w-8 rounded-full">
                  <img alt="avatar" src={profileImage} />
                </div>
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu flex flex-col gap-3 menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow rounded-lg"
            >
              <li>
                <a className="justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <RiProfileLine />
                    Profile
                  </div>
                  <span className="badge rounded">New</span>
                </a>
              </li>
              <li>
                <a>
                  <IoMdSettings />
                  Settings
                </a>
              </li>
              <li>
                <a>
                  <SiGnuprivacyguard />
                  Privacy & Security
                </a>
              </li>
              <li>
                <a>
                  <IoIosHelpCircle />
                  Help & Support
                </a>
              </li>
              <li>
                <a>
                  <SiAltiumdesigner />
                  Appearance
                </a>
              </li>
              <li onClick={handleSignOut}>
                <a className="text-red-500">
                  <CiLogout />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
