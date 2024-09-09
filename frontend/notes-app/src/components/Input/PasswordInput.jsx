import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder = "Password" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const togglePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 mb-3 rounded border-secondary-default dark:border-secondary-dark">
      <input
        value={value}
        onChange={onChange} // Fixed the prop name here
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none text-text-default dark:text-text-dark"
      />
      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-accent-default dark:text-accent-dark hover:text-accent-light cursor-pointer"
          onClick={togglePassword}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-text-default dark:text-secondary-dark hover:text-accent-default cursor-pointer"
          onClick={togglePassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
