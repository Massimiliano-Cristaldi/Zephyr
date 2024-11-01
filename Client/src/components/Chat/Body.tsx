import { useContext, useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import ContactList from "./ContactList";
import { AuthUserContext, ContactListRefContext, ContactsContext, MessageCountContext } from "../../utils.tsx";
import { User } from "../../types";
import "../../css/Body.css";

export default function Body(){

    const params = useParams();
    const authUser = useContext(AuthUserContext);
    const [contactListRef, chatWrapperRef] = useContext(ContactListRefContext);
    const [contacts, setContacts] = useState<User[] | []>([]);
    const [groups, setGroups] = useState<any>([]);
    const [sessionMessageCount, setSessionMessageCount] = useState(0);

    //Fetch contact list and group list
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/contactlist/${authUser.id}`)
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setContacts(response.data);
            } catch (err) {
                console.error(err);
            }
            
            try {
                const response = await axios.get(`http://localhost:8800/groupchatlist/${authUser.id}`)
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setGroups(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [authUser.id, sessionMessageCount, params])

    return(
        <MessageCountContext.Provider value={[sessionMessageCount, setSessionMessageCount]}>
        <ContactsContext.Provider value={contacts}>
            <div className="col-12 col-lg-2" id="contactList" ref={contactListRef}>
                <ContactList groups={groups}/>
            </div>
            <div className="col-12 col-lg-10" id="chatWrapper" ref={chatWrapperRef}>
                <Outlet context={groups}/>
            </div>
        </ContactsContext.Provider>
        </MessageCountContext.Provider>
    )
}