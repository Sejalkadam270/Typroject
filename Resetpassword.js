import React, { useState } from "react";

const Resetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const Click = async (e) => {
    e.preventDefault();

    let res = await fetch("http://localhost:5000/reset", {
      method: "post",
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    console.log (data);
    if (data.status == 201) {
      setEmail("");
      setMessage("Password reset link sent successfully");
    } else {
      alert("Password reset failed.");
    }
  }

  return (
    <div>
      <div className="card1">
        <h2>Reset Password</h2>
        {message ? <p>{message}</p> : ""}
        <p>You can reset your Password here</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="passInput" placeholder="Email address"/>
        <button onClick={Click}>Send My Password</button>
      </div>
    </div>
  );
}

export default Resetpassword;
