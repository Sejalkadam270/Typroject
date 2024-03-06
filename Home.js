import { useMediaQuery } from 'react-responsive';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
//import './App.css';  // Import the CSS file

function Home() {  
  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' });

  return (
<div>
      <h1 className="display-4" style={{marginTop:'10%'}}>Pune Institute of Computer technology</h1>
      <h2 className="h3">THE GREAT LEARNING FOR IOPE ACADEMICS</h2>
      <h3>The Better Learning Future Starts Here</h3>
        <button className="btn btn-primary"style={{ marginTop:'2%'}}>Your Button Text</button>
</div>
  );
}

export default Home;
