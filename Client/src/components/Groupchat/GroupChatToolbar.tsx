import { GroupChatToolbarProps } from "../../types";
import ParticipantList from "./ParticipantList";
import "../../css/GroupChatToolbar.css";
import GroupDetails from "./GroupDetails";

export default function GroupChatToolbar({group}:GroupChatToolbarProps){

    return(
        <>
            <div id="groupChatToolbar">
                <div id="groupInfo">
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

            <GroupDetails group={group}/>
        </>
    )
}