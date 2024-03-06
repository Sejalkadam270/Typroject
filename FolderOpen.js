// FileList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function List() {
  const [files, setFiles] = useState([]);
  const folderId = '15v9V2PbzliU-HXzEkqJgDxdyxVSU3xb7'; // Replace with your desired folderId

  useEffect(() => {
    axios.get(`http://localhost:5000/files/${folderId}`)
      .then(response => setFiles(response.data))
      .catch(error => console.error('Error fetching files:', error));
  }, [folderId]);
  return (
    <div>
      <h1>File List</h1>
      <ul>
        {files.map(file => (
          <li key={file.id}>
            <button onClick={() => openFileInBrowser(file.id)}>{file.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function openFileInBrowser(fileId) {
  axios.get(`http://localhost:5000/open/${fileId}`)  // Change the URL to your Node.js server endpoint
    .then(() => console.log('File opened in browser'))
    .catch(error => console.error('Error opening file:', error));
}
export default List;
app.get('/folders/:folderId', async (req, res) => {
  const folderId = req.params.folderId;
  const auth = await auth1();
  const drive = google.drive({ version: 'v3', auth });

  drive.files.list(
    {
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType)',
    },
    (err, result) => {
      if (err) return res.status(500).send('Error fetching files');
      const items = result.data.files || [];
      res.json({ items });
    }
  );
});
