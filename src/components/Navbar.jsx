import { BsThreeDotsVertical } from "react-icons/bs";
import { GiTalk } from "react-icons/gi";
import { TiMessages } from "react-icons/ti";
import { IoMdArchive, IoMdSettings } from "react-icons/io";
import { FcInvite } from "react-icons/fc";
import { useEffect, useState } from 'react';
import { RiProfileLine } from "react-icons/ri";
import { SiGnuprivacyguard, SiAltiumdesigner } from "react-icons/si";
import { IoIosHelpCircle } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { handleSignOut } from '../util/FirebaseHelper.jsx';
import { FaPlus, FaUserPlus } from 'react-icons/fa';
import { MdDarkMode } from "react-icons/md";
import { FaSun } from "react-icons/fa";
import { CgDarkMode } from "react-icons/cg";
import { FaAffiliatetheme } from "react-icons/fa6";
import { GrRadialSelected } from "react-icons/gr";

export const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'black');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
              <BsThreeDotsVertical className="w-6 h-6" />
            </div>
            <ul
              tabIndex={0}
              className="menu rounded-lg flex flex-col gap-3 menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <div className="dropdown dropdown-end">
                <li tabIndex={0}>
                  <a><FaAffiliatetheme /> Theme</a>
                </li>
                <ul
                  tabIndex={0}
                  className="menu rounded-lg flex flex-col gap-3 menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li onClick={() => setTheme('dark')}>
                    <a><CgDarkMode /> Dark</a>
                  </li>
                  <li onClick={() => setTheme('light')}>
                    <a><FaSun /> Light</a>
                  </li>
                  <li onClick={() => setTheme('black')}>
                    <a><MdDarkMode /> Default (Black)</a>
                  </li>
                </ul>
              </div>
              <hr />
              <li>
                <a><FaPlus /> New Group</a>
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
              <div className="w-8 rounded-full">
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
