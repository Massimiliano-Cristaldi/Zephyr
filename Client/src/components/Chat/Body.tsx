import { useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import ContactList from "./ContactList";
import { AuthUserContext, ChatTypeContext, ContactListRefContext, MessageCountContext } from "../../utils.tsx";
import { User, UseStateArray } from "../../types";
import "../../css/Body.css";

export default function Body(){

    const authUser = useContext(AuthUserContext);
    const [contactListRef, chatWrapperRef] = useContext(ContactListRefContext);
    const [contacts, setContacts] = useState<User[] | []>([]);
    const [groups, setGroups] = useState<any>([]);
    const [sessionMessageCount, setSessionMessageCount] = useState(0);

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
                const response = await axios.get(`http://localhost:8800/groupchats/${authUser.id}`)
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setGroups(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [authUser.id, sessionMessageCount])

    return(
        <MessageCountContext.Provider value={[sessionMessageCount, setSessionMessageCount]}>
            <div className="col-12 col-lg-2" id="contactList" ref={contactListRef}>
                <ContactList contacts={contacts} groups={groups}/>
            </div>
            <div className="col-12 col-lg-10" id="chatWrapper" ref={chatWrapperRef}>
                <Outlet/>
            </div>
        </MessageCountContext.Provider>
    )
}