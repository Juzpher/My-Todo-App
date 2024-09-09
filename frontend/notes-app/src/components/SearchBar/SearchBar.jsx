import React, { useId } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, onSearch, onClearSearch }) => {
  const uniqueId = useId();
  const searchInputId = `search-input-${uniqueId}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-80 flex items-center px-4 bg-secondary-default dark:bg-secondary-dark rounded-md"
    >
      <input
        id={searchInputId}
        type="text"
        placeholder="Search Notes"
        className="outline-none w-full text-xs bg-transparent py-[11px] text-text-default dark:text-text-dark"
        value={value || ""}
        onChange={onChange}
      />
      {value && (
        <button
          type="button"
          onClick={onClearSearch}
          className="bg-transparent border-none p-0 cursor-pointer"
          aria-label="Clear search"
        >
          <IoMdClose className="text-text-default dark:text-text-dark hover:text-accent-default text-xl mr-3" />
        </button>
      )}
      <button
        type="submit"
        className="bg-transparent border-none p-0 cursor-pointer"
        aria-label="Search"
      >
        <FaMagnifyingGlass className="hover:text-accent-default text-text-default dark:text-text-dark dark:hover:text-accent-dark" />
      </button>
    </form>
  );
};

export default SearchBar;
