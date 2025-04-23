import { useTheme } from "../context/ThemeContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import secureIcon from '../images/secure.png';
import { 
  RiLockLine, 
  RiCheckLine, 
  RiMenuLine, 
  RiCloseLine, 
  RiDeleteBin6Line, 
  RiShareLine, 
  RiShareForwardLine 
} from "react-icons/ri";
import { use } from "react";

const HomePage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [files, setFiles] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileId, setFileId] = useState(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState(null);
  const navigate = useNavigate();

  // Fetch files on page load
  useEffect(() => {
    axios
      .get("http://localhost:5050/api/files", { withCredentials: true })
      .then((response) => {
        setFiles(response.data);
        setSortedFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        navigate("http://localhost:5050/login");
      });
  }, [navigate]);


  useEffect(() => {
    // fetch the sahred files
    const fetchSharedFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/shared-files");
        setSharedFiles(response.data);
      }catch (error) {
        console.error("Error fetching shared files:", error);
      }
    };
    fetchSharedFiles();
  }, []);


  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/current-user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5050/api/logout", { withCredentials: true });
      if (response.data === "Logged out") {
        navigate("/login");
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error.response?.data || "Logout failed");
    }
  };

  const handleDeleteFileConfirmation = (fileId) => {
    setDeleteFileId(fileId); // Store the fileId for the file to be deleted
    setShowDeletePopup(true); // Show the confirmation pop-up
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5050/api/files/${fileId}`, { withCredentials: true });
      setFiles(files.filter(file => file._id !== fileId));
      setSortedFiles(sortedFiles.filter(file => file._id !== fileId));
      setShowDeletePopup(false)
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleVerifyPasscode = async () => {
    try {
      const response = await axios.post("http://localhost:5050/api/verifyPasscode", {
        fileId,
        passcode,
      });
      if (response.data.success) {
        setShowPopup(false);
        navigate(`/view/${fileId}`);
      } else {
        setErrorMessage("Wrong passcode. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error verifying passcode. Please try again.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/users", { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleShareFile = async () => {
    if (!selectedUser) {
      alert("Please select a user to share with.");
      return;
    }
    try {
      const response = await axios.post(
        "/api/shareFile", 
        { fileId, email: selectedUser, senderEmail: currentUser?.email }, 
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("File shared successfully!");
        setShowSharePopup(false);
      } else {
        alert("Failed to share file. Try again.");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      alert("Error occurred while sharing the file.");
    }
  };

  return (
    <main
      className={`w-full min-h-screen ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"} font-['Helvetica'] p-4 sm:p-6 overflow-y-auto`}
    >
      <nav className="flex justify-between py-2 sm:py-4 items-center sm:px-6 px-4 relative">
      <div className="flex items-center space-x-2">
  <img src={secureIcon} alt="icon" className="h-6 w-6" />
  <h3 className="text-xl sm:text-xl font-semibold tracking-tight">Secure-NoteBook</h3>
</div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-xl sm:text-2xl sm:hidden hover:scale-110 transition-transform duration-300"
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
        <div
          className={`absolute top-0 left-0 w-3/4 h-screen bg-gray-800 sm:hidden transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50 ease-in-out`}
        >
          <div className="flex flex-col items-center justify-center space-y-4 mt-24">
            <Link to="/Home" className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/create" className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              Create
            </Link>
            <button onClick={handleLogout} className="text-white text-lg font-medium hover:text-red-400 transition-colors duration-300">
              Logout
            </button>
          </div>
        </div>
        <div className="hidden sm:flex gap-4 items-center">
          <Link className="text-sm sm:text-lg font-medium hover:text-blue-500 transition-colors duration-300" to="/Home">
            Home
          </Link>
          <Link className="text-sm sm:text-lg font-medium hover:text-blue-500 transition-colors duration-300" to="/create">
            Create
          </Link>
        </div>
        <div className="flex gap-3 sm:gap-4 items-center">
          <button onClick={toggleTheme} className="text-lg sm:text-2xl hover:rotate-180 transition-transform duration-500">
            {isDark ? "🌙" : "☀️"}
          </button>
          <button onClick={handleLogout} className="text-lg sm:text-2xl hover:text-red-400 transition-colors duration-300" title="Logout">
            <i className="ri-logout-box-line"></i>
          </button>
        </div>
      </nav>

      <div className="p-4 sm:p-6">
  {/* Header Section */}
  <div className="border-b-4 border-yellow-500 mb-6">
    <h1 className="text-2xl sm:text-xl text-grey-300 pb-2">Shared Files</h1>
  </div>

  {/* Shared Files Content */}
  {sharedFiles.length === 0 ? (
    <p className="text-gray-500 text-center text-sm sm:text-lg">
      No shared files available.
    </p>
  ) : (
    <div className="bg-gray-100 rounded-lg shadow-md">
      {/* Scrollable List Container */}
      <ul
        className="divide-y divide-gray-300 overflow-y-auto"
        style={{ maxHeight: "200px" }} // Adjust height to fit 3 rows
      >
        {sharedFiles.map((file) => {
          const remainingTime = (expiry) => {
            const diff = new Date(expiry) - new Date();
            if (diff <= 0) return "Expired";
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 0) return `${hours}h ${minutes}m remaining`;
            if (minutes > 0) return `${minutes}m ${seconds}s remaining`;
            return `${seconds}s remaining`;
          };

          return (
            <li
              key={file._id}
              className="flex items-center justify-between p-4 hover:bg-gray-200 transition-colors duration-300"
            >
              {/* File Details */}
              <div className="flex items-center space-x-4 flex-grow">
                {/* File Name */}
                <span className="text-black text-sm sm:text-lg font-semibold">
                  {file.fileName}
                </span>

                {/* Sender Email */}
                <span className="text-gray-500 text-xs sm:text-sm">
                  Sent by: <span className="text-blue-500">{file.email}</span>
                </span>
              </div>

              {/* Expiry and Actions */}
              <div className="flex items-center space-x-4 flex-none">
                {/* Remaining Time */}
                {file.expiry && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {remainingTime(file.expiry)}
                  </span>
                )}

                {/* View Button */}
                <button
                  onClick={() => navigate(`/sharedView/${file._id}`)}
                  className="text-blue-500 hover:underline hover:scale-105 transition-transform duration-300 text-sm sm:text-lg"
                >
                  View
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  )}

  {/* Horizontal Line Separator */}
  <hr className="mt-6 border-t-2 border-gray-300" />
</div>






      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sortedFiles.length > 0 ? (
          sortedFiles.map((file) => (
            <div key={file._id} className="bg-gray-100 text-black p-4 sm:p-6 rounded-lg shadow-md hover:bg-gray-400 hover:shadow-lg hover:scale-105 transition-all duration-300 transform w-full relative">
              <button
                onClick={() => handleDeleteFileConfirmation(file._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:scale-110 transition-transform duration-300"
              >
                <RiDeleteBin6Line className="text-xl" />
              </button>

              <div className="flex justify-between items-center mb-2">
                <span className={`${file.encrypted ? "bg-blue-500" : "bg-green-500"} text-white px-2 py-1 rounded-lg flex items-center text-xs sm:text-sm`}>
                  {file.encrypted ? (
                    <>
                      <RiLockLine className="mr-1 text-sm sm:text-base" />
                      Encrypted
                    </>
                  ) : (
                    <>
                      <RiCheckLine className="mr-1 text-sm sm:text-base" />
                      Available
                    </>
                  )}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">{file.createdAt}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">{file.fileName}</h2>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    if (file.encrypted) {
                      setFileId(file._id);
                      setShowPopup(true);
                    } else {
                      navigate(`/view/${file._id}`);
                    }
                  }}
                  className="text-blue-500 hover:underline hover:scale-105 transition-transform duration-300 text-sm sm:text-lg"
                >
                  View
                </button>
                {file.shareable && (
                  <button
                    onClick={() => {
                      setFileId(file._id);
                      fetchUsers();
                      setShowSharePopup(true);
                    }}
                    className="text-blue-500 hover:underline hover:scale-105 transition-transform duration-300 text-sm sm:text-lg"
                  >
                    Share
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-gray-500 text-center text-sm sm:text-xl mt-8">
            Currently nothing to show, create files to see them here.
          </h3>
        )}
      </div>

      {showSharePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3">
      <h2 className="text-xl font-semibold mb-4 text-black">Share File</h2>
      <select
        className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select a user</option>
        {users
          .filter((user) => user._id !== currentUser._id) // Exclude the current user
          .map((user) => (
            <option key={user._id} value={user.email}>
              {user.email}
            </option>
          ))}
      </select>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowSharePopup(false)}
          className="bg-gray-500 text-black px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleShareFile}
          className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-colors duration-300"
        >
          Share
        </button>
      </div>
    </div>
  </div>
)}

{showPopup && (
      <div className={`fixed inset-0 ${isDark ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'} flex justify-center items-center z-50`}>
        <div className={`rounded-lg shadow-lg p-6 w-80 ${isDark ? 'bg-white text-black' : 'bg-white text-black'}`}>
          <h2 className="text-lg font-semibold mb-4">Enter Passcode</h2>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
          )}
          <div className="flex justify-between">
            <button
              onClick={handleVerifyPasscode} // Use the stored fileId
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Verify
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation Pop-up */}
{showDeletePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold mb-4 text-black">Are you sure you want to delete this file?</h2>
      <div className="flex justify-between">
        <button
          onClick={() => {
            deleteFile(deleteFileId); // Proceed with file deletion
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => setShowDeletePopup(false)} // Close the pop-up without deleting
          className="ml-2 bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
};

export default HomePage;