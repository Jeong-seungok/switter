import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';

const Sweet = ({sweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newSweet, setNewSweet] = useState(sweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm('정말로 삭제하시겠습니까?');
        if(ok){
            await dbService.doc(`Sweet/${sweetObj.id}`).delete();
            await storageService.refFromURL(sweetObj.attachment).delete();
        }
    }
    const toggleEditing = () => {
        setEditing(prev => !prev);
    }
    const onSubmit = async (event) =>{
        event.preventDefault();
        await dbService.doc(`Sweet/${sweetObj.id}`).update({
            text: newSweet
        });
        setEditing(prev => !prev);
    }
    const onChange = (event) =>{
        const {target:{value}} = event;
        setNewSweet(value);
    }
    return (
        <div key={sweetObj.id}>
            {
                editing ? 
                <>
                <form
                    onSubmit={onSubmit}>
                    <input
                     type="text"
                     value={newSweet}
                     onChange={onChange}
                     required/>
                    <input
                     type="submit"
                     value="Update"/>
                </form>
                <button onClick={toggleEditing}>Cancel</button>
                </>
                :
                <>
                    <h4>{sweetObj.text}</h4>
                    {sweetObj.attachment&&
                    <img src={sweetObj.attachment} width="50px" height="50px" alt=""/>}
                    {isOwner && 
                    <>
                    <button onClick={onDeleteClick}>Delete Sweet</button>
                    <button onClick={toggleEditing}>Edit Sweet</button>
                    </>}
                </>
            }
        </div>
    );
}

export default Sweet;