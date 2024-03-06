const fs = require('fs');
const { google } = require('googleapis');

// Replace these values with your service account credentials
const SERVICE_ACCOUNT_EMAIL = 'drivetestproject@great-learning-401307.iam.gserviceaccount.com';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtmWuT5+AweKyD\nSFBmPfu1+V3fI3kVf851wBIaBicdoxrbRnGchqvAxEW8WIx5YAoU8DQiesB8JcVB\nuY2QvpwQUcjMvSig38bS4Vn4IHjyto2+Rvo2VFfyuAGeLY1nrDy822TsM+N3f1h9\nQTnKQbk0SUjwCFUVis3UaWtZ2rNKGfH5xc0vy2kFo8pHDONWXLryOi4ndg/MFtDo\nCFpQ8lCQKJg2jUyflXtU9aMQb7Cymad4trT0vyCYXmWaWV2ziSGGUPUicvZ9kwdI\nqLlJdeCft12jjqYOLtooED4OVKn0lh2mul4liOxc1FOGHAfGI47efBcCkJc7WWdI\n3DoJyvezAgMBAAECggEAE9YKgVGG//Lh/3RFX5FokCAI1mTmwoqijDjguKGIWa4X\n9QNFGxYWTQYAU+eoUXwkWsUhp+jv0p+8POjXYLku+vxlXeOlX1CClvkR/zSyrUUn\nyByzHX8gt4bIBIt+82AuZoQJMaYyMSbXdSR9VnuRDoTrNSY2lqoQH9vV3OQNBYPm\nIyRwUywyKXwpLhELPG9fCz0qNQulm2EtO/BtKwCFqLln/l2mnTFo729F9EhAWdIw\nj0XJ9PePQGWQ7qFXGMLKkGkj7lCgndsh/t72wwsKxgTv0YL+DnA4OQ5O0uPeabjd\nBvbFyT7PAQsvNMEaBBzjMtpqlepDfhoD84MW1lUG/QKBgQDiJnSOKO/uKnpMIm+4\nDtl7ADo5NYu23I5qYWzRMpHNZfuEMWJ5SVmlen6dB8rbs5NjMVBPQi20c3MGKvxS\nRjGJJxAUh/TS+dxVIx8vnvE+QSsU2sOAcIiGyOHH0wAPrvDhlL9ITzuSvj3orhKP\nC3iCp/M9hQhJs7LqrW+mlAu0lQKBgQDEg0kyUq49n4xV0CrgMOmIxjfEU13smaGk\njUkPD5XNbMSH3cwmFrueCIpKgYSFnUk5PPp/yiN5PSVxcbaEoRYMzUX1mFZHzaG+\nvnOWAcRPvYJBn8tQxxcq1c4USGZizXS7z6rTYSCTR1+OytSt91WFeo9usyhum/TW\ns+ZVbr5hJwKBgQCNd0jJ9MnBzkiaf6ArHv7kdov1ZY10YhukaDVN17hlKDphwxK6\nlCvD3BB/4nP/YyH7lsmKCvfUPbPiU9lrDgXGqezhKvr3Tt2JVGMZwu9d5h4w+Xf6\nTGrbBaZW/aK4LNL6CbZuYUH+1Yqclud9G8vSz4TVIvbAQ+zT6JJDPbDk0QKBgEbj\nOQ9PJg2StVPrUNwoqMWvA0Tt8c68qMOsN7OYIqjE2KxORStkPe/HEuPHjt+IGnbs\nWUypxVwhw5UFuRpk5YhesCLk/hLOyc798sIlBwTgztEPbI9KEkBgegN1DoILrVVm\nly/DNLYMJBtlbY0H0LDiwkTjme00kwC0Sp184m43AoGAC6R+DjP5nyylVxFjwrnY\nz+fLfgVoGQMYCFxQJR5z6qLTugFkM0fzIFVAw4RtsKDqke/dbUCpcGvYonJmVk0f\nrk1R0OLO4U9IDI1NtVdlvwrCxjYILUFG0TnAuyIX8HDGuarB6QBTeZD9xJMrkAiU\nc99h8CbZYBHdleZFba9aYqg=\n-----END PRIVATE KEY-----\n';

// Scope for Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Create a new JWT client using the service account credentials
const auth = new google.auth.JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: SCOPES,
});
  
// Function to list files in the user's Google Drive
function listFiles(auth) {
  const drive = google.drive({ version: 'v3', auth });
  drive.files.list(
    {
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    },
    (err, res) => {
      if (err) return console.error('The API returned an error:', err.message);

      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.forEach((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log('No files found.');
      }
    }
  );
}

// Function to upload a file to Google Drive
// Function to upload a file to Google Drive


// Function to delete a file from Google Drive
/*function deleteFile(auth, fileName) {
  const drive = google.drive({ version: 'v3', auth });

  // Find the file ID by name
  getFileIdByName(drive, fileName, (fileId) => {
    if (!fileId) {
      console.error(`File '${fileName}' not found.`);
      return;
    }

    drive.files.delete({ fileId: fileId }, (err) => {
      if (err) {
        console.error('Error deleting file:', err.message);
      } else {
        console.log('File deleted successfully.');
      }
    });
  });
}
*/

function deleteFile(auth, fileName, folderName) {
  const drive = google.drive({ version: 'v3', auth });

  // Get the folder ID by name
  getFolderIdByName(drive, folderName, (folderId) => {
    if (!folderId) {
      console.error(`Folder '${folderName}' not found.`);
      return;
    }

    // Find the file ID by name and folder ID
    getFileIdByNameAndFolderId(drive, fileName, folderId, (fileId) => {
      if (!fileId) {
        console.error(`File '${fileName}' not found in folder '${folderName}'.`);
        return;
      }

      // Delete the file
      drive.files.delete({ fileId: fileId }, (err) => {
        if (err) {
          console.error('Error deleting file:', err.message);
        } else {
          console.log('File deleted successfully.');
        }
      });
    });
  });
}

function getFileIdByNameAndFolderId(drive, fileName, folderId, callback) {
  drive.files.list(
    {
      q: `mimeType!='application/vnd.google-apps.folder' and name='${fileName}' and '${folderId}' in parents`,
      fields: 'files(id, name)',
    },
    (err, res) => {
      if (err) {
        console.error('Error listing files:', err.message);
        callback(null);
      } else {
        const files = res.data.files;
        console.log('Files retrieved:', files);
        if (files.length > 0) {
          callback(files[0].id);
        } else {
          callback(null);
        }
      }
    }
  );
}

// Function to create a folder in Google Drive
function createFolderInsideParent(auth, folderName, parentFolderName) {
  const drive = google.drive({ version: 'v3', auth });

  // Find the parent folder ID by name
  getFolderIdByName(drive, parentFolderName, (parentFolderId) => {
    if (!parentFolderId) {
      console.error(`Parent folder '${parentFolderName}' not found.`);
      return;
    }

    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    };

    drive.files.create(
      {
        resource: folderMetadata,
        fields: 'id',
      },
      (err, folder) => {
        if (err) {
          console.error('Error creating folder:', err.message);
        } else {
          console.log('Folder created successfully. Folder ID:', folder.data.id);
        }
      }
    );
  });
}

// Function to get folder ID by name

function getFolderIdByName(drive, folderName, callback) {
  drive.files.list(
    {
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      fields: 'files(id, name)',
    },
    (err, res) => {
      if (err) {
        console.error('Error listing folders:', err.message);
        callback(null);
      } else {
        const folders = res.data.files;
        console.log('Folders retrieved:', folders);
        if (folders.length > 0) {
          callback(folders[0].id);
        } else {
          callback(null);
        }
      }
    }
  );
}



// Function to get file ID by name
function getFileIdByName(drive, fileName, callback) {
  drive.files.list(
    {
      q: `name='${fileName}'`,
      fields: 'files(id)',
    },
    (err, res) => {
      if (err) {
        console.error('Error listing files:', err.message);
        callback(null);
      } else {
        const files = res.data.files;
        if (files.length > 0) {
          callback(files[0].id);
        } else {
          callback(null);
        }
      }
    }
  );
}

// Example usage
auth.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in your database!
    console.log('Refresh token:', tokens.refresh_token);
  }
  console.log('Access token:', tokens.access_token);
});

auth.authorize((err, tokens) => {
  if (err) {
    console.error('Authorization error:', err);
    return;
  }

  // Uncomment the desired function calls
  listFiles(auth); // List files
  // Other function calls...
  
});
module.exports = {
  deleteFile,
  createFolderInsideParent,
};
  