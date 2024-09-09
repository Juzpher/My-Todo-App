import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-text-default font-bold bg-secondary-default">
        <h1>{getInitials(userInfo?.fullName)}</h1>
      </div>
      <div className="text-text-default dark:text-text-dark">
        <p className="text-sm font-medium">{userInfo?.fullName}</p>
        <button
          className="hover:text-accent-default text-sm underline"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
