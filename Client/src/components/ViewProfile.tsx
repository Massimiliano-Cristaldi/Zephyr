import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { closeModal, ViewProfileContext } from "../utils";
import { User } from "../types";
import "../css/ViewProfile.css";

export default function ViewProfile(){

    const params = useParams();
    const viewProfileRef = useContext(ViewProfileContext);
    const [contact, setContact] = useState<User>({
        id: 0, 
        username: "User not found", 
        phone_number: 0, 
        icon_url: "user.png"
    });
    const [isChanged, setIsChanged] = useState<boolean>(false);

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

    return(
        <div id="viewProfileWrapper" ref={viewProfileRef}>
            <div id="viewProfileModal">
                <div id="userIcon" style={{backgroundImage: `url(${contact.icon_url || "/user.png"})`}}/>
                <h2>{contact.user_added_as}</h2>
                <h5>+ 39 {contact.phone_number}</h5>
                <p>{contact.custom_status}</p>
                <i className="fa-solid fa-xmark closeModal" 
                style={{color: "rgb(180, 180, 180)"}} 
                onClick={()=>{closeModal(viewProfileRef, isChanged)}}
                />
            </div>
        </div>
    )
}