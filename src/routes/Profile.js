import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = ({refreshUser,userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();   
        history.push('/');
    }
    const onChange = (event) => {
        const {target:{value}} = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName
            })
            refreshUser();
        }
    }
    const getMySweets = async () => {
        const sweets = await dbService
        .collection('Sweet')
        .where('creatorId','==',userObj.uid)
        .orderBy('createdAt')
        .get();
        console.log(sweets);
    };
    useEffect(()=>{
        getMySweets();
    },[])
    return(
        <>
        <form onSubmit={onSubmit}>
            <input
            type="text"
            onChange={onChange}
            value={newDisplayName}
            placeholder="Display name"/>
            <input
            type="submit"
            value="Update Profile"/>
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}

export default Profile;