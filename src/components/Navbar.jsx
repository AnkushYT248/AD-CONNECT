import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import { GiTalk } from "react-icons/gi";
import { TiMessages } from "react-icons/ti";
import { IoMdArchive } from "react-icons/io";
import { FcInvite } from "react-icons/fc";
import { RiProfileLine } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { SiGnuprivacyguard } from "react-icons/si";
import { IoIosHelpCircle } from "react-icons/io";
import { SiAltiumdesigner } from "react-icons/si";
import { CiLogout } from "react-icons/ci";

export const Navbar = () => {
  return (
    <>
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
              <BsThreeDotsVertical className="w-[25px] h-[25px]" />
            </div>
            <ul
              tabIndex={0}
              className="menu rounded-lg flex flex-col gap-3 menu-base dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a><FaPlus />New Group</a>
              </li>
              <li>
                <a><FaUserPlus /> Add Friends</a>
              </li>
              <li>
                <a><GiTalk /> Communications</a>
              </li>
              <hr />
              <li>
                <a><TiMessages /> Starred Messages</a>
              </li>
              <li>
                <a><IoMdArchive /> Archived Chats</a>
              </li>
              <li>
                <a><FcInvite /> Invite Friends</a>
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
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
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
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a> 
                  <IoMdSettings />
                  Settings</a>
              </li>
              <li>
                <a>
                  <SiGnuprivacyguard />
                  Privacy & Security</a>
              </li>
              <li>
                <a>
                  <IoIosHelpCircle />
                  Help & Support</a>
              </li>
              <li>
                <a>
                  <SiAltiumdesigner />
                  Appearance</a>
              </li>
              <li onClick={handleSignOut}>
                <a className="text-red-500">
                  <CiLogout />
                  Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
