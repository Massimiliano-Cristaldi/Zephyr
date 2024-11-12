import { useContext, useRef } from "react";
import { GroupChatToolbarProps } from "../../types";
import ParticipantList from "./ParticipantList";
import GroupChatModal from "./GroupChatModal";
import "../../css/GroupChatToolbar.css";
import { GroupModalContext, ModalsContext } from "../../utils";

export default function GroupChatToolbar({group}:GroupChatToolbarProps){

    const groupDetailsWrapperRef = useContext(ModalsContext).refs[4];
    const groupTitleRef = useRef<HTMLDivElement>(null);

    const closeAllModals:()=>void = useContext(ModalsContext).actions;

    function showGroupDetailsModal(){
        closeAllModals();
        if (groupDetailsWrapperRef.current){
            groupDetailsWrapperRef.current.style.display = "flex";
        }
    }

    return(
        <GroupModalContext.Provider value={{group: group, refs: groupTitleRef}}>
            <div id="groupChatToolbar">
                <div 
                id="groupInfo"
                onClick={showGroupDetailsModal}>
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