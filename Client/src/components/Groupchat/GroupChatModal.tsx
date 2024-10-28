import { Outlet } from "react-router-dom";
import { GroupChatModalProps } from "../../types";
import "../../css/GroupChatModal.css";

export default function GroupChatModal({group}: GroupChatModalProps){

    return(
        <div id="groupDetailsWrapper">
            <div id="groupDetailsModal">
                <Outlet context={group}/>
            </div>
        </div>
    )
}