import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className="tag-list gap-2 flex overflow-x-auto">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="tag text-text-default dark:text-text-dark flex gap-2 text-sm bg-secondary-default dark:bg-secondary-dark px-2 py-1 rounded-md"
            >
              #{tag}
              <button
                className="remove-tag"
                onClick={() => handleRemoveTag(tag)}
              >
                <MdClose className="text-sm text-accent-default dark:text-accent-dark hover:text-accent-default/50 dark:hover:text-accent-dark/50" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          className="text-sm bg-transparent px-2 py-2 rounded outline-none text-text-default dark:text-text-dark border border-secondary-default dark:border-secondary-dark"
          placeholder="Add tags"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl text-accent-default dark:text-accent-dark hover:text-accent-default/50 dark:hover:text-accent-dark/50" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
