import React, { useState } from 'react';

const Navbar = () => {
  const [isResponsive, setResponsive] = useState(false);

  const toggleResponsive = () => {
    setResponsive(!isResponsive);
  };
    
  return (
    <div>
      <div className={`topnav ${isResponsive ? 'responsive' : ''}`} id="myTopnav">
        <a href="#home" className="active">Home</a>
        <a href="#news">News</a>
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
       

        <a href="javascript:void(0);" className="icon" onClick={toggleResponsive}>
          &#9776; {/* This is the hamburger icon */}
        </a>
      </div>
    </div>
  );
};

export default Navbar;
