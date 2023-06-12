import React from "react";

export default function User(props) {
  return <div className="user-div">
    <img src={props.image} alt="avatar" style={{ width:75,height:75,borderRadius:50 }} />
    <div className="users-info">
        <h1>{props.name}</h1>
        <p>{props.email}</p>
        <p>{props.status}</p>
    </div>
    <hr />
  </div>
}
