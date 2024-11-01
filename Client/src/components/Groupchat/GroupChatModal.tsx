import { Outlet } from "react-router-dom";
import { GroupChatModalProps } from "../../types";
import "../../css/GroupChatModal.css";

export default function GroupChatModal({group, refs}: GroupChatModalProps){

    const groupDetailsWrapperRef = refs;

    return(
        <div id="groupDetailsWrapper" ref={groupDetailsWrapperRef}>
            <div id="groupDetailsModal">
                <Outlet context={[group, groupDetailsWrapperRef]}/>
            </div>
        </div>
    )
}