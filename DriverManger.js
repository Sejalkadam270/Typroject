//Import necessary libraries and modules
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const DriveManager = () => {
  // State variables
  const [fileName, setFileName] = useState('');
  const [folderName, setFolderName] = useState('');
  const [parentFolderName, setParentFolderName] = useState('');
  const [deleteFileName, setDeleteFileName] = useState('');
  const [deleteFolderName, setDeleteFolderName] = useState('');

  // Event handlers
  const handleFileChange = (e) => setFileName(e.target.value);
  const handleFolderChange = (e) => setFolderName(e.target.value);
  const handleParentFolderChange = (e) => setParentFolderName(e.target.value);
  const handleDeleteFileChange = (e) => setDeleteFileName(e.target.value);
  const handleDeleteFolderChange = (e) => setDeleteFolderName(e.target.value);

  // API call functions
  const handleCreateFolder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/create-folder', {
        folderName,
        parentFolderName,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error creating folder:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/deleteFile', {
        data: { fileName: deleteFileName, folderName: deleteFolderName },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Google Drive Manager</h2>

      
      <div style={{ marginBottom: '20px' }}>
        <h4>Create Folder</h4>
        <div className="mb-2">
          <label className="form-label">Folder Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder='Enter Folder Name'
            style={{ width: '100%', boxSizing: 'border-box' }}
            value={folderName}
            onChange={handleFolderChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Parent Folder Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder='Enter Parent Folder Name'
            style={{ width: '100%' }}
            value={parentFolderName}
            onChange={handleParentFolderChange}
          />
        </div>

        <button className="btn btn-primary" onClick={handleCreateFolder}>
          Create Folder
        </button>
      </div>

      
      <div className="mt-4">
        <h4>Delete File</h4>
        <div className="mb-2">
          <label className="form-label">Enter File Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder='Enter File Name'
            style={{ width: '100%', boxSizing: 'border-box' }}
            value={deleteFileName}
            onChange={handleDeleteFileChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Enter Folder Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder='Enter Folder Name'
            style={{ width: '100%', boxSizing: 'border-box' }}
            value={deleteFolderName}
            onChange={handleDeleteFolderChange}
          />
        </div>

        <button className="btn btn-danger" onClick={handleDelete}>
          Delete File
        </button>
      </div>
    </div>
  );  
};

export default DriveManager;

