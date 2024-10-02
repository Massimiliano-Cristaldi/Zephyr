import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthUserContext, closeModal, IsMobileContext, ViewProfileContext } from "../utils";
import { User } from "../types";
import "../css/ViewProfile.css";

export default function ViewProfile(){

    const params = useParams();
    const authUser = useContext(AuthUserContext);
    const isMobile = useContext(IsMobileContext);

    const [viewProfileRef, contactNameRef] = useContext(ViewProfileContext);
    const usernameH2Ref = useRef<HTMLHeadingElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);

    const [contact, setContact] = useState<User>({
        id: 0, 
        username: "User not found", 
        phone_number: 0, 
        icon_url: "user.png"
    });

    //Fetch user data
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/userinfo/${params.contactId}`);
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setContact(response.data[0]);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [params])

    let discarding = false;

    function changeContactName(){
        if (contact.id && usernameInputRef.current && usernameH2Ref.current) {
            usernameInputRef.current.style.display = "block";
            usernameInputRef.current.focus();
            usernameH2Ref.current.style.display = "none";
            if (contact.user_added_as) {
                usernameInputRef.current.value = contact.user_added_as;
                usernameInputRef.current.select();
            }
        }
    }

    function submitContactNameChange(){
        if (discarding){
            discarding = false;
            return;
        }
        if (usernameInputRef.current && usernameH2Ref.current) {
            usernameInputRef.current.style.display = "none";
            usernameH2Ref.current.style.display = "block";
            if (contact.id && usernameH2Ref.current && usernameInputRef.current){
                const newValues = {
                    value: usernameInputRef.current.value, 
                    authUserId: authUser.id,
                    contactId: contact.id
                };
                axios.post("http://localhost:8800/updatecontactinfo", newValues);
                usernameH2Ref.current.innerText = newValues.value;
                contactNameRef.current.innerText = newValues.value;
                contact.user_added_as = newValues.value;
                usernameInputRef.current.value = contact.user_added_as;
            }
        }
    }

    return(
        <div id="viewProfileWrapper" ref={viewProfileRef}>
            <div id="viewProfileModal">
                <div id="contactIcon" style={{backgroundImage: `url(${contact.icon_url || "/user.png"})`}}/>
                <h2
                {...(isMobile 
                    ? {onClick: changeContactName, ref: usernameH2Ref} 
                    : {onDoubleClick: changeContactName, ref: usernameH2Ref})}
                >{contact.user_added_as}</h2>
                <form onSubmit={(e)=>{e.preventDefault()}}>
                    <input
                    type="text"
                    ref={usernameInputRef}
                    onBlur={submitContactNameChange}
                    />
                </form>
                <h5>+ 39 {contact.phone_number}</h5>
                <p>{contact.custom_status}</p>
                <i className="fa-solid fa-xmark closeModal" 
                style={{color: "rgb(180, 180, 180)"}} 
                onClick={()=>{closeModal(viewProfileRef, false)}}
                />
            </div>
        </div>
    )
}