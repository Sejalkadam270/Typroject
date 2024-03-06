import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

function List() {
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('1C3oXH86mYjZpFL-5ECBNouV2CRJXLnLg');
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    fetchData(currentFolder);
  }, [currentFolder]);

  const fetchData = async (folderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/folders/${folderId}`);
      const files = response.data.files || [];
      setFiles(files);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const openFolder = (folderId) => {
    setCurrentFolder(folderId);
  };

  const openFileInBrowser = async (fileId) => {
    try {
      await axios.get(`http://localhost:5000/api/open/${fileId}`);
      console.log('File opened in browser');
    } catch (error) {
      console.error('Error opening file:', error.message);
    }
  };

  const handleGoBack = () => {
    // Use navigate to navigate back to the previous folder
    navigate("/files");
  };

  return (
    <div className="container">
     
      <a href="/files" id='tag'>Back</a>
      <ul className="list-group" style={{marginTop:"40px"}}>
        {files.map(file => (
          <li key={file.id} className="list-group-item" style={{backgroundColor:" #ffee93",width:"50%",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 5px",marginTop:"23px",padding:"10px"}}>
            {file.mimeType === 'application/vnd.google-apps.folder' ? (
              <button className="btn btn-link" style={{textDecorationLine:"none",color:"black"}} onClick={() => openFolder(file.id)}>{file.name}</button>
            ) : (
              <button className="btn btn-link" style={{textDecorationLine:"none",color:"black"}} onClick={() => openFileInBrowser(file.id)}>{file.name}</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
