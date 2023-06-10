import React from "react";
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [loading,setLoading] = React.useState(false);
    const [errorMessage,setErrorMessage] = React.useState('');
    const [success,setSuccess] = React.useState('');

    function logUserIn(event){
        event.preventDefault();
        setLoading(true)
        signInWithEmailAndPassword(getAuth(),email,password)
        .then(() => {
            console.log('Login success')
            setEmail('')
            setPassword('')
            setLoading(false)
            setSuccess('Login Success')
            setErrorMessage('')
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
            setErrorMessage(err.message)
            setSuccess('')
        })
    }
  return <div>
    <h1>Welcome back</h1>
    <form onSubmit={logUserIn}
    className="form-register">
       {errorMessage && <p style={{color:'red',alignSelf:'center'}}>{errorMessage.slice(errorMessage.indexOf('auth'),errorMessage.lastIndexOf(')'))}</p>}
       {success && <p style={{color:'green',alignSelf:'center'}}>{success}</p>}
        <label htmlFor="Email">Email</label>
        <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text" className="input-register" 
        placeholder="Enter email address" required/>

        <label htmlFor="Password">Password</label>
        <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="text" className="input-register"
        placeholder="Enter password"
        required
         />

         <button className="btn-register">
            {
                loading ? "Signing in.." : "Sign In"
            }
         </button>
         <Link className="link" to="/register">Need an account?</Link>
         <Link className="link" to={'/password'}>Forgot password?</Link>
    </form>
  </div>
}
