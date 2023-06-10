import logo from './logo.svg';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Password from './components/Password';
import './firebase';
import Profile from './components/Profile';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Users from './components/Users';
import ChatRoom from './components/ChatRoom';
import Posts from './components/Posts';

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  let auth = getAuth();

  useEffect(() => {
    return onAuthStateChanged(auth,(user) => {
      if (user) {
        setIsLoggedIn(true)
      }else{
        setIsLoggedIn(false)
      }
    })
  },[auth])

  const GuestRoutes = () => {
    let routes = useRoutes([
      {
        path:'/',
        element:<Login />
      },
      {
        path:'/register',
        element:<Register />
      },
      {
        path:'/password',
        element:<Password />
      },
      {
        path:'*',
        element:<Login/>
      }
    ])
    return routes
  }

  const UserRoutes = () => {
    let routes = useRoutes([
      {
        path:'/',
        element:<Profile />
      },
      {
        path:'*',
        element:<Profile />
      },
      {
        path:'/users',
        element:<Users />
      },
      {
        path:'/chatroom/:id',
        element:<ChatRoom />
      },
      {
        path:'/posts',
        element:<Posts />
      }
    ])
    return routes
  }

  function logUserOut(){
    signOut(getAuth())
  }

  return (
    <Router>
    {isLoggedIn ? <>
      <Navbar bg="dark" variant="dark" fixed='top'>
        <Container>
          <Navbar.Brand href="/">Social Media</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Profile</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/posts">Posts</Nav.Link>
            <Nav.Link href='#' onClick={logUserOut}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <UserRoutes />
    </> : <div className="App">
      <header className="App-header">
        <GuestRoutes />
      </header>
    </div>}
    </Router>
  );
}

export default App;
