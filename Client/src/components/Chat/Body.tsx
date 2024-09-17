import { useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import ContactList from "./ContactList";
import { AuthUserContext, ContactListRefContext, MessageCountContext } from "../../utils";
import { User } from "../../types";
import "./Body.css";

export default function Body(){

    const [contacts, setContacts] = useState<User[] | []>([]);
    const [sessionMessageCount, setSessionMessageCount] = useState(0);
    const [contactListRef, chatWrapperRef] = useContext(ContactListRefContext);
    const authId = useContext(AuthUserContext);
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/contactlist/${authId}`);
                if (response.status !== 200) {
                    throw new Error("Fetch failed");
                }
                setContacts(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        }
        fetchData();
    }, [sessionMessageCount])

    return(
        <MessageCountContext.Provider value={[sessionMessageCount, setSessionMessageCount]}>
            <div className="col-12 col-lg-2" id="contactList" ref={contactListRef}>
                <ContactList contactList={contacts}/>
            </div>
            <div className="col-12 col-lg-10" id="chatWrapper" ref={chatWrapperRef}>
                <Outlet/>
            </div>
        </MessageCountContext.Provider>
    )
}