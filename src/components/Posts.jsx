import React, { useState, useEffect } from "react";
import awsconfig from '../aws-exports';
import { Storage, Amplify } from 'aws-amplify';
import {getDatabase, push, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
Amplify.configure(awsconfig);

export default function Posts() {
    const [body,setBody] = useState('');
    const [image,setImage] = useState('');
    const [loading,setLoading] = useState(false);
    const [progressText,setProgressText] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const [posts,setPosts] = useState([]);
    const [toggle,setToggle] = useState(false);
    const [users,setUsers] = useState([])

    function uploadFile(file){
        Storage.put(file.name,file,{
            level:'public',
            contentType:file.type,
            progressCallback:function(progress){
                setProgressText(
                    `${Math.round(progress.loaded / progress.total) * 100}%`
                )
            }
        })
        .then(res => {
            Storage.get(res.key)
            .then((result) => {
                let trim = result.slice(0,result.indexOf('?'))
                setImage(trim)
            })
            .catch(err => {
                console.log(err)
                setErrorMessage('Something went wrong')
            })
        })
        .catch(err => {
            setErrorMessage('Unable to upload a file')
            console.log(err)
        })
    }

    function createPost(e){
        e.preventDefault();
        setLoading(true)
        push(ref(getDatabase(),`posts/`),{
            body,
            image,
            user:getAuth().currentUser.uid,
            date:new Date().toString()
        })
        setLoading(false)
        setBody('')
        setToggle(false)
    }

    useEffect(() => {
        onValue(ref(getDatabase(),`posts`),(postsData) => {
            let postsArray = []
            postsData.forEach((post) => {
                postsArray.push(post)
            })
            setPosts(postsArray.reverse())
        })
        onValue(ref(getDatabase(),`users`),(usrs) => {
            let usersArray = []
            usrs.forEach((user) => {
                usersArray.push(user)
            })
            setUsers(usersArray)
        })
    },[])

    function getUsername(id){
        let name = ''
        users?.forEach((user) => {
            if (user.val().uid == id) {
                name = user.val().name
            }
        })
        return name
    }
    function getUserAvatar(id){
        let url = ''
        users?.forEach(user => {
            if (user.val().uid == id) {
                url = user.val().profilePicture
            }
        })
        return url
    }


  return <div className="post-parent">
    <div className="post-children">
    {toggle ? <form onSubmit={createPost}>
        {errorMessage && <p>{errorMessage}</p>}
        <textarea 
        onChange={(e) => setBody(e.target.value)}
        name="body" 
        id="" 
        rows="5" 
        placeholder="Say something.."
        className="post-body"
        value={body}
        ></textarea>
        <input onChange={(e) => uploadFile(e.target.files[0])}
        className="post-file" type="file" name="file" id="file" />
        {progressText && <p>{progressText}</p>}
        <button className="post-btn">
            {loading ? "Sharing...":"Share"}
        </button>
    </form> 
    :
    <form>
        <input onClick={() => setToggle(!toggle)} className="toggle-input" type="text" placeholder="What is in your mind?" />
    </form>
    }
    {
        posts?.map((post,index) => (
            <div
            className="post-child"
            key={index}>
                <div className="post-header">
                    <img src={getUserAvatar(post.val().user) ? getUserAvatar(post.val().user) : require('./user.jpeg')} alt="avatar" style={{width:65,height:65,borderRadius:45}} />
                    <div>
                        <h1>{getUsername(post.val().user)}</h1>
                        <p>{post.val().date}</p>
                    </div>
                </div>
                <div>
                    <img src={post.val().image} alt="image" style={{width:'100%',height:'auto'}} />
                    <p>{post.val().body}</p>
                </div>
                <hr />
            </div>
        ))
    }
    </div>
  </div>
}
