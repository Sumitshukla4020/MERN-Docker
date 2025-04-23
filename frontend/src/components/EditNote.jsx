import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [encryption, setEncryption] = useState(false);
  const [shareable, setShareable] = useState(false);
  const [passcode, setPasscode] = useState("");

  const navigate = useNavigate();
  const { fileId } = useParams(); // Extract the fileId from the URL params
  axios.defaults.withCredentials = true;

  // Fetch existing note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/notes/${fileId}`);
        const { fileName, content, encryption, shareable, passcode } = response.data;

        // Set the state with the fetched data
        setTitle(fileName);
        setContent(content);
        setEncryption(encryption);
        setShareable(shareable);
        setPasscode(passcode || "");
      } catch (error) {
        console.error("Error fetching the note:", error.response?.data || error.message);
        setMessage("Failed to load note data.");
      }
    };

    fetchNote();
  }, [fileId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setMessage("Title and Content are required.");
      return;
    }

    const updatedFileData = {
      fileName: title,
      content,
      encryption,
      shareable,
      passcode: encryption ? passcode : "",
    };

    try {
      // Send updated file data to backend
      const response = await axios.put(`http://localhost:5050/api/notes/${fileId}`, updatedFileData);

      const { message } = response.data;
      setMessage(message || "Updated Successfully");
      navigate("/Home");
    } catch (error) {
      console.error("Error updating the file:", error.response?.data || error.message);
      setMessage("An error occurred while updating the file.");
    }
  };

  return (
    <main className="w-full min-h-screen bg-zinc-100 font-['Helvetica'] flex flex-col">
      <nav className="flex px-10 justify-between py-5 bg-zinc-200 shadow-md">
        <h3 className="text-2xl tracking-tight">Secure-NoteBook</h3>
        <div className="navlinks flex gap-5">
          <Link className="tracking-tight" to="/Home">Home</Link>
          <Link className="tracking-tight" to="/create">Create</Link>
        </div>
      </nav>
      <div className="px-10 flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-md shadow-md">
          <h3 className="capitalize text-2xl font-medium mb-5 tracking-tight">
            Edit Note
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              className="text-md px-3 py-2 w-full mb-5 rounded-md bg-zinc-200"
              placeholder="Edit Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              name="content"
              className="block w-full px-3 py-2 resize-none bg-zinc-200 rounded-md min-h-[200px] mb-5"
              placeholder="Edit your note content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <div className="grid grid-cols-2 grid-rows-2 gap-4 items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={encryption}
                  onChange={() => setEncryption(!encryption)}
                  className="mr-2"
                />
                <label>Encryption</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={shareable}
                  onChange={() => setShareable(!shareable)}
                  className="mr-2"
                />
                <label>Shareable</label>
              </div>
              <input
                type="submit"
                className="px-5 py-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition"
                value="Update"
              />
            </div>

            {encryption && (
              <input
                type="password"
                className="text-md px-3 py-2 w-full mb-5 rounded-md bg-zinc-200"
                placeholder="Edit passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            )}
          </form>

          {message && <p className="text-red-500 mt-3">{message}</p>}
        </div>
      </div>
    </main>
  );
};

export default Edit;
