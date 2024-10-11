import React from "react";

const LazyCard = () => {
  return (
    <div className="relative bg-white dark:bg-primary-dark rounded-lg shadow-custom w-full h-56 overflow-hidden animate-pulse">
      {/* Urgency indicator as a subtle top border */}

      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>

      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>{" "}
              {/* Added rectangle for loading text */}
            </div>
            <div className="animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
          </div>

          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <div className="animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
          <div className="animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
        </div>
      </div>
    </div>
  );
};

export default LazyCard;
