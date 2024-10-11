import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import SearchBar from "../SearchBar/SearchBar";
import ProfileInfo from "../Cards/ProfileInfo";
import ThemeToggle from "../themeToggle/themeToggle";
import Logo from "../../assets/LogoPng.png";

const Navbar = ({ userInfo, onSearchNote, imageLogo }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = () => {
    onSearchNote(searchQuery);
    setIsSidebarOpen(false);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    onSearchNote("");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-primary-default dark:bg-primary-dark shadow-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={Logo} alt="logo" className="h-8 w-8 mr-2" />
            <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
              TaskFlow
            </h2>
          </div>
          {userInfo ? ( // Conditional rendering based on userInfo
            <>
              <div className="hidden md:block">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                  onClearSearch={onClearSearch}
                />
              </div>
              <div className="hidden md:flex items-center">
                <ProfileInfo onLogout={onLogout} userInfo={userInfo} />
                <ThemeToggle />
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center">
              <ThemeToggle />
            </div>
          )}
          {userInfo && ( // Show mobile menu button only if user is logged in
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="text-text-light dark:text-text-dark hover:text-accent-default dark:hover:text-accent-dark focus:outline-none"
              >
                <MdMenu className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for mobile */}
      {userInfo && ( // Only render sidebar if user is logged in
        <div
          className={`fixed inset-y-0 right-0 w-82 bg-primary-default dark:bg-primary-dark shadow-lg transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden z-20`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Menu
              </h2>
              <button
                onClick={toggleSidebar}
                className="text-text-light dark:text-text-dark hover:text-accent-default dark:hover:text-accent-dark focus:outline-none"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>
            {userInfo && ( // Show search bar in sidebar only if user is logged in
              <div className="mb-6">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                  onClearSearch={onClearSearch}
                />
              </div>
            )}
            <div className="flex items-center justify-between p-4 border-b border-secondary-default dark:border-secondary-dark">
              {userInfo && (
                <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
              )}{" "}
              {/* Show ProfileInfo only if user is logged in */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isSidebarOpen &&
        userInfo && ( // Only show overlay if sidebar is open and user is logged in
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
    </nav>
  );
};

export default Navbar;
