
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="logo">Your Logo</div>

      <div className={`menu ${isMobile ? "active" : ""}`}>
        <ul>
          <li>
            <Link to="/">Products</Link>
            
          </li>
          <li>{auth ? <Link onClick={logout}>Logout</Link> : null}</li>
        </ul>
      </div>

      <div className="mobile-icon" onClick={toggleMobileMenu}>
        {isMobile ? "X" : "☰"}
      </div>
    </header>
  );
};

export default Nav;



/*
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const [showLinks, setShowLinks] = useState(false);
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    // Close the navigation links when the route changes
    setShowLinks(false);
  }, []);

  return (
    <div className="App">
      <div className="navbar">
        <div className="menu-icon" onClick={toggleLinks}>
          =
        </div>
        <ul className={`nav-links ${showLinks ? "show" : ""}`}>
          <li>
            <Link to="/">Products</Link>
          </li>
          {auth ? (
            <li>
              <Link onClick={logout} to="/signup">
                Logout
              </Link>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    </div>
  );
};

export default Nav;

*/ 


/*
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');

const credentialsPath = './credentials.json';
const tokenPath = './token.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const getAccessToken = async (oAuth2Client, code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Store the token to disk for later program executions
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));

    console.log('Token stored to', tokenPath);
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

const auth = async () => {
  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    let token;
    try {
      token = JSON.parse(fs.readFileSync(tokenPath));
    } catch (err) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });

      console.log('Authorize this app by visiting this url:', authUrl);

      // Your application should then redirect the user to this URL.
      // After the user grants permission, they will be redirected back to your application.
      
      const code = '4/0AfJohXkRPHTjLiYjZsHfBeetaycTwPe8QQOl-h22jwQSsQOm28BGO9e8k_dBATemqAALrg'; // Replace with the code obtained from the redirect URL
      await getAccessToken(oAuth2Client, code);

      return oAuth2Client; 
    }

    oAuth2Client.setCredentials(token);

    return oAuth2Client;
  } catch (error) {
    console.error('Error authenticating:', error);
    throw error;
  }

  
};

const expiryTimestamp = 1705304647755;
const expiryDate = new Date(expiryTimestamp);

console.log('Token Expiry Date:', expiryDate.toISOString());


module.exports = auth;
  
*/