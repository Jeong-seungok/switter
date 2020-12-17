import React, { useEffect, useState } from 'react';
import ReactRouter from 'components/ReactRouter';
import {authService} from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    authService.onAuthStateChanged(user=>{
      if(user){
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      }
      setInit(true);
    });
  },[])
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    });
  }
  return (
    <>
      {init?<ReactRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}></ReactRouter>:'initializing...'}
      <footer>&copy; {new Date().getFullYear()} Switter</footer>
    </>
  );
}

export default App;
