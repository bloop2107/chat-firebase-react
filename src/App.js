import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Button from './components/Button';
import { useEffect, useState } from 'react';

firebase.initializeApp({
    apiKey: "AIzaSyD9gaMJ9q5oFEeZhDtWmDjspeOUDh3lrM0",
    authDomain: "chat-firebase-5b27f.firebaseapp.com",
    projectId: "chat-firebase-5b27f",
    storageBucket: "chat-firebase-5b27f.appspot.com",
    messagingSenderId: "504405779249",
    appId: "1:504405779249:web:78b61097096e397d7dc610"
})

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

function App() {

  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged( user => {
          if(user){
              setUser(user);
          } else {
              setUser(null);
          }
      });

      if(initializing){
        setInitializing(false);
      }
      
      return unsubscribe
      
  }, [])


  const signInWithGoogle = () => {
    auth.signInWithPopup(provider).then((res) => {
      console.log(res.user)
    }).catch((error) => {
      console.log(error.message)
    })
  }

  const logOut = () => {
    auth.signOut().then(()=> {
      console.log('logged out')
    }).catch((error) => {
      console.log(error.message)
    })
  }

  if(initializing) return "Loading...";

  return (
    <div className="App">
      {
        user ? (
          <> 
            <Button onClick={logOut} children="Sign out"/>
            <p>Welcome to the chat</p>
          </>
        ) : (
          <Button onClick={signInWithGoogle} children="Sign in with Google" />
        )
      }
    </div>
  );
}

export default App;
