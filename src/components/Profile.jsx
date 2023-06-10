import React, {useState, useEffect, useRef} from "react";
import { getAuth, signOut } from 'firebase/auth';
import { onValue, ref, getDatabase, update } from 'firebase/database';
import Logo from './user.jpeg';
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export default function Profile() {
    const [user,setUser] = useState(null);
    const [progressText,setProgressText] = useState('');
    const [profilePicture,setProfilePicture] = useState(null);
    const [errorMessage,setErrorMessage] = useState('');

    const imageRef = useRef();

    function logUserOut(){
        signOut(getAuth())
    }
    useEffect(() => {
        onValue(ref(getDatabase(),`users`),(users) => {
            users.forEach((u) => {
                if (u.val().uid == getAuth().currentUser.uid) {
                    setUser(u)
                }
            })
        })
    },[])

    function selectImage(){
        imageRef.current.click()
    }
    
   async function uploadImage(file){
        return Storage.put(Math.random() + file.name,file,{
            level:'public',
            contentType:file.type,
            progressCallback(progress){
                setProgressText(
                    `${Math.round(
                        (progress.loaded / progress.total) * 100
                    )}%`
                )
            }
        }).then((res) => {
            setProgressText('100%')
            Storage.get(res.key)
            .then((result) => {
                let trim = result.slice(0,result.indexOf('?'))
                setProfilePicture(trim)
                console.log(trim)
                // save aws s3 image uri into firebase database
                update(ref(getDatabase(),`users/${user?.key}`),{
                    profilePicture:trim
                })
                console.log('user profile picture updated')
            })
            .catch((err) => {
                console.log(err)
                setErrorMessage('Error upload image')
            })
        })
        .catch((err) => {
            console.log(err)
            setErrorMessage('Error upload image')
        })
    }

  return <div className="profile-container">
    <h1>Profile</h1>
    <input onChange={(e) => uploadImage(e.target.files[0])}
    ref={imageRef} type="file" name="file" style={{display:'none'}} />
    <div className="profile-container">
        <img style={{width:220,height:'auto'}}
        onClick={selectImage} src={user?.val().profilePicture ? user?.val().profilePicture : Logo} alt="avatar" />
        {progressText && <p>{progressText}</p>}
        {errorMessage && <p>{errorMessage}</p>}
        <h2>{user?.val().name}</h2>
        <p>{user?.val().email}</p>
        <p>{new Date(user?.val().date).toDateString()}</p>
    </div>
    <button className="logout-btn" onClick={logUserOut}>Sign Out</button>
  </div>
}
