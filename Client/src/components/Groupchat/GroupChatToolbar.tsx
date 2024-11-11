import { useRef } from "react";
import { GroupChatToolbarProps } from "../../types";
import ParticipantList from "./ParticipantList";
import GroupChatModal from "./GroupChatModal";
import "../../css/GroupChatToolbar.css";
import { GroupModalContext } from "../../utils";

export default function GroupChatToolbar({group}:GroupChatToolbarProps){

    const groupDetailsWrapperRef = useRef<HTMLDivElement>(null);
    const groupTitleRef = useRef<HTMLDivElement>(null);

    return(
        <GroupModalContext.Provider value={{group: group, refs: [groupDetailsWrapperRef, groupTitleRef]}}>
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
                    style={{backgroundImage: `url(/public${group?.icon_url || "/group_icons/users.png"}`}}>
                    </div>
                    <div className="d-flex flex-column pb-1" id="titleAndParticipants">
                        <div ref={groupTitleRef}>
                            {group.title || "Loading..."}
                        </div>
                        <ParticipantList/>
                    </div>
                </div>
            </div>
            <GroupChatModal/>
        </GroupModalContext.Provider>
    )
}