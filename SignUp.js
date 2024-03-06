//start from here 
/*import React,{useState,useEffect} from 'react';
import {useNavigate } from 'react-router-dom';

const SignUp=()=>{
  const [Firstname,setFirstname]=useState("");
  const [Lastname,setLastname]=userState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const [userType,setuserType]=useState("");
  const [secretKey,setSecretKey]=useState("");
  
  const navigate=useNavigate();

  useEffect(()=>{
    const auth=localStorage.getItem('user');
    if(auth){
navigate('/');
    }

  })

  const collectData=async ()=>{
    console.warn(name,email,password);
    let result=await fetch('http://localhost:5000/register',
    
    {
    method:'post',
    body:JSON.stringify(
      {Firstname,
        Lastname,
      email,
      password
    }),
    headers:{
      'Content-Type':'application/json'
    },
    })
    result=await result.json();
    console.warn(result);

    if(result){
      localStorage.setItem("user",JSON.stringify(result.result));
      localStorage.setItem("token",JSON.stringify(result.auth));
         navigate('/login');
    }
    
  }
    return ( 
        <div>
  
            <div class="container1">
      <div class="card">
        <div class="card_title">
          <h1>Create Account</h1>
          <span>Already have an account? <a href="login">Sign In</a></span>
         </div>

         <div>
        <input type="radio" 
          name="UserType" 
          value={User} 
          onChange={(e)=>setuserType(e.target.value)} 
        />
        User
        </div>

        <div>
        <input type="radio" 
          name="UserType" 
          value={Admin} 
          onChange={(e)=>setuserType(e.target.value)} 
        />
        Admin
        </div>
       
       {userType=="Admin" ?(<div>
        <label>Secret Key</label>
      <input type="radio" 
          name="UserType" 
          value={User} 
          onChange={(e)=>setSecretKey(e.target.value)} 
        />
        </div>
        ):null}
     
      

        <div class="form"> 
          <input type="text" 
          name="Firstname" 
          id="firstname" 
          value={name} onChange={(e)=>setFirstname(e.target.value)} 
          placeholder="Firstname" 
          />

          <input type="text" 
          name="Lastname" 
          id="lastname" 
          value={name} onChange={(e)=>setLastname(e.target.value)} 
          placeholder="Lastname" 
                />

          <input type="email" 
          name="email" 
          value={email} onChange={(e)=>setEmail(e.target.value)} 
          placeholder="Email" 
          id="email"
          />

          <input type="password" 
          name="password"  
          value={password} onChange={(e)=>setPassword(e.target.value)} 
          placeholder="Password" 
          id="password" 
          />

          <button onClick={collectData}>Sign Up</button>
        </div>
      </div>
    </div>
    </div>
    )
}

export default SignUp;


/*import React,{useState,useEffect} from 'react';
import {useNavigate } from 'react-router-dom';
const SignUp=()=>{
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const navigate=useNavigate();
  useEffect(()=>{
    const auth=localStorage.getItem('user');
    if(auth){
navigate('/');
    }
  })
  const collectData=async ()=>{
    console.warn(name,email,password);
    let result=await fetch('http://localhost:5000/register',{
    method:'post',
    body:JSON.stringify({name,email,password}),
    headers:{
      'Content-Type':'application/json'
    },
    })
    result=await result.json();
    console.warn(result);
    if(result){
      localStorage.setItem("user",JSON.stringify(result.result));
      localStorage.setItem("token",JSON.stringify(result.auth));
         navigate('/login');
    }
    
  }
    return ( 
        <div>
  
            <div class="container1">
      <div class="card">
        <div class="card_title">
          <h1>Create Account</h1>
          <span>Already have an account? <a href="login">Sign In</a></span>
        </div>
        <div class="form">
          <input type="text" name="username" id="username" value={name} onChange={(e)=>setName(e.target.value)} placeholder="UserName" />
          <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" id="email" />
          <input type="password" name="password"  value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" id="password" />
          <button onClick={collectData}>Sign Up</button>
        </div>
      </div>
    </div>
    </div>
    )
}

export default SignUp;
*/