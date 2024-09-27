import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContactListRefContext, IsMobileContext } from "../utils";
import "../css/Sidebar.css";

export default function Sidebar(){

    const isMobile = useContext(IsMobileContext);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);
    const navigate = useNavigate();

    function backToContacts(){
        contactListRef.current.style.display = "block";
        backButtonRef.current.style.visibility = "hidden";
        if (isMobile){
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