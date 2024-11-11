import { Outlet } from "react-router-dom";
import "../../css/GroupChatModal.css";
import { useContext } from "react";
import { GroupModalContext } from "../../utils";

export default function GroupChatModal(){

    const [groupDetailsWrapperRef, groupTitleRef] = useContext(GroupModalContext).refs;

    return(
        <div id="groupDetailsWrapper" ref={groupDetailsWrapperRef}>
            <div id="groupDetailsModal">
                <Outlet/>
            </div>
        </div>
    )
}