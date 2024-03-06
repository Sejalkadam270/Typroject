import React, { useState } from 'react';
import axios from 'axios';

const DeleteFile = () => {
  const [fileName, setFileName] = useState('');

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/deleteFile/${fileName}`)
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Delete File:</h2>
      <input type="text" placeholder="File Name" onChange={(e) => setFileName(e.target.value)} />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteFile;
