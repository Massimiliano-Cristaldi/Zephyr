import { useContext } from "react";
import { Outlet } from "react-router-dom";
import ContactList from "./ContactList";
import { ContactListRefContext } from "../../utils.tsx";
import "../../css/Body.css";

export default function Body(){

    const [contactListRef, chatWrapperRef] = useContext(ContactListRefContext);

    return(
        <>
            <div className="col-12 col-lg-2" id="contactList" ref={contactListRef}>
                <ContactList/>
            </div>
            <div className="col-12 col-lg-10" id="chatWrapper" ref={chatWrapperRef}>
                <Outlet/>
            </div>
        </>
    )
}