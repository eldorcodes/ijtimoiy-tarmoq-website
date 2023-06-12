import React, { useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { onValue, ref, getDatabase, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import awsconfig from '../aws-exports';
import { Amplify, Storage } from 'aws-amplify';
Amplify.configure(awsconfig);

export default function ChatRoom() {
    const { id } = useParams();
    const [user,setUser] = useState(null);
    const [message,setMessage] = useState('');
    const [chats,setChats] = useState([]);
    const [image,setImage] = useState('');
    const [progressText,setProgressText] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    const fileRef = useRef()
    const scrollRef = useRef();

    function handleSubmit(e){
        e.preventDefault();
        if (message || image) {
            push(ref(getDatabase(),`chat`),{
                message,
                sender:getAuth().currentUser.uid,
                receiver:id,
                date:new Date().toString(),
                image
            })
            setMessage('')
            setImage('')
            scrollRef.current.scrollIntoView({ behavior:'smooth',block:'end' })
        }else{
            setErrorMessage('Nothing to send')
        }
    }

    function clickInput(){
        fileRef.current.click()
    }

    function uploadFile(file){
        // save file into aws s3 storage
        Storage.put(Math.random() + file.name,file,{
            level:'public',
            contentType:file.type,
            progressCallback:function(progress){
                setProgressText(
                   `${Math.round(progress.loaded / progress.total) * 100}%`
                )
            }
        })
        .then((res) => {
            Storage.get(res.key)
            .then((result) => {
                let trim = result.slice(0,result.indexOf('?'))
                setImage(trim)
            })
            .catch(err => {
                setErrorMessage(err.message)
            }) 
        })
        .catch(err => {
            setErrorMessage(err.message)
        })
    }

    React.useEffect(() => {
        onValue(ref(getDatabase(),`chat`),(chts) => {
            let chatsArray = []
            chts.forEach((chat) => {
                if (chat.val().sender == getAuth().currentUser.uid && chat.val().receiver == id || chat.val().sender == id && chat.val().receiver == getAuth().currentUser.uid) {
                    chatsArray.push(chat)
                }
            })
            setChats(chatsArray)
        })
    },[])

    function getUserAvatar(id){
        let imageUri = ''
        onValue(ref(getDatabase(),`users`),(usersArray) => {
            usersArray.forEach((user) => {
                if (user.val().uid == id) {
                    imageUri = user.val().profilePicture
                }
            })
        })
        return imageUri
    }


  return <div style={{ paddingTop:50 }}>
    <div ref={scrollRef}
    className="chat-box">
        {chats?.map((chat,index) => (
            <div className="chat-message-box">
                {chat.val().receiver == getAuth().currentUser.uid ? <div key={index}
            className={chat.val().receiver == getAuth().currentUser.uid ? 'chat-item-receiver' : 'chat-item-sender'}>
            <img src={getUserAvatar(chat.val().sender) ? getUserAvatar(chat.val().sender) : require('./user.jpeg')} alt="avatar" style={{width:40,height:40,borderRadius:20}} />
            <div>
            {chat.val().message && <p className="message">{chat.val().message}</p>}
            {chat.val().image && <img src={chat.val().image} alt="image" width={300} height={'auto'} /> }
            <br />
            <small>{new Date(chat?.val().date).toDateString()}</small>
            </div>
            </div>
            :
            <div key={index}
            className={chat.val().receiver == getAuth().currentUser.uid ? 'chat-item-receiver' : 'chat-item-sender'}>
            <div>
            {chat.val().message && <p className="message2">{chat.val().message}</p>}
            {chat.val().image && <img src={chat.val().image} alt="image" width={300} height={'auto'} /> }
            <br />
            <small>{new Date(chat?.val().date).toDateString()}</small>
            </div>
            <img src={getUserAvatar(chat.val().sender) ? getUserAvatar(chat.val().sender) : require('./user.jpeg')} alt="avatar" style={{width:40,height:40,borderRadius:20}} />
            </div>
            }
            </div>
        ))}
        {errorMessage && <p>{errorMessage}</p>}
        <div style={{height:100}}></div>
    </div>
    <input onChange={(e) => uploadFile(e.target.files[0])}
    ref={fileRef} type="file" name="file" id="file" style={{display:'none'}} />
    <form onSubmit={handleSubmit}
    id="chat-box">
        <input value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text" id="chat-input" placeholder="Type message.." />
        <button onClick={clickInput} type="button" id="send-btn2">
            {progressText ? progressText : "File"}
        </button>
        <button id="send-btn">Send</button>
    </form>
  </div>
}
