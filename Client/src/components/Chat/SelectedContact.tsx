import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ContactListRefContext, IsMobileContext, ViewProfileContext } from "../../utils";
import { User } from "../../types";
import ChatToolbar from "./ChatToolbar";
import ChatWindow from "./ChatWindow";
import UserNotAdded from "./UserNotAdded";

export default function SelectedContact(){
    
    const params = useParams();    
    const isMobile = useContext(IsMobileContext);
    const [contact, setContact] = useState<User>({
        id: 0, 
        username: "Loading...", 
        phone_number: 0, 
        icon_url: "/user.png"});
    const [userIsAdded, setUserIsAdded] = useState(true);
    const viewProfileRef = useRef<HTMLDivElement>(null);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);

    useEffect(()=>{
        if (isMobile) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        } else {
            contactListRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "hidden";
        }
    }, [isMobile])

    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/contact/${params.authId}/${params.contactId}`);
                const contacts = await axios.get(`http://localhost:8800/contactlist/${params.authId}`);                
                const isInContactList = contacts.data.some((obj:User) => obj.id === Number(params.contactId));                
                if (response.status !== 200 || response.data?.length === 0) {
                    throw new Error("Fetch failed");
                }
                if (!isInContactList) {
                    setUserIsAdded(false);
                }
                setContact(response.data[0]);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [params.contactId])
    
    return(
        <ViewProfileContext.Provider value={viewProfileRef}>
            {userIsAdded || <UserNotAdded/>}
            <ChatToolbar contact={contact}/>
            <ChatWindow/>
        </ViewProfileContext.Provider>
    )
}