const fs = require('fs');
const { google } = require('googleapis');
const { Readable } = require('stream');

// Replace these values with your service account credentials
const SERVICE_ACCOUNT_EMAIL = 'drivetestproject@great-learning-401307.iam.gserviceaccount.com';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtmWuT5+AweKyD\nSFBmPfu1+V3fI3kVf851wBIaBicdoxrbRnGchqvAxEW8WIx5YAoU8DQiesB8JcVB\nuY2QvpwQUcjMvSig38bS4Vn4IHjyto2+Rvo2VFfyuAGeLY1nrDy822TsM+N3f1h9\nQTnKQbk0SUjwCFUVis3UaWtZ2rNKGfH5xc0vy2kFo8pHDONWXLryOi4ndg/MFtDo\nCFpQ8lCQKJg2jUyflXtU9aMQb7Cymad4trT0vyCYXmWaWV2ziSGGUPUicvZ9kwdI\nqLlJdeCft12jjqYOLtooED4OVKn0lh2mul4liOxc1FOGHAfGI47efBcCkJc7WWdI\n3DoJyvezAgMBAAECggEAE9YKgVGG//Lh/3RFX5FokCAI1mTmwoqijDjguKGIWa4X\n9QNFGxYWTQYAU+eoUXwkWsUhp+jv0p+8POjXYLku+vxlXeOlX1CClvkR/zSyrUUn\nyByzHX8gt4bIBIt+82AuZoQJMaYyMSbXdSR9VnuRDoTrNSY2lqoQH9vV3OQNBYPm\nIyRwUywyKXwpLhELPG9fCz0qNQulm2EtO/BtKwCFqLln/l2mnTFo729F9EhAWdIw\nj0XJ9PePQGWQ7qFXGMLKkGkj7lCgndsh/t72wwsKxgTv0YL+DnA4OQ5O0uPeabjd\nBvbFyT7PAQsvNMEaBBzjMtpqlepDfhoD84MW1lUG/QKBgQDiJnSOKO/uKnpMIm+4\nDtl7ADo5NYu23I5qYWzRMpHNZfuEMWJ5SVmlen6dB8rbs5NjMVBPQi20c3MGKvxS\nRjGJJxAUh/TS+dxVIx8vnvE+QSsU2sOAcIiGyOHH0wAPrvDhlL9ITzuSvj3orhKP\nC3iCp/M9hQhJs7LqrW+mlAu0lQKBgQDEg0kyUq49n4xV0CrgMOmIxjfEU13smaGk\njUkPD5XNbMSH3cwmFrueCIpKgYSFnUk5PPp/yiN5PSVxcbaEoRYMzUX1mFZHzaG+\nvnOWAcRPvYJBn8tQxxcq1c4USGZizXS7z6rTYSCTR1+OytSt91WFeo9usyhum/TW\ns+ZVbr5hJwKBgQCNd0jJ9MnBzkiaf6ArHv7kdov1ZY10YhukaDVN17hlKDphwxK6lCvD3BB/4nP/YyH7lsmKCvfUPbPiU9lrDgXGqezhKvr3Tt2JVGMZwu9d5h4w+Xf6TGrbBaZW/aK4LNL6CbZuYUH+1Yqclud9G8vSz4TVIvbAQ+zT6JJDPbDk0QKBgEbjOQ9PJg2StVPrUNwoqMWvA0Tt8c68qMOsN7OYIqjE2KxORStkPe/HEuPHjt+IGnbsWUypxVwhw5UFuRpk5YhesCLk/hLOyc798sIlBwTgztEPbI9KEkBgegN1DoILrVVmly/DNLYMJBtlbY0H0LDiwkTjme00kwC0Sp184m43AoGAC6R+DjP5nyylVxFjwrnYz+fLfgVoGQMYCFxQJR5z6qLTugFkM0fzIFVAw4RtsKDqke/dbUCpcGvYonJmVk0frk1R0OLO4U9IDI1NtVdlvwrCxjYILUFG0TnAuyIX8HDGuarB6QBTeZD9xJMrkAiUc99h8CbZYBHdleZFba9aYqg=\n-----END PRIVATE KEY-----\n';

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

// Function to get the folder ID by name
async function getFolderIdByName(auth, folderName) {
  const drive = google.drive({ version: 'v3', auth });
  const response = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    fields: 'files(id)',
  });
  const folders = response.data.files;
  if (folders.length === 0) {
    throw new Error(`Folder not found: ${folderName}`);
  }
  return folders[0].id;
}

// Function to upload a file to Google Drive using folder name
async function uploadFileByFolderName(auth, fileInformation, folderName) {
  try {
    // Use file information
    const { buffer, filename, mimetype } = fileInformation;

    // Your existing code to get folderId
    const folderId = await getFolderIdByName(auth, folderName);

    // Create a readable stream from the buffer
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signals the end of the stream

    // Rest of your code to upload the file using the readable stream
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
      name: filename,
      parents: [folderId],
    };
    const media = {
      mimeType: mimetype,
      body: readableStream,  // Use the readable stream
    };
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log(`File ${filename} uploaded with ID: ${file.data.id}`);
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error; // Re-throw the error to handle it further if needed
  }
}

async function deleteFolderByName(auth, folderName) {
  try {
    // Get the folder ID by name
    const folderId = await getFolderIdByName(auth, folderName);

    // Create a Drive instance
    const drive = google.drive({ version: 'v3', auth });

    // Delete the folder using the retrieved folder ID
    await drive.files.delete({
      fileId: folderId,
    });

    console.log(`Folder ${folderName} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting folder:', error.message);
    throw error; // Re-throw the error to handle it further if needed
  }
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
  listFiles(auth);
 // uploadFileByFolderName(auth, 'example.txt', 'DATA'); // example.txt - file name, DATA - folder name from Drive
  // Other function calls...
 
});

module.exports = {
  uploadFileByFolderName,
  deleteFolderByName
};
