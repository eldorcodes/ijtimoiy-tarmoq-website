import React from "react";
import User from "./User";
import { getDatabase, onValue, ref } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export default function Users() {
    const [users,setUsers] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        onValue(ref(getDatabase(),`users`),(usrs) => {
            let usersArray = []
            usrs.forEach((user) => {
                usersArray.push(user)
            })
            setUsers(usersArray)
        })
    },[])
  return <div className="users-container">
    {
        users?.map((user,index) => (
            <button 
            onClick={() => navigate(`/chatroom/${user?.val().uid}`)}
            className="users-btn">
                <User
            key={index}
            name={user?.val().name}
            email={user?.val().email}
            image={user?.val().profilePicture ? user.val().profilePicture : require('./user.jpeg')}
            status={user?.val().status ? 'online':'offline'}
            />
            </button>
        ))
    }
  </div>
}
