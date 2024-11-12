import { Outlet } from "react-router-dom";
import "../../css/GroupChatModal.css";
import { useContext } from "react";
import { ModalsContext } from "../../utils";

export default function GroupChatModal(){

    const groupDetailsWrapperRef = useContext(ModalsContext).refs[4];

    return(
        <div id="groupDetailsWrapper" ref={groupDetailsWrapperRef}>
            <div id="groupDetailsModal">
                <Outlet/>
            </div>
        </div>
    )
}