import { dbService, storageService } from 'fbase';
import React, { useState, useEffect } from 'react';
import Sweet from '../components/Sweet'
import {v4 as uuidv4} from 'uuid'

const Home = ({userObj}) => {
    const [sweet, setSweet] = useState('');
    const [sweets, setSweets] = useState([]);
    const [attachment, setAttachment] = useState('');
    useEffect(()=>{
        dbService.collection('Sweet').onSnapshot(snapshot=>{
            const sweetArr = snapshot.docs.map(doc=>{
                return {
                    id:doc.id, 
                    ...doc.data()
                }
            })
            setSweets(sweetArr);
        });
    },[])
    const onSubmit = async (event) =>{
        event.preventDefault();
        let attachmentUrl = '';
        if(attachment !== ''){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment,"data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const sweetData = {
            text:sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachment: attachmentUrl
        }
        await dbService.collection('Sweet').add(sweetData);
        setSweet('');
        setAttachment();
    }
    const onChange = (event)=>{
        const {target:{value}} = event;
        setSweet(value);
    }
    const onFileChange = (event)=>{
        const {target:{files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(theFile);
        reader.onloadend = (finishedEvent=>{
            const {currentTarget:{result}} = finishedEvent;
            setAttachment(result);
        })
    }
    const onClearAttachment = () => setAttachment('');
    return(
    <div>
        <form>
            <input 
             type="text" 
             placeholder="Sweet Your Routine" 
             value={sweet}
             maxLength={120}
             onChange={onChange}/>
            <input
             type="file"
             accept="image/*"
             onChange={onFileChange}/>
            <input 
             type="submit" 
             value="Sweet" 
             onClick={onSubmit}/>
            {attachment &&
             <div>
                <img
                src={attachment}
                alt=""
                width="50px"
                height="50px"/>
                <button onClick={onClearAttachment}>Clear</button>
             </div>
            }
        </form>
        <div>
        {
            sweets.map((sweet)=>{
                return(
                    <Sweet 
                    key={sweet.id} 
                    sweetObj={sweet}
                    isOwner={sweet.creatorId === userObj.uid}></Sweet>
                )
            })
        }
        </div>
    </div>
    );
}

export default Home;