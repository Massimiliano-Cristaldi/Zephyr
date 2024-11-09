import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthUserContext, ChatTypeContext, ContactListRefContext, GroupStateContext, IsMobileContext } from "../../utils";
import { UseStateArray } from "../../types";
import GroupChatToolbar from "./GroupChatToolbar";
import ChatWindow from "../Chat/ChatWindow";

export default function SelectedGroup(){

    const params = useParams();
    const authUser = useContext(AuthUserContext);
    const isMobile = useContext(IsMobileContext);

    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);

    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext).state;
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
    }, [params, authUser.id])

    //Hide contact list when a chat is opened if using mobile layout
    useEffect(()=>{
        if (isMobile) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        } else {
            contactListRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "hidden";
        }
    }, [isMobile])

    return(
        <GroupStateContext.Provider value={[group, setGroup]}>
            <GroupChatToolbar group={group}/>
            <ChatWindow/>
        </GroupStateContext.Provider>
    )
}