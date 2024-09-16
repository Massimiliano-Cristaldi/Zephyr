import { useParams } from "react-router-dom";
import axios from "axios";
import { User } from "../../types";
import ChatToolbar from "./ChatToolbar";
import ChatWindow from "./ChatWindow";
import "./Body.css";
import { useContext, useEffect, useState } from "react";
import { ContactListRefContext, isMobile } from "../../utils";

export default function SelectedContact(){
    
    const params = useParams();    
    const [contact, setContact] = useState<User>({id: 0, username: "N/A", phone_number: 0, icon_url: "/user.png"});
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext)

    useEffect(()=>{
        if (isMobile()) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        }
    }, [])

    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/contact/${params.contactId}`);
                // const contacts = await axios.get(`http://localhost:8800/contactlist/${params.authId}`);
                // console.log(contacts.data);
                // console.log(response.data[0]);
                
                // const isInContactList = contacts.data.includes(response.data[0]);
                // console.log(isInContactList);
                
                if (response.status !== 200 || response.data?.length === 0) {
                    throw new Error("Fetch failed");
                }        
                setContact(response.data[0]);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [])
    
    return(
        <>
            <ChatToolbar contact={contact}/>
            <ChatWindow/>
        </>
    )
}