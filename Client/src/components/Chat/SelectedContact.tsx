import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthUserContext, ContactListRefContext, IsMobileContext, ViewProfileContext } from "../../utils.tsx";
import { User } from "../../types";
import ChatToolbar from "./ChatToolbar";
import ChatWindow from "./ChatWindow";
import UserNotAdded from "./UserNotAdded";

//TODO: Contact info in ChatToolbar doesn't load when refreshing the page, but it does when navigating
export default function SelectedContact(){
    
    const params = useParams();    
    const authUser = useContext(AuthUserContext);
    const isMobile = useContext(IsMobileContext);
    
    const viewProfileRef = useRef<HTMLDivElement>(null);
    const contactNameRef = useRef<HTMLDivElement>(null);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);

    const [contact, setContact] = useState<User>({
        id: 0, 
        username: "Loading...", 
        phone_number: 0, 
        icon_url: null});
    const [userIsAdded, setUserIsAdded] = useState(true);

    //Hide contact list when a chat is opened if using mobile layout
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

    //Fetch contact list
    useEffect(()=>{
        async function fetchData(){
            try {
                const contacts = await axios.get(`http://localhost:8800/contactlist/${authUser.id}`);                
                if (contacts.status !== 200 || contacts.data?.length === 0) {
                    throw new Error("Fetch failed at SelectedContact");
                }
                const isInContactList = contacts.data.some((el:User) => el.id === Number(params.contactId));
                if (!isInContactList) {
                    setUserIsAdded(false);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [])
    
    //Fetch current contact info
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/contact/${authUser.id}/${params.contactId}`);
                if (response.status !== 200 || response.data?.length === 0) {
                    throw new Error("Fetch failed at SelectedContact");
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [params])

    return(
        <ViewProfileContext.Provider value={[viewProfileRef, contactNameRef]}>
            {userIsAdded || <UserNotAdded/>}
            <ChatToolbar contact={contact}/>
            <ChatWindow/>
        </ViewProfileContext.Provider>
    )
}