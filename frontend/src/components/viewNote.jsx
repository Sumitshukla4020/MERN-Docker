import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ViewNote = () => {
  const { fileId } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/files/${fileId}`);
        const data = await response.json();
        setFileData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching file:", error);
        setLoading(false);
      }
    };

    fetchFileData();
  }, [fileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="text-xl font-semibold text-gray-600">
          File not found.
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-zinc-100 font-['Helvetica'] flex flex-col">
      {/* Navigation */}
      <nav className="flex px-10 justify-between py-5 bg-zinc-200 shadow-md">
        <h3 className="text-2xl tracking-tight">Secure-NoteBook</h3>
        <div className="navlinks flex gap-5">
          <Link className="tracking-tight" to="/Home">Home</Link>
          <Link className="tracking-tight" to="/create">Create</Link>
        </div>
      </nav>

      {/* Note Content */}
      <div className="px-10 flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-md shadow-md">
          <h3 className="capitalize text-2xl font-medium mb-5 tracking-tight border-b pb-3">
            {fileData.fileName}
          </h3>

          {/* Date */}
          <h4 className="text-gray-500 text-sm mb-5">
            Created on{" "}
            <span className="text-gray-700 font-medium">
              {new Date(fileData.createdAt).toLocaleDateString()}
            </span>
          </h4>

          {/* Note Content */}
          <div className="bg-zinc-100 px-4 py-5 rounded-md mb-5 shadow-inner" style={{ height: '300px' }}>
  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
    {fileData.content}
  </p>
</div>


          {/* Action Buttons */}
          <div className="flex justify-between items-center border-t pt-4">
            <Link
              to="/home"
              className="px-5 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Back
            </Link>
            <Link
              to={`/edit/${fileId}`}
              className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewNote;
