
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ForgotPaasword=()=>{

      const {id,token}=useParams();
      const history=useNavigate();

      const [password,setPassword]=useState("");
      
      const [message,setMessage]=useState("");
      
      const userValid=async()=>{
        const res =await fetch(`http://localhost:5000/forgot/${id}/${token}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        });

        const data=await res.json();

        if(data.status==201){
            console.log("user valid");
        }
        else{
              history("*");
        }
      }
   
      const sendpassword=async(e)=>{
        e.preventDefault();
        const res =await fetch(`http://localhost:5000/${id}/${token}`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({password})
           
        });

        const data=await res.json();

        if(data.status==201){
            setPassword("");
            setMessage(true);
        }
        else{
              alert("Token Expired.........");
        }
      }

     useEffect(()=>{
       userValid();
     },[])

    return(
<div>
<div class="card1">
        
        <h2>Forgot Password?</h2>
        <p>You can reset your Password here</p>
        <input type="password"  value={password} onChange={(e)=>setPassword(e.target.value)} class="passInput" placeholder="Enter Password"/>
        <button onClick={sendpassword}>Send My Password</button>
    </div>
</div>
    );
}

export default ForgotPaasword;