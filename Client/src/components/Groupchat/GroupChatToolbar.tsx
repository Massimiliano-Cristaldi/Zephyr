import { useRef } from "react";
import { GroupChatToolbarProps } from "../../types";
import ParticipantList from "./ParticipantList";
import GroupChatModal from "./GroupChatModal";
import "../../css/GroupChatToolbar.css";

export default function GroupChatToolbar({group}:GroupChatToolbarProps){

    const groupDetailsWrapperRef = useRef<HTMLDivElement>(null);

    return(
        <>
            <div id="groupChatToolbar">
                <div 
                id="groupInfo"
                onClick={()=>{
                    if (groupDetailsWrapperRef.current){
                        groupDetailsWrapperRef.current.style.display = "flex";
                    }
                }}>
                    <div 
                    className="groupIcon" 
                    style={{backgroundImage: `url(/public${group?.icon_url || "user.png"}`}}>
                    </div>
                    <div className="d-flex flex-column pb-1" id="titleAndParticipants">
                        <div>
                            {group.title}
                        </div>
                        <ParticipantList group={group}/>
                    </div>
                </div>
            </div>
            <GroupChatModal group={group} refs={groupDetailsWrapperRef}/>
        </>
    )
}