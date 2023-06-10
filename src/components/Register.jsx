import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, push, ref } from 'firebase/database';
import { BiLoaderCircle } from 'react-icons/bi';

export default function Register() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);

    const registerUser = (event) => {
        event.preventDefault();
        setLoading(true)
        createUserWithEmailAndPassword(getAuth(),email,password)
        .then(() => {
            push(ref(getDatabase(),`users`),{
                name,
                email,
                date:new Date().toString(),
                uid:getAuth()?.currentUser?.uid,
                profilePicture:''
            })
            setLoading(false)
            setName('')
            setEmail('')
            setPassword('')
            console.log('User created successfully')
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
        })

    }

  return <div>
    <h1>Register</h1>
    <form onSubmit={registerUser}
    className="form-register">
        <label htmlFor="Name">Name</label>
        <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-register" 
        type="text" placeholder="Enter name" required/>

        <label htmlFor="Email">Email</label>
        <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-register"
        type="text" placeholder="Enter email address" required/>

        <label htmlFor="Password">Password</label>
        <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-register"
        type="password" placeholder="Enter password" required/>

        <button className="btn-register">
            {loading ? <BiLoaderCircle color="orange" /> : "Sign Up"}
        </button>

        <Link className="link" to={'/'}>Need to login?</Link>
    </form>
  </div>
}
