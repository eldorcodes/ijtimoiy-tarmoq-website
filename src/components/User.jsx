import React from "react";

export default function User(props) {
  return <div className="user-div">
    <img src={props.image} alt="avatar" width={150} height={'auto'} />
    <div>
        <h1>{props.name}</h1>
        <p>{props.email}</p>
        <p>{props.status}</p>
    </div>
  </div>
}
