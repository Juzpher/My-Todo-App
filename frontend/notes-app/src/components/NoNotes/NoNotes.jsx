import React from "react";

const NoNotes = ({ message, imgSrc }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={imgSrc} alt="No notes" className="w-60" />

      <p className="text-text-default/70 dark:text-text-dark/70 w-1/2 text-sm font-medium text-center mt-5">
        {message}
      </p>
    </div>
  );
};

export default NoNotes;
