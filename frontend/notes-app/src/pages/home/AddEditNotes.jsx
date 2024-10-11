import React, { useState, useEffect } from "react";
import TagInput from "../../components/Input/TagInput.jsx";
import { MdClose } from "react-icons/md";
import InputError from "../../components/PopUps/inputError.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import Spinner from "../../components/Spinner/Spinner.jsx";

const AddEditNotes = ({ onClose, data, type, getAllNotes, showToastMsg }) => {
  const [activeButton, setActiveButton] = useState("");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [urgency, setUrgency] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    if (type === "edit" && data) {
      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags || []);
      setUrgency(data.urgency);
      setActiveButton(data.urgency);
    }
  }, [type, data]);

  const handleActive = (value) => {
    setActiveButton(value);
    setUrgency(value);
  };

  const handleAddNote = async () => {
    if (!title) {
      setError("Please enter your title");
      return;
    }
    if (!content) {
      setError("Please enter your content");
      return;
    }
    if (!urgency) {
      setError("Please select the level of urgency");
      return;
    }
    setError("");
    setLoading(true); // Set loading to true

    try {
      let response;
      if (type === "add") {
        response = await axiosInstance.post("/add-note", {
          title,
          content,
          tags,
          urgency,
        });
        showToastMsg("Note added successfully", "add");
      } else if (type === "edit") {
        response = await axiosInstance.put(`/edit-note/${data._id}`, {
          title,
          content,
          tags,
          urgency,
        });
        showToastMsg("Note updated successfully", "edit");
      }

      // Update the notes immediately
      if (response && response.data && response.data.note) {
        await getAllNotes(); // Refresh all notes
      }

      // Close the modal
      onClose();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        showToastMsg(error.response.data.message, "error");
      } else {
        console.log("An unexpected error occurred.");
        showToastMsg("An unexpected error occurred", "error");
      }
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="relative bg-primary-default dark:bg-primary-dark rounded-lg shadow-shadow-default dark:shadow-shadow-dark p-5 max-w-xl mx-auto max-h-[90vh] overflow-y-auto">
      {error && <InputError error={error} setError={setError} />}
      <button
        className="absolute top-3 right-3 text-secondary-default hover:text-text-default dark:text-secondary-dark dark:hover:text-text-dark transition-colors duration-200"
        onClick={onClose}
      >
        <MdClose className="text-xl text-text-default dark:text-text-dark" />
      </button>

      <h2 className="text-xl font-semibold mb-4 text-text-default dark:text-text-dark">
        {type === "add" ? "Add New Note" : "Edit Note"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-default dark:text-text-dark mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter title"
            className="w-full px-3 py-2 text-sm text-text-default dark:text-text-dark bg-secondary-default dark:bg-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-accent-default dark:focus:ring-accent-dark transition-all duration-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-default dark:text-text-dark mb-1">
            Content
          </label>
          <textarea
            placeholder="Enter content"
            className="w-full px-3 py-2 text-sm text-text-default dark:text-text-dark bg-secondary-default dark:bg-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-accent-default dark:focus:ring-accent-dark transition-all duration-200"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-default dark:text-text-dark mb-2">
            Urgency
          </label>
          <div className="flex gap-2 justify-evenly">
            {["Less Urgent", "Urgent", "Very Urgent"].map((level) => (
              <button
                key={level}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full ${
                  activeButton === level
                    ? ` text-text-dark ${
                        level === "Less Urgent"
                          ? "bg-success-default dark:bg-success-dark "
                          : level === "Urgent"
                          ? "bg-warning-default dark:bg-warning-dark"
                          : "bg-critical-default dark:bg-critical-dark "
                      }`
                    : "bg-secondary-default dark:bg-secondary-dark text-text-default dark:text-text-dark hover:bg-secondary-effects/50 dark:hover:bg-secondary-effects/50"
                }`}
                onClick={() => handleActive(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-default dark:text-text-dark mb-1">
            Tags
          </label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        <button
          className="w-full bg-accent-default hover:bg-accent-effects dark:bg-accent-dark dark:hover:bg-accent-effects text-text-dark font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm flex items-center justify-center" // Added flex and justify-center
          onClick={handleAddNote}
          disabled={loading} // Disable button while loading
        >
          {loading ? ( // Show loading state
            <span className="flex items-center">
              <Spinner />
            </span>
          ) : type === "add" ? (
            "Add Note"
          ) : (
            "Update Note"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
