import React, { useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

//This is just a comment
const Toast = ({ isShown, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isShown) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Delay the onClose call to allow for fade-out
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isShown, onClose]);

  if (!isShown && !isVisible) return null;

  return (
    <div
      className={`fixed top-20 right-5 transition-all duration-300 ease-in-out z-50 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      <div
        className={`min-w-5 shadow-custom rounded-md overflow-hidden relative`}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            type === "delete"
              ? "bg-critical-default dark:bg-critical-dark"
              : "bg-success-default dark:bg-success-dark"
          }`}
        ></div>
        <div className="flex items-center gap-3 py-2 px-4 rounded-lg bg-white dark:bg-primary-dark shadow-md">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete"
                ? "bg-critical-default dark:bg-critical-dark"
                : "bg-success-default dark:bg-success-dark"
            }`}
          >
            {type === "delete" ? (
              <MdDelete className="text-xl text-white" />
            ) : (
              <LuCheck className="text-xl text-white" />
            )}
          </div>
          <p className="text-sm text-text-default dark:text-text-dark">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
