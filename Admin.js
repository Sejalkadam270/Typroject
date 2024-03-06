// Admin.js
/*import React, { useState, useEffect } from 'react';
import { authenticate, generateAuthUrl } from './src/auth'; // Update the path accordingly

const Admin = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      authenticate(code)
        .then((token) => setAccessToken(token))
        .catch((error) => console.error('Authentication error:', error));
    }
  }, []);

  const handleAuthentication = () => {
    const authUrl = generateAuthUrl();
    window.location.href = authUrl;
  };

  // ... (Other functions like uploadFile, deleteFile, createFolderInsideFolder)

  return (
    <div>
      {!accessToken ? (
        <button onClick={handleAuthentication}>Authenticate</button>
      ) : (
        <p>Authenticated! Access Token: {accessToken}</p>
      )}
     // { Other buttons for file operations }
    </div>
  );
};
  
export default Admin;
*/