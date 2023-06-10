import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function Password() {
  const [email,setEmail] = useState('');
  const [message,setMessage] = useState('');
  const [loading,setLoading] = useState(false);

  function resetPassword(e){
    e.preventDefault();
    setLoading(true)
    sendPasswordResetEmail(getAuth(),email)
    .then(() => {
      setMessage(`Password reset instructions have been emailed to ${email}`)
      setEmail('')
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setMessage(err.message)
      setLoading(false)
    })
  }
  return <div>
    <h1>Reset password</h1>
    <form onSubmit={resetPassword}
    className="form-register">
      {message && <p style={{alignSelf:'center'}}>{message}</p>}
        <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email address"
        type="text" 
        className="input-register" 
        required/>
        <button className="btn-register">
            {loading ? "Sending...":"Reset password"}
        </button>
    <Link className="link" to={'/'}>Need to login?</Link>
    </form>
  </div>
}
