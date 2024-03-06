//start from here
import React, { useState,useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
const Login=()=>{

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();
 useEffect=()=>{
const auth=localStorage.getItem('user');
if(auth){
  navigate('/');
}
  } 
  const handleLogin=async()=>{
    console.warn(email,password);
    let result=await fetch("http://localhost:5000/login",{
      method:'post',
      body:JSON.stringify({email,password}),
      headers:{
        'Content-Type':'application/json'
      }
    }

    );

    result=await result.json();
    console.warn(result);
    if(result.auth){
      localStorage.setItem('user',JSON.stringify(result.user));
      localStorage.setItem('token',JSON.stringify(result.auth));
      navigate('/');
    }
    else{
      alert("please enter correct information");
    }

  }
    return (
        <div>
            <div class="container1">
      <div class="card">
        <div class="card_title">
          <h1>Login</h1>
        </div>
        <div class="form">
        
          <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} id="email" />
          <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} id="password" />
          <button onClick={handleLogin}>Login</button>
          <Link to="/signup">Create Account</Link><br/>
          <Link to="/reset">forgot password?</Link>
        </div>
      </div>
    </div>
    </div>
    )
}

export default Login;

/*import React, { useState,useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
const Login=()=>{

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();
 useEffect=()=>{
const auth=localStorage.getItem('user');
if(auth){
  navigate('/');
}
  } 
  const handleLogin=async()=>{
    console.warn(email,password);
    let result=await fetch("http://localhost:5000/login",{
      method:'post',
      body:JSON.stringify({email,password}),
      headers:{
        'Content-Type':'application/json'
      }
    }

    );

    result=await result.json();
    console.warn(result);
    if(result.auth){
      localStorage.setItem('user',JSON.stringify(result.user));
      localStorage.setItem('token',JSON.stringify(result.auth));
      navigate('/');
    }
    else{
      alert("please enter correct information");
    }

  }
    return (
        <div>
            <div class="container1">
      <div class="card">
        <div class="card_title">
          <h1>Login</h1>
        </div>
        <div class="form">
        
          <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} id="email" />
          <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} id="password" />
          <button onClick={handleLogin}>Login</button>
          <Link to="/signup">Create Account</Link><br/>
          <Link to="/reset">forgot password?</Link>
        </div>
      </div>
    </div>
    </div>
    )
}

export default Login;
*/