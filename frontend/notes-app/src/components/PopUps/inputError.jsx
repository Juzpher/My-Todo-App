import React, { useState, useEffect } from "react";

const InputError = ({ error, setError }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (error) {
      // Set fade out after 2.5 seconds
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);

      // Clear the error and reset fadeOut state after 3 seconds
      const fadeOutTimer = setTimeout(() => {
        setError(null);
        setFadeOut(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(fadeOutTimer);
      };
    }
  }, [error, setError]);

  if (!error) return null;

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 z-50 w-full flex justify-center">
      <p
        className={`bg-critical-default dark:bg-critical-dark text-text-dark text-center opacity-90 rounded-md px-4 py-2 text-sm w-auto transition-all ease-in-out ${
          fadeOut ? "animate-fade-out" : "animate-fade-in"
        }`}
      >
        {error}
      </p>
    </div>
  );
};

export default InputError;
