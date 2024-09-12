import { useContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import axios from "axios";
import ContactList from "./ContactList";
import { ContactListRefContext } from "../../utils";
import { User } from "../../types";
import "./Body.css";

export default function Body(){

    const contacts = useLoaderData() as User[] | [];

    const [contactListRef, chatWrapperRef] = useContext(ContactListRefContext);

    return(
        <>
            <div className="col-12 col-lg-2" id="contactList" ref={contactListRef}>
                <ContactList contactList={contacts}/>
            </div>
            <div className="col-12 col-lg-10" id="chatWrapper" ref={chatWrapperRef}>
                <Outlet/>
            </div>
        </>
    )
}

export async function loader(){
    try {
        const response = await axios.get("http://localhost:8800/contacts");
        if (response.status !== 200) {
            throw new Error("Fetch failed");
        }
        return response.data;
    } catch (err) {
        console.error(err);
    }
}