import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import Message from './Message';


const Channel = ({ user = null, db = null }) => {
    
    const [massages,setMassages] = useState([]);
    const [newMessage,setNewMessage] = useState('');

    const {uid, displayName, photoURL} = user;

    useEffect(() => {
        if(db){
            const unsubscribe = db
                .collection('messages')
                .orderBy('createdAt')
                .limit(100)
                .onSnapshot(querySnapshot => {
                    //Get all documents from collection - with Ids 
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    //Update state 
                    setMassages(data);
                });
            return unsubscribe;
        }
    }, [db]);


    const handleOnChange = e => {
        setNewMessage(e.target.value);
    }

    const handleOnSubmit = e => {
        e.preventDefault();

        if(db){
            db.collection('messages').add({
                text: newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName,
                photoURL
            })
        }
        setNewMessage('');
    }
    

    return (
        <>
            <ul>
                {
                    massages.map(message => (
                        <li key={message.id}>
                            <Message {...message}/>
                        </li>
                    ))
                }
            </ul>
            <form onSubmit={handleOnSubmit}>
                <input type="text" onChange={handleOnChange} value={newMessage}/>
                <button type="submit" disabled={!newMessage}>Send</button>
            </form>
        </>
        
    )
}

export default Channel
