import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthUserContext, ChatTypeContext } from "../../utils";
import { UseStateArray } from "../../types";
import GroupChatToolbar from "./GroupChatToolbar";
import ChatWindow from "../Chat/ChatWindow";

export default function SelectedGroup(){

    const params = useParams();
    const authUser = useContext(AuthUserContext);
    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext);
    const [group, setGroup] = useState<any>({});

    //Set chat type as group chat every time this component is loaded
    //This ensures chat type doesn't go back to default ("individualChat") when navigating or refreshing the page
    useEffect(()=>{
        if (chatType === "individualChat") {
            setChatType("groupChat");
        }
    }, [])

    //Fetch group data
    useEffect(()=>{
        async function fetchData(){
            try {
                const groupData = await axios.get(`http://localhost:8800/groupchat/${params.groupId}`);
                const participantsData = await axios.get(`http://localhost:8800/groupparticipants/${authUser.id}/${params.groupId}`);
                console.log(participantsData.data);
                
                if (groupData.status !== 200 || groupData.data.length === 0) {
                    throw new Error("Fetch failed at GroupChatToolbar");
                }
                setGroup({
                    ...groupData.data[0],
                    participants: participantsData.data[0]
                });
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [params])

    return(
        <>
            <GroupChatToolbar group={group}/>
            <ChatWindow/>
        </>
    )
}