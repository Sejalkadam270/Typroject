import React, { useState } from 'react';
import axios from 'axios';

const Hii2 = () => {
  const [folderId, setFolderId] = useState('');
  const [folderNames, setFolderNames] = useState('');

  const handleFolderIdChange = (e) => {
    setFolderId(e.target.value);
  };

  const handleFolderNamesChange = (e) => {
    setFolderNames(e.target.value);
  };

  const handleCreateFolders = async () => {
    try {
      // Make a request to the backend with the folderId and folderNames
      await axios.post('http://localhost:5000/createFolders', { folderId, folderNames });
      alert('Folders created successfully!');
    } catch (error) {
      console.error('Error creating folders:', error.message);
      alert('Error creating folders. Check the console for details.');
    }
  };

  return (
    <div>
      <label>
        Folder ID:
        <input type="text" value={folderId} onChange={handleFolderIdChange} required></input>
      </label>
      <br />
      <label>
        Folder Names (comma-separated):
        <input type="text" value={folderNames} onChange={handleFolderNamesChange} required></input>
      </label>
      <br />
      <button onClick={handleCreateFolders}>Create Folders</button>
    </div>
  );
};

export default Hii2;
