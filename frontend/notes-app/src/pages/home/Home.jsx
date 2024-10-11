import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes.jsx";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import axiosInstance from "../../utils/axiosInstance.js";
import moment from "moment";
import Toast from "../../components/ToastMessage/Toast.jsx";
import NoNotes from "../../components/NoNotes/NoNotes.jsx";
import addNote from "../../assets/AddNotes.png";
import emptyNote from "../../assets/NoNote.png";
import { motion } from "framer-motion"; // Import motion from framer-motion
import LazyCard from "../../components/Lazy/Card/LazyCard.jsx";

ReactModal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Define loading state
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const [isSearch, setIsSearch] = useState(false);

  // Get user Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all notes API
  const getAllNotes = async () => {
    setIsLoading(true); // Set loading to true
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && Array.isArray(response.data.notes)) {
        // Sort notes: pinned notes first, then by creation date (newest first)
        const sortedNotes = response.data.notes.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.createdOn) - new Date(a.createdOn);
          }
          return b.isPinned ? 1 : -1;
        });
        setAllNotes(sortedNotes);
      }
      setIsSearch(false);
    } catch (error) {
      console.log("An unexpected error occurred. Please try again later.");
      displayToastMsg("Failed to fetch notes. Please try again.", "error");
    } finally {
      setIsLoading(false); // Set loading to false after the request completes
    }
  };

  // Search for Notes
  const onSearchNote = async (query) => {
    console.log("onSearchNote called with query:", query);
    try {
      if (query.trim() === "") {
        // If the search query is empty, fetch all notes
        await getAllNotes();
        setIsSearch(false);
      } else {
        setIsSearch(true);
        const response = await axiosInstance.get("/search-note", {
          params: { query },
        });
        console.log("Search API response:", response.data);
        if (response.data && Array.isArray(response.data.matchingNotes)) {
          // Sort matching notes: pinned notes first, then by creation date
          const sortedNotes = response.data.matchingNotes.sort((a, b) => {
            if (a.isPinned === b.isPinned) {
              return new Date(b.createdOn) - new Date(a.createdOn);
            }
            return b.isPinned ? 1 : -1;
          });
          setAllNotes(sortedNotes);
        } else {
          // If no matching notes, set allNotes to an empty array
          setAllNotes([]);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
      displayToastMsg("Search failed. Please try again.", "error");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  const handleAddEditClose = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  const handleAddEditSuccess = async () => {
    await getAllNotes(); // Refresh notes
    handleAddEditClose(); // Close modal
  };

  // Renamed this function to displayToastMsg
  const displayToastMsg = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const updateIsPinned = async (noteId, currentPinStatus) => {
    try {
      const response = await axiosInstance.post(`/pin-note/${noteId}`, {
        isPinned: !currentPinStatus,
      });
      if (response.data && !response.data.error) {
        getAllNotes(); // Refresh notes after updating isPinned
        displayToastMsg(response.data.message);
      }
    } catch (error) {
      console.log("Failed to pin/unpin note. Please try again later.");
      displayToastMsg("Failed to pin/unpin note. Please try again.");
    }
  };

  // Define animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // Stagger the children by 0.2 seconds
      },
    },
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} />
      <div className="container mx-auto max-h-full my-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            // Show LazyCard while loading, matching the number of notes
            Array.from({ length: allNotes.length || 0 }).map((_, index) => (
              <LazyCard key={index} />
            ))
          ) : allNotes.length > 0 ? (
            allNotes.map((item) => (
              <motion.div
                key={item._id}
                variants={cardVariants} // Use the defined variants
              >
                <NoteCard
                  title={item.title}
                  date={moment(item.createdOn).format("Do MMM YYYY")}
                  content={item.content}
                  tags={item.tags} // Join tags with comma for display
                  urgency={item.urgency}
                  isPinned={item.isPinned}
                  onEdit={() => {
                    setOpenAddEditModal({
                      isShown: true,
                      type: "edit",
                      data: item,
                    });
                  }}
                  onDelete={async () => {
                    try {
                      await axiosInstance.delete(`/delete-note/${item._id}`);
                      getAllNotes(); // Refresh notes after deleting
                      displayToastMsg("Note deleted successfully");
                      setShowToastMsg({
                        isShown: true,
                        message: "Note deleted successfully",
                        type: "delete",
                      });
                    } catch (error) {
                      console.log(
                        "Failed to delete note. Please try again later."
                      );
                      displayToastMsg(
                        "Failed to delete note. Please try again."
                      );
                    }
                  }}
                  onPinNote={() => updateIsPinned(item._id, item.isPinned)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3">
              <NoNotes
                imgSrc={isSearch ? emptyNote : addNote}
                message={
                  isSearch
                    ? "No notes found. Please try a different search."
                    : "Start adding your notes by clicking the button below."
                }
              />
            </div>
          )}
        </motion.div>
      </div>
      <button
        className="w-12 h-12 rounded-full flex justify-center items-center fixed bottom-10 right-10 bg-accent-default dark:bg-accent-dark hover:bg-accent-default/50 dark:hover:bg-accent-dark/50 hover:scale-105 transition-all ease-in-out"
        onClick={() =>
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          })
        }
      >
        <MdAdd className="text-3xl text-text-dark" />
      </button>

      <ReactModal
        className="bg-primary-default dark:bg-primary-dark w-[90%] sm:w-[450px] rounded-md mx-auto my-auto p-5 overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        isOpen={openAddEditModal.isShown}
        onRequestClose={handleAddEditClose}
        contentLabel=""
      >
        <AddEditNotes
          type={openAddEditModal.type}
          data={openAddEditModal.data}
          onClose={handleAddEditSuccess}
          getAllNotes={getAllNotes}
          showToastMsg={displayToastMsg}
        />
      </ReactModal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
