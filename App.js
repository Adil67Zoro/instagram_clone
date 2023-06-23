import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { Input } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ImageUpload from './ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24, 
  p: 4,
};


function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [openSignIn, setOpenSignIn] = useState(false);
  const handleClose = () => setOpenSignIn(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null)
      }
    }) 

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
      setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App">      
      <Modal
        open={openSignIn}
        onClose={handleClose}
        >
        <Box sx={style}>
          <form className='app__signup'>
            <img 
                className="app__headerImage"
                src="instagramLogo.png"
                alt="" width={100}/>
            <Input
              placeholder="email" type="text" value={email} 
              onChange={(e) => setEmail(e.target.value)}/>
            <Input
              placeholder="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}/>  
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <form className='app__signup'>
            <img 
                className="app__headerImage"
                src="instagramLogo.png"
                alt="" width={100}/>
            <Input
              placeholder="username" type="text" value={username} 
              onChange={(e) => setUsername(e.target.value)}/>
            <Input
              placeholder="email" type="text" value={email} 
              onChange={(e) => setEmail(e.target.value)}/>
            <Input
              placeholder="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}/>  
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </Box>
      </Modal>
      
      <div className="app__header">
        <img className="app__headerImage"
          src="instagramLogo.png" alt="" width="100"/> 
        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )} 
      </div>  

      <div className="app__posts">
      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to login to post</h3>
      )}

    </div>
  );
}

export default App;
