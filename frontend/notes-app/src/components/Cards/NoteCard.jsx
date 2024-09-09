import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  urgency,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="relative bg-white dark:bg-primary-dark rounded-lg custom-transition shadow-custom hover:shadow-xl transition-all duration-300 ease-in-out w-full overflow-hidden">
      {/* Urgency indicator as a subtle top border */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          urgency === "Very Urgent"
            ? "bg-critical-default dark:bg-critical-dark"
            : urgency === "Urgent"
            ? "bg-warning-default dark:bg-warning-dark"
            : "bg-success-default dark:bg-success-dark"
        }`}
      ></div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h6 className="font-semibold text-xl text-text-default dark:text-text-dark">
              {title.length > 25 ? `${title.slice(0, 25)}...` : title}
            </h6>
            <span className="text-xs text-secondary-dark dark:text-secondary-default">
              {date}
            </span>
          </div>
          <MdOutlinePushPin
            onClick={onPinNote}
            className={`text-2xl cursor-pointer transition-colors duration-200 ${
              isPinned
                ? "text-info-default dark:text-info-dark"
                : "text-secondary-default dark:text-secondary-dark hover:text-text-default dark:hover:text-text-dark"
            }`}
          />
        </div>

        <p className="text-sm text-text-default/80 dark:text-text-dark/80 mb-4 overflow-hidden">
          {content.length > 30 ? `${content.slice(0, 40)}...` : content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-secondary-default dark:bg-secondary-dark text-text-default dark:text-text-dark px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))
          ) : (
            <br />
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-secondary-default dark:bg-secondary-dark hover:bg-info-default dark:hover:bg-info-dark transition-colors duration-200"
          >
            <MdCreate className="text-text-default dark:text-text-dark" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-secondary-default dark:bg-secondary-dark hover:bg-critical-default dark:hover:bg-critical-dark transition-colors duration-200"
          >
            <MdDelete className="text-text-default dark:text-text-dark" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
