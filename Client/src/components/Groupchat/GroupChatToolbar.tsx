import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/GroupChatToolbar.css";

export default function GroupChatToolbar(){

    const params = useParams();
    const [group, setGroup] = useState<any>({});

    useEffect(()=>{
        async function fetchData(){
            const response = await axios.get("htt://localhost:8800/")
        }
    }, [params])

    return(
        <div id="chatToolbar">
        <div id="contactInfo">
            <div 
            className="contactIcon" 
            style={{backgroundImage: `url(/${group?.icon_url || "user.png"}`}}>
            </div>
            <div className="d-flex flex-column pb-1" id="nameAndNumber">
                <div>
                    {group.title}
                </div>
                <small id="phoneNumber">
                    {group?.participants}
                </small>
            </div>
        </div>
    </div>
    )
}