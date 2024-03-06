const express = require("express");
const cors = require("cors");
require('./db/config');
const User = require("./db/Users");
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
app.use(cors());
const nodemailer = require("nodemailer");
const Jwt = require('jsonwebtoken');
const jwtkey = "e-commerce";
const { OAuth2Client } = require('google-auth-library');
const fileUpload = require('express-fileupload');
const { deleteFile, createFolderInsideParent } = require('./auth.js');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { google } = require('googleapis');
// Adjust the path based on your project structure
const opn = require('opn');
const axios = require('axios');  // Assuming you're using fs.promises
//const credentials = require('./credentials.json');
const multer = require('multer');
const { uploadFileByFolderName,deleteFolderByName } = require('./FileRoutes.js');
const fs = require('fs');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

 // Store token for authentication
const transporter=nodemailer.createTransport({

  service:"gmail",
  auth:{
    user:"sejalkadam270@gmail.com",
    pass:"qpju stjg yyuf mhxp"

  }
})

app.post("/register",async (req,resp)=>{
  let users= new User(req.body);
  let result= await users.save();
  result=result.toObject();
  delete result.password;
  Jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{
    if(err){
      resp.send({result:"something is wrong"});
    }
    resp.send({result,auth:token});
  });
})

app.post("/login",async(req,resp)=>{

  if(req.body.password && req.body.email){
let user= await User.findOne(req.body).select("-password");
if(user){
  Jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{
    if(err){
      resp.send({result:"something is wrong"});
    }
    resp.send({user,auth:token});
  });

}else{
  resp.send({result:"no user found"});
}
}
  else{
  resp.send({result:"no user found"});
}

})
app.post('/reset', async (req, resp) => {
  const { email } = req.body;

  if (!email) {
    resp.status(401).json({ status: 401, message: 'Enter Your Email' });
    return;
  }

  try {
    const userFind = await User.findOne({ email });

    if (!userFind) {
      resp.status(404).json({ status: 404, message: 'User not found.' });
      return;
    }

    const token = Jwt.sign({ _id: userFind._id }, jwtkey, {
      expiresIn: '120s',
    });

    const setusertoken = await User.findByIdAndUpdate(
      { _id: userFind._id },
      { verifytoken: token },
      { new: true },
    );

    if (setusertoken) {
      const mailOptions = {
        from: 'sejalkadam270@gmail.com',
        to: email,
        subject: 'Sending Email for password reset',
        text: `this link valid for 2 min http://127.0.0.1:3000/forgot/${userFind.id}/${setusertoken.verifytoken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('error', error);
          resp.status(401).json({ status: 401, message: 'email not send' });
        } else {
          console.log('Email Sent', info.response);
          resp.status(201).json({ status: 201, message: 'email sent!!!!' });
        }
      });
    }
  } catch (error) {
    console.log('error', error);
    resp.status(500).json({ status: 500, message: 'An error occurred while resetting your password.' });
  }
});



const GOOGLE_DRIVE_API_ENDPOINT = 'https://www.googleapis.com/drive/v3/files';

const API_KEY = 'AIzaSyBke7R_lbSrVd5wcOKDTaU_h6e5Ch7VnfU'; // Replace with your actual API key

app.get('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;

  try {
    const response = await axios.get(`${GOOGLE_DRIVE_API_ENDPOINT}?q='${folderId}' in parents&key=${API_KEY}`);
    
    // Log the entire response for troubleshooting
    console.log('Google Drive API Response:', response.data);

    const files = response.data.files || [];
    res.json({ files });
  } catch (error) {
    console.error('Error fetching folder contents:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/open/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

  opn(fileUrl)
    .then(() => {
      console.log('File opened in browser');
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Error opening file:', error);
      res.status(500).json({ error: 'Error opening file' });
    });
});

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
app.post('/delete-folder', async (req, res) => {
  const { folderName } = req.body;
  try {
    // Call the function to delete folder by name
    await deleteFolderByName(auth,folderName);
    res.status(200).send(`Folder ${folderName} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting folder:', error.message);
    res.status(500).send('Internal server error');
  }
});
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const folderName = req.body.folderName;

  if (!file || !folderName) {
    return res.status(400).json({ error: 'Missing file or folderName' });
  }

  try {
    // Use file information obtained from the 'file' object
    const fileInformation = {
      buffer: file.buffer,            // File content as Buffer
      filename: file.originalname,    // Original filename
      mimetype: file.mimetype,        // File mimetype
    };

    await uploadFileByFolderName(auth, fileInformation, folderName);
    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// Assuming you have an existing route for file deletion
app.delete('/deleteFile', (req, res) => {
  const fileName = req.body.fileName;
  const folderName = req.body.folderName;

  if (!fileName || !folderName) {
    return res.status(400).json({ error: 'Missing file name or folder name' });
  }

  try {
    deleteFile(auth, fileName, folderName);
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/create-folder', (req, res) => {
  const { folderName, parentFolderName } = req.body;
  // Call the createFolderInsideParent function from your Google Drive functions file
  createFolderInsideParent(auth, folderName, parentFolderName);
  res.json({ message: 'Folder creation request received' });
});
app.listen(5000);

  app.get('/folders/:folderId', async (req, res) => {
  const folderId = req.params.folderId;
  try {
    const authClient = await auth1(); // Use the auth function from auth.js

    const drive = google.drive({ version: 'v3', auth: authClient });

    drive.files.list(
      {
        q: folderId === 'root' ? "'root' in parents" : `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType)',
      },
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error fetching files' });
        const items = result.data.files || [];
        res.json({ items });
      }
    );
  } catch (error) {
    console.error('Error authenticating:', error.message);
    res.status(500).json({ error: 'Authentication error' });
  }
});
app.get('/api/open/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

  opn(fileUrl)
    .then(() => {
      console.log('File opened in browser');
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Error opening file:', error);
      res.status(500).json({ error: 'Error opening file' });
    });
});










/*const express = require("express");
const cors = require("cors");
require('./db/config');
const User = require("./db/Users");
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
app.use(cors());
const nodemailer = require("nodemailer");
const Jwt = require('jsonwebtoken');
const jwtkey = "e-commerce";
const { OAuth2Client } = require('google-auth-library');
const fileUpload = require('express-fileupload');
const { deleteFile, createFolderInsideParent } = require('./auth.js');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { google } = require('googleapis');
// Adjust the path based on your project structure
const opn = require('opn');
const axios = require('axios');  // Assuming you're using fs.promises
//const credentials = require('./credentials.json');
const multer = require('multer');
const { uploadFileByFolderName,deleteFolderByName } = require('./FileRoutes.js');
const fs = require('fs');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

 // Store token for authentication
const transporter=nodemailer.createTransport({

  service:"gmail",
  auth:{
    user:"sejalkadam270@gmail.com",
    pass:"qpju stjg yyuf mhxp"

  }
})

app.post("/register",async (req,resp)=>{
  let users= new User(req.body);
  let result= await users.save();
  result=result.toObject();
  delete result.password;
  Jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{
    if(err){
      resp.send({result:"something is wrong"});
    }
    resp.send({result,auth:token});
  });
})

app.post("/login",async(req,resp)=>{

  if(req.body.password && req.body.email){
let user= await User.findOne(req.body).select("-password");
if(user){
  Jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{
    if(err){
      resp.send({result:"something is wrong"});
    }
    resp.send({user,auth:token});
  });

}else{
  resp.send({result:"no user found"});
}
}
  else{
  resp.send({result:"no user found"});
}

})
app.post('/reset', async (req, resp) => {
  const { email } = req.body;

  if (!email) {
    resp.status(401).json({ status: 401, message: 'Enter Your Email' });
    return;
  }

  try {
    const userFind = await User.findOne({ email });

    if (!userFind) {
      resp.status(404).json({ status: 404, message: 'User not found.' });
      return;
    }

    const token = Jwt.sign({ _id: userFind._id }, jwtkey, {
      expiresIn: '120s',
    });

    const setusertoken = await User.findByIdAndUpdate(
      { _id: userFind._id },
      { verifytoken: token },
      { new: true },
    );

    if (setusertoken) {
      const mailOptions = {
        from: 'sejalkadam270@gmail.com',
        to: email,
        subject: 'Sending Email for password reset',
        text: `this link valid for 2 min http://127.0.0.1:3000/forgot/${userFind.id}/${setusertoken.verifytoken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('error', error);
          resp.status(401).json({ status: 401, message: 'email not send' });
        } else {
          console.log('Email Sent', info.response);
          resp.status(201).json({ status: 201, message: 'email sent!!!!' });
        }
      });
    }
  } catch (error) {
    console.log('error', error);
    resp.status(500).json({ status: 500, message: 'An error occurred while resetting your password.' });
  }
});



const GOOGLE_DRIVE_API_ENDPOINT = 'https://www.googleapis.com/drive/v3/files';

const API_KEY = 'AIzaSyBke7R_lbSrVd5wcOKDTaU_h6e5Ch7VnfU'; // Replace with your actual API key

app.get('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;

  try {
    const response = await axios.get(`${GOOGLE_DRIVE_API_ENDPOINT}?q='${folderId}' in parents&key=${API_KEY}`);
    
    // Log the entire response for troubleshooting
    console.log('Google Drive API Response:', response.data);

    const files = response.data.files || [];
    res.json({ files });
  } catch (error) {
    console.error('Error fetching folder contents:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/open/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

  opn(fileUrl)
    .then(() => {
      console.log('File opened in browser');
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Error opening file:', error);
      res.status(500).json({ error: 'Error opening file' });
    });
});

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
app.post('/delete-folder', async (req, res) => {
  const { folderName } = req.body;
  try {
    // Call the function to delete folder by name
    await deleteFolderByName(auth,folderName);
    res.status(200).send(`Folder ${folderName} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting folder:', error.message);
    res.status(500).send('Internal server error');
  }
});
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const folderName = req.body.folderName;

  if (!file || !folderName) {
    return res.status(400).json({ error: 'Missing file or folderName' });
  }

  try {
    // Use file information obtained from the 'file' object
    const fileInformation = {
      buffer: file.buffer,            // File content as Buffer
      filename: file.originalname,    // Original filename
      mimetype: file.mimetype,        // File mimetype
    };

    await uploadFileByFolderName(auth, fileInformation, folderName);
    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// Assuming you have an existing route for file deletion
app.delete('/deleteFile', (req, res) => {
  const fileName = req.body.fileName;
  const folderName = req.body.folderName;

  if (!fileName || !folderName) {
    return res.status(400).json({ error: 'Missing file name or folder name' });
  }

  try {
    deleteFile(auth, fileName, folderName);
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/create-folder', (req, res) => {
  const { folderName, parentFolderName } = req.body;
  // Call the createFolderInsideParent function from your Google Drive functions file
  createFolderInsideParent(auth, folderName, parentFolderName);
  res.json({ message: 'Folder creation request received' });
});
app.listen(5000);
*/

  
/*app.get('/folders/:folderId', async (req, res) => {
  const folderId = req.params.folderId;
  try {
    const authClient = await auth1(); // Use the auth function from auth.js

    const drive = google.drive({ version: 'v3', auth: authClient });

    drive.files.list(
      {
        q: folderId === 'root' ? "'root' in parents" : `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType)',
      },
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error fetching files' });
        const items = result.data.files || [];
        res.json({ items });
      }
    );
  } catch (error) {
    console.error('Error authenticating:', error.message);
    res.status(500).json({ error: 'Authentication error' });
  }
});

/*app.get('/api/open/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

  opn(fileUrl)
    .then(() => {
      console.log('File opened in browser');
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Error opening file:', error);
      res.status(500).json({ error: 'Error opening file' });
    });
});
*/