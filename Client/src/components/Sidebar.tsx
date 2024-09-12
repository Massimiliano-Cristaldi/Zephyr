import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useContext } from "react";
import { ContactListRefContext, isMobile } from "../utils";

export default function Sidebar(){

    const navigate = useNavigate();
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);

    function backToContacts(){
        contactListRef.current.style.display = "block";
        backButtonRef.current.style.visibility = "hidden";
        if (isMobile()){
            chatWrapperRef.current.style.display = "none";
        }
        navigate("/", {replace: true});
    }

    return(
        <div id="sidebarWrapper">
            <i className="fa-solid fa-inbox" style={{color: "white"}}/>
            <i className="fa-solid fa-people-group" style={{color: "white"}}/>
            <i className="fa-solid fa-angle-left" 
            style={{color: "white"}} 
            id="backButton"
            onClick={backToContacts}
            ref={backButtonRef}
            />
        </div>
    )
}