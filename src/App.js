import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUsers, setNewUsers] = useState(false);
   const [user, setUser] = useState({
     isSignedId: false,
     name: '',
     newuser:false ,
     email: '',
     password: '',
     photo: '',
     error: '',
     succes: false
   })

  const provider = new firebase.auth.GoogleAuthProvider();
  const btnSignIn = () => {
    firebase.auth().signInWithPopup(provider)
  .then(res =>{
    const {displayName, email, photoURL} = res.user;

     const signIdUser = {
       isSignedId : true,
       name: displayName,
       email: email,
       photo: photoURL
     }
    setUser(signIdUser);
   
  })
  .catch((error) => {
    console.log( error.message)
   });
  }
   const btnSignOut = () => {
    firebase.auth()
     .signOut()
    .then((res) => {
      
     const signOutuser = {
      isSignedId : false,
      name: '',
      email: '',
      photo: ''
    }
   setUser(signOutuser);
    
    })
    .catch((error) => {
      console.log(error.message)
        console.log(error.code)
    });
   }
   const handleBlure =(e) => {
     let isFieldmValid = true;
     if(e.target.name === 'email'){
      isFieldmValid = /^\w+([-+.'']\w+)*@\w*([-.çöişğü]\w*)*\.\w+([-.]\w+)*$/.test(e.target.value);
       
     }
     if(e.target.name === 'password'){
        const passwordValid = e.target.value.length > 6 ;
        const passwordHashNumber =  /\d{1}/.test(e.target.value)
        isFieldmValid = passwordValid && passwordHashNumber;
     }
     if(isFieldmValid){
        const newUserInfo = {...user};
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
     }
   }
   const handleSubmit = (e) => {
     if(newUsers && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
         newUserInfo.succes = true;
        setUser(newUserInfo)
         updateUserName(user.name)
        console.log(res)
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.succes = false;
        setUser(newUserInfo);
        console.log(error.code, error.message)
      });
     }
     if(!newUsers && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
         newUserInfo.succes = true;
        setUser(newUserInfo)
        console.log(res)
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.succes = false;
        setUser(newUserInfo);
        console.log(error.code, error.message)
      });
     }
     e.preventDefault();
     
      const updateUserName = name => {
        var user = firebase.auth().currentUser;
          user.updateProfile({
            displayName: name
          }).then(res => {
            console.log('update name')
          }).catch((error) =>{
              console.log(error)
          });
      }
   }
  return (
    <div className="App">
     {
       user.isSignedId ? <button onClick={btnSignOut}>sign out</button> : <button onClick={btnSignIn}>sign in</button>
     }
        <br/>
       <button>sign in using fackebook</button>   
       {
         user.isSignedId && <div> 
                  <p>Wellcome, {user.name}</p>
                  <img src={user.photo} />
         </div>
       }

       <h2>our own authentication</h2>
        <input type='checkbox' onChange={() => setNewUsers(!newUsers)} neme='newUser'/>
        <label htmlFor="newUser">new user sign up</label>
     <form onSubmit={handleSubmit}>
           {newUsers && <input name='name' onBlur={handleBlure}  type='text' placeholder='Your name' /> }  
             <br/>
             <input type='email' onBlur={handleBlure} name='email' placeholder='Enter your E-mail' required />
             <br/>
            <input type='password' onBlur={handleBlure} name='password' placeholder='Enter Your Password' required />
            <br/>
           <input type='submit' value={newUsers ? 'sign up': 'Sign In'} />
     </form>
       <p style={{color:'red'}}>{user.error}</p>
       {
         user.succes && <p style={{color:'green'}}>User {newUsers? 'Created': 'logged In'} Succesesfuly</p> 
       }
    </div>
  );
}

export default App;