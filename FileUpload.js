import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [folderDeleteName, setDeleteFolderName] = useState('');

  const handleDeleteFolder = async () => {
    try {
      await axios.post('http://localhost:5000/delete-folder', { folderName: folderDeleteName });
      console.log(`Folder ${folderDeleteName} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting folder:', error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleDeleteFolderNameChange = (e) => {
    setDeleteFolderName(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !folderName) {
      console.error('Missing file or folderName');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderName', folderName);

    try {
      // Send the file information along with the file
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4">Uploader</h1>
      <div className="form-group" style={{marginTop:'30px'}}>
        <label>Choose File:</label>
        <input type="file" className="form-control-file" onChange={handleFileChange} />
      </div>

      <div className="form-group" style={{marginTop:'40px'}}>
        <label>Enter Folder Name:</label>
        <input type="text" style={{marginTop:'10px'}} placeholder='Enter Folder Name' className="form-control" value={folderName} onChange={handleFolderNameChange} />
      </div>

      <button className="btn btn-primary"  style={{marginTop:'10px'}} onClick={handleUpload}>
        Upload
      </button>

      <div className="form-group"style={{marginTop:'40px'}} >
        <label>Delete Folder:</label>
        <input type="text" style={{marginTop:'10px'}} placeholder='Enter Folder Name' className="form-control" value={folderDeleteName} onChange={handleDeleteFolderNameChange} />
      </div>

      <button className="btn btn-danger" style={{marginTop:'10px'}} onClick={handleDeleteFolder}>
        Delete Folder
      </button>
    </div>
  );
}

export default FileUpload;
